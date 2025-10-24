const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'vendedor'], default: 'vendedor' },
  fechaRegistro: { type: Date, default: Date.now },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
});

// 🔒 Encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧩 Método para verificar contraseña
usuarioSchema.methods.verificarPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
