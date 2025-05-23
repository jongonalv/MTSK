const express = require("express");
const router = express.Router();
const db = require("../db");

router.put('/updateEquipo', (req, res) => {
    const { etiquetaEquipo, tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, sistemaOperativo } = req.body;
    const sqlSelect = `SELECT tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, sistemaOperativo FROM equipo WHERE etiquetaEquipo = ? LIMIT 1`;
    db.query(sqlSelect, [etiquetaEquipo], (err, currentResult) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener datos actuales del equipo', details: err });
            return;
        }
        const current = currentResult && currentResult[0] ? currentResult[0] : {};
        const cambios = [];
        if (current.tipo !== tipo) cambios.push(`Tipo: "${current.tipo}" → "${tipo}"`);
        if (current.procesador !== procesador) cambios.push(`Procesador: "${current.procesador}" → "${procesador}"`);
        if (current.discoDuro !== discoDuro) cambios.push(`Disco Duro: "${current.discoDuro}" → "${discoDuro}"`);
        if (current.memoriaRAM !== memoriaRAM) cambios.push(`RAM: "${current.memoriaRAM}" → "${memoriaRAM}"`);
        if (current.numeroSerie !== numeroSerie) cambios.push(`N° Serie: "${current.numeroSerie}" → "${numeroSerie}"`);
        if (current.numeroPedido !== numeroPedido) cambios.push(`N° Pedido: "${current.numeroPedido}" → "${numeroPedido}"`);
        if (current.sistemaOperativo !== sistemaOperativo) cambios.push(`SO: "${current.sistemaOperativo}" → "${sistemaOperativo}"`);
        const sqlUpdate = `UPDATE equipo 
                           SET tipo = ?, procesador = ?, discoDuro = ?, memoriaRAM = ?, numeroSerie = ?, numeroPedido = ?, sistemaOperativo = ? 
                           WHERE etiquetaEquipo = ?`;
        db.query(sqlUpdate, [tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, sistemaOperativo, etiquetaEquipo], (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Error al actualizar el equipo', details: err });
                return;
            }
            const sqlUsuario = `SELECT Usuario FROM equipo_has_usuario WHERE etiquetaEquipo = ? LIMIT 1`;
            db.query(sqlUsuario, [etiquetaEquipo], (err, usuarioResult) => {
                if (err) {
                    res.status(500).json({ error: 'Error al comprobar usuario asignado', details: err });
                    return;
                }
                let usuario = null;
                if (usuarioResult && usuarioResult.length > 0 && usuarioResult[0].Usuario) {
                    usuario = usuarioResult[0].Usuario;
                }
                const tipoMovimiento = 'Editar equipo';
                const now = new Date();
                const fecha = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
                let detalleCambios = cambios.length > 0 ? cambios.join('; ') : 'Sin cambios relevantes';
                const comentario = usuario
                    ? `Se ha editado el equipo ${etiquetaEquipo} (usuario asignado: ${usuario}). Cambios: ${detalleCambios}`
                    : `Se ha editado el equipo ${etiquetaEquipo}. Cambios: ${detalleCambios}`;
                const sqlMovimiento = `
                    INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                    VALUES (?, ?, ?, ?, ?)
                `;
                db.query(sqlMovimiento, [etiquetaEquipo, usuario, fecha, tipoMovimiento, comentario], (err) => {
                    // No bloquea la respuesta principal si hay error en movimiento
                    res.json({ message: 'Equipo actualizado correctamente' });
                });
            });
        });
    });
});

module.exports = router;
