const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activo = require('../models/Activo');
// const verificarToken = require('../middleware/verificarToken');

// Obtener todos los activos
router.get('/', async (req, res) => {
  try {
    const activos = await Activo.find().populate('asignado_a', 'nombre apellido identificacion');
    res.json(activos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener activos', detalle: error.message });
  }
});

// Actualizar un activo por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID no válido' });
    }

    // Validar que haya datos en el body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Datos de actualización vacíos' });
    }

    const actualizado = await Activo.findByIdAndUpdate(id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: 'Activo no encontrado' });

    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar activo', detalle: error.message });
  }
});

// Eliminar un activo por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID no válido' });
    }

    const eliminado = await Activo.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ error: 'Activo no encontrado' });

    res.json({ mensaje: 'Activo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar activo', detalle: error.message });
  }
});

module.exports = router;

// Crear un nuevo activo
router.post('/', async (req, res) => {
  try {
    const datos = { ...req.body };

    // Si asignado_a está vacío, lo ponemos en null
    if (!datos.asignado_a) {
      datos.asignado_a = null;
    }

    // Si fecha_asignacion está vacía, lo ponemos en null
    if (!datos.fecha_asignacion) {
      datos.fecha_asignacion = null;
    }

    const nuevoActivo = new Activo(datos);
    await nuevoActivo.save();

    res.status(201).json(nuevoActivo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear activo', detalle: error.message });
  }
});
