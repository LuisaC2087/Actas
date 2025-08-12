import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

// Componente para iniciar sesión. Recibe setToken para guardar el JWT
export default function Login({ setToken }) {
  const navigate = useNavigate();
  // Estado local para almacenar los datos del formulario y el estado de carga
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/login`, formData);
      // Guardamos el token y redirigimos al panel principal
      setToken(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Usuario</label>
            <input
              className="border p-3 w-full rounded"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              placeholder="Usuario"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Contraseña</label>
            <input
              type="password"
              className="border p-3 w-full rounded"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Contraseña"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 w-full rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}