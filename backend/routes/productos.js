const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Rutas CRUD
router.post('/', productoController.crearProducto); // Crear
router.get('/', productoController.obtenerProductos); // Listar todos
router.get('/:id', productoController.obtenerProductoPorId); // Obtener por ID
router.put('/:id', productoController.actualizarProducto); // Actualizar
router.delete('/:id', productoController.eliminarProducto); // Eliminar

module.exports = router;
