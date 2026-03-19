import { useState } from 'react';
import { useStore } from '../store/useStore';
import { calculateBMI, getBMICategory, calculateTargetCalories } from '../utils/calculations';
import { Users, TrendingUp, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

function PatientRow({ patient }: { patient: any }) {
  const [open, setOpen] = useState(false);
  const { user, profile, lastLog } = patient;

  const bmi = profile ? calculateBMI(profile.weight, profile.height) : null;
  const bmiInfo = bmi ? getBMICategory(bmi) : null;
  const target = profile ? calculateTargetCalories(profile) : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
        {bmiInfo && (
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: bmiInfo.color + '20', color: bmiInfo.color }}
          >
            BMI {bmi} · {bmiInfo.label}
          </span>
        )}
        <div className="text-right">
          <p className="text-sm font-bold text-gray-700">{lastLog?.totalCalories ?? '--'} kcal</p>
          <p className="text-xs text-gray-400">Last logged</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && profile && (
        <div className="px-5 pb-5 border-t border-gray-50 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Age', val: profile.age + ' yrs' },
              { label: 'Height', val: profile.height + ' cm' },
              { label: 'Weight', val: profile.weight + ' kg' },
              { label: 'Goal', val: profile.goal === 'lose' ? '🔻 Lose' : profile.goal === 'gain' ? '📈 Gain' : '⚖️ Maintain' },
              { label: 'Activity', val: profile.activityLevel },
              { label: 'Target Calories', val: target + ' kcal' },
              { label: 'Gender', val: profile.gender },
              { label: 'Conditions', val: profile.healthConditions.join(', ') || 'None' },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {lastLog && lastLog.meals.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent Meal Log</p>
              <div className="space-y-1.5">
                {lastLog.meals.slice(0, 5).map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{m.foodName}</span>
                    <span className="text-green-600 font-medium">{m.calories} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.healthConditions.length > 0 && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <p className="text-xs font-semibold text-amber-700">Health Alerts</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.healthConditions.map((c: string) => (
                  <span key={c} className="bg-amber-100 text-amber-700 text-xs px-2.5 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DieticianDashboard() {
  const { currentUser, getAllPatients } = useStore();
  const patients = getAllPatients();
  const [search, setSearch] = useState('');

  const filtered = patients.filter(
    (p) =>
      p.user.name.toLowerCase().includes(search.toLowerCase()) ||
      p.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const withConditions = patients.filter((p) => p.profile?.healthConditions.length);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-green-600 font-semibold text-sm">Welcome back 👋</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
          {currentUser?.name}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Dietician Dashboard · Patient Overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Patients', val: patients.length, icon: Users, color: 'bg-blue-500' },
          { label: 'With Conditions', val: withConditions.length, icon: AlertCircle, color: 'bg-amber-500' },
          { label: 'Active Today', val: patients.filter((p) => p.lastLog?.totalCalories).length, icon: TrendingUp, color: 'bg-green-500' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{label}</span>
              <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{val}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patients by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {/* Patient list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>No patients found.</p>
          </div>
        ) : (
          filtered.map((patient) => (
            <PatientRow key={patient.user.id} patient={patient} />
          ))
        )}
      </div>
    </div>
  );
}
