import { useState } from 'react';
import { useStore } from '../store/useStore';
import { generateMealPlan } from '../utils/mealPlanGenerator';
import { calculateTargetCalories } from '../utils/calculations';
import type { MealPlan, MealPlanDay } from '../types';
import { Sparkles, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

function MealCard({ foods, label }: { foods: any[]; label: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      {foods.length === 0 ? (
        <p className="text-xs text-gray-300 italic">—</p>
      ) : (
        <div className="space-y-1">
          {foods.map((f, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-gray-700">{f.name}</span>
              <span className="text-xs text-green-600 font-medium">{f.calories} kcal</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DayCard({ day }: { day: MealPlanDay }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800">{day.day}</p>
            <p className="text-xs text-gray-400">{day.totalCalories} kcal total</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-5 pb-4 grid grid-cols-2 gap-3">
          <MealCard foods={day.breakfast} label="🌅 Breakfast" />
          <MealCard foods={day.lunch} label="☀️ Lunch" />
          <MealCard foods={day.dinner} label="🌙 Dinner" />
          <MealCard foods={day.snack} label="🍎 Snack" />
        </div>
      )}
    </div>
  );
}

export default function MealPlans() {
  const { currentUser, getProfile, saveMealPlan, getMealPlans } = useStore();
  const profile = getProfile(currentUser?.id || '');
  const savedPlans = getMealPlans(currentUser?.id || '');

  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [customCals, setCustomCals] = useState('');

  const targetCals = profile ? calculateTargetCalories(profile) : 2000;

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const cals = customCals ? parseInt(customCals) : targetCals;
      const plan = generateMealPlan(cals, 7);
      setActivePlan(plan);
      setLoading(false);
    }, 600);
  };

  const handleSave = () => {
    if (!activePlan) return;
    saveMealPlan(currentUser!.id, activePlan);
    alert('Meal plan saved!');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Meal Plans</h1>
        <p className="text-gray-400 text-sm mt-1">Generate a personalized 7-day Filipino meal plan based on your calorie target.</p>
      </div>

      {/* Generator card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-1">Generate New Plan</h2>
        <p className="text-sm text-gray-400 mb-4">
          Your calculated target: <strong className="text-green-600">{targetCals} kcal/day</strong>
        </p>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Custom Calories (optional)</label>
            <input
              type="number"
              placeholder={`Default: ${targetCals} kcal`}
              value={customCals}
              onChange={(e) => setCustomCals(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Active plan */}
      {activePlan && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-800">{activePlan.name}</h2>
              <p className="text-xs text-gray-400">7-day Filipino meal plan</p>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium rounded-xl transition-colors"
            >
              💾 Save Plan
            </button>
          </div>
          <div className="space-y-3">
            {activePlan.days.map((day) => (
              <DayCard key={day.day} day={day} />
            ))}
          </div>
        </div>
      )}

      {/* Saved plans */}
      {savedPlans.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">Saved Plans</h2>
          <div className="space-y-2">
            {savedPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => setActivePlan(plan)}
              >
                <div>
                  <p className="font-medium text-gray-800 text-sm">{plan.name}</p>
                  <p className="text-xs text-gray-400">Saved {new Date(plan.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-green-600 font-semibold">{plan.targetCalories} kcal/day</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
