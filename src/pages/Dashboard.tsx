import { useEffect, useState, useCallback } from 'react';
import { Activity, Scale, Droplets, Zap, Heart } from 'lucide-react';
import { calculateBMI, calculateTargetCalories, getBMICategory } from '../utils/calculations';
import type { Profile, DailyLog } from '../types';
import { supabase } from '../lib/supabase';

// 1. Interface para sa StatCard Props
interface StatCardProps {
  label: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  color: string;
}

export default function Dashboard({ profile }: { profile: Profile }) {
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  
  const target = calculateTargetCalories(profile);
  const bmiValue = profile.weight && profile.height ? calculateBMI(profile.weight, profile.height) : 0;
  const bmiCategory = getBMICategory(bmiValue);

  // 2. Wrap fetch logic in useCallback para maiwasan ang render loop
  const fetchTodayLog = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', profile.id)
        .eq('date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      if (data) setTodayLog(data);
    } catch (err) {
      console.error('Error fetching today\'s log:', err);
    } finally {
      setLoading(false);
    }
  }, [profile.id]);

  useEffect(() => {
    fetchTodayLog();
  }, [fetchTodayLog]);

  const percentage = todayLog ? Math.min(Math.round((todayLog.total_calories / target) * 100), 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <header>
        <p className="text-green-600 font-bold uppercase text-xs tracking-widest">Health Overview</p>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Kumusta, <span className="text-green-600">{profile.name.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-gray-400 font-medium mt-1">
          {new Date().toLocaleDateString('en-PH', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calorie Progress Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest self-start mb-6">Today's Calories</h3>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-50" />
              <circle 
                cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={452.4} 
                strokeDashoffset={452.4 - (452.4 * percentage) / 100}
                strokeLinecap="round"
                className="text-green-500 transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-black block text-gray-900">{todayLog?.total_calories || 0}</span>
              <span className="text-gray-400 text-[10px] font-bold uppercase">/ {target} kcal</span>
            </div>
          </div>
          
          <div className="mt-8 w-full space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                <span className="text-gray-400">Protein Progress</span>
                <span className="text-gray-900">{todayLog?.total_protein || 0}g</span>
              </div>
              <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                <div 
                  className="h-full bg-blue-500 transition-all duration-700" 
                  style={{ width: `${Math.min(((todayLog?.total_protein || 0) / 150) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard 
            label="BMI Status" 
            value={bmiValue.toFixed(1)} 
            subValue={bmiCategory} 
            icon={Scale} 
            color="bg-emerald-50 text-emerald-500" 
          />
          <StatCard 
            label="Daily Target" 
            value={`${target}`} 
            subValue="Kcal Goal" 
            icon={Zap} 
            color="bg-orange-50 text-orange-500" 
          />
          <StatCard 
            label="Blood Sugar" 
            value={todayLog?.blood_sugar ? `${todayLog.blood_sugar} mg/dL` : "-- mg/dL"} 
            subValue="Latest Reading" 
            icon={Droplets} 
            color="bg-purple-50 text-purple-500" 
          />
          <StatCard 
            label="Blood Pressure" 
            value={todayLog?.blood_pressure_systolic ? `${todayLog.blood_pressure_systolic}/${todayLog.blood_pressure_diastolic}` : "--/--"} 
            subValue="mmHg" 
            icon={Heart} 
            color="bg-red-50 text-red-500" 
          />
        </div>
      </div>
      
      {/* Conditions Section */}
      {profile.health_conditions && profile.health_conditions.length > 0 && (
        <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-[2rem] flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg shadow-orange-100 w-fit">
            <Activity size={24} />
          </div>
          <div>
            <h4 className="text-orange-900 font-black text-xs uppercase tracking-widest mb-1">
              Medical Alerts & Conditions
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.health_conditions.map((c: string) => (
                <span key={c} className="bg-white/80 backdrop-blur-sm border border-orange-200 px-3 py-1 rounded-xl text-[10px] text-orange-700 font-black uppercase tracking-tight">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, subValue, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow group">
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black mt-1 text-gray-900 tracking-tight group-hover:text-green-600 transition-colors">{value}</p>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter mt-0.5">{subValue}</p>
      </div>
      <div className={`p-4 rounded-2xl shadow-inner transition-transform group-hover:scale-110 ${color}`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
    </div>
  );
}