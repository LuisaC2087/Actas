<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState, useEffect, useRef } from 'react';
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

<<<<<<< HEAD
/**
 * Vista para gestionar colaboradores: listado, edición sencilla y eliminación.
 */
=======
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
export default function GestionColaboradores({ token }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
<<<<<<< HEAD
  const navigate = useNavigate();

=======
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Formatea fecha para input type="date"
  const toDateInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Obtener colaboradores
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
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

<<<<<<< HEAD
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

=======
  // Abrir modal con datos
  const handleEdit = (col) => {
    setEditing(col._id);
    setEditData({
      identificacion: col.identificacion || '',
      nombre: col.nombre || '',
      apellido: col.apellido || '',
      direccion: col.direccion || '',
      ciudad: col.ciudad || '',
      correo: col.correo || '',
      telefono: col.telefono || '',
      proyecto: col.proyecto || '',
      area_dependencia: col.area_dependencia || '',
      cargo: col.cargo || '',
      extension_telefonica: col.extension_telefonica || '',
      fecha_ingreso: toDateInput(col.fecha_ingreso),
      fecha_retiro: toDateInput(col.fecha_retiro)
    });
  };

  // Guardar cambios
  const saveEdit = async () => {
    if (!editData.identificacion || !editData.nombre || !editData.apellido) {
      alert('Identificación, nombre y apellido son obligatorios');
      return;
    }
    try {
      setLoading(true);
      await axios.put(`${API_URL}/api/colaboradores/${editing}`, editData, {
        headers: { Authorization: token }
      });
      alert('Colaborador actualizado');
      closeModal();
      fetchColaboradores();
    } catch (err) {
      alert(err?.response?.data?.message || 'Error al actualizar colaborador');
      setLoading(false);
    }
  };

  // Cerrar modal
  const closeModal = () => {
    setEditing(null);
    setEditData({});
    setLoading(false);
  };

  // Eliminar colaborador
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
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
<<<<<<< HEAD
=======

        {/* Tabla */}
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
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
<<<<<<< HEAD
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
=======
                <td className="px-4 py-2">{c.nombre} {c.apellido}</td>
                <td className="px-4 py-2">{c.telefono}</td>
                <td className="px-4 py-2">{c.correo}</td>
                <td className="px-4 py-2">
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
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
                </td>
              </tr>
            ))}
          </tbody>
        </table>
<<<<<<< HEAD
      </div>
    </div>
  );
}
=======

        {/* Modal de edición */}
        {editing && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]" ref={modalRef}>
              <h2 className="text-lg font-bold mb-4">Editar Colaborador</h2>
              {Object.keys(editData).map((field) => (
                <div key={field} className="mb-2">
                  <label className="block capitalize">
                    {field.replace("_", " ")}:
                  </label>
                  <input
                    type={field.includes("fecha") ? "date" : "text"}
                    value={editData[field]}
                    onChange={(e) =>
                      setEditData({ ...editData, [field]: e.target.value })
                    }
                    className="border p-1 w-full rounded"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={saveEdit}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={closeModal}
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
>>>>>>> 297472af8e12e84d3684b1250b4750fefd47f9e3
