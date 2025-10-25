// encriptarPasswords.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario'); // <-- ruta corregida

mongoose.connect('mongodb://127.0.0.1:27017/botica_novasalud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("🟢 Conectado a MongoDB...");

    const usuarios = await Usuario.find();

    for (const usuario of usuarios) {
      if (!usuario.password.startsWith('$2b$')) {
        const hash = await bcrypt.hash(usuario.password, 10);
        usuario.password = hash;
        await usuario.save();
        console.log(`🔐 Contraseña encriptada para: ${usuario.nombre}`);
      } else {
        console.log(`⚙️ ${usuario.nombre} ya tiene contraseña encriptada.`);
      }
    }

    console.log("✅ Encriptación completada con éxito.");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });
