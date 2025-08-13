import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import AsignarActivo from './AsignarActivo';
import InsertarColaborador from './InsertarColaborador';
import GestionColaboradores from './GestionColaboradores';
import GestionActivos from './GestionActivos';

export default function App() {
  // Guardamos el token de autenticación en el estado local. Cuando es null
  // significa que el usuario no está logueado.
  const [token, setToken] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: muestra el formulario de login */}
        <Route path="/" element={<Login setToken={setToken} />} />

        {/* Si el usuario está autenticado renderizamos las rutas protegidas */}
        {token ? (
          <>
            <Route
              path="/dashboard"
              element={<Dashboard token={token} setToken={setToken} />}
            />
            <Route
              path="/asignar"
              element={<AsignarActivo token={token} setToken={setToken} />}
            />
            <Route
              path="/insertar"
              element={<InsertarColaborador token={token} setToken={setToken} />}
            />
            <Route
              path="/gestion-colaboradores"
              element={<GestionColaboradores token={token} setToken={setToken} />}
            />
            <Route
              path="/gestion-activos"
              element={<GestionActivos token={token} setToken={setToken} />}
            />

            {/* Ruta por defecto para usuarios autenticados */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          // Si no está autenticado redirigimos cualquier ruta al login
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
