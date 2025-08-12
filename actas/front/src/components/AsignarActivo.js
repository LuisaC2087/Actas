import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function AsignarActivo({ token }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [activos, setActivos] = useState([]);
  const [formData, setFormData] = useState({ colaboradorId: '', activoId: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colabRes, activosRes] = await Promise.all([
          axios.get(`${API_URL}/api/colaboradores`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/activos`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setColaboradores(colabRes.data);
        setActivos(activosRes.data.filter(a => a.estado !== 'Asignado'));
      } catch {
        alert('Error al cargar datos');
      }
    };
    fetchData();
  }, [token]);

  const handleAsignar = async () => {
    if (!formData.colaboradorId || !formData.activoId) return alert('Selecciona colaborador y activo');
    try {
      await axios.post(`${API_URL}/api/asignar`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Activo asignado');
    } catch {
      alert('Error al asignar');
    }
  };

  return (
    <div>
      <h2>Asignar Activo</h2>
      <select onChange={e => setFormData({ ...formData, colaboradorId: e.target.value })}>
        <option value=''>Seleccionar colaborador</option>
        {colaboradores.map(c => (
          <option key={c._id} value={c._id}>{c.nombre} {c.apellido}</option>
        ))}
      </select>
      <select onChange={e => setFormData({ ...formData, activoId: e.target.value })}>
        <option value=''>Seleccionar activo</option>
        {activos.map(a => (
          <option key={a._id} value={a._id}>{a.tipo} - {a.marca} {a.modelo}</option>
        ))}
      </select>
      <button onClick={handleAsignar}>Asignar</button>
    </div>
  );
}