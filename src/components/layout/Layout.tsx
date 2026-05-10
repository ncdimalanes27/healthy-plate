import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, User, Utensils, Activity, Settings, 
  LogOut, ClipboardList, TrendingUp, MessageSquare, ChevronRight
} from 'lucide-react';
import type { Profile } from '../../types';
import { motion } from 'framer-motion'; // Idagdag ito

interface LayoutProps {
  user: Profile | null;
  onLogout: () => void;
}

export default function Layout({ user, onLogout }: LayoutProps) {
  const location = useLocation();
  const isPatient = user?.role === 'patient';

  // Guard: Kung wala pang user, huwag munang mag-render ng navigation
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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 fixed h-full z-30 shadow-sm">
        {/* Brand Logo */}
        <div className="p-8 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <Utensils className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            Healthy<span className="text-primary">Plate</span>
          </span>
        </div>
        
        {/* Navigation */}
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
                  <span className={`text-sm ${isActive ? 'font-black' : 'font-bold'}`}>
                    {item.label}
                  </span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Summary & Logout */}
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

      {/* --- Main Content Area --- */}
      <main className="flex-1 md:ml-72 min-h-screen relative overflow-x-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-1/2 h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none"></div>
        
        <div className="p-4 md:p-10 pb-32 md:pb-10">
          <Outlet />
        </div>
      </main>

      {/* --- Mobile Bottom Nav (Floating Glass Style) --- */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-900/10 flex justify-around p-3 rounded-[2rem] z-50">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center p-2 transition-all duration-300 ${
                isActive ? 'scale-110' : 'scale-100'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-400'
              }`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}