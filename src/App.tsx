import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/layout/Layout';
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

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
