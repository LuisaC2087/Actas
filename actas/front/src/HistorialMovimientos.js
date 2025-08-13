import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000'; // Cambia al puerto/backend que uses

export default function HistorialMovimientos({ token }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/movimientos`, {
        headers: { Authorization: token }
      });
      setMovimientos(res.data);
    } catch (err) {
      setError('Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <div className="w-full max-w-7xl bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-600">Historial de Movimientos</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          >
            Volver al Panel
          </button>
        </div>

        {loading && <p>Cargando movimientos...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && movimientos.length === 0 && <p>No hay movimientos registrados.</p>}

        {!loading && movimientos.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tipo Movimiento</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Activo / Inventario</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Cantidad</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Responsable</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Realizado por</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov) => (
                <tr key={mov._id} className="border-b">
                  <td className="px-4 py-2">{mov.tipo_movimiento}</td>
                  <td className="px-4 py-2">
                    {mov.activo
                      ? `${mov.activo.marca} ${mov.activo.modelo} (S/N: ${mov.activo.serial})`
                      : mov.item_inventario
                      ? mov.item_inventario.nombre
                      : '—'}
                  </td>
                  <td className="px-4 py-2">{mov.cantidad || 1}</td>
                  <td className="px-4 py-2">{mov.responsable ? mov.responsable.nombre : '—'}</td>
                  <td className="px-4 py-2">{mov.realizado_por ? mov.realizado_por.nombre : '—'}</td>
                  <td className="px-4 py-2">{new Date(mov.fecha).toLocaleString()}</td>
                  <td className="px-4 py-2">{mov.observaciones || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
