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
import AuditLogPage from './pages/audit-logs/AuditLogPage';
import UsersListPage from './pages/users/UsersListPage';

function LoginRoute() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <LoginPage
      onLoginSuccess={(user) => {
        // LoginPage already stored the token in localStorage before calling
        // this callback, so we just need to sync it into AuthContext state.
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
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets"
        element={
          <ProtectedRoute>
            <AssetsListPage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/audit-logs"
  element={
    <ProtectedRoute>
      <AuditLogPage />
    </ProtectedRoute>
  }
/>
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesListPage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/users"
  element={
    <ProtectedRoute>
      <UsersListPage />
    </ProtectedRoute>
  }
/>
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute>
            <MyRequestsPage />
          </ProtectedRoute>
        }
      />
      
<Route
  path="/reports"
  element={
    <ProtectedRoute>
      <ReportsPage />
    </ProtectedRoute>
  }
/>
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <ManageRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/damage-reports"
  element={
    <ProtectedRoute>
      <DamageReportsPage />
    </ProtectedRoute>
  }
/>
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




