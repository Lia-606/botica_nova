const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Función para crear un token JWT
const crearToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } 
  );
};

// Crear usuario 
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const usuario = new Usuario({ nombre, correo, password, rol });
    await usuario.save();

    res.json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

// login (versión segura)
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const passwordValida = await usuario.verificarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = crearToken(usuario);

    //  Guardar token en cookie segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,   
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.json({
      message: 'Inicio de sesión exitoso',
      rol: usuario.rol,
      nombre: usuario.nombre
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error en el inicio de sesión',
      error: error.message
    });
  }
};

//  Verificar sesión (ahora devuelve nombre + rol)
exports.verificarSesion = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No autenticado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Traer nombre y rol
    const usuario = await Usuario.findById(decoded.id).select('nombre rol');
    if (!usuario) return res.status(401).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Sesión válida', usuario });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Cerrar sesión (borrado correcto de cookie)
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,  //  cámbialo a true si usas HTTPS
    sameSite: 'Lax'
  });
  res.json({ message: 'Sesión cerrada correctamente' });
};


exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, "-password").sort({ fechaRegistro: -1 });
    res.json({ usuarios });
  } catch (err) {
    res.status(500).json({ message: 'Error al listar usuarios', error: err.message });
  }
};

exports.editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Actualizar campos
    usuario.nombre = req.body.nombre || usuario.nombre;
    usuario.correo = req.body.correo || usuario.correo;
    usuario.rol = req.body.rol || usuario.rol;
    if (req.body.password) usuario.password = req.body.password; // se encripta automáticamente
    usuario.estado = req.body.estado || usuario.estado;

    await usuario.save(); // 🔒 Esto dispara el pre('save') y encripta la contraseña si se cambió

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al editar usuario', error: err.message });
  }
};


exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    await Usuario.findByIdAndUpdate(id, { estado });
    res.json({ message: 'Estado actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al cambiar estado', error: err.message });
  }
};
