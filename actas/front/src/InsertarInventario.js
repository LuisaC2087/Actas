import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export default function InsertarInventario({ token }) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    stock_disponible: 0,
    stock_minimo: 0,
    unidad_medida: 'unidad',
    es_desechable: true
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/api/inventario`, formData, {
        headers: { Authorization: token }
      });
      alert('Inventario registrado exitosamente');
      setFormData({
        nombre: '',
        categoria: '',
        descripcion: '',
        stock_disponible: 0,
        stock_minimo: 0,
        unidad_medida: 'unidad',
        es_desechable: true
      });
       navigate('/gestion-inventario');
    } catch (err) {
      console.error(err);
      alert('Error al registrar inventario');
    }
  };

  const fieldLabels = {
    nombre: 'Nombre del Producto',
    categoria: 'Categoría',
    descripcion: 'Descripción',
    stock_disponible: 'Stock Disponible',
    stock_minimo: 'Stock Mínimo',
    unidad_medida: 'Unidad de Medida',
    es_desechable: 'Es Desechable'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Nuevo Inventario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(formData).map(key => (
            <div key={key}>
              <label className="block mb-1 font-semibold">{fieldLabels[key]}</label>
              {key === 'es_desechable' ? (
                <select
                  className="border p-3 w-full rounded"
                  value={formData[key] ? 'true' : 'false'}
                  onChange={e => setFormData({ ...formData, [key]: e.target.value === 'true' })}
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <input
                  type={
                    key.includes('stock')
                      ? 'number'
                      : key === 'unidad_medida'
                      ? 'text'
                      : 'text'
                  }
                  className="border p-3 w-full rounded"
                  value={formData[key]}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      [key]: key.includes('stock')
                        ? Number(e.target.value)
                        : e.target.value
                    })
                  }
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
            Guardar Inventario
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 w-full rounded font-semibold"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    </div>
  );
}
