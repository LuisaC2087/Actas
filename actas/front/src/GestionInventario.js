import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './GestionInventario.css';

const API_URL = 'http://localhost:3000';

export default function GestionInventario({ token, setToken }) {
  const [inventario, setInventario] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventario();
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const fetchInventario = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/inventario`, {
        headers: { Authorization: token },
      });
      setInventario(res.data);
    } catch {
      alert('Error al obtener inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item._id);
    setEditData({
      nombre: item.nombre || '',
      categoria: item.categoria || '',
      descripcion: item.descripcion || '',
      stock_disponible: item.stock_disponible || 0,
      stock_minimo: item.stock_minimo || 0,
      unidad_medida: item.unidad_medida || 'unidad',
      es_desechable: item.es_desechable || false,
    });
  };

  const saveEdit = async () => {
    if (!editData.nombre || !editData.categoria) {
      alert('El nombre y la categoría son obligatorios');
      return;
    }
    try {
      setLoading(true);
      await axios.put(`${API_URL}/api/inventario/${editing}`, editData, {
        headers: { Authorization: token },
      });
      alert('Ítem actualizado');
      setEditing(null);
      fetchInventario();
    } catch {
      alert('Error al actualizar ítem');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este ítem?')) return;
    try {
      await axios.delete(`${API_URL}/api/inventario/${id}`, {
        headers: { Authorization: token },
      });
      alert('Ítem eliminado');
      fetchInventario();
    } catch {
      alert('Error al eliminar ítem');
    }
  };

  const closeModal = () => {
    setEditing(null);
    setEditData({});
    setLoading(false);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  return (
    <div>
      <Navbar setToken={setToken} />
      <div className="gestion-inventario">
        <div className="inventario-container">
          <div className="inventario-header">
            <h2 className="titulo-inventario">Gestión de Inventario</h2>
            <div className="botones-header">
              <button
                onClick={() => navigate('/insertar-inventario')}
                className="btn-nuevo"
              >
                Nuevo
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-volver"
              >
                Volver al Panel
              </button>
            </div>
          </div>

          {loading && <p>Cargando inventario...</p>}

          {!loading && inventario.length === 0 && <p>No hay ítems en inventario.</p>}

          {!loading && inventario.length > 0 && (
            <table className="tabla-inventario">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Stock</th>
                  <th>Stock Mínimo</th>
                  <th>Unidad</th>
                  <th>Desechable</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((item) => (
                  <tr key={item._id}>
                    <td>{item.nombre}</td>
                    <td>{item.categoria}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.stock_disponible}</td>
                    <td>{item.stock_minimo}</td>
                    <td>{item.unidad_medida}</td>
                    <td>{item.es_desechable ? 'Sí' : 'No'}</td>
                    <td>
                      <div className="acciones">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(item)}
                        >
                          <span className="mingcute--pencil-3-line"></span>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => deleteItem(item._id)}
                        >
                          <span className="wpf--full-trash"></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {editing && (
            <div className="modal-overlay">
              <div className="modal" ref={modalRef}>
                <h2 className="modal-titulo">Editar Ítem de Inventario</h2>

                {['nombre','categoria','descripcion','stock_disponible','stock_minimo','unidad_medida'].map((field) => (
                  <div className="form-group" key={field}>
                    <label>
                      {field.charAt(0).toUpperCase()+field.slice(1).replace('_',' ')}
                    </label>
                    <input
                      type={field.includes('stock') ? 'number' : 'text'}
                      value={editData[field]}
                      onChange={(e) => setEditData({ ...editData, [field]: field.includes('stock') ? Number(e.target.value) : e.target.value })}
                    />
                  </div>
                ))}

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={editData.es_desechable}
                    onChange={(e) => setEditData({ ...editData, es_desechable: e.target.checked })}
                    id="desechable"
                  />
                  <label htmlFor="desechable">¿Es desechable?</label>
                </div>

                <div className="modal-botones">
                  <button
                    onClick={saveEdit}
                    disabled={loading}
                    className="btn-guardar"
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="btn-cancelar"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
