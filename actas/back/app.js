
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const activosRoutes = require('./routes/activos');
const colaboradoresRoutes = require('./routes/colaboradores');
const authRoutes = require('./routes/auth');
const inventarioRoutes = require('./routes/inventario');
const movimientoRoutes = require('./routes/movimiento');

app.use('/api/movimiento', movimientoRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/activos', activosRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/login', authRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
  })
  .catch(err => console.error('Error de conexión:', err));
