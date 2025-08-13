import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8 pt-24">
        <div className="w-full max-w-6xl bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-600">Gestión de Activos</h2>
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
              {activos.map(a => (
                <tr key={a._id} className="border-b">
                  <td className="px-4 py-2">
                    {editing === a._id ? (
                      <input
                        className="border p-1 rounded"
                        value={editData.tipo}
                        onChange={e => setEditData({ ...editData, tipo: e.target.value })}
                      />
                    ) : (
                      a.tipo
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editing === a._id ? (
                      <input
                        className="border p-1 rounded"
                        value={editData.marca}
                        onChange={e => setEditData({ ...editData, marca: e.target.value })}
                      />
                    ) : (
                      a.marca
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editing === a._id ? (
                      <input
                        className="border p-1 rounded"
                        value={editData.modelo}
                        onChange={e => setEditData({ ...editData, modelo: e.target.value })}
                      />
                    ) : (
                      a.modelo
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editing === a._id ? (
                      <input
                        className="border p-1 rounded"
                        value={editData.serial}
                        onChange={e => setEditData({ ...editData, serial: e.target.value })}
                      />
                    ) : (
                      a.serial
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editing === a._id ? (
                      <select
                        className="border p-1 rounded"
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
                  <td className="px-4 py-2">
                    {editing === a._id ? (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        onClick={() => saveEdit(a._id)}
                      >
                        Guardar
                      </button>
                    ) : (
                      <>
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