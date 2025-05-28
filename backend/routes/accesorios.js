const express = require("express");
const router = express.Router();
const db = require("../db");

router.get('/accesorios', (req, res) => {
    const sqlQuery = `
        SELECT 
            accesorio.etiquetaAccesorio, accesorio.nombreProducto, accesorio.Stock, accesorio.descripcion, accesorio.qr_code_token
        FROM accesorio 
        INNER JOIN producto ON producto.etiqueta = accesorio.etiquetaAccesorio
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            res.status(500).json({ error: 'Error en la consulta' });
            return;
        }
        results.forEach(result => {
            if (result.fechaCompra) {
                result.fechaCompra = result.fechaCompra.toISOString().split('T')[0];
            }
        });
        res.json(results);
    });
});

module.exports = router;