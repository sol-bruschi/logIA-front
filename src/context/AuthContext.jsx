import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (identifier, password) => {
    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier,
        password,
      });

      const { jwt, user: userData } = response.data;
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(jwt);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data);
      const msg = error.response?.data?.error?.message || 'Credenciales inválidas';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);