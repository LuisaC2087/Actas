import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HistorialMovimientos.css';

const API_URL = 'http://localhost:3000';

export default function HistorialMovimientos({ token }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovimientos();
  }, [token]);

  const fetchMovimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/movimientos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovimientos(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="historial-container">
      <div className="historial-box">
        <div className="historial-header">
          <h2 className="historial-title">Historial de Movimientos</h2>
        </div>

        {loading && <p>Cargando movimientos...</p>}
        {error && <p className="text-red">{error}</p>}
        {!loading && movimientos.length === 0 && <p>No hay movimientos registrados.</p>}

        {!loading && movimientos.length > 0 && (
          <table className="historial-table">
            <thead>
              <tr>
                <th>Tipo Movimiento</th>
                <th>Activo / Inventario</th>
                <th>Cantidad</th>
                <th>Responsable</th>
                <th>Realizado por</th>
                <th>Fecha</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov) => (
                <tr key={mov._id}>
                  <td>{mov.tipo_movimiento}</td>
                  <td>
                    {mov.activo
                      ? `${mov.activo.marca} ${mov.activo.modelo} (S/N: ${mov.activo.serial})`
                      : mov.item_inventario
                      ? mov.item_inventario.nombre
                      : '—'}
                  </td>
                  <td>{mov.cantidad || 1}</td>
                  <td>{mov.responsable ? mov.responsable.nombre : '—'}</td>
                  <td>{mov.realizado_por ? mov.realizado_por.nombre : '—'}</td>
                  <td>{new Date(mov.fecha).toLocaleString()}</td>
                  <td>{mov.observaciones || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
