import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, FileText, RefreshCw, Trash2 } from 'lucide-react';

export default function ComprobantesPage() {
  const [comprobantes, setComprobantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    numero: '',
    tipo: 'ingreso',
    cliente: 'Cliente General',
    fecha: new Date().toISOString().split('T')[0] 
  });

  const [items, setItems] = useState([
    { producto: '', cantidad: 1, precioUnitario: 0 }
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resComprobantes, resProductos] = await Promise.all([
        api.get('/comprobantes'),
        api.get('/productos')
      ]);
      setComprobantes(resComprobantes.data.data || []);
      setProductos(resProductos.data.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeHeader = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'producto') {
      const prodSelected = productos.find(
        p => String(p.documentId) === String(value) || String(p.id) === String(value)
      );
      const prodData = prodSelected?.attributes || prodSelected;
      if (prodData && prodData.precio) {
        newItems[index].precioUnitario = prodData.precio;
      }
    }

    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { producto: '', cantidad: 1, precioUnitario: 0 }]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calcularTotal = () => {
    return items.reduce((acc, item) => {
      const cant = Number(item.cantidad) || 0;
      const precio = Number(item.precioUnitario) || 0;
      return acc + (cant * precio);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      data: {
        numero: formData.numero,
        tipo: formData.tipo,
        monto: Number(calcularTotal()),
        cliente: formData.cliente || 'Cliente General',
        fecha: formData.fecha || new Date().toISOString().split('T')[0]
      }
    };

    try {
      await api.post('/comprobantes', payload);
      setShowModal(false);
      setFormData({
        numero: '',
        tipo: 'ingreso',
        cliente: 'Cliente General',
        fecha: new Date().toISOString().split('T')[0]
      });
      setItems([{ producto: '', cantidad: 1, precioUnitario: 0 }]);
      fetchData();
      alert('¡Comprobante guardado con éxito!');
    } catch (error) {
      console.error('Error al crear comprobante:', error.response?.data || error);
      const msg = error.response?.data?.error?.message || error.message;
      alert(`Error al guardar comprobante: ${msg}`);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Módulo de Comprobantes</h1>
          <p className="text-sm text-slate-500">Registro de facturación e ingreso de stock</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium text-sm"
        >
          <Plus size={18} /> Nuevo Comprobante
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
            <RefreshCw className="animate-spin" size={20} /> Cargando datos...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-4">N° Comprobante</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {comprobantes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400">
                    No hay comprobantes registrados.
                  </td>
                </tr>
              ) : (
                comprobantes.map((item) => {
                  const data = item.attributes || item;
                  return (
                    <tr key={item.id || item.documentId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono text-indigo-600 font-bold">{data.numero || `#000-${item.id}`}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase">
                          {data.tipo || 'ingreso'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{data.cliente || '-'}</td>
                      <td className="p-4 text-slate-500">{data.fecha || '-'}</td>
                      <td className="p-4 font-semibold text-slate-800">${Number(data.monto || 0).toLocaleString('es-AR')}</td>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="text-indigo-600" size={22} /> Nuevo Comprobante
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">N° Comprobante</label>
                  <input
                    type="text"
                    name="numero"
                    required
                    value={formData.numero}
                    onChange={handleChangeHeader}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="FC-0001-0001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChangeHeader}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Cliente / Proveedor</label>
                  <input
                    type="text"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleChangeHeader}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ej. Consumidor Final"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChangeHeader}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-slate-700">Ítems del Comprobante</h3>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Agregar Producto
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div className="flex-1">
                        <select
                          required
                          value={item.producto}
                          onChange={(e) => handleItemChange(index, 'producto', e.target.value)}
                          className="w-full border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                        >
                          <option value="">-- Seleccionar Producto --</option>
                          {productos.map((prod) => {
                            const pData = prod.attributes || prod;
                            const prodVal = prod.documentId || prod.id;
                            return (
                              <option key={prod.id || prod.documentId} value={prodVal}>
                                {pData.nombre} ({pData.codigo || `#${prod.id}`})
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.cantidad}
                          onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                          placeholder="Cant"
                          className="w-full border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                        />
                      </div>

                      <div className="w-28">
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={item.precioUnitario}
                          onChange={(e) => handleItemChange(index, 'precioUnitario', e.target.value)}
                          placeholder="Precio U."
                          className="w-full border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                        />
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-4 text-slate-800 font-bold text-sm">
                  Monto Total a Guardar: ${calcularTotal().toLocaleString('es-AR')}
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
                  Guardar Comprobante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}