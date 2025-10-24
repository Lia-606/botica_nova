const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'vendedor'], default: 'vendedor' },
  fechaRegistro: { type: Date, default: Date.now }
});

// 🔒 Encriptar contraseña antes de guardar (solo si no está ya encriptada)
usuarioSchema.pre('save', async function (next) {
  // Si la contraseña ya parece encriptada (empieza con $2a o $2b), no volver a encriptar
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧩 Método para verificar contraseña
usuarioSchema.methods.verificarPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
