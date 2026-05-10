import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Profile, DailyLog } from '../types';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Activity, Scale, TrendingUp, Calendar, Zap } from 'lucide-react';

export default function HealthMonitoring({ profile }: { profile: Profile | null }) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    // FIX: Kung wala pang profile, itigil ang loading para hindi ma-stuck
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', profile.id)
        .order('date', { ascending: true })
        .limit(7);

      if (error) throw error;
      if (data) setLogs(data as DailyLog[]);
    } catch (err) {
      console.error('Error fetching health logs:', err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Loading State UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="animate-spin h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full"></div>
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40" size={16} />
        </div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Analyzing health trends...</p>
      </div>
    );
  }

  // Guard clause para sa missing profile data pagkatapos ng loading
  if (!profile) return null;

  const avgCalories = logs.length > 0 
    ? Math.round(logs.reduce((acc, curr) => acc + (curr.total_calories || 0), 0) / logs.length) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 max-w-6xl mx-auto pb-10"
    >
      {/* Header Section */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
          <Zap size={14} className="fill-primary" />
          <span>Health Insights</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Your <span className="gradient-text">Progress</span> Dashboard
        </h1>
        <p className="text-slate-500 font-medium">Visual breakdown ng iyong nutrition at weight trends.</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: 'Avg. Calories', 
            value: avgCalories, 
            unit: 'kcal', 
            icon: <Activity size={20} />, 
            color: 'text-orange-500', 
            bg: 'bg-orange-50' 
          },
          { 
            title: 'Current Weight', 
            value: profile.weight || '--', 
            unit: 'kg', 
            icon: <Scale size={20} />, 
            color: 'text-blue-500', 
            bg: 'bg-blue-50' 
          },
          { 
            title: 'Logs this week', 
            value: logs.length, 
            unit: 'days', 
            icon: <Calendar size={20} />, 
            color: 'text-emerald-500', 
            bg: 'bg-emerald-50' 
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border-none shadow-xl shadow-slate-200/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                {stat.icon}
              </div>
              <h3 className="font-black text-slate-300 uppercase text-[10px] tracking-widest">{stat.title}</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 border-none shadow-2xl shadow-slate-200/60"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg tracking-tight">Calorie Intake Trend</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Last 7 recorded entries</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Syncing</span>
          </div>
        </div>

        <div className="h-80 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
                tick={{fontSize: 10, fill: '#cbd5e1', fontWeight: 800}}
                dy={15}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{fontSize: 10, fill: '#cbd5e1', fontWeight: 800}} 
              />
              <Tooltip 
                cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                contentStyle={{ 
                  borderRadius: '1.25rem', 
                  border: 'none', 
                  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                  padding: '1.25rem',
                  fontWeight: 'bold'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="total_calories" 
                stroke="#10b981" 
                strokeWidth={5}
                fill="url(#colorCal)" 
                animationDuration={2500}
                dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Suggestion Footer */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black tracking-tight">Keep it up, {profile.name?.split(' ')[0]}! 🥗</h3>
            <p className="text-slate-400 text-sm font-medium max-w-md leading-relaxed">
              Ang pag-monitor ng iyong kinakain ay ang unang step sa mas malusog na pamumuhay. Balikan ang iyong meal plan kung kailangan ng gabay.
            </p>
          </div>
          <button className="bg-primary hover:bg-emerald-400 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-2xl shadow-primary/40 whitespace-nowrap">
            View Meal Plan
          </button>
        </div>
      </div>
    </motion.div>
  );
}