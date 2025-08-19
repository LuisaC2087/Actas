import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './InsertarInventario.css';

const API_URL = 'http://localhost:3000';

export default function InsertarInventario({ token, setToken }) {
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
    <div>
      <Navbar token={token} setToken={setToken} />
      <div className="insertar-container">
        <div className="insertar-card">
          <h2 className="insertar-title">Nuevo Inventario</h2>
          <div className="insertar-grid">
            {Object.keys(formData).map(key => (
              <div key={key}>
                <label className="insertar-label">{fieldLabels[key]}</label>
                {key === 'es_desechable' ? (
                  <select
                    className="insertar-input"
                    value={formData[key] ? 'true' : 'false'}
                    onChange={e =>
                      setFormData({ ...formData, [key]: e.target.value === 'true' })
                    }
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
                    className="insertar-input"
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
          <div className="insertar-buttons">
            <button
              onClick={handleSubmit}
              className="btn-guardar"
            >
              Guardar Inventario
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-volver"
            >
              Volver al Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
