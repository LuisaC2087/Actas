import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

/**
 * Vista para asignar un activo a un colaborador. Permite seleccionar un
 * colaborador y un activo disponible y realiza la petición al servidor.
 */
export default function AsignarActivo({ token }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [activos, setActivos] = useState([]);
  const [formData, setFormData] = useState({ colaboradorId: '', activoId: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar colaboradores y activos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colabRes, activosRes] = await Promise.all([
          axios.get(`${API_URL}/api/colaboradores`, {
            // Usamos encabezado en minúsculas porque Express lee los
            // encabezados en minúsculas. Esto evita problemas con "authorization".
            headers: { authorization: token }
          }),
          axios.get(`${API_URL}/api/activos`, {
            headers: { authorization: token }
          })
        ]);
        setColaboradores(colabRes.data);
        // Solo mostramos los activos disponibles o desechables
        // Mostrar todos los activos que no estén marcados como "Asignado".  Si no
        // tienen estado (por ejemplo, los desechables), también se muestran.
        setActivos(
          activosRes.data.filter(a => {
            if (!a.estado) return true;
            return a.estado.toLowerCase() !== 'asignado';
          })
        );
      } catch (err) {
        alert('Error al obtener datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Maneja la asignación
  const asignarActivo = async () => {
    if (!formData.colaboradorId || !formData.activoId) {
      alert('Selecciona colaborador y activo');
      return;
    }
    try {
      await axios.post(`${API_URL}/api/asignar`, formData, {
        headers: { authorization: token }
      });
      alert('Activo asignado correctamente');
      // Restablecemos el formulario
      setFormData({ colaboradorId: '', activoId: '' });
      // Volvemos a cargar los activos para reflejar la asignación
      try {
        const activosRes = await axios.get(`${API_URL}/api/activos`, {
          headers: { authorization: token }
        });
        setActivos(
          activosRes.data.filter(a => {
            if (!a.estado) return true;
            return a.estado.toLowerCase() !== 'asignado';
          })
        );
      } catch {}
    } catch (err) {
      alert(err.response?.data?.error || 'Error al asignar activo');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Asignar Activo</h2>
        {loading ? (
          <p className="text-center text-gray-500">Cargando datos...</p>
        ) : (
          <>
            {colaboradores.length === 0 && (
              <p className="mb-2 text-red-500">No hay colaboradores registrados. Cree uno antes de asignar activos.</p>
            )}
            <select
              className="w-full border rounded p-3 mb-4"
              value={formData.colaboradorId}
              onChange={e => setFormData({ ...formData, colaboradorId: e.target.value })}
            >
              <option value="">Seleccionar colaborador</option>
              {colaboradores.map(c => (
                <option key={c._id} value={c._id}>
                  {c.nombre} {c.apellido} ({c.identificacion})
                </option>
              ))}
            </select>
            <select
              className="w-full border rounded p-3 mb-4"
              value={formData.activoId}
              onChange={e => setFormData({ ...formData, activoId: e.target.value })}
            >
              <option value="">Seleccionar activo disponible</option>
              {activos.map(a => (
                <option key={a._id} value={a._id}>
                  {a.tipo} - {a.marca} {a.modelo} {a.serial ? `(${a.serial})` : ''} {a.es_desechable ? '(Desechable)' : ''}
                </option>
              ))}
            </select>
            <div className="flex gap-4">
              <button
                onClick={asignarActivo}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 w-full rounded font-semibold"
              >
                Asignar Activo
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 w-full rounded font-semibold"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}