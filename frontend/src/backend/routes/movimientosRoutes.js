const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientosController');

router.get('/', movimientosController.getMovimientos);

module.exports = router;