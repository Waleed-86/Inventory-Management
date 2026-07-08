import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AssetsListPage from './pages/assets/AssetsListPage';
import CategoriesListPage from './pages/categories/CategoriesListPage';

// Wraps LoginPage so it can update AuthContext and redirect on success.
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


<Route
  path="/categories"
  element={
    <ProtectedRoute>
      <CategoriesListPage />
    </ProtectedRoute>
  }
/>
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