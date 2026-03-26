import { useState, useEffect } from "react";
import {
  getAllFoods,
  searchFoods,
  getFoodsByCategory,
  getTodayLog,
  getMealEntries,
  insertMealEntry,
  upsertDailyLog,
} from "../lib/supabaseService";
import { foodCategories } from "../data/foods";
import { Search, Plus, CheckCircle, Wallet, Loader2 } from "lucide-react";

interface Props {
  user: { id: string } | null;
}

const categoryEmoji: Record<string, string> = {
  Breakfast: "🌅",
  "Rice & Grains": "🍚",
  Poultry: "🍗",
  Meat: "🥩",
  Seafood: "🐟",
  Vegetables: "🥬",
  "Legumes & Eggs": "🥗",
  Fruits: "🍌",
  Snacks: "🍢",
  Desserts: "🍮",
  Dairy: "🥛",
  Drinks: "🥤",
  "Budget Meals": "💰",
};

const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;

export default function HealthData({ user }: Props) {
  const [foods, setFoods] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState<(typeof mealTypes)[number]>("lunch");
  const [added, setAdded] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [budgetOnly, setBudgetOnly] = useState(false);
  const [todayLog, setTodayLog] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  // Load initial foods + today's log
  useEffect(() => {
    if (!user) return;
    Promise.all([
      getAllFoods().then(setFoods),
      getTodayLog(user.id, today).then(setTodayLog),
      getMealEntries(user.id, today).then(setMeals),
    ]).finally(() => setLoading(false));
  }, [user]);

  // Search handler with debounce
  useEffect(() => {
    if (!search.trim()) {
      if (activeCategory === "All") {
        getAllFoods().then(setFoods);
      } else {
        getFoodsByCategory(activeCategory).then(setFoods);
      }
      return;
    }
    const timer = setTimeout(() => {
      searchFoods(search).then((results) => {
        if (activeCategory !== "All") {
          setFoods(results.filter((f: any) => f.category === activeCategory));
        } else {
          setFoods(results);
        }
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeCategory]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setBudgetOnly(cat === "Budget Meals");
    setSearch("");
    if (cat === "All") {
      getAllFoods().then(setFoods);
    } else {
      getFoodsByCategory(cat).then(setFoods);
    }
  };

  const handleAdd = async (food: any) => {
    if (!user) return;
    const newCalories = (todayLog?.total_calories || 0) + food.calories;
    const newProtein = (todayLog?.total_protein || 0) + food.protein;
    const newCarbs = (todayLog?.total_carbs || 0) + food.carbs;
    const newFat = (todayLog?.total_fat || 0) + food.fat;

    const updatedLog = await upsertDailyLog({
      user_id: user.id,
      date: today,
      total_calories: newCalories,
      total_protein: newProtein,
      total_carbs: newCarbs,
      total_fat: newFat,
    });
    setTodayLog(updatedLog);

    await insertMealEntry({
      user_id: user.id,
      log_id: updatedLog?.id,
      food_id: food.id,
      food_name: food.name,
      servings: 1,
      calories: food.calories,
      meal_type: mealType,
      date: today,
    });

    setMeals((prev) => [
      ...prev,
      { food_name: food.name, calories: food.calories, meal_type: mealType },
    ]);
    setAdded(food.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const displayed = foods.slice(0, 40);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Log Food
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Search from our food database and log your meals.
        </p>
      </div>

      {/* Today's summary */}
      {todayLog && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5">
          <p className="text-sm font-semibold text-green-800 mb-2">
            Today's Summary
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Calories", val: `${todayLog.total_calories} kcal` },
              { label: "Meals", val: `${meals.length} items` },
              {
                label: "Protein",
                val: `${Math.round(todayLog.total_protein)}g`,
              },
              { label: "Carbs", val: `${Math.round(todayLog.total_carbs)}g` },
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
          <button
            key={type}
            onClick={() => setMealType(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
              mealType === type
                ? "bg-green-600 text-white border-green-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
            }`}
          >
            {type === "breakfast"
              ? "🌅"
              : type === "lunch"
                ? "☀️"
                : type === "dinner"
                  ? "🌙"
                  : "🍎"}{" "}
            {type}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search any food e.g. Adobo, Rice, Milk Tea..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => handleCategoryClick("All")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            activeCategory === "All"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
          }`}
        >
          🍽️ All
        </button>
        {foodCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeCategory === cat
                ? cat === "Budget Meals"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-green-600 text-white border-green-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
            }`}
          >
            {categoryEmoji[cat] || "🍴"} {cat}
          </button>
        ))}
      </div>

      {/* Budget banner */}
      {activeCategory === "Budget Meals" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
          <Wallet className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              💰 Budget-Friendly Meals
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Masustansya at abot-kaya para sa lahat!
            </p>
          </div>
        </div>
      )}

      {/* Results info */}
      <p className="text-xs text-gray-400 mb-3">
        {loading
          ? "Loading foods..."
          : `Showing ${displayed.length} of ${foods.length} results${activeCategory !== "All" ? ` in ${activeCategory}` : ""}${search ? ` for "${search}"` : ""}`}
      </p>

      {/* Food list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-gray-500 font-medium">Walang nahanap.</p>
              <p className="text-gray-400 text-sm mt-1">
                Try a different search or category.
              </p>
            </div>
          ) : (
            displayed.map((food) => (
              <div
                key={food.id}
                className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg shrink-0">
                    {categoryEmoji[food.category] || "🍴"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {food.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {food.category} · {food.serving_size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-700">
                      {food.calories} kcal
                    </p>
                    <p className="text-xs text-gray-400">
                      P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdd(food)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      added === food.id
                        ? "bg-green-100 text-green-600"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {added === food.id ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Today's logged meals */}
      {meals.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-800 mb-3">
            Today's Logged Meals
          </h2>
          <div className="space-y-2">
            {meals.map((meal, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {meal.food_name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {meal.meal_type}
                  </p>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {meal.calories} kcal
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
