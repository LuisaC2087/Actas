import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

/**
 * Vista para crear un nuevo colaborador. Incluye todos los campos
 * solicitados y permite volver al panel principal.
 */
export default function InsertarColaborador({ token }) {
  const [formData, setFormData] = useState({
    identificacion: '',
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    correo: '',
    telefono: '',
    proyecto: '',
    area_dependencia: '',
    cargo: '',
    extension_telefonica: '',
    fecha_ingreso: '',
    fecha_retiro: ''
  });

  const navigate = useNavigate();

  // Enviar formulario al backend
  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/api/colaboradores`, formData, {
        headers: { Authorization: token }
      });
      alert('Colaborador creado exitosamente');
      // Reseteamos el formulario
      setFormData({
        identificacion: '',
        nombre: '',
        apellido: '',
        direccion: '',
        ciudad: '',
        correo: '',
        telefono: '',
        proyecto: '',
        area_dependencia: '',
        cargo: '',
        extension_telefonica: '',
        fecha_ingreso: '',
        fecha_retiro: ''
      });
    } catch (err) {
      alert('Error al crear colaborador');
    }
  };

  // Etiquetas legibles para cada campo
  const fieldLabels = {
    identificacion: 'Identificación',
    nombre: 'Nombres',
    apellido: 'Apellidos',
    direccion: 'Dirección de Residencia',
    ciudad: 'Ciudad',
    correo: 'Correo Corporativo',
    telefono: 'Teléfono de Contacto',
    proyecto: 'Proyecto Asignado / Área',
    area_dependencia: 'Área / Dependencia',
    cargo: 'Cargo',
    extension_telefonica: 'Extensión Telefónica',
    fecha_ingreso: 'Fecha de Ingreso',
    fecha_retiro: 'Fecha de Retiro'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">Nuevo Colaborador</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(formData).map(key => (
            <div key={key}>
              <label className="block mb-1 font-semibold">{fieldLabels[key]}</label>
              <input
                type={key.includes('fecha') ? 'date' : 'text'}
                className="border p-3 w-full rounded"
                value={formData[key]}
                onChange={e => setFormData({ ...formData, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 w-full rounded font-semibold"
          >
            Guardar Colaborador
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 w-full rounded font-semibold"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    </div>
  );
}