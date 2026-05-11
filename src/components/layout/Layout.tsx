import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, User, Utensils, Activity, Settings,
  LogOut, ClipboardList, TrendingUp, MessageSquare, ChevronRight, X, Menu
} from 'lucide-react';
import type { Profile } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  user: Profile | null;
  onLogout: () => void;
}

export default function Layout({ user, onLogout }: LayoutProps) {
  const location = useLocation();
  const isPatient = user?.role === 'patient';
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return <Outlet />;

  const navItems = isPatient ? [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Log Food', path: '/food-log', icon: Utensils },
    { label: 'Meal Plans', path: '/meal-plans', icon: ClipboardList },
    { label: 'Monitoring', path: '/monitoring', icon: Activity },
    { label: 'Settings', path: '/settings', icon: Settings },
  ] : [
    { label: 'Dashboard', path: '/dietitian/dashboard', icon: LayoutDashboard },
    { label: 'Notes', path: '/dietitian/notes', icon: MessageSquare },
    { label: 'Assign Plan', path: '/dietitian/assign', icon: ClipboardList },
    { label: 'Progress', path: '/dietitian/progress', icon: TrendingUp },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const bottomNavItems = navItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 fixed h-full z-30 shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <Utensils className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            Healthy<span className="text-primary">Plate</span>
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-primary text-white shadow-xl shadow-primary/25 translate-x-2'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-sm ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-50 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-white shadow-sm">
              {user.name[0]}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-black text-slate-900 truncate">{user.name}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase truncate">{user.role}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all duration-300 font-bold text-sm group"
          >
            <div className="p-1.5 bg-slate-50 group-hover:bg-red-100 rounded-lg transition-colors">
              <LogOut size={18} />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Header ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-xl shadow-md shadow-primary/20">
            <Utensils className="text-white w-4 h-4" />
          </div>
          <span className="text-base font-black tracking-tighter text-slate-900 uppercase">
            Healthy<span className="text-primary">Plate</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs">
              {user.name[0]}
            </div>
            <span className="text-xs font-bold text-slate-600 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ── Mobile Slide-up Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2.5rem] shadow-2xl pb-10"
            >
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
                <div>
                  <p className="font-black text-slate-900 text-sm">{user.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-50 text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-4 py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-primary text-white font-black shadow-lg shadow-primary/20'
                          : 'text-slate-600 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 mx-4">
                <button
                  onClick={() => { setMenuOpen(false); onLogout(); }}
                  className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-all"
                >
                  <LogOut size={20} />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-72 min-h-screen relative overflow-x-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />
        <div className="pt-20 md:pt-0 px-4 md:px-10 pb-28 md:pb-10">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl shadow-slate-900/10 flex justify-around items-center px-2 py-2 rounded-[2rem] z-40">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-200"
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                  : 'text-slate-400'
              }`}>
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wide transition-colors ${
                isActive ? 'text-primary' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}

        {/* Menu / More button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="relative flex flex-col items-center gap-1 flex-1 py-1"
        >
          <div className="p-2.5 rounded-2xl text-slate-400 transition-all duration-200">
            <Menu size={19} strokeWidth={2} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-wide text-slate-400">More</span>
        </button>
      </nav>
    </div>
  );
}
