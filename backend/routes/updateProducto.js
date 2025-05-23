const express = require("express");
const router = express.Router();
const db = require("../db");

router.put('/updateProducto', (req, res) => {
    const { etiqueta, fechaCompra, garantia, empresa, marca, modelo } = req.body;
    const formattedFechaCompra = fechaCompra ? new Date(fechaCompra).toISOString().split('T')[0] : null;
    const sqlUpdate = `UPDATE producto 
                       SET fechaCompra = ?, garantia = ?, empresa = ?, marca = ?, modelo = ? 
                       WHERE etiqueta = ?`;
    db.query(sqlUpdate, [formattedFechaCompra, garantia, empresa, marca, modelo, etiqueta], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
            return;
        }
        res.json({ message: 'Producto actualizado correctamente' });
    });
});

module.exports = router;
