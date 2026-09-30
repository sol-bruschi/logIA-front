import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const PERMISOS_DEFAULT = [
  { menu: { nombre: 'productos' }, consulta: true, alta: true, baja: true, modificacion: true },
  { menu: { nombre: 'comprobantes' }, consulta: true, alta: true, baja: true, modificacion: true },
  { menu: { nombre: 'usuarios' }, consulta: true, alta: true, baja: true, modificacion: true },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accesos, setAccesos] = useState(PERMISOS_DEFAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier,
        password,
      });

      const { jwt, user: userData } = response.data;
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setAccesos(userData?.grupo?.accesos || PERMISOS_DEFAULT);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accesos, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);