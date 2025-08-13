const express = require('express');
const router = express.Router();
const Inventario = require('../models/Inventario'); 

// GET /api/inventario - Listar todos los ítems de inventario
router.get('', async (req, res) => {
  try {
    const items = await Inventario.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener inventario' });
  }
});

// GET /api/inventario/:id - Obtener un ítem por ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventario.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Ítem no encontrado' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ítem' });
  }
});

// POST /api/inventario - Crear un nuevo ítem de inventario
router.post('/',  async (req, res) => {
  try {
    const nuevoItem = new Inventario(req.body);
    const guardado = await nuevoItem.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear ítem de inventario' });
  }
});

// PUT /api/inventario/:id - Actualizar un ítem existente
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Inventario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ message: 'Ítem no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar ítem' });
  }
});

// DELETE /api/inventario/:id - Eliminar un ítem
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Inventario.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Ítem no encontrado' });
    res.json({ message: 'Ítem eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar ítem' });
  }
});

module.exports = router;
