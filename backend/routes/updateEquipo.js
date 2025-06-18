const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db"); // importar correctamente

router.put('/updateEquipo', async (req, res) => {
  const {
    etiquetaEquipo,
    tipo,
    procesador,
    discoDuro,
    memoriaRAM,
    numeroSerie,
    numeroPedido,
    sistemaOperativo
  } = req.body;

  if (!etiquetaEquipo) {
    return res.status(400).json({ error: "Falta la etiqueta del equipo" });
  }

  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // 1. Obtener datos actuales
    const selectResult = await request
      .input('etiquetaEquipo', sql.VarChar, etiquetaEquipo)
      .query(`
        SELECT tipo, procesador, discoDuro, memoriaRAM, numeroSerie, numeroPedido, sistemaOperativo
        FROM equipo
        WHERE etiquetaEquipo = @etiquetaEquipo
      `);

    const current = selectResult.recordset[0];
    if (!current) {
      await transaction.rollback();
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    // 2. Detectar cambios
    const cambios = [];
    const comparaciones = [
      { campo: 'tipo', actual: current.tipo, nuevo: tipo, label: 'Tipo' },
      { campo: 'procesador', actual: current.procesador, nuevo: procesador, label: 'Procesador' },
      { campo: 'discoDuro', actual: current.discoDuro, nuevo: discoDuro, label: 'Disco Duro' },
      { campo: 'memoriaRAM', actual: current.memoriaRAM, nuevo: memoriaRAM, label: 'RAM' },
      { campo: 'numeroSerie', actual: current.numeroSerie, nuevo: numeroSerie, label: 'N° Serie' },
      { campo: 'numeroPedido', actual: current.numeroPedido, nuevo: numeroPedido, label: 'N° Pedido' },
      { campo: 'sistemaOperativo', actual: current.sistemaOperativo, nuevo: sistemaOperativo, label: 'SO' }
    ];

    comparaciones.forEach(({ label, actual, nuevo }) => {
      if ((actual || '') !== (nuevo || '')) {
        cambios.push(`${label}: "${actual || ''}" → "${nuevo || ''}"`);
      }
    });

    // 3. Actualizar equipo
    await new sql.Request(transaction)
      .input('tipo', sql.VarChar, tipo)
      .input('procesador', sql.VarChar, procesador)
      .input('discoDuro', sql.VarChar, discoDuro)
      .input('memoriaRAM', sql.VarChar, memoriaRAM)
      .input('numeroSerie', sql.VarChar, numeroSerie)
      .input('numeroPedido', sql.VarChar, numeroPedido)
      .input('sistemaOperativo', sql.VarChar, sistemaOperativo)
      .input('etiquetaEquipo', sql.VarChar, etiquetaEquipo)
      .query(`
        UPDATE equipo
        SET tipo = @tipo,
            procesador = @procesador,
            discoDuro = @discoDuro,
            memoriaRAM = @memoriaRAM,
            numeroSerie = @numeroSerie,
            numeroPedido = @numeroPedido,
            sistemaOperativo = @sistemaOperativo
        WHERE etiquetaEquipo = @etiquetaEquipo
      `);

    // 4. Obtener usuario asignado
    const usuarioResult = await new sql.Request(transaction)
      .input('etiquetaEquipo', sql.VarChar, etiquetaEquipo)
      .query(`
        SELECT TOP 1 Usuario FROM equipo_has_usuario WHERE etiquetaEquipo = @etiquetaEquipo
      `);

    const usuario = usuarioResult.recordset.length > 0 ? usuarioResult.recordset[0].Usuario : null;

    // 5. Insertar movimiento
    const tipoMovimiento = 'Editar equipo';
    const now = new Date();
    const detalleCambios = cambios.length > 0 ? cambios.join('; ') : 'Sin cambios relevantes';
    const comentario = usuario
      ? `Se ha editado el equipo ${etiquetaEquipo} (usuario asignado: ${usuario}). Cambios: ${detalleCambios}`
      : `Se ha editado el equipo ${etiquetaEquipo}. Cambios: ${detalleCambios}`;

    await new sql.Request(transaction)
      .input('etiquetaProducto', sql.VarChar, etiquetaEquipo)
      .input('usuario', sql.VarChar, usuario)
      .input('fecha', sql.DateTime, now)
      .input('tipoMovimiento', sql.VarChar, tipoMovimiento)
      .input('comentario', sql.VarChar, comentario)
      .query(`
        INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
        VALUES (@etiquetaProducto, @usuario, @fecha, @tipoMovimiento, @comentario)
      `);

    await transaction.commit();
    res.json({ message: 'Equipo actualizado correctamente', cambios });

  } catch (err) {
    console.error('Error al actualizar equipo:', err);
    await transaction.rollback();
    res.status(500).json({ error: 'Error al actualizar el equipo', details: err });
  }
});

module.exports = router;
