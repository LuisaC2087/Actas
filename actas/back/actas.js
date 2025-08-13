const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 📌 Conexión a MongoDB
mongoose.connect('mongodb://10.24.0.4:27017/actas')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error(err));

// 📌 MODELOS
const UsuarioSchema = new mongoose.Schema({
    username: String,
    password: String,
    rol: String,
    nombre_completo: String
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

const ActivoSchema = new mongoose.Schema({
    tipo: String,
    marca: String,
    modelo: String,
    serial: String,
    activo_fijo: String,
    estado: String,
    asignado_a: { type: mongoose.Schema.Types.ObjectId, ref: 'Colaborador', default: null },
    fecha_asignacion: Date,
    categoria: String,
    es_desechable: Boolean,
    stock_disponible: Number,
    stock_minimo: Number,
    observaciones: String
});
const Activo = mongoose.model('Activo', ActivoSchema);

const ColaboradorSchema = new mongoose.Schema({
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
    fecha_ingreso: Date,
    fecha_retiro: Date,
    activos_asignados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activo' }]
});
const Colaborador = mongoose.model('Colaborador', ColaboradorSchema, 'Colaboradores');

// 📌 Nuevo Modelo: Inventario
const InventarioSchema = new mongoose.Schema({
    nombre: String,
    cantidad: Number,
    ubicacion: String,
    observaciones: String
});
const Inventario = mongoose.model('Inventario', InventarioSchema);

// 📌 Middleware Auth
function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = decoded;
        next();
    });
}

// 📌 LOGIN
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Usuario.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    if (password !== user.password) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, nombre: user.nombre_completo, rol: user.rol });
});

// 📌 RUTAS Colaboradores
app.post('/api/colaboradores', auth, async (req, res) => {
    try {
        const nuevo = new Colaborador(req.body);
        await nuevo.save();
        res.json(nuevo);
    } catch (err) {
        res.status(400).json({ error: 'Error al crear colaborador' });
    }
});

app.get('/api/colaboradores', auth, async (req, res) => {
    try {
        const colaboradores = await Colaborador.find();
        res.json(colaboradores);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener colaboradores' });
    }
});

// 📌 RUTAS Activos
app.post('/api/activos', auth, async (req, res) => {
    const activo = new Activo(req.body);
    await activo.save();
    res.json(activo);
});

app.get('/api/activos', auth, async (req, res) => {
    const activos = await Activo.find();
    res.json(activos);
});

// 📌 Asignar Activo
app.post('/api/asignar', auth, async (req, res) => {
    const { colaboradorId, activoId } = req.body;
    const activo = await Activo.findById(activoId);
    if (!activo || activo.estado !== 'Disponible') return res.status(400).json({ error: 'Activo no disponible' });

    activo.estado = 'Asignado';
    activo.asignado_a = colaboradorId;
    activo.fecha_asignacion = new Date();
    await activo.save();

    const colaborador = await Colaborador.findById(colaboradorId);
    colaborador.activos_asignados.push(activo._id);
    await colaborador.save();

    res.json({ mensaje: 'Activo asignado', activo, colaborador });
});

// 📌 CRUD Inventario
app.post('/api/inventario', auth, async (req, res) => {
    try {
        const nuevoItem = new Inventario(req.body);
        await nuevoItem.save();
        res.json(nuevoItem);
    } catch (err) {
        res.status(400).json({ error: 'Error al crear ítem de inventario' });
    }
});

app.get('/api/inventario', auth, async (req, res) => {
    try {
        const inventario = await Inventario.find();
        res.json(inventario);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener inventario' });
    }
});

app.put('/api/inventario/:id', auth, async (req, res) => {
    try {
        const actualizado = await Inventario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(actualizado);
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar inventario' });
    }
});

app.delete('/api/inventario/:id', auth, async (req, res) => {
    try {
        await Inventario.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Ítem eliminado del inventario' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar ítem de inventario' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

const Movimiento = mongoose.model('Movimiento', MovimientoSchema);

// 📌 CRUD Movimientos
app.post('/api/movimientos', auth, async (req, res) => {
    try {
        const nuevoMovimiento = new Movimiento({
            ...req.body,
            usuario: req.user.id // guarda quién lo registró
        });
        await nuevoMovimiento.save();
        res.json(nuevoMovimiento);
    } catch (err) {
        res.status(400).json({ error: 'Error al crear movimiento' });
    }
});

app.get('/api/movimientos', auth, async (req, res) => {
    try {
        const movimientos = await Movimiento.find()
            .populate('activo')
            .populate('inventario')
            .populate('colaborador')
            .populate('usuario', 'nombre_completo');
        res.json(movimientos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener movimientos' });
    }
});

app.delete('/api/movimientos/:id', auth, async (req, res) => {
    try {
        await Movimiento.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Movimiento eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar movimiento' });
    }
});

