import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { supabaseService } from './lib/supabaseService';
import type { Profile } from './types';

// Layout & Pages
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import FoodLog from './pages/FoodLog';
import MealPlans from './pages/MealPlans';
import HealthMonitoring from './pages/HealthMonitoring';
import Settings from './pages/Settings';
import DieticianDashboard from './pages/DieticianDashboard';
import DieticianNotes from './pages/DieticianNotes';
import AssignMealPlan from './pages/AssignMealPlan';
import ProgressReport from './pages/ProgressReport';

export default function App() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // FIX: Stable reference para sa profile fetching
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const cached = localStorage.getItem(`hp_u_${userId}`);
      if (cached) setUser(JSON.parse(cached));

      const { data, error } = await supabaseService.getProfile(userId);
      if (data && !error) {
        setUser(data);
        localStorage.setItem(`hp_u_${userId}`, JSON.stringify(data));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Check initial session on mount
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    checkInitialSession();

    // 2. Listen for Auth Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        localStorage.clear();
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]); // Depend lang sa fetchProfile na memoized

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.clear();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-light/20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to={user.role === 'dietitian' ? '/dietitian/dashboard' : '/dashboard'} replace />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to={user.role === 'dietitian' ? '/dietitian/dashboard' : '/dashboard'} replace />} 
        />

        {/* Protected Routes */}
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          {user?.role === 'patient' ? (
            <>
              <Route path="/dashboard" element={<Dashboard profile={user} />} />
              <Route path="/profile" element={<ProfilePage profile={user} />} />
              <Route path="/food-log" element={<FoodLog profile={user} />} />
              <Route path="/meal-plans" element={<MealPlans profile={user} />} />
              <Route path="/monitoring" element={<HealthMonitoring profile={user} />} />
            </>
          ) : user?.role === 'dietitian' ? (
            <>
              <Route path="/dietitian/dashboard" element={<DieticianDashboard />} />
              <Route path="/dietitian/notes" element={<DieticianNotes />} />
              <Route path="/dietitian/assign" element={<AssignMealPlan />} />
              <Route path="/dietitian/progress" element={<ProgressReport />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
          <Route path="/settings" element={<Settings profile={user} onLogout={handleLogout} />} />
        </Route>

        {/* Default Redirects */}
        <Route 
          path="/" 
          element={<Navigate to={user ? (user.role === 'dietitian' ? '/dietitian/dashboard' : '/dashboard') : '/login'} replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={user ? (user.role === 'dietitian' ? '/dietitian/dashboard' : '/dashboard') : '/login'} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}