import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function GestionActivos({ token }) {
  const [activos, setActivos] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/activos`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setActivos(res.data));
  }, [token]);

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar activo?')) return;
    try {
      await axios.delete(`${API_URL}/api/activos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivos(activos.filter(a => a._id !== id));
    } catch {
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <h2>Activos</h2>
      <ul>
        {activos.map(a => (
          <li key={a._id}>
            {a.tipo} - {a.marca} {a.modelo}
            <button onClick={() => eliminar(a._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}