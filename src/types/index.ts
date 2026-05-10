export type UserRole = 'patient' | 'dietitian';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age?: number;
  gender?: 'Male' | 'Female';
  height?: number;
  weight?: number;
  activity_level?: string;
  health_conditions: string[];
  allergies: string[];
  goal?: 'Lose Weight' | 'Maintain' | 'Gain Weight';
  created_at: string;
}

export interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  serving_size: string;
  is_filipino: boolean;
}

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  weight?: number;
  blood_sugar?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
}