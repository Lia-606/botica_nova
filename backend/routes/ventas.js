const express = require('express');
const router = express.Router();
const { crearVenta, obtenerVentas, obtenerVentaPorId } = require('../controllers/ventaController');
const auth = require('../middleware/auth');

// Obtener todas las ventas
router.get('/', auth, obtenerVentas);

// Obtener una venta por ID
router.get('/:id', auth, obtenerVentaPorId);

// Crear nueva venta
router.post('/', auth, crearVenta);

module.exports = router;
