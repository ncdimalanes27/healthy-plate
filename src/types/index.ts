export type UserRole = 'patient' | 'dietician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface HealthProfile {
  userId: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  healthConditions: string[];
  allergies: string[];
  goal: 'lose' | 'maintain' | 'gain';
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  isFilipino?: boolean;
}

export interface MealEntry {
  id: string;
  foodId: string;
  foodName: string;
  servings: number;
  calories: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

export interface DailyLog {
  date: string;
  meals: MealEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  weight?: number;
  bloodSugar?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
}

export interface MealPlan {
  id: string;
  name: string;
  targetCalories: number;
  days: MealPlanDay[];
  createdAt: string;
}

export interface MealPlanDay {
  day: string;
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snack: FoodItem[];
  totalCalories: number;
}

export interface Patient {
  user: User;
  profile: HealthProfile;
  recentLogs: DailyLog[];
}

export interface DieticianNote {
  id: string;
  dieticianId: string;
  dieticianName: string;
  patientId: string;
  content: string;
  category: 'recommendation' | 'warning' | 'progress' | 'general';
  createdAt: string;
}

export interface AssignedMealPlan {
  id: string;
  mealPlanId: string;
  mealPlanName: string;
  patientId: string;
  dieticianId: string;
  dieticianName: string;
  targetCalories: number;
  assignedAt: string;
  note?: string;
}

export interface ProgressReport {
  patientId: string;
  patientName: string;
  startWeight: number;
  currentWeight: number;
  targetCalories: number;
  avgCalories: number;
  logsCount: number;
  bmi: number;
  bmiCategory: string;
  trend: 'improving' | 'stable' | 'declining';
}
