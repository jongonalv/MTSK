const express = require("express");
const router = express.Router();
const db = require("../db"); // conexión con mssql

router.delete('/equipo/:etiquetaEquipo', async (req, res) => {
    const { etiquetaEquipo } = req.params;
    const transaction = new db.Transaction();

    try {
        await transaction.begin();

        // 1. Obtener usuario asignado al equipo
        const reqUsuario = new db.Request(transaction);
        const usuarioResult = await reqUsuario
            .input('etiquetaEquipo', db.VarChar, etiquetaEquipo)
            .query(`
                SELECT TOP 1 Usuario FROM equipo_has_usuario WHERE etiquetaEquipo = @etiquetaEquipo
            `);

        const usuario = usuarioResult.recordset.length > 0 ? usuarioResult.recordset[0].Usuario : null;

        // 2. Eliminar movimientos del equipo
        const reqDelMovs = new db.Request(transaction);
        await reqDelMovs
            .input('etiquetaProducto', db.VarChar, etiquetaEquipo)
            .query('DELETE FROM movimiento WHERE etiquetaProducto = @etiquetaProducto');

        // 3. Eliminar relación equipo-usuario
        const reqDelRel = new db.Request(transaction);
        await reqDelRel
            .input('etiquetaEquipo', db.VarChar, etiquetaEquipo)
            .query('DELETE FROM equipo_has_usuario WHERE etiquetaEquipo = @etiquetaEquipo');

        // 4. Eliminar equipo
        const reqDelEquipo = new db.Request(transaction);
        await reqDelEquipo
            .input('etiquetaEquipo', db.VarChar, etiquetaEquipo)
            .query('DELETE FROM equipo WHERE etiquetaEquipo = @etiquetaEquipo');

        // 5. Eliminar producto
        const reqDelProd = new db.Request(transaction);
        await reqDelProd
            .input('etiqueta', db.VarChar, etiquetaEquipo)
            .query('DELETE FROM producto WHERE etiqueta = @etiqueta');

        // 6. Registrar movimiento de eliminación
        const comentario = usuario
            ? `Se ha eliminado el equipo ${etiquetaEquipo} (usuario asignado: ${usuario})`
            : `Se ha eliminado el equipo ${etiquetaEquipo}`;
        const tipoMovimiento = 'Eliminar equipo';
        const now = new Date();

        const reqMov = new db.Request(transaction);
        await reqMov
            .input('etiquetaProducto', db.VarChar, null)
            .input('usuario', db.VarChar, usuario)
            .input('fecha', db.DateTime, now)
            .input('tipoMovimiento', db.VarChar, tipoMovimiento)
            .input('comentario', db.VarChar, comentario)
            .query(`
                INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                VALUES (@etiquetaProducto, @usuario, @fecha, @tipoMovimiento, @comentario)
            `);

        await transaction.commit();
        res.json({
            message: 'Equipo, producto, movimientos y relación eliminados correctamente. Movimiento de eliminación registrado.'
        });

    } catch (err) {
        console.error('Error en la transacción de eliminación:', err);
        await transaction.rollback();
        res.status(500).json({ error: 'Error al eliminar el equipo' });
    }
});

module.exports = router;
