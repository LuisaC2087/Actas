import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Dashboard from './Dashboard';
import AsignarActivo from './AsignarActivo';
import InsertarColaborador from './InsertarColaborador';
import GestionColaboradores from './GestionColaboradores';
import GestionActivos from './GestionActivos';
import GestionInventario from './GestionInventario'; 
import HistorialMovimientos from './HistorialMovimientos'; 
import InsertarActivos from './InsertarActivos';
import InsertarInventario from './InsertarInventario';


export default function App() {
  const [token, setToken] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: login */}
        <Route path="/" element={<Login setToken={setToken} />} />

        {/* Rutas protegidas */}
        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} />
            <Route path="/asignar" element={<AsignarActivo token={token} />} />
            <Route path="/insertar" element={<InsertarColaborador token={token} />} />
            <Route path="/gestion-colaboradores" element={<GestionColaboradores token={token} />} />
            <Route path="/insertar-activos" element={<InsertarActivos token={token} />} />
            <Route path="/gestion-activos" element={<GestionActivos token={token} />} />
            <Route path="/gestion-inventario" element={<GestionInventario token={token} />} /> 
            <Route path="/historial" element={<HistorialMovimientos token={token} />} /> 
            <Route path="/insertar-inventario" element={<InsertarInventario token={token} />} />
            <Route path="/GestionInventario" element={<GestionInventario token={token} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          // Si no está autenticado, redirige al login
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
