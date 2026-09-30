import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas o error de conexión con Strapi');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="input-figma"
            placeholder="Usuario" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            className="input-figma"
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-figma">
            Ingresar
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#666' }}>
          ¿Olvidaste tu contraseña?
        </p>
      </div>
    </div>
  );
}