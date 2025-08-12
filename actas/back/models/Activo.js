const mongoose = require('mongoose');
const activoSchema = new mongoose.Schema({
  tipo: String,
  marca: String,
  modelo: String,
  serial: String,
  activo_fijo: String,
  estado: String,
  asignado_a: { type: mongoose.Schema.Types.ObjectId, ref: 'Colaborador', default: null },
  fecha_asignacion: { type: Date, default: null },
  categoria: String,
  stock_disponible: Number,
  stock_minimo: Number,
  es_desechable: Boolean
});
module.exports = mongoose.model('Activo', activoSchema, 'activos');
