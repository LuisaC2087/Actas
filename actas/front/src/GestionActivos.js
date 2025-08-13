import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './GestionActivos.css';

const API_URL = 'http://localhost:3000';

/**
 * Vista para gestionar activos. Permite editar y eliminar activos
 * existentes. No cubre la creación porque los activos suelen
 * registrarse a través de otras herramientas (por ejemplo, un script o
 * la propia BD).
 */
export default function GestionActivos({ token, setToken }) {
  const [activos, setActivos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivos();
  }, []);

  const fetchActivos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/activos`, {
        headers: { Authorization: token }
      });
      setActivos(res.data);
    } catch (err) {
      alert('Error al obtener activos');
    }
  };

  const handleEdit = (activo) => {
    setEditing(activo._id);
    setEditData({
      tipo: activo.tipo || '',
      marca: activo.marca || '',
      modelo: activo.modelo || '',
      serial: activo.serial || '',
      estado: activo.estado || 'Disponible',
      categoria: activo.categoria || '',
      stock_disponible: activo.stock_disponible || 0,
      stock_minimo: activo.stock_minimo || 0
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/api/activos/${id}`, editData, {
        headers: { Authorization: token }
      });
      alert('Activo actualizado');
      setEditing(null);
      fetchActivos();
    } catch (err) {
      alert('Error al actualizar activo');
    }
  };

  const deleteActivo = async (id) => {
    if (!window.confirm('¿Seguro de eliminar?')) return;
    try {
      await axios.delete(`${API_URL}/api/activos/${id}`, {
        headers: { Authorization: token }
      });
      alert('Activo eliminado');
      fetchActivos();
    } catch (err) {
      alert('Error al eliminar activo');
    }
  };

  return (
    <div>
      <Navbar setToken={setToken}/>
      <div className="gestion-activos-container">
        <div className="gestion-activos-card">
          <div className="gestion-activos-header">
            <h2 className="gestion-activos-title">Gestión de Activos</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-back"
            >
              Volver al Panel
            </button>
          </div>

          <table className="gestion-activos-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Serial</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {activos.map(a => (
                <tr key={a._id}>
                  <td>
                    {editing === a._id ? (
                      <input
                        className="gestion-activos-input"
                        value={editData.tipo}
                        onChange={e => setEditData({ ...editData, tipo: e.target.value })}
                      />
                    ) : (
                      a.tipo
                    )}
                  </td>
                  <td>
                    {editing === a._id ? (
                      <input
                        className="gestion-activos-input"
                        value={editData.marca}
                        onChange={e => setEditData({ ...editData, marca: e.target.value })}
                      />
                    ) : (
                      a.marca
                    )}
                  </td>
                  <td>
                    {editing === a._id ? (
                      <input
                        className="gestion-activos-input"
                        value={editData.modelo}
                        onChange={e => setEditData({ ...editData, modelo: e.target.value })}
                      />
                    ) : (
                      a.modelo
                    )}
                  </td>
                  <td>
                    {editing === a._id ? (
                      <input
                        className="gestion-activos-input"
                        value={editData.serial}
                        onChange={e => setEditData({ ...editData, serial: e.target.value })}
                      />
                    ) : (
                      a.serial
                    )}
                  </td>
                  <td>
                    {editing === a._id ? (
                      <select
                        className="gestion-activos-select"
                        value={editData.estado}
                        onChange={e => setEditData({ ...editData, estado: e.target.value })}
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="Asignado">Asignado</option>
                        <option value="Dañado">Dañado</option>
                      </select>
                    ) : (
                      a.estado
                    )}
                  </td>
                  <td>
                    {editing === a._id ? (
                      <button
                        className="btn btn-save"
                        onClick={() => saveEdit(a._id)}
                      >
                        Guardar
                      </button>
                    ) : (
                      <>
                      <div className='acciones'>
                        <button
                          className="btn btn-edit"
                          style={{ marginRight: '0.5rem' }}
                          onClick={() => handleEdit(a)}
                        >
                          <span className='mingcute--pencil-3-line '></span>
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => deleteActivo(a._id)}
                        >
                          <span className="wpf--full-trash"></span>
                        </button>
                      </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}