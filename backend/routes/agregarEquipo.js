const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

router.post('/agregarEquipo', async (req, res) => {
    const {
        etiquetaEquipo, marca, modelo, fechaCompra, garantia, empresa,
        tipo, procesador, ram, discoDuro, numeroSerie, numeroPedido, sistemaOperativo
    } = req.body;

    let transaction;

    try {
        const pool = await poolPromise;
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        const request1 = new sql.Request(transaction);
        await request1
            .input('etiqueta', sql.VarChar, etiquetaEquipo)
            .input('marca', sql.VarChar, marca)
            .input('modelo', sql.VarChar, modelo)
            .input('fechaCompra', sql.DateTime, fechaCompra ? new Date(fechaCompra) : null)
            .input('garantia', sql.VarChar, garantia)
            .input('empresa', sql.VarChar, empresa)
            .query(`
                USE MTSK;
                INSERT INTO producto (etiqueta, marca, modelo, fechaCompra, garantia, empresa)
                VALUES (@etiqueta, @marca, @modelo, @fechaCompra, @garantia, @empresa)
            `);

        const request2 = new sql.Request(transaction);
        await request2
            .input('etiquetaEquipo', sql.VarChar, etiquetaEquipo)
            .input('tipo', sql.VarChar, tipo)
            .input('procesador', sql.VarChar, procesador)
            .input('memoriaRAM', sql.VarChar, ram)
            .input('discoDuro', sql.VarChar, discoDuro)
            .input('numeroSerie', sql.VarChar, numeroSerie)
            .input('numeroPedido', sql.VarChar, numeroPedido)
            .input('sistemaOperativo', sql.VarChar, sistemaOperativo)
            .query(`
                USE MTSK;
                INSERT INTO equipo (etiquetaEquipo, tipo, procesador, memoriaRAM, discoDuro, numeroSerie, numeroPedido, sistemaOperativo)
                VALUES (@etiquetaEquipo, @tipo, @procesador, @memoriaRAM, @discoDuro, @numeroSerie, @numeroPedido, @sistemaOperativo)
            `);

        const tipoMovimiento = 'Alta equipo';
        const comentario = `Se ha agregado el equipo ${etiquetaEquipo} (${marca} ${modelo}) al inventario`;
        const now = new Date();

        const request3 = new sql.Request(transaction);
        await request3
            .input('etiquetaProducto', sql.VarChar, etiquetaEquipo)
            .input('fecha', sql.DateTime, now)
            .input('tipoMovimiento', sql.VarChar, tipoMovimiento)
            .input('comentario', sql.VarChar, comentario)
            .query(`
                USE MTSK;
                INSERT INTO movimiento (etiquetaProducto, fecha, tipoMovimiento, Comentario)
                VALUES (@etiquetaProducto, @fecha, @tipoMovimiento, @comentario)
            `);

        await transaction.commit();
        res.status(201).json({ message: 'Producto, equipo y movimiento insertados correctamente' });

    } catch (err) {
        console.error('Error durante la transacción:', err);
        if (transaction) await transaction.rollback();
        res.status(500).json({ error: 'Error al insertar los datos' });
    }
});

module.exports = router;
