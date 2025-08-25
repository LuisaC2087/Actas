import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Navbar({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate('/');
  };

  return (
    <nav className='navbar'>
      <div className='navbar-links flex flex-wrap gap-2'>
        <button onClick={() => navigate('/asignar')}>Asignar Equipo</button>
        <button onClick={() => navigate('/insertar')}>Insertar Nuevo Colaborador</button>
        <button onClick={() => navigate('/gestion-colaboradores')}>Gestionar Colaboradores</button>
        <button onClick={() => navigate('/gestion-activos')}>Gestionar Activos</button>
        <button onClick={() => navigate('/gestion-inventario')}>Gestionar Inventario</button>
      </div>

      <div className='navbar-logout'>
        <button onClick={handleLogout} className='logout-btn'>Cerrar Sesión</button>
      </div>
    </nav>
  );
}
