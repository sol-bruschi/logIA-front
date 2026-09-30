import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Trash2 } from 'lucide-react';

export default function ComprobantesPage() {
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchComprobantes();
  }, []);
  const fetchComprobantes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:1337/api/comprobantes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data?.data || [];
      setComprobantes(data);
    } catch (err) {
      console.log('Error al cargar comprobantes:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ backgroundColor: '#e6e6e6', padding: '24px', borderRadius: '16px', color: '#222' }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Gestión de Comprobantes</h2>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            Registro e historial de comprobantes del sistema.
          </p>
        </div>
      </div>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd', color: '#444' }}>
              <th style={{ padding: '12px 16px' }}>N° Comprobante</th>
              <th style={{ padding: '12px 16px' }}>Tipo</th>
              <th style={{ padding: '12px 16px' }}>Fecha</th>
              <th style={{ padding: '12px 16px' }}>Total</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  Cargando comprobantes...
                </td>
              </tr>
            ) : comprobantes.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No hay comprobantes registrados en la base de datos.
                </td>
              </tr>
            ) : (
              comprobantes.map((comp) => {
                const item = comp.attributes || comp;
                return (
                  <tr key={comp.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{item.numero || `CMP-${comp.id}`}</td>
                    <td style={{ padding: '12px 16px' }}>{item.tipo || 'Factura A'}</td>
                    <td style={{ padding: '12px 16px' }}>{item.fecha || new Date().toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>${item.total || item.monto || 0}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '8px', color: '#333' }}>
                        <Eye size={16} />
                      </button>
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d9534f' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}