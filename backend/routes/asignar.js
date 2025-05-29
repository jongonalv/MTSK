const express = require("express");
const router = express.Router();
const db = require("../db");

router.post('/equipo/:etiquetaEquipo/asignar', (req, res) => {
    const { etiquetaEquipo } = req.params;
    const { usuario } = req.body;

    db.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).json({ error: 'Error al iniciar la transacción' });
        }
        const deleteQuery = `DELETE FROM equipo_has_usuario WHERE etiquetaEquipo = ?`;
        db.query(deleteQuery, [etiquetaEquipo], (err) => {
            if (err) {
                console.error('Error al eliminar usuario asignado:', err);
                return db.rollback(() => res.status(500).json({ error: 'Error al eliminar usuario asignado' }));
            }   
            console.log('Insertando:', etiquetaEquipo, usuario.Usuario);
            const insertQuery = `INSERT INTO equipo_has_usuario (etiquetaEquipo, Usuario) VALUES (?, ?)`;
            db.query(insertQuery, [etiquetaEquipo, usuario.Usuario], (err) => {
                if (err) {
                    console.error('Error al asignar usuario:', err);
                    return db.rollback(() => res.status(500).json({ error: 'Error al asignar usuario' }));
                }
                db.query('SELECT Nombre FROM usuario WHERE Usuario = ?', [usuario.Usuario], (err, results) => {
                    if (err) {
                        return db.rollback(() => res.status(500).json({ error: 'Error al obtener el nombre del usuario' }));
                    }
                    const nombreUsuario = results && results[0] ? results[0].Nombre : usuario.Usuario;
                    const comentario = `Se ha asignado el equipo ${etiquetaEquipo} a ${nombreUsuario}`;
                    const tipoMovimiento = 'Asignar usuario';
                    const now = new Date();
                    const fecha = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
                    const movimientoQuery = `
                        INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    db.query(
                        movimientoQuery,
                        [etiquetaEquipo, usuario.Usuario, fecha, tipoMovimiento, comentario],
                        (err) => {
                            if (err) {
                                return db.rollback(() => res.status(500).json({ error: 'Error al registrar movimiento' }));
                            }
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => res.status(500).json({ error: 'Error al confirmar la transacción' }));
                                }
                                res.json({ success: true, message: 'Usuario asignado correctamente' });
                            });
                        }
                    );
                });
            });
        });
    });
});

module.exports = router;
