import { useState, useEffect } from 'react';
import { getLogsForUser, upsertDailyLog } from '../lib/supabaseService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend } from 'recharts';
import { Save } from 'lucide-react';

interface Props { user: { id: string } | null; }

export default function HealthMonitoring({ user }: Props) {
  const [logs, setLogs] = useState<any[]>([]);
  const [form, setForm] = useState({ weight: '', bloodSugar: '', systolic: '', diastolic: '' });
  const [saved, setSaved] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;
    getLogsForUser(user.id).then(setLogs);
  }, [user]);

  const chartData = logs.slice(-14).map((log) => ({
    date: new Date(log.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }),
    calories: log.total_calories,
    weight: log.weight,
    bloodSugar: log.blood_sugar,
    systolic: log.blood_pressure_systolic,
    diastolic: log.blood_pressure_diastolic,
  }));

  const handleSave = async () => {
    if (!user) return;
    const updated = await upsertDailyLog({
      user_id: user.id, date: today,
      ...(form.weight && { weight: parseFloat(form.weight) }),
      ...(form.bloodSugar && { blood_sugar: parseFloat(form.bloodSugar) }),
      ...(form.systolic && { blood_pressure_systolic: parseFloat(form.systolic) }),
      ...(form.diastolic && { blood_pressure_diastolic: parseFloat(form.diastolic) }),
    });
    setLogs((prev) => {
      const exists = prev.find((l) => l.date === today);
      return exists ? prev.map((l) => l.date === today ? { ...l, ...updated } : l) : [...prev, updated];
    });
    setSaved(true);
    setForm({ weight: '', bloodSugar: '', systolic: '', diastolic: '' });
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Health Monitoring</h1>
        <p className="text-gray-400 text-sm mt-1">Track your weight, blood sugar, and blood pressure over time.</p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Log Today's Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Weight (kg)', key: 'weight', ph: '68.5' },
            { label: 'Blood Sugar (mg/dL)', key: 'bloodSugar', ph: '100' },
            { label: 'Systolic (mmHg)', key: 'systolic', ph: '120' },
            { label: 'Diastolic (mmHg)', key: 'diastolic', ph: '80' },
          ].map(({ label, key, ph }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <input type="number" placeholder={ph} value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={inp} />
            </div>
          ))}
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-green-100 text-green-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Metrics'}
        </button>
      </div>

      {chartData.length > 0 ? (
        <div className="space-y-5">
          {[
            { title: '📊 Daily Calorie Intake', key: 'calories', color: '#22c55e', type: 'area' },
            { title: '⚖️ Weight (kg)', key: 'weight', color: '#6366f1', type: 'line' },
            { title: '🩸 Blood Sugar (mg/dL)', key: 'bloodSugar', color: '#f97316', type: 'area' },
          ].map(({ title, key, color, type }) => (
            <div key={key} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4">{title}</h2>
              <ResponsiveContainer width="100%" height={180}>
                {type === 'area' ? (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey={key} stroke={color} fill={`url(#grad-${key})`} strokeWidth={2} />
                  </AreaChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          ))}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">💓 Blood Pressure (mmHg)</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="systolic" fill="#ef4444" radius={[4, 4, 0, 0]} name="Systolic" />
                <Bar dataKey="diastolic" fill="#fca5a5" radius={[4, 4, 0, 0]} name="Diastolic" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
          <p className="text-4xl mb-3">📈</p>
          <p className="text-gray-500 font-medium">No data yet.</p>
          <p className="text-gray-400 text-sm mt-1">Log your health metrics above to see charts here.</p>
        </div>
      )}
    </div>
  );
}
