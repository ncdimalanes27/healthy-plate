import { useState, useEffect } from 'react';
import { getAllPatients, getLogsForUser } from '../lib/supabaseService';
import { calculateBMI, getBMICategory, calculateTargetCalories } from '../utils/calculations';
import { Users, TrendingUp, AlertCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface Props { user: { id: string; name: string } | null; }

function PatientRow({ patient }: { patient: any }) {
  const [open, setOpen] = useState(false);
  const bmi = patient.weight && patient.height ? calculateBMI(patient.weight, patient.height) : null;
  const bmiInfo = bmi ? getBMICategory(bmi) : null;
  const target = patient ? calculateTargetCalories({ weight: patient.weight, height: patient.height, age: patient.age, gender: patient.gender, activityLevel: patient.activity_level, goal: patient.goal }) : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
          {patient.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate">{patient.name}</p>
          <p className="text-xs text-gray-400 truncate">{patient.email}</p>
        </div>
        {bmiInfo && (
          <span className="hidden sm:inline-flex shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ background: bmiInfo.color + '22', color: bmiInfo.color }}>
            BMI {bmi} · {bmiInfo.label}
          </span>
        )}
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-gray-700">{target || '--'}</p>
          <p className="text-xs text-gray-400">kcal target</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>

      {bmiInfo && (
        <div className="sm:hidden px-4 pb-2">
          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: bmiInfo.color + '22', color: bmiInfo.color }}>
            BMI {bmi} · {bmiInfo.label}
          </span>
        </div>
      )}

      {open && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Age', val: (patient.age || '--') + (patient.age ? ' yrs' : '') },
              { label: 'Height', val: (patient.height || '--') + (patient.height ? ' cm' : '') },
              { label: 'Weight', val: (patient.weight || '--') + (patient.weight ? ' kg' : '') },
              { label: 'Goal', val: patient.goal === 'lose' ? '🔻 Lose' : patient.goal === 'gain' ? '📈 Gain' : '⚖️ Maintain' },
              { label: 'Activity', val: patient.activity_level || '--' },
              { label: 'Target Cal', val: target ? target + ' kcal' : '--' },
              { label: 'Gender', val: patient.gender || '--' },
              { label: 'BMI', val: bmi ? `${bmi} — ${bmiInfo?.label}` : '--' },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5 truncate">{val}</p>
              </div>
            ))}
          </div>
          {patient.health_conditions?.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <p className="text-xs font-semibold text-amber-700">Health Alerts</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {patient.health_conditions.map((c: string) => (
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

export default function DieticianDashboard({ user }: Props) {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPatients().then((data) => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  const filtered = patients.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );
  const withConditions = patients.filter((p) => p.health_conditions?.length > 0);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-5">
        <p className="text-green-600 font-semibold text-sm">Welcome back 👋</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
          {user?.name}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Dietician Dashboard · Patient Overview</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total Patients', val: patients.length, icon: Users, color: 'bg-blue-500' },
          { label: 'With Conditions', val: withConditions.length, icon: AlertCircle, color: 'bg-amber-500' },
          { label: 'Registered', val: patients.length, icon: TrendingUp, color: 'bg-green-500' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-xs sm:text-sm text-gray-500 leading-tight">{label}</span>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{val}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search patients by name or email…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 border border-gray-200 rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading patients...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>{search ? 'No patients found.' : 'No patients registered yet.'}</p>
          </div>
        ) : (
          filtered.map((patient) => <PatientRow key={patient.id} patient={patient} />)
        )}
      </div>
    </div>
  );
}
