import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function InsertarColaborador({ token }) {
  const [formData, setFormData] = useState({
    identificacion: '', nombre: '', apellido: '', correo: '', telefono: ''
  });

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/api/colaboradores`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Colaborador creado');
    } catch {
      alert('Error al crear colaborador');
    }
  };

  return (
    <div>
      <h2>Insertar Colaborador</h2>
      {Object.keys(formData).map((key) => (
        <input key={key} placeholder={key} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
      ))}
      <button onClick={handleSubmit}>Guardar</button>
    </div>
  );
}