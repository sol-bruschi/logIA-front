import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, FileText, Shield, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const getBtnStyle = ({ isActive }) => ({
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isActive ? '#333333' : '#ffffff',
    color: isActive ? '#ffffff' : '#333333',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  });

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#9e9e9e' }}>
      <aside 
        style={{
          width: '70px',
          backgroundColor: '#b0b0b0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px 0',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <NavLink to="/productos" style={getBtnStyle} title="Productos">
            <Package size={20} />
          </NavLink>

          <NavLink to="/comprobantes" style={getBtnStyle} title="Comprobantes">
            <FileText size={20} />
          </NavLink>

          <NavLink to="/grupos" style={getBtnStyle} title="Permisos y Grupos">
            <Shield size={20} />
          </NavLink>
        </div>
        <button 
          onClick={handleLogout} 
          style={{
            ...getBtnStyle({ isActive: false }),
            backgroundColor: '#ffffff'
          }} 
          title="Cerrar Sesión"
        >
          <LogOut size={18} />
        </button>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header 
          style={{
            height: '60px',
            backgroundColor: '#b0b0b0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 30px'
          }}
        >
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>LogIA</span>
          
          <input 
            type="text" 
            placeholder="Buscar..." 
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              outline: 'none',
              width: '250px',
              backgroundColor: '#e0e0e0'
            }} 
          />
          
          <div style={{ textAlign: 'right', fontSize: '13px' }}>
            <strong style={{ color: '#1a1a1a' }}>{user?.username || 'Usuario'}</strong>
            <br />
            <span style={{ fontSize: '11px', color: '#444' }}>Administrador</span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '30px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}