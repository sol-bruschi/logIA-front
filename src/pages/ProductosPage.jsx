import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:1337/api/productos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data?.data || [];
      setProductos(data);
    } catch (err) {
      console.log('Error al cargar productos o sin datos aún en backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#e6e6e6', padding: '24px', borderRadius: '16px', color: '#222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Gestión de Productos</h2>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            Listado e inventario general en stock.
          </p>
        </div>
        <button
          style={{
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => alert('Abrir modal de Nuevo Producto')}
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd', color: '#444' }}>
              <th style={{ padding: '12px 16px' }}>Código</th>
              <th style={{ padding: '12px 16px' }}>Nombre</th>
              <th style={{ padding: '12px 16px' }}>Precio</th>
              <th style={{ padding: '12px 16px' }}>Stock</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  Cargando productos...
                </td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No hay productos cargados en la base de datos.
                </td>
              </tr>
            ) : (
              productos.map((prod) => {
                const item = prod.attributes || prod; 
                return (
                  <tr key={prod.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{item.codigo || prod.id}</td>
                    <td style={{ padding: '12px 16px' }}>{item.nombre || item.titulo || 'Sin nombre'}</td>
                    <td style={{ padding: '12px 16px' }}>${item.precio || 0}</td>
                    <td style={{ padding: '12px 16px' }}>{item.stock ?? 0} u.</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '8px', color: '#333' }}>
                        <Edit size={16} />
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