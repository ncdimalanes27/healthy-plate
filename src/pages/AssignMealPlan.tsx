import { useState, useEffect } from 'react';
import { getAllPatients, getAssignedPlansForPatient, insertAssignedPlan } from '../lib/supabaseService';
import { generateMealPlan } from '../utils/mealPlanGenerator';
import { calcTargetFromProfile } from '../lib/supabaseService';
import { ClipboardList, Sparkles, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Props { user: { id: string; name: string } | null; }

export default function AssignMealPlan({ user }: Props) {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [customCals, setCustomCals] = useState('');
  const [note, setNote] = useState('');
  const [assigned, setAssigned] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [assignedPlans, setAssignedPlans] = useState<any[]>([]);

  useEffect(() => {
    getAllPatients().then((data) => {
      setPatients(data);
      if (data.length > 0) setSelectedPatient(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedPatient) getAssignedPlansForPatient(selectedPatient).then(setAssignedPlans);
  }, [selectedPatient]);

  const patient = patients.find((p) => p.id === selectedPatient);
  const targetCals = patient ? calcTargetFromProfile(patient) : 1800;

  const handleGenerate = () => {
    const cals = customCals ? parseInt(customCals) : targetCals;
    const plan = generateMealPlan(cals, 7);
    setGeneratedPlan(plan);
  };

  const handleAssign = async () => {
    if (!user || !patient || !generatedPlan) return;
    await insertAssignedPlan({
      meal_plan_id: generatedPlan.id,
      meal_plan_name: generatedPlan.name,
      patient_id: selectedPatient,
      dietician_id: user.id,
      dietician_name: user.name,
      target_calories: generatedPlan.targetCalories,
      note: note.trim() || null,
    });
    const updated = await getAssignedPlansForPatient(selectedPatient);
    setAssignedPlans(updated);
    setNote('');
    setGeneratedPlan(null);
    setCustomCals('');
    setAssigned(true);
    setTimeout(() => setAssigned(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Assign Meal Plan</h1>
        <p className="text-gray-400 text-sm mt-1">Generate and assign a personalized Filipino meal plan to a patient.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <p className="text-sm font-semibold text-gray-600 mb-3">Select Patient</p>
          {patients.map((p) => (
            <button key={p.id} onClick={() => { setSelectedPatient(p.id); setGeneratedPlan(null); }}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${selectedPatient === p.id ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">Target: {calcTargetFromProfile(p)} kcal</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-4">
          {patient && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">{patient.name}'s Profile</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[
                  { label: 'Goal', val: patient.goal === 'lose' ? '🔻 Lose' : patient.goal === 'gain' ? '📈 Gain' : '⚖️ Maintain' },
                  { label: 'Target', val: `${targetCals} kcal` },
                  { label: 'Activity', val: patient.activity_level || '--' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white rounded-xl px-3 py-2">
                    <p className="text-xs text-blue-400">{label}</p>
                    <p className="text-sm font-semibold text-blue-800 truncate">{val}</p>
                  </div>
                ))}
              </div>
              {patient.health_conditions?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {patient.health_conditions.map((c: string) => (
                    <span key={c} className="bg-amber-100 text-amber-700 text-xs px-2.5 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-4">Generate 7-Day Meal Plan</p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Custom calories (optional — default: {targetCals} kcal)</label>
                <input type="number" value={customCals} onChange={(e) => setCustomCals(e.target.value)}
                  placeholder={`Default: ${targetCals} kcal`}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Note to patient (optional)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Sundin ito ng 2 linggo. Iwasan ang maalat na pagkain."
                  rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleGenerate}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-all">
                <Sparkles className="w-4 h-4" /> Generate Plan
              </button>
              {generatedPlan && (
                <button onClick={handleAssign}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${assigned ? 'bg-green-100 text-green-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  {assigned ? <CheckCircle className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
                  {assigned ? 'Assigned!' : 'Assign to Patient'}
                </button>
              )}
            </div>
          </div>

          {generatedPlan && (
            <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-green-50 border-b border-green-100">
                <p className="font-bold text-green-900">{generatedPlan.name}</p>
                <p className="text-xs text-green-600">{generatedPlan.targetCalories} kcal/day · 7-day Filipino meal plan</p>
              </div>
              <div className="divide-y divide-gray-50">
                {generatedPlan.days.map((day: any) => (
                  <div key={day.day}>
                    <button onClick={() => setExpandedId(expandedId === day.day ? null : day.day)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800 text-sm w-24 text-left">{day.day}</span>
                        <span className="text-xs text-green-600 font-medium">{day.totalCalories} kcal</span>
                      </div>
                      {expandedId === day.day ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {expandedId === day.day && (
                      <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { label: '🌅 Breakfast', foods: day.breakfast },
                          { label: '☀️ Lunch', foods: day.lunch },
                          { label: '🌙 Dinner', foods: day.dinner },
                          { label: '🍎 Snack', foods: day.snack },
                        ].map(({ label, foods }) => (
                          <div key={label} className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs font-semibold text-gray-500 mb-1.5">{label}</p>
                            {(foods || []).map((f: any, i: number) => (
                              <div key={i} className="flex items-center justify-between">
                                <span className="text-xs text-gray-700 truncate">{f.name}</span>
                                <span className="text-xs text-green-600 font-medium ml-2 shrink-0">{f.calories} kcal</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {assignedPlans.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Previously Assigned ({assignedPlans.length})</p>
              <div className="space-y-2">
                {assignedPlans.map((plan) => (
                  <div key={plan.id} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{plan.meal_plan_name}</p>
                      <p className="text-xs text-gray-400">{new Date(plan.assigned_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })} · {plan.dietician_name}</p>
                      {plan.note && <p className="text-xs text-gray-500 mt-1 italic">"{plan.note}"</p>}
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full shrink-0 ml-3">{plan.target_calories} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
