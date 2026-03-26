import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from '../../lib/supabaseService';
import {
  LayoutDashboard, User, Activity, UtensilsCrossed,
  Heart, Settings, LogOut, Leaf, Stethoscope,
  MessageSquare, ClipboardList, BarChart2, Menu, X,
} from 'lucide-react';

const patientNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/health-data', icon: Activity, label: 'Log Food' },
  { to: '/meal-plans', icon: UtensilsCrossed, label: 'Meal Plans' },
  { to: '/monitoring', icon: Heart, label: 'Monitoring' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const dieticianNav = [
  { to: '/dietician', icon: Stethoscope, label: 'Patients' },
  { to: '/dietician/notes', icon: MessageSquare, label: 'Notes' },
  { to: '/dietician/assign', icon: ClipboardList, label: 'Assign Plan' },
  { to: '/dietician/progress', icon: BarChart2, label: 'Progress' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface LayoutProps {
  user: { id: string; name: string; role: string } | null;
  onLogout: () => void;
}

export default function Layout({ user, onLogout }: LayoutProps) {
  const navigate = useNavigate();
<<<<<<< HEAD
  const nav = currentUser?.role === 'dietician' ? dieticianNav : patientNav;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = () => (
    <>
      {/* Brand */}
=======
  const nav = user?.role === 'dietician' ? dieticianNav : patientNav;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    onLogout();
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = () => (
    <>
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-800 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            HealthyPlate
          </span>
        </div>
<<<<<<< HEAD
        {/* Close button — mobile only */}
=======
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
        <button onClick={closeMobile} className="md:hidden text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

<<<<<<< HEAD
      {/* User pill */}
      <div className="mx-4 mt-4 mb-2 bg-green-50 rounded-xl px-4 py-3">
        <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">
          {currentUser?.role === 'dietician' ? 'Dietician' : 'Patient'}
        </p>
        <p className="text-sm font-semibold text-gray-800 truncate">{currentUser?.name}</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dietician'}
            onClick={closeMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`
            }
          >
=======
      <div className="mx-4 mt-4 mb-2 bg-green-50 rounded-xl px-4 py-3">
        <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">
          {user?.role === 'dietician' ? 'Dietician' : 'Patient'}
        </p>
        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/dietician'} onClick={closeMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`
            }>
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

<<<<<<< HEAD
      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
=======
      <div className="p-3 border-t border-gray-100">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
<<<<<<< HEAD

      {/* ── Desktop sidebar ── */}
=======
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
      <aside className="hidden md:flex w-60 bg-white border-r border-gray-100 flex-col shadow-sm shrink-0">
        <SidebarContent />
      </aside>

<<<<<<< HEAD
      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col shadow-xl transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
=======
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={closeMobile} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col shadow-xl transition-transform duration-300 md:hidden ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
          <button onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              HealthyPlate
            </span>
          </div>
          <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-green-700 font-bold text-sm">
<<<<<<< HEAD
            {currentUser?.name.charAt(0)}
          </div>
        </header>

        {/* Page content */}
=======
            {user?.name.charAt(0)}
          </div>
        </header>

>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

<<<<<<< HEAD
        {/* ── Mobile bottom nav ── */}
        <nav className="md:hidden flex items-center justify-around bg-white border-t border-gray-100 px-2 py-2 shrink-0">
          {nav.slice(0, 5).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dietician'}
=======
        <nav className="md:hidden flex items-center justify-around bg-white border-t border-gray-100 px-2 py-2 shrink-0">
          {nav.slice(0, 5).map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/dietician'}
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-green-600' : 'text-gray-400'
                }`
<<<<<<< HEAD
              }
            >
=======
              }>
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
<<<<<<< HEAD

=======
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
      </div>
    </div>
  );
}
