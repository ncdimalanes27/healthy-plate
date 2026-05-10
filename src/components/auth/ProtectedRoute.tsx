import { Navigate, Outlet } from 'react-router-dom';
import type { Profile } from '../../types';

interface ProtectedRouteProps {
  user: Profile | null;
  loading: boolean;
  requiredRole?: 'patient' | 'dietitian';
}

export default function ProtectedRoute({ 
  user, 
  loading, 
  requiredRole 
}: ProtectedRouteProps) {
  
  // 1. Habang nag-che-check pa ng session, ipakita ang loading
  // Pero siguraduhin na sa App.tsx ay nag-se-setLoading(false) tayo sa huli.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 2. Kung tapos na ang loading at walang user, balik sa Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Kung may user pero mali ang role (e.g. Pasyente pilit pumasok sa Dietitian page)
  if (requiredRole && user.role !== requiredRole) {
    const fallbackPath = user.role === 'dietitian' ? '/dietitian/dashboard' : '/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  // 4. Kung lahat okay, i-render ang children (mga pages sa loob ng Layout)
  return <Outlet />;
}