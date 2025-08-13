import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function GestionActivos({ token }) {
  const [activos, setActivos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivos();
  }, [token]);

  const fetchActivos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/activos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivos(res.data);
    } catch {
      alert('Error al obtener activos');
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar activo?')) return;
    try {
      await axios.delete(`${API_URL}/api/activos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivos(activos.filter((a) => a._id !== id));
    } catch {
      alert('Error al eliminar');
    }
  };

  const handleEdit = (activo) => {
    setEditing(activo._id);
    setEditData({
      tipo: activo.tipo || '',
      marca: activo.marca || '',
      modelo: activo.modelo || '',
      serial: activo.serial || '',
      activo_fijo: activo.activo_fijo || '',
      estado: activo.estado || '',
      asignado_a: activo.asignado_a ? activo.asignado_a._id || activo.asignado_a : null,
      fecha_asignacion: activo.fecha_asignacion ? activo.fecha_asignacion.slice(0,10) : '',
      categoria: activo.categoria || '',
      es_desechable: activo.es_desechable || false,
    });
  };

  const saveEdit = async () => {
    if (!editData.tipo || !editData.marca || !editData.modelo) {
      alert('Tipo, marca y modelo son obligatorios');
      return;
    }
    try {
      setLoading(true);
      await axios.put(`${API_URL}/api/activos/${editing}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Activo actualizado');
      setEditing(null);
      fetchActivos();
    } catch {
      alert('Error al actualizar activo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-yellow-600 mb-6">Gestión de Activos</h2>
        {activos.length === 0 ? (
          <p>No hay activos registrados.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 mb-6">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tipo</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Marca</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Modelo</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Serial</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Asignado a</th>
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
                  <td className="px-4 py-2">{a.asignado_a ? (a.asignado_a.nombre || a.asignado_a) : 'No asignado'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(a._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal Edición */}
        {editing && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
              <h2 className="text-lg font-bold mb-4">Editar Activo</h2>

              <label className="block mb-1 font-semibold">Tipo:</label>
              <input
                type="text"
                value={editData.tipo}
                onChange={(e) => setEditData({ ...editData, tipo: e.target.value })}
                className="border p-1 mb-3 w-full rounded"
              />

              <label className="block mb-1 font-semibold">Marca:</label>
              <input
                type="text"
                value={editData.marca}
                onChange={(e) => setEditData({ ...editData, marca: e.target.value })}
                className="border p-1 mb-3 w-full rounded"
              />

              <label className="block mb-1 font-semibold">Modelo:</label>
              <input
                type="text"
                value={editData.modelo}
                onChange={(e) => setEditData({ ...editData, modelo: e.target.value })}
                className="border p-1 mb-3 w-full rounded"
              />

              <label className="block mb-1 font-semibold">Serial:</label>
              <input
                type="text"
                value={editData.serial}
                onChange={(e) => setEditData({ ...editData, serial: e.target.value })}
                className="border p-1 mb-3 w-full rounded"
              />

              <label className="block mb-1 font-semibold">Activo Fijo:</label>
              <input
                type="text"
                value={editData.activo_fijo}
                onChange={(e) => setEditData({ ...editData, activo_fijo: e.target.value })}
                className="border p-1 mb-3 w-full rounded"
              />

              <label className="block mb-1 font-semibold">Estado:</label>
              <input
                type="text"
                value={editData.estado}
                onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
                className="border p-1 mb-3 w-full rounded"
              />

              <label className="block mb-1 font-semibold">Asignado a (ID colaborador):</label>
              <input
                type="text"
                value={editData.asignado_a || ''}
                onChange={(e) => setEditData({ ...editData, asignado_a: e.target.value })}
                placeholder="ObjectId colaborador o vacío"
                className="border p-1 mb-3 w-full rounded"
              />

              <label className="block mb-1 font-semibold">Fecha de Asignación:</label>
              <input
                type="date"
                value={editData.fecha_asignacion || ''}
                onChange={(e) => setEditData({ ...editData, fecha_asignacion: e.target.value })}
                className="border p-1 mb-3 w-full rounded"
              />

              <label className="block mb-1 font-semibold">Categoría:</label>
              <input
                type="text"
                value={editData.categoria}
                onChange={(e) => setEditData({ ...editData, categoria: e.target.value })}
                className="border p-1 mb-3 w-full rounded"
              />

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={editData.es_desechable}
                  onChange={(e) => setEditData({ ...editData, es_desechable: e.target.checked })}
                  id="es_desechable"
                  className="mr-2"
                />
                <label htmlFor="es_desechable">Es desechable</label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={saveEdit}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
