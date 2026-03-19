import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { HealthProfile } from '../types';
import { Save } from 'lucide-react';

const conditions = ['Type 2 Diabetes', 'Hypertension', 'High Cholesterol', 'Heart Disease', 'Kidney Disease', 'Anemia', 'Gout', 'Obesity'];
const allergies = ['Peanuts', 'Shellfish', 'Fish', 'Dairy', 'Eggs', 'Gluten', 'Soy'];

export default function Profile() {
  const { currentUser, getProfile, saveProfile } = useStore();
  const existing = getProfile(currentUser?.id || '');

  const [form, setForm] = useState<Omit<HealthProfile, 'userId'>>({
    age: 25,
    gender: 'female',
    height: 160,
    weight: 60,
    activityLevel: 'moderate',
    healthConditions: [],
    allergies: [],
    goal: 'maintain',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existing) {
      const { userId, ...rest } = existing;
      setForm(rest);
    }
  }, []);

  const toggleItem = (list: 'healthConditions' | 'allergies', item: string) => {
    setForm((prev) => ({
      ...prev,
      [list]: prev[list].includes(item) ? prev[list].filter((x) => x !== item) : [...prev[list], item],
    }));
  };

  const handleSave = () => {
    saveProfile({ ...form, userId: currentUser!.id });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Health Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Keep your profile updated for accurate meal plans and calorie targets.</p>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Age</label>
              <input type="number" className={inputClass} value={form.age}
                onChange={(e) => setForm({ ...form, age: +e.target.value })} min={10} max={100} />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select className={inputClass} value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as any })}>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Height (cm)</label>
              <input type="number" className={inputClass} value={form.height}
                onChange={(e) => setForm({ ...form, height: +e.target.value })} min={100} max={220} />
            </div>
            <div>
              <label className={labelClass}>Weight (kg)</label>
              <input type="number" className={inputClass} value={form.weight}
                onChange={(e) => setForm({ ...form, weight: +e.target.value })} min={30} max={300} />
            </div>
          </div>
        </div>

        {/* Activity & Goal */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Activity & Goal</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Activity Level</label>
              <select className={inputClass} value={form.activityLevel}
                onChange={(e) => setForm({ ...form, activityLevel: e.target.value as any })}>
                <option value="sedentary">Sedentary (desk job, no exercise)</option>
                <option value="light">Light (1-3x/week exercise)</option>
                <option value="moderate">Moderate (3-5x/week)</option>
                <option value="active">Active (6-7x/week)</option>
                <option value="veryActive">Very Active (athlete / physical job)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Nutrition Goal</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: 'lose', label: '🔻 Lose Weight' },
                  { val: 'maintain', label: '⚖️ Maintain' },
                  { val: 'gain', label: '📈 Gain Weight' },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setForm({ ...form, goal: val as any })}
                    className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                      form.goal === val ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-green-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Health Conditions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Health Conditions</h2>
          <div className="flex flex-wrap gap-2">
            {conditions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleItem('healthConditions', c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  form.healthConditions.includes(c)
                    ? 'bg-red-100 border-red-300 text-red-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-red-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Food Allergies</h2>
          <div className="flex flex-wrap gap-2">
            {allergies.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleItem('allergies', a)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  form.allergies.includes(a)
                    ? 'bg-orange-100 border-orange-300 text-orange-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-orange-200'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold transition-all ${
            saved ? 'bg-green-100 text-green-700' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-200'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Profile Saved!' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
