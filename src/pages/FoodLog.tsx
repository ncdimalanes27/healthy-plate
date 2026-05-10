import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Food, Profile } from '../types';
import { Search, Plus, Utensils, Sparkles } from 'lucide-react';

export default function FoodLog({ profile }: { profile: Profile }) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('foods').select('*');
      if (data) setFoods(data as Food[]);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const addFoodToLog = async (food: Food) => {
    setLogging(true);
    try {
      const { error } = await supabase.from('daily_logs').insert([{
        user_id: profile.id,
        food_id: food.id,
        total_calories: food.calories,
        date: new Date().toISOString().split('T')[0]
      }]);
      if (error) throw error;
      // Pwedeng palitan ito ng custom toast notification sa future
      alert(`Added ${food.name} to your log!`);
    } catch (err) {
      console.error(err);
    } finally {
      setLogging(false);
    }
  };

  const filteredFoods = foods.filter((f: Food) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Header & Search Section */}
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
          <Utensils size={16} />
          <span>Nutrition Tracker</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            What did you <span className="gradient-text">eat today?</span>
          </h1>
        </div>

        <div className="glass-card p-2 md:p-3 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search foods (e.g. Adobo, Sinigang, Rice)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-[1.5rem] bg-slate-50/50 border-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium text-slate-600"
            />
          </div>
          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto px-2">
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center py-20 space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-slate-400 font-medium tracking-wide">Fetching food database...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredFoods.map((food: Food, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                key={food.id}
                className="glass-card p-5 group flex justify-between items-center transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">
                        {food.name}
                      </h3>
                      {food.is_filipino && (
                        <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter">
                          <Sparkles size={10} /> Pinoy
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                      {food.serving_size} • {food.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-orange-50 px-3 py-1.5 rounded-xl">
                      <span className="text-sm font-black text-orange-600">{food.calories} kcal</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Prot</p>
                        <p className="text-xs font-bold text-slate-600">{food.protein}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Carb</p>
                        <p className="text-xs font-bold text-slate-600">{food.carbs}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Fat</p>
                        <p className="text-xs font-bold text-slate-600">{food.fat}g</p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => addFoodToLog(food)}
                  disabled={logging}
                  className="h-14 w-14 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200 group-hover:bg-primary group-hover:shadow-primary/30 transition-all disabled:opacity-50"
                >
                  {logging ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Plus size={24} strokeWidth={3} />
                  )}
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Empty State */}
      {!loading && filteredFoods.length === 0 && (
        <div className="text-center py-20 glass-card">
          <Search size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No results found</h3>
          <p className="text-slate-500">Subukan i-search ang ibang pagkain o i-check ang category.</p>
        </div>
      )}
    </motion.div>
  );
}