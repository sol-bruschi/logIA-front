import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, FileText, RefreshCw } from 'lucide-react';

export default function ComprobantesPage() {
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    numero: '',
    tipo: 'Factura A',
    monto: '',
    cliente: ''
  });

  const fetchComprobantes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:1337/api/comprobantes');
      setComprobantes(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar comprobantes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComprobantes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const montoLimpio = Number(formData.monto.toString().replace(/,/g, '.'));

    try {
      await axios.post('http://localhost:1337/api/comprobantes', {
        data: {
          numero: formData.numero,
          tipo: formData.tipo,
          monto: montoLimpio,
          cliente: formData.cliente,
        }
      });
      setShowModal(false);
      setFormData({ numero: '', tipo: 'Factura A', monto: '', cliente: '' });
      fetchComprobantes();
    } catch (error) {
      console.error('Error al crear comprobante:', error);
      alert('Error al guardar el comprobante. Verificá los permisos de Strapi.');
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Módulo de Comprobantes</h1>
          <p className="text-sm text-slate-500">Registro de facturación y emisiones</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Nuevo Comprobante
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
            <RefreshCw className="animate-spin" size={20} /> Cargando comprobantes...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-4">N° Comprobante</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Monto Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {comprobantes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-400">
                    No hay comprobantes registrados.
                  </td>
                </tr>
              ) : (
                comprobantes.map((item) => {
                  const data = item.attributes || item;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono text-indigo-600">{data.numero || `#000-${item.id}`}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {data.tipo || 'Factura A'}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-800">{data.cliente || 'Consumidor Final'}</td>
                      <td className="p-4 font-bold text-slate-900">${data.monto || 0}</td>
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
              <FileText className="text-indigo-600" size={22} /> Emitir Comprobante
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">N° Comprobante</label>
                <input
                  type="text"
                  name="numero"
                  required
                  value={formData.numero}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800"
                  placeholder="Ej. FC-0001-000045"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800"
                  >
                    <option value="Factura A">Factura A</option>
                    <option value="Factura B">Factura B</option>
                    <option value="Factura C">Factura C</option>
                    <option value="Nota de Crédito">Nota de Crédito</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Monto ($)</label>
                  <input
                    type="number"
                    name="monto"
                    required
                    value={formData.monto}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800"
                    placeholder="25000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cliente / Razón Social</label>
                <input
                  type="text"
                  name="cliente"
                  required
                  value={formData.cliente}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800"
                  placeholder="Ej. Logística Sur S.A."
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
                  Emitir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}