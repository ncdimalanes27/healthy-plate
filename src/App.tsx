import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
=======
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { getProfile } from './lib/supabaseService';
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
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

<<<<<<< HEAD
function TutorialWrapper({ children }: { children: React.ReactNode }) {
  const { currentUser, hasTutorialSeen } = useStore();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (currentUser && !hasTutorialSeen(currentUser.id)) {
      setShowTutorial(true);
    }
  }, [currentUser]);
=======
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
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)

  return (
    <>
      {children}
<<<<<<< HEAD
      {showTutorial && currentUser && (
        <Tutorial
          role={currentUser.role}
          onClose={() => setShowTutorial(false)}
        />
      )}
=======
      {showTutorial && user && <Tutorial role={user.role} onClose={handleClose} />}
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const buildUser = async (supabaseUser: any): Promise<AppUser | null> => {
    // Check localStorage cache first for instant load
    const cached = localStorage.getItem(`hp_profile_${supabaseUser.id}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Use cache immediately, refresh in background
        getProfile(supabaseUser.id).then((profile) => {
          if (profile) {
            const fresh = { id: supabaseUser.id, email: supabaseUser.email || '', name: profile.name, role: profile.role };
            localStorage.setItem(`hp_profile_${supabaseUser.id}`, JSON.stringify(fresh));
            setUser(fresh);
          }
        });
        return parsed;
      } catch {}
    }
    // No cache — fetch from Supabase
    const profile = await getProfile(supabaseUser.id);
    if (profile) {
      const u = { id: supabaseUser.id, email: supabaseUser.email || '', name: profile.name, role: profile.role };
      localStorage.setItem(`hp_profile_${supabaseUser.id}`, JSON.stringify(u));
      return u;
    }
    return null;
  };

  useEffect(() => {
    // Check cache first — show app instantly if cached user exists
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Try cache first for instant load
        const cached = localStorage.getItem(`hp_profile_${session.user.id}`);
        if (cached) {
          try {
            setUser(JSON.parse(cached));
            setLoading(false);
            // Refresh in background silently
            buildUser(session.user).then((u) => { if (u) setUser(u); });
            return;
          } catch {}
        }
        // No cache — fetch then show
        const u = await buildUser(session.user);
        if (u) setUser(u);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        return;
      }
      if (session?.user) {
        const u = await buildUser(session.user);
        if (u) setUser(u);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-green-600 font-medium text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TutorialWrapper>
                <Layout />
=======
        <Route path="/" element={user ? <Navigate to={user.role === 'dietician' ? '/dietician' : '/dashboard'} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <TutorialWrapper user={user}>
                <Layout user={user} onLogout={() => setUser(null)} />
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
              </TutorialWrapper>
            </ProtectedRoute>
          }
        >
<<<<<<< HEAD
          {/* Patient routes */}
          <Route path="dashboard" element={<ProtectedRoute role="patient"><Dashboard /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute role="patient"><Profile /></ProtectedRoute>} />
          <Route path="health-data" element={<ProtectedRoute role="patient"><HealthData /></ProtectedRoute>} />
          <Route path="meal-plans" element={<ProtectedRoute role="patient"><MealPlans /></ProtectedRoute>} />
          <Route path="monitoring" element={<ProtectedRoute role="patient"><HealthMonitoring /></ProtectedRoute>} />
          {/* Dietician routes */}
          <Route path="dietician" element={<ProtectedRoute role="dietician"><DieticianDashboard /></ProtectedRoute>} />
          <Route path="dietician/notes" element={<ProtectedRoute role="dietician"><DieticianNotes /></ProtectedRoute>} />
          <Route path="dietician/assign" element={<ProtectedRoute role="dietician"><AssignMealPlan /></ProtectedRoute>} />
          <Route path="dietician/progress" element={<ProtectedRoute role="dietician"><ProgressReport /></ProtectedRoute>} />
          {/* Shared */}
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
=======
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
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
