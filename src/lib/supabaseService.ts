import { supabase } from './supabase';
import type { Profile, DailyLog, Food, DieticianNote, MealPlan } from '../types';

export const supabaseService = {
  // --- Profile Operations ---
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Ginawa nating maybeSingle para hindi mag-error agad kung bago ang user

      if (error) throw error;
      return { data: data as Profile, error: null };
    } catch (error: any) {
      console.error('Error in getProfile:', error.message);
      return { data: null, error };
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Profile, error: null };
    } catch (error: any) {
      console.error('Error in updateProfile:', error.message);
      return { data: null, error };
    }
  },

  // --- Food Operations ---
  async getFoods() {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return { data: data as Food[], error: null };
    } catch (error: any) {
      console.error('Error in getFoods:', error.message);
      return { data: [], error };
    }
  },

  // --- Logging Operations ---
  async getTodayLog(userId: string, date: string) {
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*, foods(*)') // Sinama natin ang food details para sa history
        .eq('user_id', userId)
        .eq('date', date);

      if (error) throw error;
      return { data: data as any[], error: null };
    } catch (error: any) {
      console.error('Error in getTodayLog:', error.message);
      return { data: [], error };
    }
  },

  async upsertDailyLog(log: Partial<DailyLog>) {
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .upsert(log, { onConflict: 'user_id, date' })
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error in upsertDailyLog:', error.message);
      return { data: null, error };
    }
  },

  // --- Dietitian Operations ---
  async getAllPatients() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient')
        .order('name', { ascending: true });

      if (error) throw error;
      return { data: data as Profile[], error: null };
    } catch (error: any) {
      console.error('Error in getAllPatients:', error.message);
      return { data: [], error };
    }
  },

  async sendNote(note: Partial<DieticianNote>) {
    try {
      const { data, error } = await supabase
        .from('dietician_notes')
        .insert([note])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error in sendNote:', error.message);
      return { data: null, error };
    }
  },

  // --- Meal Plan Operations (Dagdag para sa Dashboard) ---
  async getMealPlan(userId: string) {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('patient_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return { data: data as MealPlan, error: null };
    } catch (error: any) {
      console.error('Error in getMealPlan:', error.message);
      return { data: null, error };
    }
  },

  async assignMealPlan(plan: Partial<MealPlan>) {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert([plan])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error in assignMealPlan:', error.message);
      return { data: null, error };
    }
  }
};