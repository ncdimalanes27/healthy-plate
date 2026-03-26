import { supabase } from './supabase';

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string, name: string, role: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      name,
      role,
    });
    if (profileError) throw profileError;
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ─── PROFILES ────────────────────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

export async function upsertProfile(profile: any) {
  const { error } = await supabase.from('profiles').upsert(profile);
  if (error) throw error;
}

export async function getAllPatients() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'patient');
  if (error) throw error;
  return data || [];
}

// ─── DAILY LOGS ──────────────────────────────────────────────────────────────

export async function getLogsForUser(userId: string) {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getTodayLog(userId: string, date: string) {
  const { data } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();
  return data;
}

export async function upsertDailyLog(log: any) {
  const { data, error } = await supabase
    .from('daily_logs')
    .upsert(log, { onConflict: 'user_id,date' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── MEAL ENTRIES ─────────────────────────────────────────────────────────────

export async function getMealEntries(userId: string, date: string) {
  const { data, error } = await supabase
    .from('meal_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date);
  if (error) return [];
  return data || [];
}

export async function insertMealEntry(entry: any) {
  const { error } = await supabase.from('meal_entries').insert(entry);
  if (error) throw error;
}

// ─── MEAL PLANS ──────────────────────────────────────────────────────────────

export async function getMealPlans(userId: string) {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function insertMealPlan(plan: any) {
  const { error } = await supabase.from('meal_plans').insert(plan);
  if (error) throw error;
}

export async function deleteMealPlan(planId: string) {
  const { error } = await supabase.from('meal_plans').delete().eq('id', planId);
  if (error) throw error;
}

export async function renameMealPlan(planId: string, newName: string) {
  const { error } = await supabase.from('meal_plans').update({ name: newName }).eq('id', planId);
  if (error) throw error;
}

// ─── DIETICIAN NOTES ─────────────────────────────────────────────────────────

export async function getNotesForPatient(patientId: string) {
  const { data, error } = await supabase
    .from('dietician_notes')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function insertNote(note: any) {
  const { error } = await supabase.from('dietician_notes').insert(note);
  if (error) throw error;
}

export async function deleteNote(noteId: string) {
  const { error } = await supabase.from('dietician_notes').delete().eq('id', noteId);
  if (error) throw error;
}

// ─── ASSIGNED PLANS ──────────────────────────────────────────────────────────

export async function getAssignedPlansForPatient(patientId: string) {
  const { data, error } = await supabase
    .from('assigned_plans')
    .select('*')
    .eq('patient_id', patientId)
    .order('assigned_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function insertAssignedPlan(plan: any) {
  const { error } = await supabase.from('assigned_plans').insert(plan);
  if (error) throw error;
}

// ─── FOODS ───────────────────────────────────────────────────────────────────

export async function getAllFoods() {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .order('category', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function searchFoods(query: string) {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
    .order('name', { ascending: true })
    .limit(50);
  if (error) return [];
  return data || [];
}

export async function getFoodsByCategory(category: string) {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('category', category)
    .order('name', { ascending: true });
  if (error) return [];
  return data || [];
}

// Helper to calculate calories from Supabase profile data
export function calcTargetFromProfile(p: any): number {
  if (!p?.weight || !p?.height || !p?.age) return 2000;
  const profile = {
    userId: p.id || '',
    weight: p.weight,
    height: p.height,
    age: p.age,
    gender: p.gender || 'female',
    activityLevel: p.activity_level || 'moderate',
    healthConditions: p.health_conditions || [],
    allergies: p.allergies || [],
    goal: p.goal || 'maintain',
  };
  // Mifflin-St Jeor
  let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
  bmr += profile.gender === 'male' ? 5 : -161;
  const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
  const tdee = Math.round(bmr * (multipliers[profile.activityLevel] || 1.55));
  if (profile.goal === 'lose') return tdee - 500;
  if (profile.goal === 'gain') return tdee + 300;
  return tdee;
}
