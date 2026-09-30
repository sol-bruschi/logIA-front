import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ProductosPage from './pages/ProductosPage';
import ComprobantesPage from './pages/ComprobantesPage';
import GruposPage from './pages/GruposPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/productos" replace />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="comprobantes" element={<ComprobantesPage />} />
            <Route path="grupos" element={<GruposPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}