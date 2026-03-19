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
];

export const foodCategories = [...new Set(filipinoFoods.map(f => f.category))];
