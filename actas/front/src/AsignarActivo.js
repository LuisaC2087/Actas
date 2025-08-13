import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './AsignarActivo.css'

const API_URL = 'http://localhost:3000';

/**
 * Vista para asignar un activo a un colaborador. Permite seleccionar un
 * colaborador y un activo disponible y realiza la petición al servidor.
 */
export default function AsignarActivo({ token, setToken }) {
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
    <div>
      <Navbar setToken={setToken}/>
      <div className="asignar-container">
        <div className="asignar-card">
          <h2 className="asignar-title">Asignar Activo</h2>
          {loading ? (
            <p className="loading-text">Cargando datos...</p>
          ) : (
            <>
              {colaboradores.length === 0 && (
                <p className="warning-text">No hay colaboradores registrados. Cree uno antes de asignar activos.</p>
              )}
              <select
                className="select-full"
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
                className="select-full"
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
              <div className="button-group">
                <button
                  onClick={asignarActivo}
                  className="button-full button-assign"
                >
                  Asignar Activo
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="button-full button-cancel"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}