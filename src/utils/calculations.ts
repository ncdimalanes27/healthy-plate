import type { Profile } from '../types';

export const calculateBMR = (profile: Profile): number => {
  const { weight, height, age, gender } = profile;
  if (!weight || !height || !age || !gender) return 0;
  
  // Mifflin-St Jeor Formula
  if (gender === 'Male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
};

export const calculateTDEE = (profile: Profile): number => {
  const bmr = calculateBMR(profile);
  const multipliers: Record<string, number> = {
    'Sedentary': 1.2,
    'Light': 1.375,
    'Moderate': 1.55,
    'Active': 1.725,
    'Very Active': 1.9
  };
  return bmr * (multipliers[profile.activity_level || 'Sedentary'] || 1.2);
};

export const calculateTargetCalories = (profile: Profile): number => {
  const tdee = calculateTDEE(profile);
  switch (profile.goal) {
    case 'Lose Weight': return Math.round(tdee - 500);
    case 'Gain Weight': return Math.round(tdee + 300);
    default: return Math.round(tdee);
  }
};

export const calculateBMI = (weight: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return Number((weight / (heightM * heightM)).toFixed(1));
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};