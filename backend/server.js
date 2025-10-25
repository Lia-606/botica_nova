require('dotenv').config();

// Dependencias principales
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const conectarDB = require('./config/db');

// Inicializar app
const app = express();

// Conectar a MongoDB
conectarDB();

// Middlewares
app.use(express.json());
app.use(cookieParser()); 

// Configurar CORS para permitir cookies
app.use(cors({
  origin: 'http://localhost:5500', 
  credentials: true,              
}));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Importar rutas
const productoRoutes = require('./routes/productos');
const usuarioRoutes = require('./routes/usuarios');
const ventaRoutes = require('./routes/ventas');
const alertasRoutes = require('./routes/alertas');
const reportesRoutes = require('./routes/reportes');

// Usar rutas API
app.use('/api/reportes', reportesRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ventas', ventaRoutes);

// Ruta base → abrir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});


// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en el puerto ${PORT}`);
  console.log(` Abre en tu navegador: http://localhost:${PORT}/`);
});
