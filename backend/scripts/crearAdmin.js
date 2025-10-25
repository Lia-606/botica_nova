
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const conectarDB = require('../config/db');

(async () => {
  try {

    await conectarDB();


    const nombre = 'Zayne';
    const correo = 'zayne@gmail.com';
    const password = '123456789'; 
    const rol = 'admin';


    const existente = await Usuario.findOne({ correo });

    if (existente) {
      console.log('⚠️  El usuario administrador ya existe. No se creará de nuevo.');
      mongoose.connection.close();
      return;
    }

   
    const admin = new Usuario({
      nombre,
      correo,
      password, 
      rol,
    });

    await admin.save();

    console.log('\n Administrador creado con éxito:');
    console.log(` Correo: ${correo}`);
    console.log(` Contraseña: ${password}`);
    console.log(` Rol: ${rol}`);
  } catch (error) {
    console.error(' Error al crear el administrador:', error.message);
  } finally {
  
    mongoose.connection.close();
  }
})();
