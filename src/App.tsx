import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { getProfile } from './lib/supabaseService';
import Layout from './components/layout/Layout';
import Tutorial from './components/Tutorial';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import HealthData from './pages/HealthData';
import MealPlans from './pages/MealPlans';
import HealthMonitoring from './pages/HealthMonitoring';
import DieticianDashboard from './pages/DieticianDashboard';
import DieticianNotes from './pages/DieticianNotes';
import AssignMealPlan from './pages/AssignMealPlan';
import ProgressReport from './pages/ProgressReport';
import Settings from './pages/Settings';

interface AppUser {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'dietician';
}

function ProtectedRoute({ children, user, role }: { children: React.ReactNode; user: AppUser | null; role?: string }) {
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'dietician' ? '/dietician' : '/dashboard'} replace />;
  return <>{children}</>;
}

function TutorialWrapper({ children, user }: { children: React.ReactNode; user: AppUser | null }) {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (user) {
      const seen = localStorage.getItem(`tutorial_seen_${user.id}`);
      if (!seen) setShowTutorial(true);
    }
  }, [user]);

  const handleClose = () => {
    if (user) localStorage.setItem(`tutorial_seen_${user.id}`, 'true');
    setShowTutorial(false);
  };

  return (
    <>
      {children}
      {showTutorial && user && <Tutorial role={user.role} onClose={handleClose} />}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        if (profile) setUser({ id: session.user.id, email: session.user.email || '', name: profile.name, role: profile.role });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        if (profile) setUser({ id: session.user.id, email: session.user.email || '', name: profile.name, role: profile.role });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-pulse">
            <span className="text-white text-xl">🌿</span>
          </div>
          <p className="text-green-600 font-medium text-sm">Loading HealthyPlate...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.role === 'dietician' ? '/dietician' : '/dashboard'} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <TutorialWrapper user={user}>
                <Layout user={user} onLogout={() => setUser(null)} />
              </TutorialWrapper>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ProtectedRoute user={user} role="patient"><Dashboard user={user} /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute user={user} role="patient"><Profile user={user} /></ProtectedRoute>} />
          <Route path="health-data" element={<ProtectedRoute user={user} role="patient"><HealthData user={user} /></ProtectedRoute>} />
          <Route path="meal-plans" element={<ProtectedRoute user={user} role="patient"><MealPlans user={user} /></ProtectedRoute>} />
          <Route path="monitoring" element={<ProtectedRoute user={user} role="patient"><HealthMonitoring user={user} /></ProtectedRoute>} />
          <Route path="dietician" element={<ProtectedRoute user={user} role="dietician"><DieticianDashboard user={user} /></ProtectedRoute>} />
          <Route path="dietician/notes" element={<ProtectedRoute user={user} role="dietician"><DieticianNotes user={user} /></ProtectedRoute>} />
          <Route path="dietician/assign" element={<ProtectedRoute user={user} role="dietician"><AssignMealPlan user={user} /></ProtectedRoute>} />
          <Route path="dietician/progress" element={<ProtectedRoute user={user} role="dietician"><ProgressReport /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute user={user}><Settings user={user} /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
