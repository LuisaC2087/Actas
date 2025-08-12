
const express = require('express');
const router = express.Router();
const Activo = require('../models/Activo');
const verificarToken = require('../middleware/verificarToken');

router.get('/', async (req, res) => {
  const activos = await Activo.find();
  res.json(activos);
});

router.put('/:id',  async (req, res) => {
  try {
    const actualizado = await Activo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: 'Activo no encontrado' });
    res.json(actualizado);
  } catch {
    res.status(500).json({ error: 'Error al actualizar activo' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Activo.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Activo no encontrado' });
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar activo' });
  }
});
module.exports = router;
