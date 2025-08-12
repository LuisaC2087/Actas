import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'

// Panel principal con enlaces a las distintas secciones de la aplicación
export default function Dashboard({ token, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminamos el token en el estado padre
    setToken(null);
    navigate('/');
  };

  const handleViewActa = () => {
    // Abrimos la URL para ver el PDF; ajusta esta ruta si cambias en backend
    window.open('http://localhost:3000/api/acta/pdf', '_blank');
  };

  return (
    <nav className='navbar'>
      <div className='navbar-links'>
        <button onClick={() => navigate('/asignar')}>Asignar Equipo</button>
        <button onClick={() => navigate('/insertar')}>Insertar Nuevo Colaborador</button>
        <button onClick={() => navigate('/gestion-colaboradores')}>Gestionar Colaboradores</button>
        <button onClick={() => navigate('/gestion-activos')}>Gestionar Activos</button>
        <button onClick={handleViewActa}>Ver Acta PDF</button>
      </div>

      <div className='navbar-logout'>
        <button onClick={handleLogout} className='logout-btn'>Cerrar Sesión</button>
      </div>
    </nav>
  )
}