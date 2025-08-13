const mongoose = require('mongoose');

const inventarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  descripcion: String,
  stock_disponible: { type: Number, default: 0 },
  stock_minimo: { type: Number, default: 0 },
  unidad_medida: { type: String, default: 'unidad' },
  es_desechable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Inventario', inventarioSchema, 'inventario');
