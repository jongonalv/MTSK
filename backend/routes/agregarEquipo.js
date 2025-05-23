const express = require("express");
const router = express.Router();
const db = require("../db");

router.post('/agregarEquipo', (req, res) => {
    const { etiquetaEquipo, marca, modelo, fechaCompra, garantia, empresa, tipo, procesador, ram, discoDuro, numeroSerie, numeroPedido, sistemaOperativo } = req.body;

    db.beginTransaction(err => {
        if (err) {
            res.status(500).json({ error: 'Error al iniciar la transacción' });
            return;
        }
        const sqlInsertProducto = `INSERT INTO producto (etiqueta, marca, modelo, fechaCompra, garantia, empresa) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(sqlInsertProducto, [etiquetaEquipo, marca, modelo, fechaCompra, garantia, empresa], (err) => {
            if (err) {
                return db.rollback(() => res.status(500).json({ error: 'Error al insertar el producto' }));
            }
            const sqlInsertEquipo = `INSERT INTO equipo (etiquetaEquipo, tipo, procesador, memoriaRAM, discoDuro, numeroSerie, numeroPedido, sistemaOperativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            db.query(sqlInsertEquipo, [etiquetaEquipo, tipo, procesador, ram, discoDuro, numeroSerie, numeroPedido, sistemaOperativo], (err) => {
                if (err) {
                    return db.rollback(() => res.status(500).json({ error: 'Error al insertar el equipo' }));
                }
                const tipoMovimiento = 'Alta equipo';
                const comentario = `Se ha agregado el equipo ${etiquetaEquipo} (${marca} ${modelo} al inventario)`;
                const now = new Date();
                const fecha = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
                const sqlMovimiento = `
                    INSERT INTO movimiento (etiquetaProducto, fecha, tipoMovimiento, Comentario)
                    VALUES (?, ?, ?, ?)
                `;
                db.query(sqlMovimiento, [etiquetaEquipo, fecha, tipoMovimiento, comentario], (err) => {
                    if (err) {
                        return db.rollback(() => res.status(500).json({ error: 'Error al registrar el movimiento' }));
                    }
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => res.status(500).json({ error: 'Error al confirmar la transacción' }));
                        }
                        res.status(201).json({ message: 'Producto, equipo y movimiento insertados correctamente' });
                    });
                });
            });
        });
    });
});

module.exports = router;
