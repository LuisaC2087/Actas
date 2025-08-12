import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-purple-600">Panel Principal</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate('/asignar')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded font-semibold"
        >
          Asignar Equipo
        </button>
        <button
          onClick={() => navigate('/insertar')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded font-semibold"
        >
          Insertar Nuevo Colaborador
        </button>
        <button
          onClick={() => navigate('/gestion-colaboradores')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded font-semibold"
        >
          Gestionar Colaboradores
        </button>
        <button
          onClick={() => navigate('/gestion-activos')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded font-semibold"
        >
          Gestionar Activos
        </button>
        <button
          onClick={handleViewActa}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded font-semibold md:col-span-2"
        >
          Ver Acta PDF
        </button>
      </div>
    </div>
  );
}