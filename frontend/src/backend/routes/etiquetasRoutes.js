const express = require('express');
const router = express.Router();
const etiquetasController = require('../controllers/etiquetasController');

router.get('/siguienteEtiqueta', etiquetasController.getSiguienteEtiqueta);

module.exports = router;