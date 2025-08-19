const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Activo = require('../models/Activo');
const Inventario = require('../models/Inventario');
const Movimiento = require('../models/Movimiento');

// POST: Asignar activo/inventario/ambos
router.post('/', async (req, res) => {
  const {
    tipoAsignacion,   // "activo" | "inventario" | "ambos"
    colaboradorId,    // _id del colaborador
    activoId,         // _id del activo
    inventarioId,     // _id del item inventario
    cantidad = 1,     // cantidad para inventario
    observaciones,    // texto opcional
    realizado_por     // _id del usuario que realiza la acción
  } = req.body;

  if (!colaboradorId) {
    return res.status(400).json({ error: 'Debe seleccionar un colaborador' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Asignación de activo
    if (tipoAsignacion === 'activo' || tipoAsignacion === 'ambos') {
      const activo = await Activo.findById(activoId).session(session);
      if (!activo) {
        throw new Error('Activo no encontrado');
      }
      if (activo.estado && activo.estado.toLowerCase() === 'asignado') {
        throw new Error('Este activo ya está asignado');
      }

      activo.asignado_a = colaboradorId;
      activo.fecha_asignacion = new Date();
      activo.estado = 'Asignado';
      await activo.save({ session });

      await Movimiento.create([{
        tipo_movimiento: 'asignacion',
        activo: activoId,
        responsable: colaboradorId,
        realizado_por,
        observaciones
      }], { session });
    }

    // Asignación de inventario
    if (tipoAsignacion === 'inventario' || tipoAsignacion === 'ambos') {
      const item = await Inventario.findById(inventarioId).session(session);
      if (!item) {
        throw new Error('Item de inventario no encontrado');
      }
      if (item.stock_disponible < cantidad) {
        throw new Error('Stock insuficiente');
      }

      item.stock_disponible -= cantidad;
      await item.save({ session });

      await Movimiento.create([{
        tipo_movimiento: 'asignacion',
        item_inventario: inventarioId,
        cantidad,
        responsable: colaboradorId,
        realizado_por,
        observaciones
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Asignación realizada correctamente' });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error en asignación:', error);
    res.status(400).json({ error: error.message || 'Error al asignar' });
  }
});

module.exports = router;
