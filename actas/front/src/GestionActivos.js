import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export default function GestionActivos({ token }) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-6xl bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600">Gestión de Activos</h2>
          <button
            onClick={() => navigate('/insertar-activos')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
          >
            Nuevo Activo
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          >
            Volver al Panel
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Marca</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Modelo</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Serial</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {activos.map((a) => (
              <tr key={a._id} className="border-b">
                <td className="px-4 py-2">{a.tipo}</td>
                <td className="px-4 py-2">{a.marca}</td>
                <td className="px-4 py-2">{a.modelo}</td>
                <td className="px-4 py-2">{a.serial}</td>
                <td className="px-4 py-2">{a.estado}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEdit(a)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => deleteActivo(a._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">Editar Activo</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Tipo', key: 'tipo' },
                  { label: 'Marca', key: 'marca' },
                  { label: 'Modelo', key: 'modelo' },
                  { label: 'Serial', key: 'serial' },
                  { label: 'Activo Fijo', key: 'activo_fijo' },
                  { label: 'Categoría', key: 'categoria' }
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                      className="border p-1 rounded w-full"
                      value={editData[field.key] || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, [field.key]: e.target.value })
                      }
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    className="border p-1 rounded w-full"
                    value={editData.estado}
                    onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="usado">Usado</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desechable</label>
                  <input
                    type="checkbox"
                    checked={editData.es_desechable}
                    onChange={(e) =>
                      setEditData({ ...editData, es_desechable: e.target.checked })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
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
    </div>
  );
}
