import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Leaf } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { users, login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.email === email);
    if (!user) { setError('No account found with that email.'); return; }
    // Demo: any password works
    login(user);
    navigate(user.role === 'dietician' ? '/dietician' : '/dashboard');
  };

  const demoLogin = (role: 'patient' | 'dietician') => {
    const email = role === 'patient' ? 'patient@demo.com' : 'dietician@demo.com';
    const user = users.find((u) => u.email === email)!;
    login(user);
    navigate(role === 'dietician' ? '/dietician' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            HealthyPlate
          </h1>
          <p className="text-gray-500 mt-1">Your Filipino Nutrition Companion</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-center text-gray-400 mb-3">— Quick Demo Access —</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => demoLogin('patient')}
                className="border-2 border-green-200 text-green-700 hover:bg-green-50 text-sm font-medium py-2 rounded-xl transition-colors"
              >
                👤 Patient Demo
              </button>
              <button
                onClick={() => demoLogin('dietician')}
                className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 text-sm font-medium py-2 rounded-xl transition-colors"
              >
                🩺 Dietician Demo
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{' '}
            <a href="/register" className="text-green-600 font-medium hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
