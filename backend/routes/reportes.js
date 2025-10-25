const express = require('express');
const router = express.Router();
const { generarReporte } = require('../controllers/reporteController');
const auth = require('../middleware/auth');

router.get('/pdf', auth, generarReporte);

module.exports = router;
