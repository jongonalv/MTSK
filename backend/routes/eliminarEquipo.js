const express = require("express");
const router = express.Router();
const db = require("../db");

router.delete('/equipo/:etiquetaEquipo', (req, res) => {
    const { etiquetaEquipo } = req.params;
    db.beginTransaction(err => {
        if (err) {
            res.status(500).json({ error: 'Error al iniciar la transacción' });
            return;
        }
        const sqlUsuario = `SELECT Usuario FROM equipo_has_usuario WHERE etiquetaEquipo = ? LIMIT 1`;
        db.query(sqlUsuario, [etiquetaEquipo], (err, usuarioResult) => {
            if (err) {
                return db.rollback(() => res.status(500).json({ error: 'Error al obtener usuario asignado' }));
            }
            let usuario = null;
            if (usuarioResult && usuarioResult.length > 0 && usuarioResult[0].Usuario) {
                usuario = usuarioResult[0].Usuario;
            }
            const sqlDeleteMovimientos = `DELETE FROM movimiento WHERE etiquetaProducto = ?`;
            db.query(sqlDeleteMovimientos, [etiquetaEquipo], (err) => {
                if (err) {
                    return db.rollback(() => res.status(500).json({ error: 'Error al eliminar movimientos relacionados' }));
                }
                const sqlDeleteRelacion = `DELETE FROM equipo_has_usuario WHERE etiquetaEquipo = ?`;
                db.query(sqlDeleteRelacion, [etiquetaEquipo], (err) => {
                    if (err) {
                        return db.rollback(() => res.status(500).json({ error: 'Error al eliminar relación equipo-usuario' }));
                    }
                    const sqlDeleteEquipo = `DELETE FROM equipo WHERE etiquetaEquipo = ?`;
                    db.query(sqlDeleteEquipo, [etiquetaEquipo], (err) => {
                        if (err) {
                            return db.rollback(() => res.status(500).json({ error: 'Error al eliminar el equipo' }));
                        }
                        const sqlDeleteProducto = `DELETE FROM producto WHERE etiqueta = ?`;
                        db.query(sqlDeleteProducto, [etiquetaEquipo], (err) => {
                            if (err) {
                                return db.rollback(() => res.status(500).json({ error: 'Error al eliminar el producto' }));
                            }
                            const tipoMovimiento = 'Eliminar equipo';
                            const now = new Date();
                            const fecha = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
                            const comentario = usuario
                                ? `Se ha eliminado el equipo ${etiquetaEquipo} (usuario asignado: ${usuario})`
                                : `Se ha eliminado el equipo ${etiquetaEquipo}`;
                            const sqlMovimiento = `
                                INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                                VALUES (?, ?, ?, ?, ?)
                            `;
                            db.query(sqlMovimiento, [null, usuario, fecha, tipoMovimiento, comentario], (err) => {
                                if (err) {
                                    return db.rollback(() => res.status(500).json({ error: 'Error al registrar el movimiento' }));
                                }
                                db.commit(err => {
                                    if (err) {
                                        return db.rollback(() => res.status(500).json({ error: 'Error al confirmar la transacción' }));
                                    }
                                    res.json({ message: 'Equipo, producto, movimientos y relación eliminados correctamente. Movimiento de eliminación registrado.' });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
