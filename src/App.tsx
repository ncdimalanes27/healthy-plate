import { useEffect, useState, useCallback, useRef } from 'react';
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
  const isMounted = useRef(true);

  // Stable reference para sa profile fetching
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // Check Cache muna para instant UI update
      const cached = localStorage.getItem(`hp_u_${userId}`);
      if (cached && isMounted.current) {
        setUser(JSON.parse(cached));
      }

      const { data, error } = await supabaseService.getProfile(userId);
      
      if (error) throw error;

      if (data && isMounted.current) {
        setUser(data);
        localStorage.setItem(`hp_u_${userId}`, JSON.stringify(data));
      }
    } catch (err) {
      console.error("Profile sync error:", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          if (isMounted.current) setLoading(false);
        }
      } catch (err) {
        if (isMounted.current) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true); // Re-trigger loading para sa profile fetch
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
        localStorage.clear();
        if (isMounted.current) setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Silent update ng profile kung kailangan
        fetchProfile(session.user.id);
      }
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.clear();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading Screen Component
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary/20 border-t-primary"></div>
          <div className="absolute font-black text-xs text-primary">HP</div>
        </div>
        <p className="mt-4 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse">
          Loading your experience
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes: Only accessible if NOT logged in */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/" replace />} 
        />

        {/* Protected Application Shell */}
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
            // If user is logged in but role is missing/invalid
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
          
          {/* Shared Routes */}
          <Route path="/settings" element={<Settings profile={user} onLogout={handleLogout} />} />
        </Route>

        {/* Root & Catch-all Redirect Logic */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={user.role === 'dietitian' ? '/dietitian/dashboard' : '/dashboard'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}