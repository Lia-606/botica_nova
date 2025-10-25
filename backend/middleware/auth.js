const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: 'No hay token, autorización denegada' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.usuario = {
      id: decoded.id,
      rol: decoded.rol
    };

    next();
  } catch (err) {
    console.error('Error verificando token:', err);
    res.status(401).json({ msg: 'Token no válido' });
  }
};

module.exports = auth;
