import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  LayoutDashboard, User, Activity, UtensilsCrossed,
  Heart, Settings, LogOut, Leaf, Stethoscope,
  MessageSquare, ClipboardList, BarChart2,
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

export default function Layout() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const nav = currentUser?.role === 'dietician' ? dieticianNav : patientNav;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shadow-sm shrink-0">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-800 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            HealthyPlate
          </span>
        </div>

        <div className="mx-4 mt-4 mb-2 bg-green-50 rounded-xl px-4 py-3">
          <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">
            {currentUser?.role === 'dietician' ? 'Dietician' : 'Patient'}
          </p>
          <p className="text-sm font-semibold text-gray-800 truncate">{currentUser?.name}</p>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dietician'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
