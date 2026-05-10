import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { motion } from 'framer-motion'; // For animations
import { Send, Utensils, Target, Calendar, Sparkles } from 'lucide-react';

export default function AssignMealPlan() {
  const [patients, setPatients] = useState<Profile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [targetCalories, setTargetCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'patient');
      if (data) setPatients(data);
    };
    fetchPatients();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return alert('Pumili muna ng pasyente');
    setLoading(true);
    try {
      const { error } = await supabase.from('meal_plans').insert([{
        patient_id: selectedPatient,
        target_calories: parseInt(targetCalories),
        notes: notes,
        assigned_at: new Date().toISOString()
      }]);
      if (error) throw error;
      alert('Meal plan assigned successfully!');
      setTargetCalories('');
      setNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto space-y-8 p-4 md:p-8"
    >
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
          <Sparkles size={16} />
          <span>Dietitian Tools</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Assign <span className="gradient-text">Health Plan</span>
        </h1>
        <p className="text-slate-500 text-lg">I-personalize ang goals ng iyong mga pasyente.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Card */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          
          <form onSubmit={handleAssign} className="relative space-y-6">
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Pasyente</label>
              <select 
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-0 transition-all font-medium text-slate-600 outline-none"
              >
                <option value="">Pumili ng pasyente...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Calorie Target</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                    <Target size={20} />
                  </div>
                  <input
                    type="number"
                    placeholder="e.g. 1800"
                    value={targetCalories}
                    onChange={(e) => setTargetCalories(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Plan Period</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Calendar size={20} />
                  </div>
                  <input
                    type="text"
                    value="Weekly Plan"
                    disabled
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 border-none font-medium text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mga Paalala at Instructions</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Iwasan ang maaalat, uminom ng maraming tubig..."
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-medium"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <><Send size={20} /> I-send ang Plan sa Pasyente</>
              )}
            </motion.button>
          </form>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-primary p-8 rounded-[2.5rem] text-white shadow-lg shadow-primary/20 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
               <Utensils size={120} />
            </div>
            <h3 className="font-bold text-xl mb-2 relative z-10">Pro Tip</h3>
            <p className="text-primary-light text-sm leading-relaxed relative z-10">
              Ang pagbibigay ng specific na calorie target ay nakakatulong sa pasyente na maging mas disiplinado sa pagkain.
            </p>
          </motion.div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
               <Target size={24} />
             </div>
             <h3 className="font-bold text-slate-900">Activity Levels</h3>
             <ul className="mt-4 space-y-3 text-sm text-slate-500">
               <li className="flex justify-between"><span>Sedentary:</span> <span className="font-bold">x1.2</span></li>
               <li className="flex justify-between"><span>Moderate:</span> <span className="font-bold">x1.5</span></li>
               <li className="flex justify-between"><span>Active:</span> <span className="font-bold">x1.9</span></li>
             </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}