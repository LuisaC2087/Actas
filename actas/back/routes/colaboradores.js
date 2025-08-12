
const express = require('express');
const router = express.Router();
const Colaborador = require('../models/Colaborador');
const verificarToken = require('../middleware/verificarToken');

router.get('/', verificarToken, async (req, res) => {
  const colaboradores = await Colaborador.find();
  res.json(colaboradores);
});

router.post('/', verificarToken, async (req, res) => {
  try {
    const nuevo = new Colaborador(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch {
    res.status(500).json({ error: 'Error al crear' });
  }
});

router.put('/:id', verificarToken, async (req, res) => {
  console.log('ID recibido:', req.params.id);
  try {
    const actualizado = await Colaborador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(actualizado);
  } catch {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const eliminado = await Colaborador.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});
module.exports = router;
