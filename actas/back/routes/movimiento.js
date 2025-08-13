const express = require('express');
const router = express.Router();

const Movimiento = require('../models/Movimiento');
const Inventario = require('../models/Inventario');
const Activo = require('../models/Activo');

// GET: Obtener historial de movimientos
router.get('/', async (req, res) => {
  try {
    const movimientos = await Movimiento.find()
      .populate('item_inventario')
      .populate('activo')
      .populate('responsable')
      .populate('realizado_por')
      .sort({ fecha: -1 });

    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ error: 'Error al obtener movimientos' });
  }
});

// POST: Registrar un nuevo movimiento
router.post('/', async (req, res) => {
  try {
    const {
      tipo_movimiento,
      item_inventario,
      activo,
      cantidad = 1,
      responsable,
      realizado_por,
      observaciones
    } = req.body;

    const nuevoMovimiento = new Movimiento({
      tipo_movimiento,
      item_inventario: item_inventario || null,
      activo: activo || null,
      cantidad,
      responsable: responsable || null,
      realizado_por,
      observaciones
    });

    await nuevoMovimiento.save();

    // Si es inventario, actualizamos stock
    if (item_inventario) {
      const item = await Inventario.findById(item_inventario);
      if (!item) return res.status(404).json({ error: 'Item de inventario no encontrado' });

      if (tipo_movimiento === 'entrada' || tipo_movimiento === 'devolucion') {
        item.stock_disponible += cantidad;
      } else if (tipo_movimiento === 'salida' || tipo_movimiento === 'asignacion') {
        if (item.stock_disponible < cantidad) {
          return res.status(400).json({ error: 'Stock insuficiente' });
        }
        item.stock_disponible -= cantidad;
      }

      await item.save();
    }

    // Si es activo individual, actualizamos su estado
    if (activo) {
      if (tipo_movimiento === 'asignacion') {
        await Activo.findByIdAndUpdate(activo, {
          asignado_a: responsable,
          fecha_asignacion: new Date()
        });
      } else if (tipo_movimiento === 'devolucion') {
        await Activo.findByIdAndUpdate(activo, {
          asignado_a: null,
          fecha_asignacion: null
        });
      }
    }

    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    console.error('Error al registrar movimiento:', error);
    res.status(500).json({ error: 'Error al registrar movimiento' });
  }
});

module.exports = router;
