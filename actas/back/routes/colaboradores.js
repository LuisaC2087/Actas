
const express = require('express');
const router = express.Router();
const Colaborador = require('../models/Colaborador');
const verificarToken = require('../middleware/verificarToken');

<<<<<<< HEAD
router.get('/', verificarToken, async (req, res) => {
=======
router.get('/', async (req, res) => {
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
  const colaboradores = await Colaborador.find();
  res.json(colaboradores);
});

<<<<<<< HEAD
router.post('/', verificarToken, async (req, res) => {
=======
router.post('/', async (req, res) => {
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
  try {
    const nuevo = new Colaborador(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch {
    res.status(500).json({ error: 'Error al crear' });
  }
});

<<<<<<< HEAD
router.put('/:id', verificarToken, async (req, res) => {
=======
router.put('/:id', async (req, res) => {
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
  console.log('ID recibido:', req.params.id);
  try {
    const actualizado = await Colaborador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(actualizado);
  } catch {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

<<<<<<< HEAD
router.delete('/:id', verificarToken, async (req, res) => {
=======
router.delete('/:id', async (req, res) => {
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
  try {
    const eliminado = await Colaborador.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});
module.exports = router;
