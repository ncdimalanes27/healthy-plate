import type { FoodItem, MealPlan, MealPlanDay } from '../types';
import { filipinoFoods } from '../data/foods';

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getFoodsForMeal(
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  targetCalories: number,
  exclude: string[] = []
): FoodItem[] {
  let pool: FoodItem[] = [];

  if (category === 'breakfast') {
    pool = filipinoFoods.filter(f =>
      ['Breakfast', 'Bread', 'Porridge', 'Grain', 'Egg'].includes(f.category)
    );
  } else if (category === 'snack') {
    pool = filipinoFoods.filter(f =>
      ['Snack', 'Fruit', 'Kakanin', 'Drink'].includes(f.category)
    );
  } else {
    // lunch/dinner
    const viands = filipinoFoods.filter(f =>
      ['Viand', 'Soup', 'Stew', 'Pork', 'Beef', 'Fish', 'Poultry', 'Legumes', 'Vegetables', 'Egg'].includes(f.category) &&
      !exclude.includes(f.id)
    );
    const rice = filipinoFoods.filter(f => f.category === 'Rice');
    const picked = shuffleArray(viands).slice(0, 1);
    const pickedRice = shuffleArray(rice).slice(0, 1);
    return [...pickedRice, ...picked];
  }

  const available = shuffleArray(pool.filter(f => !exclude.includes(f.id)));
  const selected: FoodItem[] = [];
  let total = 0;

  for (const food of available) {
    if (total + food.calories <= targetCalories + 50) {
      selected.push(food);
      total += food.calories;
      if (selected.length >= 2 || total >= targetCalories * 0.85) break;
    }
  }

  return selected.length ? selected : available.slice(0, 1);
}

export function generateMealPlan(targetCalories: number, days = 7): MealPlan {
  const plan: MealPlanDay[] = [];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Calorie splits: breakfast 25%, lunch 35%, dinner 30%, snack 10%
  const splits = {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.30,
    snack: 0.10,
  };

  for (let i = 0; i < days; i++) {
    const used: string[] = [];

    const breakfast = getFoodsForMeal('breakfast', targetCalories * splits.breakfast, used);
    breakfast.forEach(f => used.push(f.id));

    const lunch = getFoodsForMeal('lunch', targetCalories * splits.lunch, used);
    lunch.forEach(f => used.push(f.id));

    const dinner = getFoodsForMeal('dinner', targetCalories * splits.dinner, used);

    const snack = getFoodsForMeal('snack', targetCalories * splits.snack);

    const allFoods = [...breakfast, ...lunch, ...dinner, ...snack];
    const totalCalories = allFoods.reduce((sum, f) => sum + f.calories, 0);

    plan.push({
      day: dayNames[i],
      breakfast,
      lunch,
      dinner,
      snack,
      totalCalories,
    });
  }

  return {
    id: `plan-${Date.now()}`,
    name: `${targetCalories} kcal Filipino Meal Plan`,
    targetCalories,
    days: plan,
    createdAt: new Date().toISOString(),
  };
}
