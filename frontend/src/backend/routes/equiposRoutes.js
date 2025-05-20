const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equiposController');

router.get('/', equiposController.getAllEquipos);
router.post('/:etiquetaEquipo/asignar', equiposController.asignarUsuario);
router.post('/agregarEquipo', equiposController.agregarEquipo);
router.put('/updateEquipo', equiposController.updateEquipo);
router.put('/updateProducto', equiposController.updateProducto);
router.delete('/:etiquetaEquipo', equiposController.deleteEquipo);

module.exports = router;