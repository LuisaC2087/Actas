import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './GestionColaboradores.css'

const API_URL = 'http://localhost:3000';

export default function GestionColaboradores({ token, setToken }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Formatea fecha para input type="date"
  const toDateInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Obtener colaboradores
  useEffect(() => {
    fetchColaboradores();
  }, []);

  const fetchColaboradores = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/colaboradores`, {
        headers: { Authorization: token }
      });
      setColaboradores(res.data);
    } catch (err) {
      alert('Error al obtener colaboradores');
    }
  };

  // Abrir modal con datos
  const handleEdit = (col) => {
    setEditing(col._id);
    setEditData({
      identificacion: col.identificacion || '',
      nombre: col.nombre || '',
      apellido: col.apellido || '',
      direccion: col.direccion || '',
      ciudad: col.ciudad || '',
      correo: col.correo || '',
      telefono: col.telefono || '',
      proyecto: col.proyecto || '',
      area_dependencia: col.area_dependencia || '',
      cargo: col.cargo || '',
      extension_telefonica: col.extension_telefonica || '',
      fecha_ingreso: toDateInput(col.fecha_ingreso),
      fecha_retiro: toDateInput(col.fecha_retiro)
    });
  };

  // Guardar cambios
  const saveEdit = async () => {
    if (!editData.identificacion || !editData.nombre || !editData.apellido) {
      alert('Identificación, nombre y apellido son obligatorios');
      return;
    }
    try {
      setLoading(true);
      await axios.put(`${API_URL}/api/colaboradores/${editing}`, editData, {
        headers: { Authorization: token }
      });
      alert('Colaborador actualizado');
      closeModal();
      fetchColaboradores();
    } catch (err) {
      alert(err?.response?.data?.message || 'Error al actualizar colaborador');
      setLoading(false);
    }
  };

  // Cerrar modal
  const closeModal = () => {
    setEditing(null);
    setEditData({});
    setLoading(false);
  };

  // Eliminar colaborador
  const deleteColaborador = async (id) => {
    if (!window.confirm('¿Seguro de eliminar?')) return;
    try {
      await axios.delete(`${API_URL}/api/colaboradores/${id}`, {
        headers: { Authorization: token }
      });
      alert('Colaborador eliminado');
      fetchColaboradores();
    } catch (err) {
      alert('Error al eliminar colaborador');
    }
  };

  return (
    <div>
      <Navbar setToken={setToken} />
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-5xl bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-600">Gestión de Colaboradores</h2>
          <button
            onClick={() => navigate('/insertar')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
          >
            Nuevo Colaborador
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          >
            Volver al Panel
          </button>
        </div>

        {/* Tabla */}
        <table className="tabla">
          <thead>
            <tr>
              <th>Identificación</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((c) => (
              <tr key={c._id}>
                <td>{c.identificacion}</td>
                <td>{c.nombre} {c.apellido}</td>
                <td>{c.telefono}</td>
                <td>{c.correo}</td>
                <td>
                  <div className="acciones">
                    <button className="btn-edit" onClick={() => handleEdit(c)}>
                      <span className='mingcute--pencil-3-line '></span>
                    </button>
                    <button className="btn-delete" onClick={() => deleteColaborador(c._id)}>
                      <span className="wpf--full-trash"></span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal de edición */}
        {editing && (
          <div className="modal-overlay">
            <div className="modal" ref={modalRef}>
              <h2>Editar Colaborador</h2>
              <div className="form-grid">
                {Object.keys(editData).map((field) => (
                  <div key={field} className="form-group">
                    <label>{field.replace("_", " ")}:</label>
                    <input
                      type={field.includes("fecha") ? "date" : "text"}
                      value={editData[field]}
                      onChange={(e) =>
                        setEditData({ ...editData, [field]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button onClick={saveEdit} disabled={loading} className="btn-save">
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button onClick={closeModal} className="btn-cancel">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}