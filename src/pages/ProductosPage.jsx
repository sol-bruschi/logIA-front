import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Package, RefreshCw } from 'lucide-react';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    precio: '',
    stock: ''
  });

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/productos');
      setProductos(res.data.data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      data: {
        nombre: formData.nombre,
        codigo: formData.codigo,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        activo: true
      }
    };

    try {
      await api.post('/productos', payload);
      setShowModal(false);
      setFormData({ nombre: '', codigo: '', precio: '', stock: '' });
      fetchProductos();
      alert('¡Producto guardado con éxito!');
    } catch (error) {
      console.error('Error al crear producto:', error.response?.data || error);
      const msg = error.response?.data?.error?.message || error.message;
      alert(`Error al guardar producto: ${msg}`);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Módulo de Productos</h1>
          <p className="text-sm text-slate-500">Gestión e inventario de catálogo</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium text-sm"
        >
          <Plus size={18} /> Registrar Producto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
            <RefreshCw className="animate-spin" size={20} /> Cargando catálogo...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Código</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                productos.map((item) => {
                  const data = item.attributes || item;
                  return (
                    <tr key={item.id || item.documentId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono text-indigo-600 font-bold">{data.codigo || `-`}</td>
                      <td className="p-4 font-medium">{data.nombre}</td>
                      <td className="p-4">${Number(data.precio || 0).toLocaleString('es-AR')}</td>
                      <td className="p-4 font-semibold">{data.stock || 0}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${data.activo !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {data.activo !== false ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package className="text-indigo-600" size={22} /> Registrar Producto
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Ej. Pijama Camisero"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Código</label>
                <input
                  type="text"
                  name="codigo"
                  required
                  value={formData.codigo}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Ej. PROD-001"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="precio"
                    required
                    value={formData.precio}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="20"
                  />
                </div>
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}