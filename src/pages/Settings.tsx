import React from 'react';
import { motion } from 'framer-motion'; // In-import para sa smooth transitions
import type { Profile } from '../types';
import { LogOut, Shield, Bell, Database, ArrowRight, User, Mail, Sparkles } from 'lucide-react';

interface SettingsProps {
  profile: Profile | null;
  onLogout: () => void;
}

export default function Settings({ profile, onLogout }: SettingsProps) {
  const handleClearCache = () => {
    if (profile) {
      localStorage.removeItem(`hp_u_${profile.id}`);
      alert("Local cache cleared!");
      window.location.reload();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8 pb-10"
    >
      {/* Header with Glass Effect */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 font-medium">Manage your account and app preferences</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-2xl text-primary">
          <Sparkles size={24} />
        </div>
      </header>

      {/* Profile Card - Premium Look */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="p-8 bg-linear-to-br from-primary/5 to-transparent border-b border-slate-50">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-primary text-white rounded-[1.8rem] flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/20">
                {profile?.name?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm border border-slate-50">
                <div className="bg-emerald-500 w-3 h-3 rounded-full border-2 border-white"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 leading-tight">{profile?.name}</h2>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-tighter">
                  {profile?.role}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Mail size={14} />
                <p className="text-sm font-medium">{profile?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Options List */}
        <div className="p-4 space-y-2">
          <div className="px-4 py-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">General Preferences</h3>
          </div>
          
          <SettingItem 
            icon={Bell} 
            title="Notifications" 
            description="Manage email and push alerts"
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
          />
          <SettingItem 
            icon={Shield} 
            title="Privacy & Security" 
            description="Update password and data sharing"
            iconColor="text-emerald-500"
            iconBg="bg-emerald-50"
          />
          
          <button 
            onClick={handleClearCache}
            className="w-full flex items-center justify-between hover:bg-slate-50 p-4 rounded-[1.5rem] transition-all group"
          >
            <div className="flex gap-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl group-hover:scale-110 transition-transform">
                <Database size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">Clear Cache</p>
                <p className="text-xs text-slate-400 font-medium">Refresh locally stored profile data</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Sign Out Section */}
        <div className="p-4 bg-slate-50/50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-white text-red-500 border border-red-100 font-black py-4 rounded-[1.5rem] hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 shadow-sm"
          >
            <LogOut size={20} />
            Sign Out Account
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Healthy Plate v1.0.2 • Capstone Project</p>
      </div>
    </motion.div>
  );
}

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
}

function SettingItem({ icon: Icon, title, description, iconColor, iconBg }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-4 rounded-[1.5rem] transition-all group">
      <div className="flex gap-4">
        <div className={`p-3 ${iconBg} ${iconColor} rounded-2xl group-hover:scale-110 transition-transform`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="font-bold text-slate-900">{title}</p>
          <p className="text-xs text-slate-400 font-medium">{description}</p>
        </div>
      </div>
      <ArrowRight size={18} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  );
}