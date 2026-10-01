import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, ShieldCheck, Plus, UserCheck, LogOut, CheckCircle2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GruposPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const fetchGrupos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:1337/api/grupos');
      setGrupos(response.data.data || []);
    } catch (error) {
      console.error('Error al obtener grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1337/api/grupos', {
        data: {
          nombre: formData.nombre,
          descripcion: formData.descripcion
        }
      });
      setShowModal(false);
      setFormData({ nombre: '', descripcion: '' });
      fetchGrupos();
    } catch (error) {
      console.error('Error al crear grupo:', error.response?.data);
      alert('Error al guardar el grupo en Strapi. Verificá los permisos del rol Public.');
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Grupos y Usuarios</h1>
          <p className="text-sm text-slate-500">Gestión de grupos de trabajo y sesión activa</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={18} /> Nuevo Grupo
          </button>
          {user && (
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:col-span-1 h-fit">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <UserCheck size={24} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Usuario Actual</h2>
              <span className="text-xs text-slate-400">Credenciales activas</span>
            </div>
          </div>

          {user ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 font-medium">Usuario:</span>
                <span className="font-semibold text-slate-800">{user.username}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-semibold text-slate-800">{user.email}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 font-medium">Estado:</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 size={16} /> Activo
                </span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-4">No hay sesión activa.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Grupos Registrados</h2>
              <span className="text-xs text-slate-400">Lista obtenida desde la API de Strapi</span>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
              <RefreshCw className="animate-spin" size={20} /> Cargando grupos...
            </div>
          ) : grupos.length === 0 ? (
            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
              <Users className="mx-auto mb-2 text-slate-300" size={32} />
              <p className="text-sm">No hay grupos creados en Strapi.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 text-indigo-600 font-medium text-xs hover:underline"
              >
                + Crear el primer grupo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {grupos.map((item) => {
                const data = item.attributes || item;
                return (
                  <div key={item.id} className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{data.nombre || `Grupo #${item.id}`}</h3>
                      <p className="text-xs text-slate-500 mt-1">{data.descripcion || 'Sin descripción asignada'}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold">
                      ID: {item.id}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="text-indigo-600" size={22} /> Crear Nuevo Grupo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Grupo</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Ej. Operadores Logísticos"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  rows="3"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Ej. Acceso a emisión y control de inventario"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Guardar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}