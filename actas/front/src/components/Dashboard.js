import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ token, setToken }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Panel Principal</h2>
      <button onClick={() => navigate('/insertar')}>Insertar Colaborador</button>
      <button onClick={() => navigate('/gestion-colaboradores')}>Gestionar Colaboradores</button>
      <button onClick={() => navigate('/gestion-activos')}>Gestionar Activos</button>
      <button onClick={() => navigate('/asignar')}>Asignar Activo</button>
      <button onClick={() => setToken(null)}>Cerrar sesión</button>
    </div>
  );
}