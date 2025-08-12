import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function GestionColaboradores({ token }) {
  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/colaboradores`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setColaboradores(res.data));
  }, [token]);

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar colaborador?')) return;
    try {
      await axios.delete(`${API_URL}/api/colaboradores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setColaboradores(colaboradores.filter(c => c._id !== id));
    } catch {
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <h2>Colaboradores</h2>
      <ul>
        {colaboradores.map(c => (
          <li key={c._id}>
            {c.nombre} {c.apellido} - {c.telefono}
            <button onClick={() => eliminar(c._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}