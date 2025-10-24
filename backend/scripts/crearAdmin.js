// ✅ Cargar variables de entorno
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const conectarDB = require('../config/db');

(async () => {
  try {
    // 1️⃣ Conectar a la base de datos
    await conectarDB();

    // 2️⃣ Datos del administrador
    const nombre = 'Zayne';
    const correo = 'zayne@gmail.com';
    const password = '123456789'; // ⚠️ En texto plano — se encripta automáticamente
    const rol = 'admin';

    // 3️⃣ Verificar si ya existe un admin con ese correo
    const existente = await Usuario.findOne({ correo });

    if (existente) {
      console.log('⚠️  El usuario administrador ya existe. No se creará de nuevo.');
      mongoose.connection.close();
      return;
    }

    // 4️⃣ Crear nuevo usuario administrador
    const admin = new Usuario({
      nombre,
      correo,
      password, // ✅ Se encripta automáticamente por el pre('save')
      rol,
    });

    await admin.save();

    console.log('\n✅ Administrador creado con éxito:');
    console.log(`📧 Correo: ${correo}`);
    console.log(`🔑 Contraseña: ${password}`);
    console.log(`⚙️  Rol: ${rol}`);
  } catch (error) {
    console.error('❌ Error al crear el administrador:', error.message);
  } finally {
    // 5️⃣ Cerrar conexión
    mongoose.connection.close();
  }
})();
