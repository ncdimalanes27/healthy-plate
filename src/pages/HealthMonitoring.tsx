import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, DailyLog } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Activity, Scale, Droplets, TrendingUp } from 'lucide-react';

export default function HealthMonitoring({ profile }: { profile: Profile }) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!profile?.id) return;
    try {
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

  if (loading) {
    return <div className="text-center py-10 text-gray-400">Loading health data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold font-serif">Health Monitoring</h1>
        <p className="text-gray-500">Track your vitals and nutritional progress over the last 7 days</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Scale size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Current Weight</p>
            <p className="text-xl font-bold">{profile?.weight || '--'} kg</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Avg. Calories</p>
            <p className="text-xl font-bold">
              {logs.length > 0 
                ? Math.round(logs.reduce((acc, curr) => acc + (curr.total_calories || 0), 0) / logs.length) 
                : '--'} kcal
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Log Consistency</p>
            <p className="text-xl font-bold">{logs.length} / 7 Days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Scale className="text-blue-500" size={20} />
            <h3 className="font-bold">Weight Progress (kg)</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
                  tick={{fontSize: 12, fill: '#9ca3af'}}
                />
                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Droplets className="text-orange-500" size={20} />
            <h3 className="font-bold">Calorie Intake (kcal)</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={logs}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
                  tick={{fontSize: 12, fill: '#9ca3af'}}
                />
                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total_calories" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorCal)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}