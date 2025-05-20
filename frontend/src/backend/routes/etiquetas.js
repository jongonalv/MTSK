const express = require('express');
const router = express.Router();
const controller = require('../controllers/etiquetasController');

router.get('/', controller.getSiguienteEtiqueta);

module.exports = router;
