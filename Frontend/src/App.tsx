import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { Clientes } from './pages/Clientes';
import { Inventario } from './pages/Inventario';
import { Caja } from './pages/Caja';
import { Login } from './pages/Login';
import { Reportes } from './pages/Reportes';
import { Configuracion } from './pages/Configuracion';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="pos" element={<POS />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="inventario" element={<Inventario />} />
              <Route path="caja" element={<Caja />} />
              <Route path="reportes" element={<Reportes />} />
              <Route path="config" element={<Configuracion />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
