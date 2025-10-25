const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  cliente: { type: String, required: true }, 
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  cantidad: { type: Number, required: true },
  total: { type: Number, required: true },
  fechaVenta: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venta', ventaSchema);
