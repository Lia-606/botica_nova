const express = require('express');
const router = express.Router();
const { obtenerAlertas } = require('../controllers/alertaController');
const auth = require('../middleware/auth'); 


router.get('/', auth, obtenerAlertas);

module.exports = router;
