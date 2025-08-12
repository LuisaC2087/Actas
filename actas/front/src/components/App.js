import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import InsertarColaborador from './InsertarColaborador';
import GestionColaboradores from './GestionColaboradores';
import GestionActivos from './GestionActivos';
import AsignarActivo from './AsignarActivo';

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login setToken={setToken} />} />
        {token ? (
          <>
            <Route path='/dashboard' element={<Dashboard token={token} setToken={setToken} />} />
            <Route path='/insertar' element={<InsertarColaborador token={token} />} />
            <Route path='/gestion-colaboradores' element={<GestionColaboradores token={token} />} />
            <Route path='/gestion-activos' element={<GestionActivos token={token} />} />
            <Route path='/asignar' element={<AsignarActivo token={token} />} />
            <Route path='*' element={<Navigate to='/dashboard' />} />
          </>
        ) : (
          <Route path='*' element={<Navigate to='/' />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}