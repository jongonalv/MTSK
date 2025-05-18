const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

// Crear la aplicación express
const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'mtsk_version1',
    port: 3306
});

// Realizar conexión con comprobación de errores
db.connect(err => {
    if (err) {
        console.error('Error de conexión con la base de datos: ', err);
        return;
    }
    console.log('Conexión realizada correctamente.');
});

// Ruta para obtener datos de equipos
app.get('/equipos', (req, res) => {
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

        // Procesamos las fechas antes de enviar la respuesta
        results.forEach(result => {
            if (result.fechaCompra) {
                result.fechaCompra = result.fechaCompra.toISOString().split('T')[0];
            }
        });

        console.log('Consulta exitosa. Resultados:', results);
        res.json(results);
    });
});

// Ruta para obtener la lista de usuarios
app.get('/usuarios', (req, res) => {
    const sqlQuery = 'SELECT Usuario, Nombre FROM usuario';
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error al obtener la lista de usuarios: ', err);
            res.status(500).send('Error al obtener la lista de usuarios');
            return;
        }
        res.json(result);
    });
});

// Ruta para obtener los últimos movimientos
app.get('/movimientos', (req, res) => {
    // Puedes limitar a los últimos 10 movimientos, por ejemplo
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
        // Formatea la fecha a YYYY-MM-DD HH:mm
        results.forEach(mov => {
            if (mov.fecha) {
                const d = new Date(mov.fecha);
                mov.fecha = d.toISOString().replace('T', ' ').substring(0, 16);
            }
        });
        res.json(results);
    });
});

// Ruta para asignar un usuario a un equipo
app.post('/equipo/:etiquetaEquipo/asignar', (req, res) => {
    const { etiquetaEquipo } = req.params;
    const { usuario } = req.body;

    // Actualiza el usuario asignado al equipo
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

        // Obtener el nombre del usuario para el comentario
        db.query('SELECT Nombre FROM usuario WHERE Usuario = ?', [usuario], (err, results) => {
            const nombreUsuario = results && results[0] ? results[0].Nombre : usuario;
            const comentario = `Se ha asignado el equipo ${etiquetaEquipo} a ${nombreUsuario}`;
            const tipoMovimiento = 'Asignar usuario';
            const fecha = new Date();

            // Insertar movimiento
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
});

// Ruta para agregar un nuevo equipo
app.post('/agregarEquipo', (req, res) => {
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

                // Insertar movimiento de alta de equipo
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

                        console.log('Producto, equipo y movimiento insertados correctamente.');
                        res.status(201).json({ message: 'Producto, equipo y movimiento insertados correctamente' });
                    });
                });
            });
        });
    });
});

// Ruta para actualizar datos de equipo
app.put('/updateEquipo', (req, res) => {
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

        // Comprobar si el equipo tiene usuario asignado
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

            // Insertar movimiento de edición
            const tipoMovimiento = 'Editar equipo';
            const fecha = new Date();

            // Obtener el nombre del usuario para el comentario
            const comentario = usuario
                ? `Se ha editado el equipo ${etiquetaEquipo} (usuario asignado: ${usuario})`
                : `Se ha editado el equipo ${etiquetaEquipo}`;

            // Insertar movimiento
            const sqlMovimiento = `
                INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(sqlMovimiento, [etiquetaEquipo, usuario, fecha, tipoMovimiento, comentario], (err) => {
                if (err) {
                    console.error('Error al registrar movimiento de edición:', err);
                    // No bloquea la respuesta principal
                }
                console.log('Equipo actualizado correctamente. Resultados:', result);
                res.json({ message: 'Equipo actualizado correctamente' });
            });
        });
    });
});

// Ruta para actualizar datos de producto
app.put('/updateProducto', (req, res) => {
    const { etiqueta, fechaCompra, garantia, empresa, marca, modelo } = req.body;

    // Extraer solo la fecha (YYYY-MM-DD) de la cadena ISO 8601 (por ejemplo, '2021-07-27T22:00:00.000Z')
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
        console.log('Producto actualizado correctamente. Resultados:', result);
        res.json({ message: 'Producto actualizado correctamente' });
    });
});

// Ruta para eliminar datos de equipo y producto
app.delete('/equipo/:etiquetaEquipo', (req, res) => {
    const { etiquetaEquipo } = req.params;

    db.beginTransaction(err => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            res.status(500).json({ error: 'Error al iniciar la transacción' });
            return;
        }

        // Obtener usuario asignado antes de eliminar
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

            // Insertar movimiento de eliminación antes de borrar los datos
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

                // Eliminar equipo
                const sqlDeleteEquipo = `DELETE FROM equipo WHERE etiquetaEquipo = ?`;
                db.query(sqlDeleteEquipo, [etiquetaEquipo], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error al eliminar equipo:', err);
                            res.status(500).json({ error: 'Error al eliminar el equipo' });
                        });
                    }

                    // Eliminar producto
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

                            console.log('Equipo, producto y movimiento de eliminación registrados correctamente.');
                            res.json({ message: 'Equipo, producto y movimiento de eliminación registrados correctamente' });
                        });
                    });
                });
            });
        });
    });
});

// Ruta para obtener la siguiente etiqueta
// Recibe un prefijo y devuelve el siguiente número de etiqueta
app.get('/siguienteEtiqueta', (req, res) => {
  console.log("Query recibida:", req.query);
  const { prefijo } = req.query;
  if (!prefijo) return res.status(400).json({ error: 'Prefijo requerido' });

  const sql = `
    SELECT etiquetaEquipo 
    FROM equipo 
    WHERE etiquetaEquipo LIKE ? 
    ORDER BY etiquetaEquipo ASC
  `;
  db.query(sql, [`${prefijo}%`], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    // Extrae los números usados
    const usados = results
      .map(r => parseInt(r.etiquetaEquipo.slice(prefijo.length), 10))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    // Busca el primer hueco
    let siguienteNumero = 1;
    for (let i = 0; i < usados.length; i++) {
      if (usados[i] !== i + 1) {
        siguienteNumero = i + 1;
        break;
      }
      // Si no hay huecos, será el siguiente al mayor
      siguienteNumero = usados.length + 1;
    }
    res.json({ siguienteNumero: siguienteNumero.toString().padStart(3, '0') });
  });
});

// Inicializar el servidor 
app.listen(3001, () => {
    console.debug('Servidor corriendo en el puerto 3001');
});