const db = require('../config/database');

exports.getAllEquipos = (req, res) => {
    const sqlQuery = `
        SELECT 
            equipo.etiquetaEquipo, equipo.tipo, equipo.procesador, equipo.discoDuro, equipo.memoriaRAM, equipo.numeroSerie, equipo.numeroPedido, producto.fechaCompra, producto.garantia, producto.empresa, producto.marca, producto.modelo, equipo.sistemaOperativo,
            COALESCE(usuario.Nombre, 'Sin asignar') AS usuario
        FROM equipo 
        INNER JOIN producto ON producto.etiqueta = equipo.etiquetaEquipo
        LEFT JOIN equipo_has_usuario ON equipo.etiquetaEquipo = equipo_has_usuario.etiquetaEquipo
        LEFT JOIN usuario ON usuario.Usuario = equipo_has_usuario.Usuario
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
};

exports.asignarUsuario = (req, res) => {
    const { etiquetaEquipo } = req.params;
    const { usuario } = req.body;

    const updateQuery = `
        INSERT INTO equipo_has_usuario (etiquetaEquipo, Usuario)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE Usuario = VALUES(Usuario)
    `;

    db.query(updateQuery, [etiquetaEquipo, usuario], (err) => {
        if (err) {
            console.error('Error al asignar usuario:', err);
            return res.status(500).json({ error: 'Error al asignar usuario' });
        }

        db.query('SELECT Nombre FROM usuario WHERE Usuario = ?', [usuario], (err, results) => {
            const nombreUsuario = results && results[0] ? results[0].Nombre : usuario;
            const comentario = `Se ha asignado el equipo ${etiquetaEquipo} a ${nombreUsuario}`;
            const tipoMovimiento = 'Asignar usuario';
            const fecha = new Date();

            const movimientoQuery = `
                INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(
                movimientoQuery,
                [etiquetaEquipo, usuario, fecha, tipoMovimiento, comentario],
                (err) => {
                    if (err) {
                        console.error('Error al registrar movimiento:', err);
                    }
                    return res.json({ success: true });
                }
            );
        });
    });
};

exports.agregarEquipo = (req, res) => {
    const { etiquetaEquipo, marca, modelo, fechaCompra, garantia, empresa, tipo, procesador, ram, discoDuro, numeroSerie, numeroPedido, sistemaOperativo } = req.body;

    db.beginTransaction(err => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            res.status(500).json({ error: 'Error al iniciar la transacción' });
            return;
        }

        const sqlInsertProducto = `INSERT INTO producto (etiqueta, marca, modelo, fechaCompra, garantia, empresa) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(sqlInsertProducto, [etiquetaEquipo, marca, modelo, fechaCompra, garantia, empresa], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error al insertar producto:', err);
                    res.status(500).json({ error: 'Error al insertar el producto' });
                });
            }

            const sqlInsertEquipo = `INSERT INTO equipo (etiquetaEquipo, tipo, procesador, memoriaRAM, discoDuro, numeroSerie, numeroPedido, sistemaOperativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            db.query(sqlInsertEquipo, [etiquetaEquipo, tipo, procesador, ram, discoDuro, numeroSerie, numeroPedido, sistemaOperativo], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error al insertar equipo:', err);
                        res.status(500).json({ error: 'Error al insertar el equipo' });
                    });
                }

                const tipoMovimiento = 'Alta equipo';
                const comentario = `Se ha agregado el equipo ${etiquetaEquipo} (${marca} ${modelo} al inventario)`;
                const fecha = new Date();

                const sqlMovimiento = `
                    INSERT INTO movimiento (etiquetaProducto, fecha, tipoMovimiento, Comentario)
                    VALUES (?, ?, ?, ?)
                `;
                db.query(sqlMovimiento, [etiquetaEquipo, fecha, tipoMovimiento, comentario], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error al insertar movimiento:', err);
                            res.status(500).json({ error: 'Error al registrar el movimiento' });
                        });
                    }

                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Error al confirmar la transacción:', err);
                                res.status(500).json({ error: 'Error al confirmar la transacción' });
                            });
                        }

                        res.status(201).json({ message: 'Producto, equipo y movimiento insertados correctamente' });
                    });
                });
            });
        });
    });
};

exports.updateEquipo = (req, res) => {
    const { etiquetaEquipo, tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, sistemaOperativo } = req.body;

    const sqlUpdate = `UPDATE equipo 
                       SET tipo = ?, procesador = ?, discoDuro = ?, memoriaRAM = ?, numeroSerie = ?, numeroPedido = ?, sistemaOperativo = ? 
                       WHERE etiquetaEquipo = ?`;

    db.query(sqlUpdate, [tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, sistemaOperativo, etiquetaEquipo], (err, result) => {
        if (err) {
            console.error('Error al actualizar equipo:', err);
            res.status(500).json({ error: 'Error al actualizar el equipo', details: err });
            return;
        }

        const sqlUsuario = `SELECT Usuario FROM equipo_has_usuario WHERE etiquetaEquipo = ? LIMIT 1`;
        db.query(sqlUsuario, [etiquetaEquipo], (err, usuarioResult) => {
            if (err) {
                console.error('Error al comprobar usuario asignado:', err);
                res.status(500).json({ error: 'Error al comprobar usuario asignado', details: err });
                return;
            }

            let usuario = null;
            if (usuarioResult && usuarioResult.length > 0 && usuarioResult[0].Usuario) {
                usuario = usuarioResult[0].Usuario;
            }

            const tipoMovimiento = 'Editar equipo';
            const fecha = new Date();
            const comentario = usuario
                ? `Se ha editado el equipo ${etiquetaEquipo} (usuario asignado: ${usuario})`
                : `Se ha editado el equipo ${etiquetaEquipo}`;

            const sqlMovimiento = `
                INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(sqlMovimiento, [etiquetaEquipo, usuario, fecha, tipoMovimiento, comentario], (err) => {
                if (err) {
                    console.error('Error al registrar movimiento de edición:', err);
                }
                res.json({ message: 'Equipo actualizado correctamente' });
            });
        });
    });
};

exports.updateProducto = (req, res) => {
    const { etiqueta, fechaCompra, garantia, empresa, marca, modelo } = req.body;

    const formattedFechaCompra = fechaCompra ? new Date(fechaCompra).toISOString().split('T')[0] : null;

    const sqlUpdate = `UPDATE producto 
                       SET fechaCompra = ?, garantia = ?, empresa = ?, marca = ?, modelo = ? 
                       WHERE etiqueta = ?`;

    db.query(sqlUpdate, [formattedFechaCompra, garantia, empresa, marca, modelo, etiqueta], (err, result) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar el producto' });
            return;
        }
        res.json({ message: 'Producto actualizado correctamente' });
    });
};

exports.deleteEquipo = (req, res) => {
    const { etiquetaEquipo } = req.params;

    db.beginTransaction(err => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            res.status(500).json({ error: 'Error al iniciar la transacción' });
            return;
        }

        const sqlUsuario = `SELECT Usuario FROM equipo_has_usuario WHERE etiquetaEquipo = ? LIMIT 1`;
        db.query(sqlUsuario, [etiquetaEquipo], (err, usuarioResult) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error al obtener usuario asignado:', err);
                    res.status(500).json({ error: 'Error al obtener usuario asignado' });
                });
            }

            let usuario = null;
            if (usuarioResult && usuarioResult.length > 0 && usuarioResult[0].Usuario) {
                usuario = usuarioResult[0].Usuario;
            }

            const tipoMovimiento = 'Eliminar equipo';
            const fecha = new Date();
            const comentario = usuario
                ? `Se ha eliminado el equipo ${etiquetaEquipo} (usuario asignado: ${usuario})`
                : `Se ha eliminado el equipo ${etiquetaEquipo}`;

            const sqlMovimiento = `
                INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(sqlMovimiento, [etiquetaEquipo, usuario, fecha, tipoMovimiento, comentario], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error al registrar movimiento de eliminación:', err);
                        res.status(500).json({ error: 'Error al registrar el movimiento' });
                    });
                }

                const sqlDeleteEquipo = `DELETE FROM equipo WHERE etiquetaEquipo = ?`;
                db.query(sqlDeleteEquipo, [etiquetaEquipo], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error al eliminar equipo:', err);
                            res.status(500).json({ error: 'Error al eliminar el equipo' });
                        });
                    }

                    const sqlDeleteProducto = `DELETE FROM producto WHERE etiqueta = ?`;
                    db.query(sqlDeleteProducto, [etiquetaEquipo], (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Error al eliminar producto:', err);
                                res.status(500).json({ error: 'Error al eliminar el producto' });
                            });
                        }

                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Error al confirmar la transacción:', err);
                                    res.status(500).json({ error: 'Error al confirmar la transacción' });
                                });
                            }

                            res.json({ message: 'Equipo, producto y movimiento de eliminación registrados correctamente' });
                        });
                    });
                });
            });
        });
    });
};