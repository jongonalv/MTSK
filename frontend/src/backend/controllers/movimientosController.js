const db = require('../db');

exports.getUltimosMovimientos = (req, res) => {
    const sqlQuery = `
        SELECT ID_Movimiento, etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario
        FROM movimiento
        ORDER BY fecha DESC
        LIMIT 10
    `;
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener movimientos:', err);
            res.status(500).json({ error: 'Error al obtener movimientos' });
            return;
        }

        results.forEach(mov => {
            if (mov.fecha) {
                const d = new Date(mov.fecha);
                mov.fecha = d.toISOString().replace('T', ' ').substring(0, 16);
            }
        });

        res.json(results);
    });
};
