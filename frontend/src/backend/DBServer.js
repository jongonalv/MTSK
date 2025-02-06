const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

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

app.get('/equipos', (req, res) => {
    const sqlQuery = `SELECT etiquetaEquipo, tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, fechaCompra, garantia, empresa, marca, modelo 
                      FROM equipo 
                      INNER JOIN producto 
                      ON producto.etiqueta = equipo.etiquetaEquipo`;

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

// Ruta para actualizar datos de equipo
app.put('/updateEquipo', (req, res) => {
    const { etiquetaEquipo, tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido } = req.body;

    const sqlUpdate = `UPDATE equipo 
                       SET tipo = ?, procesador = ?, discoDuro = ?, memoriaRAM = ?, numeroSerie = ?, numeroPedido = ? 
                       WHERE etiquetaEquipo = ?`;

    db.query(sqlUpdate, [tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, etiquetaEquipo], (err, result) => {
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

// Inicializar el servidor
app.listen(3001, () => {
    console.debug('Servidor corriendo en el puerto 3001');
});
