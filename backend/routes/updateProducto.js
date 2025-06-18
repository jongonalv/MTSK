const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db"); // Importar correctamente

router.put('/updateProducto', async (req, res) => {
  const {
    etiqueta,
    fechaCompra,
    garantia,
    empresa,
    marca,
    modelo
  } = req.body;

  if (!etiqueta) {
    return res.status(400).json({ error: "Etiqueta requerida" });
  }

  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // Obtener datos actuales
    const selectResult = await new sql.Request(transaction)
      .input('etiqueta', sql.VarChar, etiqueta)
      .query(`
        SELECT fechaCompra, garantia, empresa, marca, modelo
        FROM producto
        WHERE etiqueta = @etiqueta
      `);

    const current = selectResult.recordset[0];
    if (!current) {
      await transaction.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Detectar cambios
    const cambios = [];
    const comparaciones = [
      { campo: 'fechaCompra', actual: current.fechaCompra?.toISOString().split('T')[0], nuevo: fechaCompra, label: 'Fecha de compra' },
      { campo: 'garantia', actual: current.garantia, nuevo: garantia, label: 'Garantía' },
      { campo: 'empresa', actual: current.empresa, nuevo: empresa, label: 'Empresa' },
      { campo: 'marca', actual: current.marca, nuevo: marca, label: 'Marca' },
      { campo: 'modelo', actual: current.modelo, nuevo: modelo, label: 'Modelo' }
    ];

    comparaciones.forEach(({ label, actual, nuevo }) => {
      if ((actual || '') !== (nuevo || '')) {
        cambios.push(`${label}: "${actual || ''}" → "${nuevo || ''}"`);
      }
    });

    // Ejecutar actualización
    await new sql.Request(transaction)
      .input('fechaCompra', sql.DateTime, fechaCompra ? new Date(fechaCompra) : null)
      .input('garantia', sql.VarChar, garantia)
      .input('empresa', sql.VarChar, empresa)
      .input('marca', sql.VarChar, marca)
      .input('modelo', sql.VarChar, modelo)
      .input('etiqueta', sql.VarChar, etiqueta)
      .query(`
        UPDATE producto
        SET fechaCompra = @fechaCompra,
            garantia = @garantia,
            empresa = @empresa,
            marca = @marca,
            modelo = @modelo
        WHERE etiqueta = @etiqueta
      `);

    // Registrar movimiento
    const tipoMovimiento = 'Editar producto';
    const now = new Date();
    const detalleCambios = cambios.length > 0 ? cambios.join('; ') : 'Sin cambios relevantes';
    const comentario = `Se ha editado el producto ${etiqueta}. Cambios: ${detalleCambios}`;

    await new sql.Request(transaction)
      .input('etiquetaProducto', sql.VarChar, etiqueta)
      .input('usuario', sql.VarChar, null) // sustituir por usuario si lo tienes en sesión
      .input('fecha', sql.DateTime, now)
      .input('tipoMovimiento', sql.VarChar, tipoMovimiento)
      .input('comentario', sql.VarChar, comentario)
      .query(`
        INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
        VALUES (@etiquetaProducto, @usuario, @fecha, @tipoMovimiento, @comentario)
      `);

    await transaction.commit();
    res.json({ message: 'Producto actualizado correctamente', cambios });

  } catch (err) {
    console.error('Error al actualizar producto:', err);
    await transaction.rollback();
    res.status(500).json({ error: 'Error al actualizar el producto', details: err });
  }
});

module.exports = router;
