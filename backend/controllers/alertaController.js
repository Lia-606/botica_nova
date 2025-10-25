const Producto = require('../models/Producto');

const obtenerAlertas = async (req, res) => {
  try {
    const productosAlertas = await Producto.find({ stock: { $lte: 20 } });
    res.json(productosAlertas);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ msg: 'Error al obtener alertas' });
  }
};

module.exports = { obtenerAlertas };
