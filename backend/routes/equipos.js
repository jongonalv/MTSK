const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET /equipos
router.get("/equipos", (req, res) => {
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
      return res.status(500).json({ error: 'Error en la consulta' });
    }
    results.forEach(result => {
      if (result.fechaCompra) {
        result.fechaCompra = result.fechaCompra.toISOString().split('T')[0];
      }
    });
    res.json(results);
  });
});

// POST /equipo/agregarEquipo
router.post("/agregarEquipo", (req, res) => {
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

// PUT /equipo/updateEquipo
router.put("/updateEquipo", (req, res) => {
const { etiquetaEquipo, tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, sistemaOperativo } = req.body;

    // Obtener los datos actuales antes de actualizar
    const sqlSelect = `SELECT tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, sistemaOperativo FROM equipo WHERE etiquetaEquipo = ? LIMIT 1`;
    db.query(sqlSelect, [etiquetaEquipo], (err, currentResult) => {
        if (err) {
            console.error('Error al obtener datos actuales del equipo:', err);
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

                // Detalle de cambios
                let detalleCambios = cambios.length > 0 ? cambios.join('; ') : 'Sin cambios relevantes';
                const comentario = usuario
                    ? `Se ha editado el equipo ${etiquetaEquipo} (usuario asignado: ${usuario}). Cambios: ${detalleCambios}`
                    : `Se ha editado el equipo ${etiquetaEquipo}. Cambios: ${detalleCambios}`;

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
});

// PUT /equipo/updateProducto
router.put("/updateProducto", (req, res) => {
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

// DELETE /equipo/:etiquetaEquipo
router.delete("/:etiquetaEquipo", (req, res) => {
  // ...mover aquí la lógica de eliminar equipo...
  // ...existing code from /equipo/:etiquetaEquipo...
});

// POST /equipo/:etiquetaEquipo/asignar
router.post("/:etiquetaEquipo/asignar", (req, res) => {
  // ...mover aquí la lógica de asignar usuario...
  // ...existing code from /equipo/:etiquetaEquipo/asignar...
});

module.exports = router;
