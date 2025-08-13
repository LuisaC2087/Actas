import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

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
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
        <div className="w-full max-w-5xl bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-600">Gestión de Inventario</h2>
              <button
              onClick={() => navigate('/insertar-inventario')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
            >
              Nuevo
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
            >
              Volver al Panel
            </button>
          </div>

          {loading && <p>Cargando inventario...</p>}

          {!loading && inventario.length === 0 && <p>No hay ítems en inventario.</p>}

          {!loading && inventario.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Categoría</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descripción</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Stock</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Stock Mínimo</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Unidad</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Desechable</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="px-4 py-2">{item.nombre}</td>
                    <td className="px-4 py-2">{item.categoria}</td>
                    <td className="px-4 py-2">{item.descripcion}</td>
                    <td className="px-4 py-2">{item.stock_disponible}</td>
                    <td className="px-4 py-2">{item.stock_minimo}</td>
                    <td className="px-4 py-2">{item.unidad_medida}</td>
                    <td className="px-4 py-2">{item.es_desechable ? 'Sí' : 'No'}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleEdit(item)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => deleteItem(item._id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Modal edición */}
          {editing && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]" ref={modalRef}>
                <h2 className="text-lg font-bold mb-4">Editar Ítem de Inventario</h2>

                {['nombre','categoria','descripcion','stock_disponible','stock_minimo','unidad_medida'].map((field) => (
                  <div className="mb-2" key={field}>
                    <label className="block font-semibold">{field.charAt(0).toUpperCase()+field.slice(1).replace('_',' ')}</label>
                    <input
                      type={field.includes('stock') ? 'number' : 'text'}
                      value={editData[field]}
                      onChange={(e) => setEditData({ ...editData, [field]: field.includes('stock') ? Number(e.target.value) : e.target.value })}
                      className="border p-1 w-full rounded"
                    />
                  </div>
                ))}

                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editData.es_desechable}
                    onChange={(e) => setEditData({ ...editData, es_desechable: e.target.checked })}
                    id="desechable"
                  />
                  <label htmlFor="desechable">¿Es desechable?</label>
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
    </div>
  );
}
