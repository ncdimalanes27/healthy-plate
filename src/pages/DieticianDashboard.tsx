import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { calculateBMI, getBMICategory, calculateTargetCalories } from '../utils/calculations';
import type { Profile } from '../types';
import { Search, ChevronDown, ChevronUp, ClipboardList, Users, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DieticianDashboard() {
  const [patients, setPatients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState(''); // Dinagdag ang missing search state
  const [error, setError] = useState<string | null>(null);

  // Fix para sa "setState in effect" warning: naka-wrap sa useCallback
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      
      setPatients(data || []);
    } catch (err: any) {
      console.error('Error fetching patients:', err);
      setError(err.message || 'Hindi makuha ang listahan ng mga pasyente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Filtering Logic
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Patient Data...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
            <Users size={18} />
            <span>Management</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Patient <span className="gradient-text">Directory</span>
          </h1>
          <p className="text-slate-500 font-medium">Monitor and manage your patients' health journey.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 pl-12 pr-4 py-3.5 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-slate-600"
          />
        </div>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm border border-red-100">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Patient List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => {
            const bmi = patient.weight && patient.height ? calculateBMI(patient.weight, patient.height) : null;
            const bmiCategory = bmi ? getBMICategory(bmi) : null;
            const target = calculateTargetCalories(patient);
            const isExpanded = expandedId === patient.id;

            return (
              <motion.div 
                layout
                key={patient.id} 
                className={`glass-card overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'ring-2 ring-primary/20 shadow-2xl' : 'hover:shadow-xl hover:shadow-slate-200/50'
                }`}
              >
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : patient.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-black text-xl shadow-inner border border-white">
                      {patient.name[0]}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg tracking-tight">{patient.name}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{patient.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Health Level</p>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                        bmiCategory === 'Normal' ? 'text-emerald-600 bg-emerald-50' : 'text-orange-600 bg-orange-50'
                      }`}>
                        {bmiCategory || 'Pending'}
                      </span>
                    </div>
                    <div className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-primary text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-5 pb-6 border-t border-slate-50 bg-slate-50/30"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6">
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Body Metrics</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-black uppercase">Weight</p>
                            <p className="font-black text-slate-700 text-sm">{patient.weight || '--'} <span className="text-[10px] font-bold text-slate-400">kg</span></p>
                          </div>
                          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-black uppercase">Height</p>
                            <p className="font-black text-slate-700 text-sm">{patient.height || '--'} <span className="text-[10px] font-bold text-slate-400">cm</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">BMI Analytics</h4>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Index Score</p>
                            <p className="font-black text-2xl text-slate-800 tracking-tighter">{bmi || '--'}</p>
                          </div>
                          <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase shadow-sm ${
                            bmiCategory === 'Normal' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                          }`}>
                            {bmiCategory || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Medical Context</h4>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-h-[76px]">
                          <p className="text-[10px] text-slate-400 font-black uppercase mb-2">Conditions/Allergies</p>
                          <div className="flex flex-wrap gap-1.5">
                            {patient.health_conditions && patient.health_conditions.length > 0 ? (
                              patient.health_conditions.map((c) => (
                                <span key={c} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-black uppercase tracking-tight border border-slate-200">
                                  {c}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-300 font-bold italic">No records</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-end">
                        <Link 
                          to="/dietitian/progress" 
                          className="w-full bg-slate-900 text-white text-center py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                        >
                          <ClipboardList size={16} />
                          Full Progress
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-slate-200" size={40} />
            </div>
            <h3 className="text-slate-900 font-black text-lg uppercase tracking-tight">No Patients Found</h3>
            <p className="text-slate-400 font-medium text-sm">Walang nahanap na record para sa "{search}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}