<<<<<<< HEAD
import { useState } from "react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, BookOpen } from "lucide-react";
import Tutorial from "../components/Tutorial";
=======
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../lib/supabaseService';
import { LogOut, Trash2, BookOpen } from 'lucide-react';
import Tutorial from '../components/Tutorial';
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)

interface Props { user: { id: string; name: string; email: string; role: string } | null; }

export default function Settings({ user }: Props) {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);

<<<<<<< HEAD
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleClearData = () => {
    if (confirm("Clear all local data? This cannot be undone.")) {
      localStorage.removeItem("healthyplate-store");
=======
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleClearData = () => {
    if (confirm('Clear all local data? This cannot be undone.')) {
      localStorage.clear();
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
      window.location.reload();
    }
  };

  const handleReplayTutorial = () => {
    setShowTutorial(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your account and app preferences.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">Account</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg shrink-0">
<<<<<<< HEAD
              {currentUser?.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{currentUser?.name}</p>
              <p className="text-sm text-gray-400">{currentUser?.email}</p>
              <p className="text-xs text-green-600 capitalize font-medium">
                {currentUser?.role}
              </p>
=======
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <p className="text-xs text-green-600 capitalize font-medium">{user?.role}</p>
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            About HealthyPlate
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
<<<<<<< HEAD
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Food Database</span>
              <span className="font-medium">170+ foods</span>
            </div>
            <div className="flex justify-between">
              <span>Storage</span>
              <span className="font-medium">Local (browser)</span>
            </div>
=======
            <div className="flex justify-between"><span>Version</span><span className="font-medium">2.0.0</span></div>
            <div className="flex justify-between"><span>Food Database</span><span className="font-medium">170+ foods</span></div>
            <div className="flex justify-between"><span>Storage</span><span className="font-medium">Supabase Cloud</span></div>
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-800 mb-1">Actions</h2>
<<<<<<< HEAD

          <button
            onClick={handleReplayTutorial}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all text-sm font-medium"
          >
            <BookOpen className="w-4 h-4" />
            View Tutorial Again
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>

          <button
            onClick={handleClearData}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
=======
          <button onClick={() => setShowTutorial(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all text-sm font-medium">
            <BookOpen className="w-4 h-4" /> View Tutorial Again
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm font-medium">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
          <button onClick={handleClearData}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm font-medium">
            <Trash2 className="w-4 h-4" /> Clear Local Data
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Tutorial modal */}
      {showTutorial && currentUser && (
        <Tutorial
          role={currentUser.role}
          onClose={() => setShowTutorial(false)}
        />
=======
      {showTutorial && user && (
        <Tutorial role={user.role as 'patient' | 'dietician'} onClose={() => setShowTutorial(false)} />
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
      )}
    </div>
  );
}
