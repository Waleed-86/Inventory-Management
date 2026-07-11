import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AssetsListPage from './pages/assets/AssetsListPage';
import CategoriesListPage from './pages/categories/CategoriesListPage';
import MyRequestsPage from './pages/requests/MyRequestsPage';
import ManageRequestsPage from './pages/requests/ManageRequestsPage';
import DamageReportsPage from './pages/damage-reports/DamageReportsPage';
import ReportsPage from './pages/reports/ReportsPage';
import UsersListPage from './pages/users/UsersListPage';
import AuditLogPage from './pages/audit-logs/AuditLogPage';

// Wraps LoginPage so it can update AuthContext and redirect on success.
function LoginRoute() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <LoginPage
      onLoginSuccess={(user) => {
        login(user, localStorage.getItem('auth_token'));
        navigate('/dashboard');
      }}
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      {/* Accessible to any authenticated user (admin or employee) */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/my-requests" element={<ProtectedRoute><MyRequestsPage /></ProtectedRoute>} />
      <Route path="/damage-reports" element={<ProtectedRoute><DamageReportsPage /></ProtectedRoute>} />

      {/* Admin-only — Super Admin or Inventory Manager */}
      <Route path="/assets" element={<ProtectedRoute adminOnly><AssetsListPage /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute adminOnly><CategoriesListPage /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute adminOnly><ManageRequestsPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute adminOnly><ReportsPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute adminOnly><UsersListPage /></ProtectedRoute>} />
      <Route path="/audit-logs" element={<ProtectedRoute adminOnly><AuditLogPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}