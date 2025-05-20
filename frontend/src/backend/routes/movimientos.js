const express = require('express');
const router = express.Router();
const controller = require('../controllers/movimientosController');

router.get('/', controller.getUltimosMovimientos);

module.exports = router;
// Compare this snippet from frontend/src/backend/routes/siguienteEtiqueta.js:
// const express = require('express');  