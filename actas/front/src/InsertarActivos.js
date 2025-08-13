import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export default function InsertarActivo({ token }) {
  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    serial: '',
    activo_fijo: '',
    estado: 'nuevo',            // enum: nuevo | usado | baja
    asignado_a: '',             // ObjectId (opcional)
    fecha_asignacion: '',       // YYYY-MM-DD (opcional)
    categoria: '',
    es_desechable: false
  });

  const navigate = useNavigate();

  // Normaliza datos para evitar cast errors en Mongoose
  const buildPayload = (data) => {
    const p = { ...data };

    // Si están vacíos, no los envíes (o mándalos en null)
    if (!p.modelo) delete p.modelo;
    if (!p.activo_fijo) delete p.activo_fijo;
    if (!p.categoria) delete p.categoria;

    // ObjectId opcional
    if (!p.asignado_a) {
      p.asignado_a = null; // o delete p.asignado_a;
    }

    // Fecha opcional
    if (!p.fecha_asignacion) {
      p.fecha_asignacion = null; // o delete p.fecha_asignacion;
    } else {
      p.fecha_asignacion = new Date(p.fecha_asignacion);
    }

    return p;
  };

  const handleSubmit = async () => {
    // Validaciones mínimas según el esquema
    if (!formData.tipo || !formData.marca || !formData.serial) {
      alert('Tipo, Marca y Serial son obligatorios');
      return;
    }

    try {
      const payload = buildPayload(formData);
      await axios.post(`${API_URL}/api/activos`, payload, {
        headers: { Authorization: token }
      });
      alert('Activo creado exitosamente');
      // Limpia y vuelve a la lista (opcional)
      setFormData({
        tipo: '',
        marca: '',
        modelo: '',
        serial: '',
        activo_fijo: '',
        estado: 'nuevo',
        asignado_a: '',
        fecha_asignacion: '',
        categoria: '',
        es_desechable: false
      });
      navigate('/activos'); // ajusta a tu ruta de listado
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Error al crear activo';
      alert(`No se pudo crear el activo: ${msg}`);
      console.error('POST /api/activos error →', err?.response?.data || err);
    }
  };

  const fieldLabels = {
    tipo: 'Tipo de Activo',
    marca: 'Marca',
    modelo: 'Modelo',
    serial: 'Serial',
    activo_fijo: 'Activo Fijo',
    estado: 'Estado',
    asignado_a: 'ID Colaborador Asignado (opcional)',
    fecha_asignacion: 'Fecha de Asignación (opcional)',
    categoria: 'Categoría',
    es_desechable: '¿Es Desechable?'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Nuevo Activo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block mb-1 font-semibold">{fieldLabels[key]}</label>
              {key === 'estado' ? (
                <select
                  className="border p-3 w-full rounded"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                  <option value="baja">Baja</option>
                </select>
              ) : key === 'es_desechable' ? (
                <input
                  type="checkbox"
                  checked={formData.es_desechable}
                  onChange={(e) => setFormData({ ...formData, es_desechable: e.target.checked })}
                />
              ) : (
                <input
                  type={key.includes('fecha') ? 'date' : 'text'}
                  className="border p-3 w-full rounded"
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 w-full rounded font-semibold"
          >
            Guardar Activo
          </button>
          <button
            onClick={() => navigate('/activos')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 w-full rounded font-semibold"
          >
            Volver al Listado
          </button>
        </div>
      </div>
    </div>
  );
}
