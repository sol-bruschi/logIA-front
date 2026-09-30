import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2 } from 'lucide-react';

export default function GruposPage() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:1337/api/grupos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data?.data || [];
      setGrupos(data);
    } catch (err) {
      console.log('Error al cargar grupos:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ backgroundColor: '#e6e6e6', padding: '24px', borderRadius: '16px', color: '#222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Gestión de Grupos y Permisos</h2>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            Administración de roles de usuario y matriz de accesos.
          </p>
        </div>
      </div>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd', color: '#444' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Nombre del Grupo</th>
              <th style={{ padding: '12px 16px' }}>Descripción</th>
              <th style={{ padding: '12px 16px' }}>Estado</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  Cargando grupos...
                </td>
              </tr>
            ) : grupos.length === 0 ? (
              // Registros de demostración en caso de no haber datos cargados en el CMS
              <>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>1</td>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>Administrador</td>
                  <td style={{ padding: '12px 16px' }}>Acceso total a todos los módulos y permisos del sistema</td>
                  <td style={{ padding: '12px 16px', color: '#2e7d32', fontWeight: 'bold' }}>Activo</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '8px', color: '#333' }}>
                      <Edit size={16} />
                    </button>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d9534f' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>2</td>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>Operador de Stock</td>
                  <td style={{ padding: '12px 16px' }}>Consulta de productos y registro de comprobantes</td>
                  <td style={{ padding: '12px 16px', color: '#2e7d32', fontWeight: 'bold' }}>Activo</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '8px', color: '#333' }}>
                      <Edit size={16} />
                    </button>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d9534f' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              </>
            ) : (
              grupos.map((grp) => {
                const item = grp.attributes || grp;
                return (
                  <tr key={grp.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{grp.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{item.nombre || 'Grupo'}</td>
                    <td style={{ padding: '12px 16px' }}>{item.descripcion || 'Sin descripción'}</td>
                    <td style={{ padding: '12px 16px', color: '#2e7d32', fontWeight: 'bold' }}>Activo</td>
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