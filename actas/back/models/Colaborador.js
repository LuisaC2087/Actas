const mongoose = require('mongoose');
const colaboradorSchema = new mongoose.Schema({
  identificacion: String,
  nombre: String,
  apellido: String,
  direccion: String,
  ciudad: String,
  correo: String,
  telefono: String,
  proyecto: String,
  area_dependencia: String,
  cargo: String,
  extension_telefonica: String,
  fecha_ingreso: String,
  fecha_retiro: String
});
module.exports = mongoose.model('Colaborador', colaboradorSchema, 'Colaboradores');
