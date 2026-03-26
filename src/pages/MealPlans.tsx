import { useState, useEffect } from 'react';
import { getMealPlans, insertMealPlan, deleteMealPlan as sbDeleteMealPlan, renameMealPlan as sbRenameMealPlan } from '../lib/supabaseService';
import { generateMealPlan } from '../utils/mealPlanGenerator';
import { getProfile } from '../lib/supabaseService';
import { calculateTargetCalories } from '../utils/calculations';
<<<<<<< HEAD
import type { MealPlan, MealPlanDay } from '../types';
import { Sparkles, ChevronDown, ChevronUp, Calendar, Trash2, Pencil, Check, X, RefreshCw, BookmarkCheck } from 'lucide-react';
=======
import { Sparkles, ChevronDown, ChevronUp, Calendar, Trash2, Pencil, Check, X, RefreshCw, BookmarkCheck } from 'lucide-react';

interface Props { user: { id: string } | null; }
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)

function MealCard({ foods, label }: { foods: any[]; label: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      {foods.length === 0 ? <p className="text-xs text-gray-300 italic">—</p> : (
        <div className="space-y-1">
          {foods.map((f, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-700 truncate">{f.name}</span>
              <span className="text-xs text-green-600 font-medium shrink-0">{f.calories} kcal</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DayCard({ day }: { day: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
<<<<<<< HEAD
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
=======
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm">{day.day}</p>
            <p className="text-xs text-gray-400">{day.totalCalories} kcal total</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <MealCard foods={day.breakfast} label="🌅 Breakfast" />
          <MealCard foods={day.lunch} label="☀️ Lunch" />
          <MealCard foods={day.dinner} label="🌙 Dinner" />
          <MealCard foods={day.snack} label="🍎 Snack" />
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD
// Rename modal
function RenameModal({ plan, onSave, onClose }: { plan: MealPlan; onSave: (name: string) => void; onClose: () => void }) {
=======
function RenameModal({ plan, onSave, onClose }: { plan: any; onSave: (name: string) => void; onClose: () => void }) {
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
  const [name, setName] = useState(plan.name);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-gray-800 mb-4">Rename Meal Plan</h3>
<<<<<<< HEAD
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onSave(name.trim())}
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim()}
            className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-40"
          >
            Save
          </button>
=======
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-4" autoFocus
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onSave(name.trim())} />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => name.trim() && onSave(name.trim())} disabled={!name.trim()}
            className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-40">Save</button>
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD

export default function MealPlans() {
  const { currentUser, getProfile, saveMealPlan, getMealPlans, deleteMealPlan, renameMealPlan } = useStore();
  const profile = getProfile(currentUser?.id || '');
  const savedPlans = getMealPlans(currentUser?.id || '');
=======
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)

export default function MealPlans({ user }: Props) {
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [customCals, setCustomCals] = useState('');
  const [savedToast, setSavedToast] = useState(false);
<<<<<<< HEAD
  const [renamingPlan, setRenamingPlan] = useState<MealPlan | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
=======
  const [renamingPlan, setRenamingPlan] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then(setProfile);
    getMealPlans(user.id).then(setSavedPlans);
  }, [user]);
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)

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

<<<<<<< HEAD
  const handleSave = () => {
    if (!activePlan) return;
    saveMealPlan(currentUser!.id, activePlan);
=======
  const handleSave = async () => {
    if (!activePlan || !user) return;
    await insertMealPlan({ user_id: user.id, name: activePlan.name, target_calories: activePlan.targetCalories, days: activePlan.days });
    const updated = await getMealPlans(user.id);
    setSavedPlans(updated);
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

<<<<<<< HEAD
  const handleDelete = (planId: string) => {
    deleteMealPlan(currentUser!.id, planId);
=======
  const handleDelete = async (planId: string) => {
    await sbDeleteMealPlan(planId);
    setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
    if (activePlan?.id === planId) setActivePlan(null);
    setDeleteConfirm(null);
  };

<<<<<<< HEAD
  const handleRename = (plan: MealPlan, newName: string) => {
    renameMealPlan(currentUser!.id, plan.id, newName);
    if (activePlan?.id === plan.id) setActivePlan({ ...activePlan, name: newName });
=======
  const handleRename = async (plan: any, newName: string) => {
    await sbRenameMealPlan(plan.id, newName);
    setSavedPlans((prev) => prev.map((p) => p.id === plan.id ? { ...p, name: newName } : p));
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
    setRenamingPlan(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Meal Plans</h1>
        <p className="text-gray-400 text-sm mt-1">Generate a personalized 7-day Filipino meal plan based on your calorie target.</p>
      </div>

<<<<<<< HEAD
      {/* Generator card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-1">Generate New Plan</h2>
        <p className="text-sm text-gray-400 mb-4">
          Your calculated target: <strong className="text-green-600">{targetCals} kcal/day</strong>
        </p>
=======
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-1">Generate New Plan</h2>
        <p className="text-sm text-gray-400 mb-4">Your calculated target: <strong className="text-green-600">{targetCals} kcal/day</strong></p>
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-40">
            <label className="block text-sm font-medium text-gray-600 mb-1">Custom Calories (optional)</label>
            <input type="number" placeholder={`Default: ${targetCals} kcal`} value={customCals}
              onChange={(e) => setCustomCals(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <button onClick={handleGenerate} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 shrink-0">
            <Sparkles className="w-4 h-4" />
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Active / previewing plan */}
=======
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
      {activePlan && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div>
              <h2 className="font-semibold text-gray-800">{activePlan.name}</h2>
              <p className="text-xs text-gray-400">{activePlan.targetCalories} kcal/day · 7-day plan</p>
            </div>
            <div className="flex gap-2 flex-wrap">
<<<<<<< HEAD
              {/* Regenerate */}
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
              {/* Save */}
              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  savedToast
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {savedToast ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkCheck className="w-4 h-4" />}
=======
              <button onClick={handleGenerate}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
              <button onClick={handleSave}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${savedToast ? 'bg-green-100 text-green-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                <BookmarkCheck className="w-4 h-4" />
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
                {savedToast ? 'Saved!' : 'Save Plan'}
              </button>
            </div>
          </div>
          <div className="space-y-2">
<<<<<<< HEAD
            {activePlan.days.map((day) => (
              <DayCard key={day.day} day={day} />
            ))}
=======
            {activePlan.days.map((day: any) => <DayCard key={day.day} day={day} />)}
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
          </div>
        </div>
      )}

      {savedPlans.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">
<<<<<<< HEAD
            Saved Plans
            <span className="ml-2 text-xs text-gray-400 font-normal">{savedPlans.length} plan{savedPlans.length !== 1 ? 's' : ''}</span>
=======
            Saved Plans <span className="ml-2 text-xs text-gray-400 font-normal">{savedPlans.length} plan{savedPlans.length !== 1 ? 's' : ''}</span>
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
          </h2>
          <div className="space-y-2">
            {savedPlans.map((plan) => (
              <div key={plan.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
<<<<<<< HEAD
                {/* Plan row */}
                <div
                  className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => setActivePlan(activePlan?.id === plan.id ? null : plan)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{plan.name}</p>
                    <p className="text-xs text-gray-400">
                      Saved {new Date(plan.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' · '}{plan.targetCalories} kcal/day
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Rename */}
                    <button
                      onClick={() => setRenamingPlan(plan)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Rename"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    {deleteConfirm === plan.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors"
                          title="Confirm delete"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                          title="Cancel"
                        >
=======
                <div className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => setActivePlan(activePlan?.id === plan.id ? null : { ...plan, days: plan.days, targetCalories: plan.target_calories })}>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{plan.name}</p>
                    <p className="text-xs text-gray-400">
                      Saved {new Date(plan.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })} · {plan.target_calories} kcal/day
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setRenamingPlan(plan)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {deleteConfirm === plan.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(plan.id)} className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
<<<<<<< HEAD
                      <button
                        onClick={() => setDeleteConfirm(plan.id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
=======
                      <button onClick={() => setDeleteConfirm(plan.id)} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
<<<<<<< HEAD

                {/* Expanded days (when clicked) */}
                {activePlan?.id === plan.id && (
                  <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-2">
                    {plan.days.map((day) => (
                      <DayCard key={day.day} day={day} />
                    ))}
=======
                {activePlan?.id === plan.id && (
                  <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-2">
                    {(plan.days || []).map((day: any) => <DayCard key={day.day} day={day} />)}
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* Rename modal */}
      {renamingPlan && (
        <RenameModal
          plan={renamingPlan}
          onSave={(name) => handleRename(renamingPlan, name)}
          onClose={() => setRenamingPlan(null)}
        />
      )}
=======
      {renamingPlan && <RenameModal plan={renamingPlan} onSave={(name) => handleRename(renamingPlan, name)} onClose={() => setRenamingPlan(null)} />}
>>>>>>> 3fcda7c (feat: fetch foods from Supabase database)
    </div>
  );
}
