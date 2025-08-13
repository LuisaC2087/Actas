import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './InsertarColaborador.css'

const API_URL = 'http://localhost:3000';

/**
 * Vista para crear un nuevo colaborador. Incluye todos los campos
 * solicitados y permite volver al panel principal.
 */
export default function InsertarColaborador({ token, setToken }) {
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
    <div>
      <Navbar setToken={setToken}/>
      <div className="nuevo-colaborador-container">
        <div className="nuevo-colaborador-card">
          <h2 className="nuevo-colaborador-title">Nuevo Colaborador</h2>
          <div className="grid-form">
            {Object.keys(formData).map(key => (
              <div className="input-group" key={key}>
                <label>{fieldLabels[key]}</label>
                <input
                  type={key.includes('fecha') ? 'date' : 'text'}
                  value={formData[key]}
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div className="button-group">
            <button
              onClick={handleSubmit}
              className="button-full button-save"
            >
              Guardar Colaborador
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="button-full button-cancel"
            >
              Volver al Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}