import type { FoodItem } from '../types';

export const filipinoFoods: FoodItem[] = [
  // Breakfast
  { id: 'f001', name: 'Sinangag (Garlic Fried Rice)', category: 'Rice', calories: 238, protein: 5, carbs: 43, fat: 6, fiber: 1, servingSize: '1 cup', isFilipino: true },
  { id: 'f002', name: 'Tapsilog (Beef Tapa + Sinangag + Itlog)', category: 'Breakfast', calories: 580, protein: 35, carbs: 52, fat: 22, fiber: 2, servingSize: '1 plate', isFilipino: true },
  { id: 'f003', name: 'Longsilog (Longganisa + Sinangag + Itlog)', category: 'Breakfast', calories: 610, protein: 28, carbs: 55, fat: 28, fiber: 2, servingSize: '1 plate', isFilipino: true },
  { id: 'f004', name: 'Champorado', category: 'Breakfast', calories: 280, protein: 6, carbs: 52, fat: 7, fiber: 3, servingSize: '1 bowl', isFilipino: true },
  { id: 'f005', name: 'Pandesal', category: 'Bread', calories: 120, protein: 4, carbs: 22, fat: 2, fiber: 1, servingSize: '2 pcs', isFilipino: true },
  { id: 'f006', name: 'Lugaw / Arroz Caldo', category: 'Porridge', calories: 190, protein: 12, carbs: 28, fat: 4, fiber: 1, servingSize: '1 bowl', isFilipino: true },

  // Lunch / Dinner Viands
  { id: 'f007', name: 'Adobo (Chicken)', category: 'Viand', calories: 320, protein: 30, carbs: 8, fat: 18, fiber: 1, servingSize: '1 serving', isFilipino: true },
  { id: 'f008', name: 'Adobo (Pork)', category: 'Viand', calories: 380, protein: 25, carbs: 7, fat: 26, fiber: 1, servingSize: '1 serving', isFilipino: true },
  { id: 'f009', name: 'Sinigang na Baboy', category: 'Soup', calories: 290, protein: 20, carbs: 15, fat: 16, fiber: 3, servingSize: '1 bowl', isFilipino: true },
  { id: 'f010', name: 'Sinigang na Hipon', category: 'Soup', calories: 180, protein: 22, carbs: 12, fat: 5, fiber: 3, servingSize: '1 bowl', isFilipino: true },
  { id: 'f011', name: 'Kare-Kare', category: 'Stew', calories: 420, protein: 28, carbs: 18, fat: 24, fiber: 5, servingSize: '1 serving', isFilipino: true },
  { id: 'f012', name: 'Lechon Kawali', category: 'Pork', calories: 450, protein: 22, carbs: 3, fat: 38, fiber: 0, servingSize: '1 serving', isFilipino: true },
  { id: 'f013', name: 'Bistek Tagalog', category: 'Beef', calories: 310, protein: 28, carbs: 9, fat: 17, fiber: 1, servingSize: '1 serving', isFilipino: true },
  { id: 'f014', name: 'Pinakbet', category: 'Vegetables', calories: 180, protein: 8, carbs: 16, fat: 10, fiber: 5, servingSize: '1 serving', isFilipino: true },
  { id: 'f015', name: 'Nilaga (Beef)', category: 'Soup', calories: 240, protein: 24, carbs: 14, fat: 10, fiber: 3, servingSize: '1 bowl', isFilipino: true },
  { id: 'f016', name: 'Tinola (Chicken)', category: 'Soup', calories: 200, protein: 22, carbs: 10, fat: 7, fiber: 2, servingSize: '1 bowl', isFilipino: true },
  { id: 'f017', name: 'Caldereta', category: 'Stew', calories: 390, protein: 26, carbs: 18, fat: 22, fiber: 4, servingSize: '1 serving', isFilipino: true },
  { id: 'f018', name: 'Mechado', category: 'Beef', calories: 350, protein: 24, carbs: 16, fat: 18, fiber: 2, servingSize: '1 serving', isFilipino: true },
  { id: 'f019', name: 'Dinuguan', category: 'Pork', calories: 360, protein: 20, carbs: 6, fat: 28, fiber: 1, servingSize: '1 serving', isFilipino: true },
  { id: 'f020', name: 'Paksiw na Isda', category: 'Fish', calories: 180, protein: 24, carbs: 4, fat: 7, fiber: 1, servingSize: '1 serving', isFilipino: true },
  { id: 'f021', name: 'Inihaw na Bangus', category: 'Fish', calories: 210, protein: 28, carbs: 2, fat: 10, fiber: 0, servingSize: '1 serving', isFilipino: true },
  { id: 'f022', name: 'Laing', category: 'Vegetables', calories: 290, protein: 6, carbs: 12, fat: 24, fiber: 4, servingSize: '1 serving', isFilipino: true },
  { id: 'f023', name: 'Tortang Talong', category: 'Egg', calories: 190, protein: 12, carbs: 8, fat: 12, fiber: 2, servingSize: '1 pc', isFilipino: true },
  { id: 'f024', name: 'Ginisang Monggo', category: 'Legumes', calories: 220, protein: 14, carbs: 30, fat: 5, fiber: 8, servingSize: '1 bowl', isFilipino: true },
  { id: 'f025', name: 'Menudo', category: 'Pork', calories: 340, protein: 22, carbs: 20, fat: 18, fiber: 3, servingSize: '1 serving', isFilipino: true },
  
  // Rice / Staples
  { id: 'f026', name: 'Steamed White Rice', category: 'Rice', calories: 206, protein: 4, carbs: 45, fat: 0.4, fiber: 0.6, servingSize: '1 cup cooked', isFilipino: false },
  { id: 'f027', name: 'Steamed Brown Rice', category: 'Rice', calories: 215, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, servingSize: '1 cup cooked', isFilipino: false },

  // Snacks
  { id: 'f028', name: 'Banana Cue', category: 'Snack', calories: 180, protein: 2, carbs: 38, fat: 4, fiber: 2, servingSize: '2 pcs', isFilipino: true },
  { id: 'f029', name: 'Turon', category: 'Snack', calories: 210, protein: 3, carbs: 42, fat: 5, fiber: 2, servingSize: '2 pcs', isFilipino: true },
  { id: 'f030', name: 'Puto', category: 'Kakanin', calories: 90, protein: 2, carbs: 18, fat: 1.5, fiber: 0.5, servingSize: '2 pcs', isFilipino: true },
  { id: 'f031', name: 'Bibingka', category: 'Kakanin', calories: 260, protein: 6, carbs: 44, fat: 8, fiber: 1, servingSize: '1 pc', isFilipino: true },
  { id: 'f032', name: 'Halo-Halo', category: 'Dessert', calories: 310, protein: 5, carbs: 62, fat: 8, fiber: 3, servingSize: '1 glass', isFilipino: true },
  { id: 'f033', name: 'Leche Flan', category: 'Dessert', calories: 220, protein: 6, carbs: 30, fat: 9, fiber: 0, servingSize: '1 slice', isFilipino: true },

  // Fruits
  { id: 'f034', name: 'Mango (Philippine)', category: 'Fruit', calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, servingSize: '1 medium', isFilipino: true },
  { id: 'f035', name: 'Banana (Lakatan)', category: 'Fruit', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, servingSize: '1 medium', isFilipino: true },
  { id: 'f036', name: 'Papaya', category: 'Fruit', calories: 59, protein: 0.9, carbs: 15, fat: 0.4, fiber: 2.5, servingSize: '1 cup', isFilipino: false },

  // Vegetables
  { id: 'f037', name: 'Kangkong (Water Spinach)', category: 'Vegetable', calories: 25, protein: 2.6, carbs: 3.1, fat: 0.2, fiber: 2.2, servingSize: '1 cup', isFilipino: true },
  { id: 'f038', name: 'Ampalaya (Bitter Gourd)', category: 'Vegetable', calories: 20, protein: 1, carbs: 4, fat: 0.2, fiber: 2.8, servingSize: '1 cup', isFilipino: true },
  { id: 'f039', name: 'Malunggay (Moringa)', category: 'Vegetable', calories: 64, protein: 9.4, carbs: 8.3, fat: 1.4, fiber: 2, servingSize: '1 cup', isFilipino: true },
  { id: 'f040', name: 'Sitaw (String Beans)', category: 'Vegetable', calories: 35, protein: 2, carbs: 8, fat: 0.3, fiber: 3.4, servingSize: '1 cup', isFilipino: true },

  // Drinks
  { id: 'f041', name: 'Salabat (Ginger Tea)', category: 'Drink', calories: 20, protein: 0, carbs: 5, fat: 0, fiber: 0, servingSize: '1 cup', isFilipino: true },
  { id: 'f042', name: 'Calamansi Juice', category: 'Drink', calories: 40, protein: 0.5, carbs: 10, fat: 0.1, fiber: 0.5, servingSize: '1 glass', isFilipino: true },
  { id: 'f043', name: 'Buko Juice', category: 'Drink', calories: 46, protein: 0.5, carbs: 10, fat: 0.5, fiber: 1.1, servingSize: '1 glass', isFilipino: true },

  // Generic / International
  { id: 'f044', name: 'Egg (Boiled)', category: 'Egg', calories: 77, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, servingSize: '1 large', isFilipino: false },
  { id: 'f045', name: 'Chicken Breast (Grilled)', category: 'Poultry', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: '100g', isFilipino: false },
  { id: 'f046', name: 'Tofu (Firm)', category: 'Legumes', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, servingSize: '100g', isFilipino: false },
  { id: 'f047', name: 'Sweet Potato', category: 'Vegetable', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, servingSize: '1 medium', isFilipino: false },
  { id: 'f048', name: 'Oatmeal', category: 'Grain', calories: 150, protein: 5, carbs: 27, fat: 2.5, fiber: 4, servingSize: '1 cup cooked', isFilipino: false },
  { id: 'f049', name: 'Whole Wheat Bread', category: 'Bread', calories: 138, protein: 6, carbs: 23, fat: 2, fiber: 2.8, servingSize: '2 slices', isFilipino: false },
  { id: 'f050', name: 'Low-fat Milk', category: 'Dairy', calories: 102, protein: 8, carbs: 12, fat: 2.4, fiber: 0, servingSize: '1 cup', isFilipino: false },

  // ─── Budget-Friendly Filipino Meals ───────────────────────────────────────

  // Pang-masa breakfast
  { id: 'f051', name: 'Pandesal na may Margarina', category: 'Budget Meal', calories: 180, protein: 4, carbs: 28, fat: 7, fiber: 1, servingSize: '2 pcs', isFilipino: true },
  { id: 'f052', name: 'Pandesal na may Peanut Butter', category: 'Budget Meal', calories: 250, protein: 8, carbs: 30, fat: 11, fiber: 2, servingSize: '2 pcs', isFilipino: true },
  { id: 'f053', name: 'Instant Oatmeal (3-in-1)', category: 'Budget Meal', calories: 130, protein: 3, carbs: 26, fat: 2, fiber: 2, servingSize: '1 sachet', isFilipino: false },
  { id: 'f054', name: 'Tinapay na may Itlog (Scrambled)', category: 'Budget Meal', calories: 220, protein: 9, carbs: 24, fat: 10, fiber: 1, servingSize: '1 serving', isFilipino: true },
  { id: 'f055', name: 'Lugaw na may Itlog', category: 'Budget Meal', calories: 210, protein: 10, carbs: 32, fat: 5, fiber: 1, servingSize: '1 bowl', isFilipino: true },
  { id: 'f056', name: 'Mais (Boiled Corn)', category: 'Budget Meal', calories: 132, protein: 5, carbs: 29, fat: 2, fiber: 4, servingSize: '1 piece', isFilipino: true },

  // Budget viands
  { id: 'f057', name: 'Ginisang Sardinas', category: 'Budget Meal', calories: 220, protein: 18, carbs: 6, fat: 13, fiber: 1, servingSize: '1 serving', isFilipino: true },
  { id: 'f058', name: 'Pritong Isda (Galunggong)', category: 'Budget Meal', calories: 195, protein: 26, carbs: 2, fat: 9, fiber: 0, servingSize: '1 piece', isFilipino: true },
  { id: 'f059', name: 'Pritong Isda (Tilapia)', category: 'Budget Meal', calories: 185, protein: 28, carbs: 0, fat: 8, fiber: 0, servingSize: '1 piece', isFilipino: true },
  { id: 'f060', name: 'Daing na Bangus', category: 'Budget Meal', calories: 210, protein: 25, carbs: 1, fat: 12, fiber: 0, servingSize: '1 serving', isFilipino: true },
  { id: 'f061', name: 'Tuyo na may Kanin', category: 'Budget Meal', calories: 280, protein: 16, carbs: 42, fat: 6, fiber: 1, servingSize: '1 plate', isFilipino: true },
  { id: 'f062', name: 'Tinapa (Smoked Fish)', category: 'Budget Meal', calories: 190, protein: 22, carbs: 0, fat: 11, fiber: 0, servingSize: '1 piece', isFilipino: true },
  { id: 'f063', name: 'Ginisang Monggo na may Dilis', category: 'Budget Meal', calories: 240, protein: 16, carbs: 32, fat: 5, fiber: 9, servingSize: '1 bowl', isFilipino: true },
  { id: 'f064', name: 'Pritong Tokwa', category: 'Budget Meal', calories: 150, protein: 10, carbs: 4, fat: 10, fiber: 1, servingSize: '1 serving', isFilipino: true },
  { id: 'f065', name: 'Tokwa at Baboy', category: 'Budget Meal', calories: 290, protein: 18, carbs: 6, fat: 20, fiber: 1, servingSize: '1 serving', isFilipino: true },
  { id: 'f066', name: 'Adobong Kangkong', category: 'Budget Meal', calories: 120, protein: 4, carbs: 8, fat: 8, fiber: 3, servingSize: '1 serving', isFilipino: true },
  { id: 'f067', name: 'Ginisang Repolyo', category: 'Budget Meal', calories: 95, protein: 3, carbs: 10, fat: 5, fiber: 3, servingSize: '1 serving', isFilipino: true },
  { id: 'f068', name: 'Nilagang Baboy (Budget Cut)', category: 'Budget Meal', calories: 260, protein: 18, carbs: 12, fat: 15, fiber: 2, servingSize: '1 bowl', isFilipino: true },
  { id: 'f069', name: 'Sinigang na Bangus (sa Sampalok)', category: 'Budget Meal', calories: 210, protein: 24, carbs: 12, fat: 7, fiber: 3, servingSize: '1 bowl', isFilipino: true },
  { id: 'f070', name: 'Ginisang Togue', category: 'Budget Meal', calories: 110, protein: 6, carbs: 10, fat: 5, fiber: 3, servingSize: '1 serving', isFilipino: true },
  { id: 'f071', name: 'Pork Cubed Adobo (Matipid)', category: 'Budget Meal', calories: 310, protein: 20, carbs: 7, fat: 22, fiber: 1, servingSize: '1 serving', isFilipino: true },
  { id: 'f072', name: 'Ginisang Ampalaya na may Itlog', category: 'Budget Meal', calories: 145, protein: 8, carbs: 8, fat: 9, fiber: 3, servingSize: '1 serving', isFilipino: true },
  { id: 'f073', name: 'Bulalo (Budget)', category: 'Budget Meal', calories: 280, protein: 22, carbs: 10, fat: 16, fiber: 2, servingSize: '1 bowl', isFilipino: true },
  { id: 'f074', name: 'Arrozcaldo na may Manok', category: 'Budget Meal', calories: 230, protein: 15, carbs: 30, fat: 6, fiber: 1, servingSize: '1 bowl', isFilipino: true },

  // Budget snacks / merienda
  { id: 'f075', name: 'Kamote Cue', category: 'Budget Meal', calories: 160, protein: 2, carbs: 35, fat: 3, fiber: 3, servingSize: '2 pcs', isFilipino: true },
  { id: 'f076', name: 'Boiled Kamote (Sweet Potato)', category: 'Budget Meal', calories: 103, protein: 2, carbs: 24, fat: 0.1, fiber: 4, servingSize: '1 medium', isFilipino: true },
  { id: 'f077', name: 'Boiled Saging na Saba', category: 'Budget Meal', calories: 115, protein: 1.5, carbs: 27, fat: 0.4, fiber: 2.5, servingSize: '1 piece', isFilipino: true },
  { id: 'f078', name: 'Puto Bumbong', category: 'Budget Meal', calories: 180, protein: 3, carbs: 36, fat: 4, fiber: 2, servingSize: '2 pcs', isFilipino: true },
  { id: 'f079', name: 'Ginataang Mais', category: 'Budget Meal', calories: 195, protein: 3, carbs: 38, fat: 5, fiber: 2, servingSize: '1 cup', isFilipino: true },
  { id: 'f080', name: 'Lugaw na Maize / Lugaw Bisaya', category: 'Budget Meal', calories: 150, protein: 4, carbs: 30, fat: 2, fiber: 2, servingSize: '1 bowl', isFilipino: true },

  // Affordable protein sources
  { id: 'f081', name: 'Itlog na Maalat (Salted Egg)', category: 'Budget Meal', calories: 130, protein: 8, carbs: 1, fat: 10, fiber: 0, servingSize: '1 piece', isFilipino: true },
  { id: 'f082', name: 'Pork Liver (Atay)', category: 'Budget Meal', calories: 165, protein: 22, carbs: 4, fat: 6, fiber: 0, servingSize: '100g', isFilipino: true },
  { id: 'f083', name: 'Chicken Feet (Adidas)', category: 'Budget Meal', calories: 215, protein: 19, carbs: 0, fat: 15, fiber: 0, servingSize: '4 pcs', isFilipino: true },
  { id: 'f084', name: 'Balut', category: 'Budget Meal', calories: 188, protein: 13, carbs: 5, fat: 13, fiber: 0, servingSize: '1 piece', isFilipino: true },
  { id: 'f085', name: 'Dilis (Dried Anchovies)', category: 'Budget Meal', calories: 95, protein: 16, carbs: 0, fat: 3, fiber: 0, servingSize: '2 tbsp', isFilipino: true },
  { id: 'f086', name: 'Sardinas sa Tomato Sauce', category: 'Budget Meal', calories: 200, protein: 19, carbs: 4, fat: 12, fiber: 1, servingSize: '1 can (155g)', isFilipino: true },
  { id: 'f087', name: 'Corned Beef (Budget)', category: 'Budget Meal', calories: 190, protein: 14, carbs: 4, fat: 13, fiber: 0, servingSize: '3/4 cup', isFilipino: false },

  // Affordable vegetables / sides
  { id: 'f088', name: 'Pinakbet (Budget version)', category: 'Budget Meal', calories: 150, protein: 5, carbs: 14, fat: 8, fiber: 5, servingSize: '1 serving', isFilipino: true },
  { id: 'f089', name: 'Nilaga na Gulay', category: 'Budget Meal', calories: 90, protein: 3, carbs: 16, fat: 2, fiber: 4, servingSize: '1 bowl', isFilipino: true },
  { id: 'f090', name: 'Ensaladang Talong', category: 'Budget Meal', calories: 80, protein: 2, carbs: 10, fat: 4, fiber: 4, servingSize: '1 serving', isFilipino: true },
  { id: 'f091', name: 'Ginisang Pechay', category: 'Budget Meal', calories: 85, protein: 3, carbs: 8, fat: 5, fiber: 2, servingSize: '1 serving', isFilipino: true },
  { id: 'f092', name: 'Utan Bisaya (Mixed Veggies)', category: 'Budget Meal', calories: 100, protein: 4, carbs: 14, fat: 3, fiber: 5, servingSize: '1 bowl', isFilipino: true },

  // Budget drinks
  { id: 'f093', name: 'Tubig na may Kalamansi', category: 'Budget Meal', calories: 15, protein: 0, carbs: 4, fat: 0, fiber: 0, servingSize: '1 glass', isFilipino: true },
  { id: 'f094', name: 'Gatas na de Lata (Evaporated)', category: 'Budget Meal', calories: 80, protein: 4, carbs: 6, fat: 5, fiber: 0, servingSize: '1/4 cup', isFilipino: false },
  { id: 'f095', name: 'Instant Coffee (3-in-1)', category: 'Budget Meal', calories: 60, protein: 1, carbs: 12, fat: 1.5, fiber: 0, servingSize: '1 sachet', isFilipino: false },
];

export const foodCategories = [...new Set(filipinoFoods.map(f => f.category))];

export const budgetFoods = filipinoFoods.filter(f => f.category === 'Budget Meal');
