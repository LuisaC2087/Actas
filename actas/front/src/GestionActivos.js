import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './GestionActivos.css';

const API_URL = 'http://localhost:3000';

export default function GestionActivos({ token, setToken }) {
  const [activos, setActivos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    fetchActivos();
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const fetchActivos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/activos`, {
        headers: { Authorization: token },
      });
      setActivos(res.data);
    } catch (err) {
      alert('Error al obtener activos');
    }
  };

  const toDateInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const handleEdit = (activo) => {
    setEditing(activo._id);
    setEditData({
      tipo: activo.tipo || '',
      marca: activo.marca || '',
      modelo: activo.modelo || '',
      serial: activo.serial || '',
      activo_fijo: activo.activo_fijo || '',
      estado: activo.estado || 'nuevo',
      asignado_a: activo.asignado_a?._id || '',
      fecha_asignacion: toDateInput(activo.fecha_asignacion),
      categoria: activo.categoria || '',
      es_desechable: activo.es_desechable || false,
    });
  };

  const saveEdit = async (id) => {
    try {
      setLoading(true);

      const body = {
        tipo: editData.tipo,
        marca: editData.marca,
        modelo: editData.modelo,
        serial: editData.serial,
        activo_fijo: editData.activo_fijo,
        estado: editData.estado,
        asignado_a: editData.asignado_a || null,
        fecha_asignacion: editData.fecha_asignacion ? new Date(editData.fecha_asignacion) : null,
        categoria: editData.categoria,
        es_desechable: Boolean(editData.es_desechable),
      };

      await axios.put(`${API_URL}/api/activos/${id}`, body, {
        headers: { Authorization: token },
      });

      alert('Activo actualizado');
      closeModal();
      fetchActivos();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Error al actualizar activo');
      setLoading(false);
    }
  };

  const closeModal = () => {
    setEditing(null);
    setEditData({});
    setLoading(false);
  };

  const deleteActivo = async (id) => {
    if (!window.confirm('¿Seguro de eliminar?')) return;
    try {
      await axios.delete(`${API_URL}/api/activos/${id}`, {
        headers: { Authorization: token },
      });
      alert('Activo eliminado');
      fetchActivos();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar activo');
    }
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
                  <td className="acciones">
                    {editing === a._id ? (
                      <button
                        className="btn-save"
                        onClick={() => saveEdit(a._id)}
                        disabled={loading}
                      >
                        Guardar
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(a)}
                        >
                          <span className='mingcute--pencil-3-line'></span>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => deleteActivo(a._id)}
                        >
                          <span className="wpf--full-trash"></span>
                        </button>
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
