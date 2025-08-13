const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
  tipo_movimiento: {
    type: String,
    enum: ['entrada', 'salida', 'asignacion', 'devolucion'],
    required: true
  },

  // Para movimientos de inventario (por cantidad)
  item_inventario: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventario', default: null },
  cantidad: { type: Number, default: 1 },

  // Para movimientos de activos únicos
  activo: { type: mongoose.Schema.Types.ObjectId, ref: 'Activo', default: null },

  // A quién se asigna (si aplica)
  responsable: { type: mongoose.Schema.Types.ObjectId, ref: 'Colaborador', default: null },

  observaciones: { type: String },
  realizado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Movimiento', movimientoSchema, 'movimientos');
