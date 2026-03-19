import { useState } from 'react';
import { useStore } from '../store/useStore';
import { calculateTargetCalories } from '../utils/calculations';
import { ClipboardList, Sparkles, CheckCircle, ChevronDown, ChevronUp, Loader2, Bot } from 'lucide-react';

interface AIMealDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  totalCalories: number;
  notes: string;
}

interface AIMealPlan {
  planName: string;
  targetCalories: number;
  days: AIMealDay[];
  generalAdvice: string;
}

export default function AssignMealPlan() {
  const { currentUser, getAllPatients, getProfile, assignMealPlan, getAssignedPlansForPatient } = useStore();
  const patients = getAllPatients();

  const [selectedPatient, setSelectedPatient] = useState(patients[0]?.user.id || '');
  const [customCals, setCustomCals] = useState('');
  const [note, setNote] = useState('');
  const [assigned, setAssigned] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<AIMealPlan | null>(null);
  const [aiError, setAiError] = useState('');
  const [apiKey] = useState(() => localStorage.getItem('hp_api_key') || '');
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const [tempKey, setTempKey] = useState('');

  const patient = patients.find((p) => p.user.id === selectedPatient);
  const profile = getProfile(selectedPatient);
  const targetCals = profile ? calculateTargetCalories(profile) : 1800;
  const assignedPlans = getAssignedPlansForPatient(selectedPatient);

  const handleGenerateAI = async () => {
    const key = apiKey || tempKey;
    if (!key) { setShowKeyPrompt(true); return; }
    if (!profile || !patient) return;

    setAiLoading(true);
    setAiPlan(null);
    setAiError('');

    const cals = customCals ? parseInt(customCals) : targetCals;
    const conditions = profile.healthConditions.join(', ') || 'wala';
    const allergies = profile.allergies.join(', ') || 'wala';

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: `Ikaw ay isang Filipino registered nutritionist-dietitian. Gumawa ng 7-day Filipino meal plan para sa patient na ito.

Patient Information:
- Pangalan: ${patient.user.name}
- Edad: ${profile.age} taong gulang
- Kasarian: ${profile.gender}
- Taas: ${profile.height} cm
- Timbang: ${profile.weight} kg
- Aktibidad: ${profile.activityLevel}
- Goal: ${profile.goal} weight
- Health conditions: ${conditions}
- Allergies: ${allergies}
- Target calories: ${cals} kcal/day

Gumamit ng mga Filipino na pagkain tulad ng adobo, sinigang, tinola, pinakbet, atbp. Isaalang-alang ang health conditions ng patient.

Mag-respond ng JSON LANG, walang ibang text:
{
  "planName": "pangalan ng plan",
  "targetCalories": ${cals},
  "days": [
    {
      "day": "Monday",
      "breakfast": "pagkain sa breakfast",
      "lunch": "pagkain sa lunch",
      "dinner": "pagkain sa dinner", 
      "snack": "pagkain sa snack",
      "totalCalories": estimated total calories as number,
      "notes": "short na note kung may special consideration para sa araw na ito (Taglish)"
    }
  ],
  "generalAdvice": "2-3 sentences na pangkalahatang advice para sa patient base sa kanyang kondisyon (Taglish)"
}`
          }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed: AIMealPlan = JSON.parse(clean);
      setAiPlan(parsed);
      if (tempKey) localStorage.setItem('hp_api_key', tempKey);
    } catch (e: any) {
      setAiError('May error sa AI generation. I-check ang API key mo.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAssign = () => {
    if (!currentUser || !patient || !aiPlan) return;
    assignMealPlan({
      mealPlanId: `ai-${Date.now()}`,
      mealPlanName: aiPlan.planName,
      patientId: selectedPatient,
      dieticianId: currentUser.id,
      dieticianName: currentUser.name,
      targetCalories: aiPlan.targetCalories,
      note: note.trim() || aiPlan.generalAdvice,
    });
    setNote('');
    setAiPlan(null);
    setAssigned(true);
    setTimeout(() => setAssigned(false), 2500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Assign Meal Plan
        </h1>
        <p className="text-gray-400 text-sm mt-1">Gumamit ng AI para gumawa ng personalized Filipino meal plan para sa patient.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient selector */}
        <div className="md:col-span-1 space-y-2">
          <p className="text-sm font-semibold text-gray-600 mb-3">Piliin ang Patient</p>
          {patients.map(({ user, profile: prof }) => (
            <button key={user.id} onClick={() => { setSelectedPatient(user.id); setAiPlan(null); }}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                selectedPatient === user.id ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200'
              }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-400">{prof ? calculateTargetCalories(prof) : '—'} kcal target</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main panel */}
        <div className="md:col-span-2 space-y-4">
          {/* Patient info */}
          {profile && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">{patient?.user.name}'s Profile</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[
                  { label: 'Goal', val: profile.goal === 'lose' ? '🔻 Lose' : profile.goal === 'gain' ? '📈 Gain' : '⚖️ Maintain' },
                  { label: 'Target', val: `${targetCals} kcal` },
                  { label: 'Activity', val: profile.activityLevel },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white rounded-xl px-3 py-2">
                    <p className="text-xs text-blue-400">{label}</p>
                    <p className="text-sm font-semibold text-blue-800">{val}</p>
                  </div>
                ))}
              </div>
              {profile.healthConditions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {profile.healthConditions.map((c) => (
                    <span key={c} className="bg-amber-100 text-amber-700 text-xs px-2.5 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* API Key prompt */}
          {showKeyPrompt && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-purple-800 mb-2">🔑 I-enter ang Claude API Key</p>
              <div className="flex gap-2">
                <input type="password" value={tempKey} onChange={(e) => setTempKey(e.target.value)}
                  placeholder="sk-ant-xxxxxxxx"
                  className="flex-1 border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <button onClick={() => { localStorage.setItem('hp_api_key', tempKey); setShowKeyPrompt(false); handleGenerateAI(); }}
                  className="px-4 bg-purple-600 text-white rounded-xl text-sm font-medium">Save</button>
              </div>
            </div>
          )}

          {/* Generate form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-purple-600" />
              <p className="font-semibold text-gray-800">AI-Powered Meal Plan Generator</p>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Custom calories (optional)</label>
                <input type="number" value={customCals} onChange={(e) => setCustomCals(e.target.value)}
                  placeholder={`Default: ${targetCals} kcal`}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Additional note para sa patient (optional)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Sundin ito ng 2 linggo, iwasan ang maalat na pagkain..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <button onClick={handleGenerateAI} disabled={aiLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50">
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {aiLoading ? 'Ginagawa ng AI ang meal plan...' : 'Generate AI Meal Plan'}
            </button>
          </div>

          {/* AI Error */}
          {aiError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">{aiError}</div>
          )}

          {/* AI Plan Result */}
          {aiPlan && (
            <div className="bg-white border border-purple-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-purple-50 border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-purple-900">{aiPlan.planName}</p>
                    <p className="text-xs text-purple-600">{aiPlan.targetCalories} kcal/day · 7-day Filipino meal plan</p>
                  </div>
                  <button onClick={handleAssign}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      assigned ? 'bg-green-100 text-green-700' : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}>
                    {assigned ? <CheckCircle className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
                    {assigned ? 'Assigned!' : 'I-assign sa Patient'}
                  </button>
                </div>
              </div>

              {/* General advice */}
              <div className="px-5 py-3 bg-green-50 border-b border-green-100">
                <p className="text-xs font-semibold text-green-700 mb-1">💡 General Advice</p>
                <p className="text-sm text-gray-700">{aiPlan.generalAdvice}</p>
              </div>

              {/* Days */}
              <div className="divide-y divide-gray-50">
                {aiPlan.days.map((day) => (
                  <div key={day.day}>
                    <button onClick={() => setExpandedId(expandedId === day.day ? null : day.day)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800 text-sm w-24 text-left">{day.day}</span>
                        <span className="text-xs text-green-600 font-medium">{day.totalCalories} kcal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 hidden sm:block truncate max-w-48">{day.breakfast}</span>
                        {expandedId === day.day ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>
                    {expandedId === day.day && (
                      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
                        {[
                          { label: '🌅 Breakfast', val: day.breakfast },
                          { label: '☀️ Lunch', val: day.lunch },
                          { label: '🌙 Dinner', val: day.dinner },
                          { label: '🍎 Snack', val: day.snack },
                        ].map(({ label, val }) => (
                          <div key={label} className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
                            <p className="text-sm text-gray-700">{val}</p>
                          </div>
                        ))}
                        {day.notes && (
                          <div className="col-span-2 bg-amber-50 rounded-xl p-3">
                            <p className="text-xs font-semibold text-amber-600 mb-1">📝 Note</p>
                            <p className="text-sm text-gray-700">{day.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previously assigned */}
          {assignedPlans.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Previously Assigned ({assignedPlans.length})</p>
              <div className="space-y-2">
                {assignedPlans.map((plan) => (
                  <div key={plan.id} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{plan.mealPlanName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(plan.assignedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })} · {plan.dieticianName}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {plan.targetCalories} kcal/day
                    </span>
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
