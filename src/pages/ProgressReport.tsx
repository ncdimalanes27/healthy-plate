import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { calculateBMI, calculateTargetCalories } from '../utils/calculations';
import type { Profile } from '../types';
import { AlertTriangle, CheckCircle, ArrowRight, FileText, ClipboardCheck, Search } from 'lucide-react';

interface PatientStats extends Profile {
  avgIntake: number;
  status: 'On track' | 'Needs attention' | 'Stable';
}

export default function ProgressReport() {
  const [reportData, setReportData] = useState<PatientStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Kunin lahat ng patients
      const { data: patients, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient')
        .order('name', { ascending: true });
      
      if (pError) throw pError;

      if (patients) {
        // 2. Fetch logs parallelized but with safety
        const fullStats = await Promise.all(patients.map(async (p) => {
          try {
            const { data: logs, error: lError } = await supabase
              .from('daily_logs')
              .select('total_calories')
              .eq('user_id', p.id)
              .order('date', { ascending: false })
              .limit(7);

            if (lError) throw lError;

            const avgIntake = logs && logs.length > 0 
              ? Math.round(logs.reduce((acc, curr) => acc + (curr.total_calories || 0), 0) / logs.length) 
              : 0;
            
            const target = calculateTargetCalories(p);
            let status: 'On track' | 'Needs attention' | 'Stable' = 'Stable';
            
            if (avgIntake > 0) {
              // Status Logic: ±15% threshold
              const upperThreshold = target + 200;
              const lowerThreshold = target - 300;
              status = avgIntake > upperThreshold || avgIntake < lowerThreshold ? 'Needs attention' : 'On track';
            }

            return { ...p, avgIntake, status };
          } catch (err) {
            console.error(`Error fetching logs for ${p.name}:`, err);
            return { ...p, avgIntake: 0, status: 'Stable' as const };
          }
        }));
        
        setReportData(fullStats as PatientStats[]);
      }
    } catch (err) {
      console.error('Major error in ProgressReport:', err);
    } finally {
      setLoading(false); // Siguradong mamamatay ang spinner
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Search filter
  const filteredPatients = reportData.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="relative">
          <div className="animate-spin h-14 w-14 border-[5px] border-primary/10 border-t-primary rounded-full"></div>
          <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/30" size={20} />
        </div>
        <div className="text-center space-y-1">
          <p className="text-slate-900 font-black text-sm uppercase tracking-widest">Generating Reports</p>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Syncing patient telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-10"
    >
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <ClipboardCheck size={14} className="fill-primary/20" />
            <span>Clinical Analytics</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Patient <span className="gradient-text">Progress</span>
          </h1>
          <p className="text-slate-500 font-medium">Real-time health monitoring and intervention tracking.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border-none rounded-2xl text-sm font-bold shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-primary/20 w-full sm:w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20">
            <FileText size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-6">Patient Identifier</th>
                <th className="px-6 py-6">BMI</th>
                <th className="px-6 py-6 text-center">Target</th>
                <th className="px-6 py-6 text-center">7-Day Avg</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-8 py-6 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map((p, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={p.id} 
                  className="hover:bg-slate-50/80 transition-all group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-black text-sm shadow-inner">
                        {p.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 group-hover:text-primary transition-colors tracking-tight">{p.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.role} ID: {p.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {p.weight && p.height ? (
                      <div className="flex flex-col gap-1">
                         <span className="text-sm font-black text-slate-700">{calculateBMI(p.weight, p.height)}</span>
                         <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-primary/40"></div>
                         </div>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic text-xs font-bold uppercase">No Metrics</span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                      {calculateTargetCalories(p)} <span className="text-[10px] opacity-60">kcal</span>
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`text-sm font-black ${p.avgIntake > calculateTargetCalories(p) + 200 ? 'text-orange-500' : 'text-emerald-600'}`}>
                      {p.avgIntake || '0'} 
                      <span className="ml-1 text-[10px] opacity-50 font-bold uppercase">kcal</span>
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest w-fit shadow-sm ${
                      p.status === 'On track' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 
                      p.status === 'Needs attention' ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {p.status === 'On track' ? <CheckCircle size={14} className="fill-emerald-600/10"/> : <AlertTriangle size={14} className="fill-orange-600/10"/>}
                      {p.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
                      <ArrowRight size={20} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Modern Empty State */}
        {filteredPatients.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-slate-50 text-slate-300">
              <Search size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-black text-sm uppercase tracking-[0.2em]">No Patients Found</p>
              <p className="text-slate-400 text-xs font-medium">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </div>

      {/* Insight Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem] flex items-start gap-5">
           <div className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
              <CheckCircle size={24} />
           </div>
           <div>
              <h4 className="text-slate-900 font-black text-lg tracking-tight">Compliance Rate</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                 {Math.round((reportData.filter(p => p.status === 'On track').length / reportData.length) * 100) || 0}% ng iyong mga pasyente ay on-track sa kanilang calorie goals ngayong linggo.
              </p>
           </div>
        </div>
        
        <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-start gap-5 text-white">
           <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-xl shadow-orange-500/20">
              <AlertTriangle size={24} />
           </div>
           <div>
              <h4 className="font-black text-lg tracking-tight">Critical Interventions</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                 Mayroong {reportData.filter(p => p.status === 'Needs attention').length} pasyente na kailangang i-review ang meal plan dahil sa consistent calorie deviation.
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}