const mongoose = require('mongoose');

const activoSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  marca: { type: String, required: true },
  modelo: { type: String },
  serial: { type: String, unique: true, required: true },
  activo_fijo: { type: String, unique: true },
  estado: { type: String, enum: ['nuevo', 'usado', 'baja'], default: 'nuevo' },
  asignado_a: { type: mongoose.Schema.Types.ObjectId, ref: 'Colaborador', default: null },
  fecha_asignacion: { type: Date, default: null },
  categoria: { type: String },
  es_desechable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Activo', activoSchema, 'activos');
