import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export default function Login({ setToken }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/login`, formData);
      setToken(res.data.token);
      navigate('/dashboard');
    } catch {
      alert('Login fallido');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder='Usuario' onChange={e => setFormData({ ...formData, username: e.target.value })} />
        <input placeholder='Contraseña' type='password' onChange={e => setFormData({ ...formData, password: e.target.value })} />
        <button type='submit'>Entrar</button>
      </form>
    </div>
  );
}