import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

/**
 * Vista para gestionar colaboradores: listado, edición sencilla y eliminación.
 */
export default function GestionColaboradores({ token }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchColaboradores();
  }, []);

  const fetchColaboradores = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/colaboradores`, {
        headers: { Authorization: token }
      });
      setColaboradores(res.data);
    } catch (err) {
      alert('Error al obtener colaboradores');
    }
  };

  const handleEdit = (colaborador) => {
    setEditing(colaborador._id);
    setEditData({
      nombre: colaborador.nombre || '',
      apellido: colaborador.apellido || '',
      telefono: colaborador.telefono || '',
      correo: colaborador.correo || '',
      cargo: colaborador.cargo || ''
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/api/colaboradores/${id}`, editData, {
        headers: { Authorization: token }
      });
      alert('Colaborador actualizado');
      setEditing(null);
      fetchColaboradores();
    } catch (err) {
      alert('Error al actualizar colaborador');
    }
  };

  const deleteColaborador = async (id) => {
    if (!window.confirm('¿Seguro de eliminar?')) return;
    try {
      await axios.delete(`${API_URL}/api/colaboradores/${id}`, {
        headers: { Authorization: token }
      });
      alert('Colaborador eliminado');
      fetchColaboradores();
    } catch (err) {
      alert('Error al eliminar colaborador');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-5xl bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-600">Gestión de Colaboradores</h2>
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
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Identificación</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Teléfono</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Correo</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="px-4 py-2">{c.identificacion}</td>
                <td className="px-4 py-2">
                  {editing === c._id ? (
                    <>
                      <input
                        className="border p-1 mr-1 rounded"
                        value={editData.nombre}
                        onChange={e => setEditData({ ...editData, nombre: e.target.value })}
                      />
                      <input
                        className="border p-1 rounded"
                        value={editData.apellido}
                        onChange={e => setEditData({ ...editData, apellido: e.target.value })}
                      />
                    </>
                  ) : (
                    `${c.nombre} ${c.apellido}`
                  )}
                </td>
                <td className="px-4 py-2">
                  {editing === c._id ? (
                    <input
                      className="border p-1 rounded"
                      value={editData.telefono}
                      onChange={e => setEditData({ ...editData, telefono: e.target.value })}
                    />
                  ) : (
                    c.telefono
                  )}
                </td>
                <td className="px-4 py-2">
                  {editing === c._id ? (
                    <input
                      className="border p-1 rounded"
                      value={editData.correo}
                      onChange={e => setEditData({ ...editData, correo: e.target.value })}
                    />
                  ) : (
                    c.correo
                  )}
                </td>
                <td className="px-4 py-2">
                  {editing === c._id ? (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                      onClick={() => saveEdit(c._id)}
                    >
                      Guardar
                    </button>
                  ) : (
                    <>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleEdit(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => deleteColaborador(c._id)}
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
  );
}