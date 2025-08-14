import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './GestionActivos.css'; // Tu archivo de estilos se mantiene

const API_URL = 'http://localhost:3000';

export default function GestionActivos({ token, setToken }) {
  const [activos, setActivos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null); // La referencia para el modal sigue siendo necesaria

  useEffect(() => {
    fetchActivos();
    // Estos listeners son para controlar el cierre del modal
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

  // Esta función ahora abre el modal
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
  
  // Lógica para guardar desde el modal
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

  // Cierra el modal y resetea los estados
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

  // Cierra el modal si se hace clic afuera
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  // Cierra el modal si se presiona la tecla Escape
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

          {/* LA TABLA AHORA SOLO MUESTRA DATOS, SIN LÓGICA DE EDICIÓN EN LÍNEA */}
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
                  <td>{a.tipo}</td>
                  <td>{a.marca}</td>
                  <td>{a.modelo}</td>
                  <td>{a.serial}</td>
                  <td>{a.estado}</td>
                  <td className="acciones">
                    {/* El botón de editar ahora abre el modal */}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editing && (
        <div className="modal-backdrop">
          <div ref={modalRef} className="modal-container">
            <h3 className="modal-title">Editar Activo</h3>
            <div className="modal-grid">
              {[
                { label: 'Tipo', key: 'tipo' },
                { label: 'Marca', key: 'marca' },
                { label: 'Modelo', key: 'modelo' },
                { label: 'Serial', key: 'serial' },
                { label: 'Activo Fijo', key: 'activo_fijo' },
                { label: 'Categoría', key: 'categoria' }
              ].map((field) => (
                <div key={field.key}>
                  <label className="modal-label">{field.label}</label>
                  <input
                    className="modal-input"
                    value={editData[field.key] || ''}
                    onChange={(e) =>
                      setEditData({ ...editData, [field.key]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div>
                <label className="modal-label">Estado</label>
                <select
                  className="modal-input"
                  value={editData.estado}
                  onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                  <option value="baja">Baja</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Asignado">Asignado</option>
                  <option value="Dañado">Dañado</option>
                </select>
              </div>
              <div className="modal-checkbox">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={editData.es_desechable}
                  onChange={(e) =>
                    setEditData({ ...editData, es_desechable: e.target.checked })
                  }
                />
                <label className="checkbox-label">Desechable</label>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button
                className="btn-save"
                onClick={() => saveEdit(editing)}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}