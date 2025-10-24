const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  total: { type: Number, required: true },
  fechaVenta: { type: Date, default: Date.now },
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Venta', ventaSchema);
