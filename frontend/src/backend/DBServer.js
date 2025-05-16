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
    password: 'Ingl@terra_24$',
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

// Ruta para asignar un usuario a un equipo
app.post('/equipo/:etiquetaEquipo/asignar', (req, res) => {
    const { etiquetaEquipo } = req.params;
    const { usuario } = req.body;

    const deleteQuery = `DELETE FROM equipo_has_usuario WHERE etiquetaEquipo = ?`;
    const insertQuery = `INSERT INTO equipo_has_usuario (etiquetaEquipo, Usuario) VALUES (?, ?)`;

    db.query(deleteQuery, [etiquetaEquipo], (err, result) => {
        if (err) {
            console.error('Error al eliminar registros previos: ', err);
            res.status(500).send('Error al asignar el usuario al equipo');
            return;
        }

        db.query(insertQuery, [etiquetaEquipo, usuario], (err, result) => {
            if (err) {
                console.error('Error al insertar nuevo usuario: ', err);
                res.status(500).send('Error al asignar el usuario al equipo');
                return;
            }

            res.send('Usuario asignado correctamente');
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

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error al confirmar la transacción:', err);
                            res.status(500).json({ error: 'Error al confirmar la transacción' });
                        });
                    }

                    console.log('Producto y equipo insertados correctamente. Resultados:', result);
                    res.status(201).json({ message: 'Producto y equipo insertados correctamente' });
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
        console.log('Equipo actualizado correctamente. Resultados:', result);
        res.json({ message: 'Equipo actualizado correctamente' });
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

                    console.log('Equipo y producto eliminados correctamente. Resultados:', result);
                    res.json({ message: 'Equipo y producto eliminados correctamente' });
                });
            });
        });
    });
});

// Inicializar el servidor 
app.listen(3001, () => {
    console.debug('Servidor corriendo en el puerto 3001');
});