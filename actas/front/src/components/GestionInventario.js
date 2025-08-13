import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function GestionInventario({ token }) {
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/inventario`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInventario(res.data))
      .catch(() => alert('Error al obtener inventario'));
  }, [token]);

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este ítem de inventario?')) return;
    try {
      await axios.delete(`${API_URL}/api/inventario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventario(inventario.filter((item) => item._id !== id));
    } catch {
      alert('Error al eliminar ítem de inventario');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-yellow-600 mb-4">Gestión de Inventario</h2>
        {inventario.length === 0 ? (
          <p>No hay elementos en el inventario.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Categoría</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Stock Mínimo</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Desechable</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="px-4 py-2">{item.nombre}</td>
                  <td className="px-4 py-2">{item.categoria}</td>
                  <td className="px-4 py-2">{item.stock_disponible}</td>
                  <td className="px-4 py-2">{item.stock_minimo}</td>
                  <td className="px-4 py-2">{item.es_desechable ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => eliminar(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
