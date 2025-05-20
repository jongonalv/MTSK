const db = require('../db');

exports.getEquipos = (req, res) => {
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
        if (err) return res.status(500).json({ error: 'Error en la consulta' });
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

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Error al iniciar la transacción' });

        const deleteQuery = `DELETE FROM equipo_has_usuario WHERE etiquetaEquipo = ?`;
        db.query(deleteQuery, [etiquetaEquipo], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ error: 'Error al eliminar usuario asignado' }));

            const insertQuery = `INSERT INTO equipo_has_usuario (etiquetaEquipo, Usuario) VALUES (?, ?)`;
            db.query(insertQuery, [etiquetaEquipo, usuario], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ error: 'Error al asignar usuario' }));

                db.query('SELECT Nombre FROM usuario WHERE Usuario = ?', [usuario], (err, results) => {
                    if (err) return db.rollback(() => res.status(500).json({ error: 'Error al obtener el nombre del usuario' }));

                    const nombreUsuario = results?.[0]?.Nombre || usuario;
                    const comentario = `Se ha asignado el equipo ${etiquetaEquipo} a ${nombreUsuario}`;
                    const fecha = new Date();
                    const movimientoQuery = `
                        INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    db.query(movimientoQuery, [etiquetaEquipo, usuario, fecha, 'Asignar usuario', comentario], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ error: 'Error al registrar movimiento' }));
                        db.commit((err) => {
                            if (err) return db.rollback(() => res.status(500).json({ error: 'Error al confirmar la transacción' }));
                            res.json({ success: true, message: 'Usuario asignado correctamente' });
                        });
                    });
                });
            });
        });
    });
};

exports.agregarEquipo = (req, res) => {
    const { etiquetaEquipo, marca, modelo, fechaCompra, garantia, empresa, tipo, procesador, ram, discoDuro, numeroSerie, numeroPedido, sistemaOperativo } = req.body;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: 'Error al iniciar la transacción' });

        const sqlInsertProducto = `INSERT INTO producto (etiqueta, marca, modelo, fechaCompra, garantia, empresa) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(sqlInsertProducto, [etiquetaEquipo, marca, modelo, fechaCompra, garantia, empresa], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ error: 'Error al insertar el producto' }));

            const sqlInsertEquipo = `INSERT INTO equipo (etiquetaEquipo, tipo, procesador, memoriaRAM, discoDuro, numeroSerie, numeroPedido, sistemaOperativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            db.query(sqlInsertEquipo, [etiquetaEquipo, tipo, procesador, ram, discoDuro, numeroSerie, numeroPedido, sistemaOperativo], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ error: 'Error al insertar el equipo' }));

                const comentario = `Se ha agregado el equipo ${etiquetaEquipo} (${marca} ${modelo} al inventario)`;
                const fecha = new Date();
                const sqlMovimiento = `INSERT INTO movimiento (etiquetaProducto, fecha, tipoMovimiento, Comentario) VALUES (?, ?, ?, ?)`;
                db.query(sqlMovimiento, [etiquetaEquipo, fecha, 'Alta equipo', comentario], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ error: 'Error al registrar el movimiento' }));

                    db.commit(err => {
                        if (err) return db.rollback(() => res.status(500).json({ error: 'Error al confirmar la transacción' }));
                        res.status(201).json({ message: 'Producto, equipo y movimiento insertados correctamente' });
                    });
                });
            });
        });
    });
};

exports.actualizarEquipo = (req, res) => {
    const { etiquetaEquipo, tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, sistemaOperativo } = req.body;

    const sqlUpdate = `
        UPDATE equipo 
        SET tipo = ?, procesador = ?, discoDuro = ?, memoriaRAM = ?, numeroSerie = ?, numeroPedido = ?, sistemaOperativo = ? 
        WHERE etiquetaEquipo = ?
    `;
    db.query(sqlUpdate, [tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, sistemaOperativo, etiquetaEquipo], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el equipo' });

        const sqlUsuario = `SELECT Usuario FROM equipo_has_usuario WHERE etiquetaEquipo = ? LIMIT 1`;
        db.query(sqlUsuario, [etiquetaEquipo], (err, usuarioResult) => {
            if (err) return res.status(500).json({ error: 'Error al comprobar usuario asignado' });

            const usuario = usuarioResult?.[0]?.Usuario || null;
            const comentario = usuario
                ? `Se ha editado el equipo ${etiquetaEquipo} (usuario asignado: ${usuario})`
                : `Se ha editado el equipo ${etiquetaEquipo}`;
            const fecha = new Date();
            const sqlMovimiento = `
                INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(sqlMovimiento, [etiquetaEquipo, usuario, fecha, 'Editar equipo', comentario], () => {
                res.json({ message: 'Equipo actualizado correctamente' });
            });
        });
    });
};

exports.actualizarProducto = (req, res) => {
    const { etiqueta, fechaCompra, garantia, empresa, marca, modelo } = req.body;
    const formattedFechaCompra = fechaCompra ? new Date(fechaCompra).toISOString().split('T')[0] : null;

    const sqlUpdate = `UPDATE producto SET fechaCompra = ?, garantia = ?, empresa = ?, marca = ?, modelo = ? WHERE etiqueta = ?`;
    db.query(sqlUpdate, [formattedFechaCompra, garantia, empresa, marca, modelo, etiqueta], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el producto' });
        res.json({ message: 'Producto actualizado correctamente' });
    });
};

exports.eliminarEquipo = (req, res) => {
    const { etiquetaEquipo } = req.params;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: 'Error al iniciar la transacción' });

        const sqlUsuario = `SELECT Usuario FROM equipo_has_usuario WHERE etiquetaEquipo = ? LIMIT 1`;
        db.query(sqlUsuario, [etiquetaEquipo], (err, usuarioResult) => {
            if (err) return db.rollback(() => res.status(500).json({ error: 'Error al obtener usuario asignado' }));

            const usuario = usuarioResult?.[0]?.Usuario || null;
            const comentario = usuario
                ? `Se ha eliminado el equipo ${etiquetaEquipo} (usuario asignado: ${usuario})`
                : `Se ha eliminado el equipo ${etiquetaEquipo}`;
            const fecha = new Date();

            const sqlMovimiento = `
                INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(sqlMovimiento, [etiquetaEquipo, usuario, fecha, 'Eliminar equipo', comentario], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ error: 'Error al registrar el movimiento' }));

                db.query(`DELETE FROM equipo WHERE etiquetaEquipo = ?`, [etiquetaEquipo], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ error: 'Error al eliminar el equipo' }));

                    db.query(`DELETE FROM producto WHERE etiqueta = ?`, [etiquetaEquipo], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ error: 'Error al eliminar el producto' }));

                        db.commit((err) => {
                            if (err) return db.rollback(() => res.status(500).json({ error: 'Error al confirmar la transacción' }));
                            res.json({ message: 'Equipo, producto y movimiento de eliminación registrados correctamente' });
                        });
                    });
                });
            });
        });
    });
};
