const express = require('express');
const router = express.Router();
const controller = require('../controllers/equiposController');

router.get('/', controller.getEquipos);
router.post('/:etiquetaEquipo/asignar', controller.asignarUsuario);
router.post('/agregarEquipo', controller.agregarEquipo);
router.put('/updateEquipo', controller.actualizarEquipo);
router.put('/updateProducto', controller.actualizarProducto);
router.delete('/:etiquetaEquipo', controller.eliminarEquipo);

module.exports = router;
