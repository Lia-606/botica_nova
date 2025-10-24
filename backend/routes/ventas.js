const express = require('express');
const router = express.Router();

// Ruta temporal para probar el servidor
router.get('/', (req, res) => {
  res.send('📦 Ruta de ventas funcionando correctamente');
});

module.exports = router;
