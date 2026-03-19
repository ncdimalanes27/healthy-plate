import { useState } from 'react';
import { useStore } from '../store/useStore';
import { filipinoFoods, budgetFoods } from '../data/foods';
import type { FoodItem, MealEntry } from '../types';
import { Search, Plus, CheckCircle, Sparkles, Loader2, Bot, Wallet } from 'lucide-react';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

interface AIResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  feedback: string;
  suggestion: string;
}

export default function HealthData() {
  const { currentUser, addMealEntry, getTodayLog, getProfile } = useStore();
  const todayLog = getTodayLog(currentUser?.id || '');
  const profile = getProfile(currentUser?.id || '');

  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState<typeof mealTypes[number]>('lunch');
  const [added, setAdded] = useState<string | null>(null);
  const [budgetOnly, setBudgetOnly] = useState(false);

  // AI states
  const [aiMode, setAiMode] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiError, setAiError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const sourceList = budgetOnly ? budgetFoods : filipinoFoods;
  const filtered = search.trim()
    ? sourceList.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase())
      )
    : sourceList.slice(0, 25);

  const handleAdd = (food: FoodItem) => {
    const entry: MealEntry = {
      id: `e${Date.now()}`,
      foodId: food.id,
      foodName: food.name,
      servings: 1,
      calories: food.calories,
      mealType,
      date: new Date().toISOString().split('T')[0],
    };
    addMealEntry(currentUser!.id, entry);
    setAdded(food.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const handleAILog = async () => {
    if (!aiInput.trim()) return;
    const key = apiKey || localStorage.getItem('hp_api_key') || '';
    if (!key) { setShowKeyInput(true); return; }

    setAiLoading(true);
    setAiResult(null);
    setAiError('');

    const conditions = profile?.healthConditions?.join(', ') || 'wala';
    const goal = profile?.goal || 'maintain';

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Ikaw ay isang nutritionist na nag-a-analyze ng pagkain ng isang Filipino patient.

Patient info:
- Health conditions: ${conditions}
- Goal: ${goal} weight
- Meal type: ${mealType}

Kinain ng patient: "${aiInput}"

Sagutin mo ito in Taglish (mix ng Tagalog at English). Mag-respond ng JSON lang, walang ibang text:
{
  "foodName": "pangalan ng pagkain (short)",
  "calories": number,
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "feedback": "2-3 sentences na feedback tungkol sa kinain — healthy ba? okay ba para sa kanyang kondisyon? (Taglish)",
  "suggestion": "1 specific na suggestion para mas mapabuti ang meal na ito (Taglish)"
}`
          }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed: AIResult = JSON.parse(clean);
      setAiResult(parsed);
      localStorage.setItem('hp_api_key', key);
    } catch (e: any) {
      setAiError('May error sa AI. Siguraduhing tama ang API key mo.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddAIResult = () => {
    if (!aiResult) return;
    const entry: MealEntry = {
      id: `e${Date.now()}`,
      foodId: `ai-${Date.now()}`,
      foodName: aiResult.foodName,
      servings: 1,
      calories: aiResult.calories,
      mealType,
      date: new Date().toISOString().split('T')[0],
    };
    addMealEntry(currentUser!.id, entry);
    setAiResult(null);
    setAiInput('');
    setAdded('ai-done');
    setTimeout(() => setAdded(null), 2000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Log Food</h1>
        <p className="text-gray-400 text-sm mt-1">I-search ang pagkain o i-describe lang sa AI.</p>
      </div>

      {/* Today's summary */}
      {todayLog && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold text-green-800 mb-2">Today's Summary</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Calories', val: `${todayLog.totalCalories} kcal` },
              { label: 'Meals', val: `${todayLog.meals.length} items` },
              { label: 'Protein', val: `${todayLog.totalProtein}g` },
              { label: 'Carbs', val: `${todayLog.totalCarbs}g` },
            ].map(({ label, val }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-green-700">{val}</p>
                <p className="text-xs text-green-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal type selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {mealTypes.map((type) => (
          <button key={type} onClick={() => setMealType(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
              mealType === type ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'
            }`}>
            {type === 'breakfast' ? '🌅' : type === 'lunch' ? '☀️' : type === 'dinner' ? '🌙' : '🍎'} {type}
          </button>
        ))}
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setAiMode(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            !aiMode ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-200 text-gray-600'
          }`}>
          <Search className="w-4 h-4" /> Search Database
        </button>
        <button onClick={() => setAiMode(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            aiMode ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-200 text-gray-600'
          }`}>
          <Sparkles className="w-4 h-4" /> AI Log
        </button>
      </div>

      {/* AI MODE */}
      {aiMode ? (
        <div className="space-y-4">
          {/* API Key input */}
          {showKeyInput && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-purple-800 mb-2">🔑 I-enter ang Claude API Key</p>
              <p className="text-xs text-purple-600 mb-3">Makukuha sa console.anthropic.com — isang beses mo lang ilalagay, ma-save na.</p>
              <div className="flex gap-2">
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-xxxxxxxx"
                  className="flex-1 border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <button onClick={() => { localStorage.setItem('hp_api_key', apiKey); setShowKeyInput(false); }}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium">
                  Save
                </button>
              </div>
            </div>
          )}

          {/* AI Input */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-purple-600" />
              <p className="font-semibold text-gray-800 text-sm">I-describe ang kinain mo</p>
            </div>
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Halimbawa: Kumain ako ng isang plato ng sinangag na may dalawang pritong itlog at kape na may gatas..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 mb-3"
            />
            <button onClick={handleAILog} disabled={aiLoading || !aiInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50">
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {aiLoading ? 'Ina-analyze ng AI...' : 'Analyze with AI'}
            </button>
          </div>

          {/* AI Error */}
          {aiError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">{aiError}</div>
          )}

          {/* AI Result */}
          {aiResult && (
            <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-purple-600" />
                <p className="font-semibold text-gray-800">AI Analysis Result</p>
              </div>

              {/* Food name */}
              <p className="text-lg font-bold text-gray-900 mb-3">{aiResult.foodName}</p>

              {/* Macros */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Calories', val: `${aiResult.calories}`, unit: 'kcal', color: 'bg-green-50 text-green-700' },
                  { label: 'Protein', val: `${aiResult.protein}`, unit: 'g', color: 'bg-blue-50 text-blue-700' },
                  { label: 'Carbs', val: `${aiResult.carbs}`, unit: 'g', color: 'bg-amber-50 text-amber-700' },
                  { label: 'Fat', val: `${aiResult.fat}`, unit: 'g', color: 'bg-pink-50 text-pink-700' },
                ].map(({ label, val, unit, color }) => (
                  <div key={label} className={`rounded-xl px-3 py-2 text-center ${color}`}>
                    <p className="text-lg font-bold">{val}<span className="text-xs ml-0.5">{unit}</span></p>
                    <p className="text-xs font-medium">{label}</p>
                  </div>
                ))}
              </div>

              {/* AI Feedback */}
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-3">
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">AI Feedback</p>
                <p className="text-sm text-gray-700 leading-relaxed">{aiResult.feedback}</p>
              </div>

              {/* Suggestion */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">💡 Suggestion</p>
                <p className="text-sm text-gray-700 leading-relaxed">{aiResult.suggestion}</p>
              </div>

              <button onClick={handleAddAIResult}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-all">
                <Plus className="w-4 h-4" /> I-log ang pagkain na ito
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Search mode */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Filipino food, e.g. Adobo, Sinigang…"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
          </div>

          {/* Budget filter */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setBudgetOnly(!budgetOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                budgetOnly
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'
              }`}
            >
              <Wallet className="w-4 h-4" />
              Budget-Friendly Foods
            </button>
            {budgetOnly && (
              <span className="text-xs text-amber-600 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                💰 Showing {budgetFoods.length} affordable Filipino meals
              </span>
            )}
          </div>

          {/* Budget banner */}
          {budgetOnly && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">💰 Budget-Friendly Meals</p>
              <p className="text-xs text-amber-700">Mga pagkaing abot-kaya para sa lahat — mula sardinas, tuyo, tokwa, kamote, at iba pa. Masustansya at hindi mahal!</p>
            </div>
          )}

          <div className="space-y-2">
            {filtered.map((food) => (
              <div key={food.id} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg">
                    {food.category === 'Budget Meal' ? '💰' : food.isFilipino ? '🇵🇭' : '🥗'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{food.name}</p>
                    <p className="text-xs text-gray-400">{food.category} · {food.servingSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-700">{food.calories} kcal</p>
                    <p className="text-xs text-gray-400">P:{food.protein}g C:{food.carbs}g F:{food.fat}g</p>
                  </div>
                  <button onClick={() => handleAdd(food)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      added === food.id ? 'bg-green-100 text-green-600' : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}>
                    {added === food.id ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Today's logged meals */}
      {todayLog && todayLog.meals.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-800 mb-3">Today's Logged Meals</h2>
          <div className="space-y-2">
            {todayLog.meals.map((meal) => (
              <div key={meal.id} className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{meal.foodName}</p>
                  <p className="text-xs text-gray-400 capitalize">{meal.mealType}</p>
                </div>
                <span className="text-sm font-semibold text-green-600">{meal.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
