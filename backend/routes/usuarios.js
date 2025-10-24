const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  crearUsuario,
  login,
  verificarSesion,
  logout,
  listarUsuarios,
  editarUsuario,
  cambiarEstado
} = require('../controllers/usuarioController');

// Middleware de autenticación
const verificarToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // guarda datos del usuario (id y rol)
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// ✅ Rutas protegidas y públicas

// Crear usuario (solo admin)
router.post('/registrar', verificarToken, (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'Solo el administrador puede crear usuarios' });
  }
  next();
}, crearUsuario);

// Login público
router.post('/login', login);

// Verificar sesión
router.get('/verificar', verificarSesion);

// Cerrar sesión
router.post('/logout', logout);

// ✅ Listar todos los usuarios (solo admin)
router.get('/listar', verificarToken, (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
}, listarUsuarios);

// ✅ Editar usuario (solo admin)
router.patch('/editar/:id', verificarToken, (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
}, editarUsuario);

// ✅ Cambiar estado (solo admin)
router.patch('/estado/:id', verificarToken, (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
}, cambiarEstado);

module.exports = router;
