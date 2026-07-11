import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_ROLES = ['super-admin', 'inventory-manager'];

/**
 * Wrap any route element that requires authentication:
 * <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 *
 * For admin-only pages, pass adminOnly:
 * <Route path="/users" element={<ProtectedRoute adminOnly><UsersListPage /></ProtectedRoute>} />
 * A logged-in employee hitting an admin-only URL directly is redirected to
 * /dashboard instead of the page attempting (and failing) to load data.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EDEEF0] text-[#5B6472] text-sm">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}