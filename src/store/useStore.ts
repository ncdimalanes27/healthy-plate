import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, HealthProfile, DailyLog, MealPlan, MealEntry, DieticianNote, AssignedMealPlan } from '../types/index';

interface AppState {
  currentUser: User | null;
  users: User[];
  profiles: Record<string, HealthProfile>;
  logs: Record<string, DailyLog[]>;
  mealPlans: Record<string, MealPlan[]>;
  notes: DieticianNote[];
  assignedPlans: AssignedMealPlan[];
  tutorialSeen: string[]; // userIds who have seen tutorial

  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
  markTutorialSeen: (userId: string) => void;
  hasTutorialSeen: (userId: string) => boolean;

  saveProfile: (profile: HealthProfile) => void;
  getProfile: (userId: string) => HealthProfile | null;

  addMealEntry: (userId: string, entry: MealEntry) => void;
  getTodayLog: (userId: string) => DailyLog | null;
  updateHealthMetrics: (userId: string, data: Partial<DailyLog>) => void;
  getLogs: (userId: string) => DailyLog[];

  saveMealPlan: (userId: string, plan: MealPlan) => void;
  getMealPlans: (userId: string) => MealPlan[];
  deleteMealPlan: (userId: string, planId: string) => void;
  renameMealPlan: (userId: string, planId: string, newName: string) => void;

  addNote: (note: Omit<DieticianNote, 'id' | 'createdAt'>) => void;
  getNotesForPatient: (patientId: string) => DieticianNote[];
  deleteNote: (noteId: string) => void;

  assignMealPlan: (assignment: Omit<AssignedMealPlan, 'id' | 'assignedAt'>) => void;
  getAssignedPlansForPatient: (patientId: string) => AssignedMealPlan[];
  getAssignedPlansByDietician: (dieticianId: string) => AssignedMealPlan[];

  getAllPatients: () => { user: User; profile: HealthProfile | null; lastLog: DailyLog | null }[];
}

const today = () => new Date().toISOString().split('T')[0];

const pastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const generateLogs = (
  days: number,
  baseCalories: number,
  startWeight: number,
  weightTrend: number,
  baseBloodSugar?: number,
  baseSystolic?: number,
  baseDiastolic?: number,
): DailyLog[] =>
  Array.from({ length: days }, (_, i) => {
    const daysAgo = days - i - 1;
    const calVar = Math.round((Math.random() - 0.5) * 200);
    const wVar = parseFloat((Math.random() * 0.3 - 0.1).toFixed(1));
    return {
      date: pastDate(daysAgo),
      meals: [],
      totalCalories: baseCalories + calVar,
      totalProtein: Math.round((baseCalories * 0.25) / 4 + (Math.random() - 0.5) * 10),
      totalCarbs: Math.round((baseCalories * 0.50) / 4 + (Math.random() - 0.5) * 15),
      totalFat: Math.round((baseCalories * 0.25) / 9 + (Math.random() - 0.5) * 5),
      weight: parseFloat((startWeight + weightTrend * i * 0.07 + wVar).toFixed(1)),
      bloodSugar: baseBloodSugar ? Math.round(baseBloodSugar + (Math.random() - 0.5) * 15) : undefined,
      bloodPressureSystolic: baseSystolic ? Math.round(baseSystolic + (Math.random() - 0.5) * 8) : undefined,
      bloodPressureDiastolic: baseDiastolic ? Math.round(baseDiastolic + (Math.random() - 0.5) * 5) : undefined,
    };
  });

const seedUsers: User[] = [
  { id: 'u001', name: 'Maria Santos', email: 'patient@demo.com', role: 'patient' },
  { id: 'u002', name: 'Dr. Jose Reyes', email: 'dietician@demo.com', role: 'dietician' },
  { id: 'u003', name: 'Pedro Reyes', email: 'pedro@demo.com', role: 'patient' },
  { id: 'u004', name: 'Ana Cruz', email: 'ana@demo.com', role: 'patient' },
];

const seedProfiles: Record<string, HealthProfile> = {
  u001: { userId: 'u001', age: 35, gender: 'female', height: 158, weight: 68, activityLevel: 'moderate', healthConditions: ['Type 2 Diabetes'], allergies: [], goal: 'lose' },
  u003: { userId: 'u003', age: 42, gender: 'male', height: 170, weight: 88, activityLevel: 'light', healthConditions: ['Hypertension', 'High Cholesterol'], allergies: ['Shellfish'], goal: 'lose' },
  u004: { userId: 'u004', age: 28, gender: 'female', height: 162, weight: 52, activityLevel: 'active', healthConditions: [], allergies: [], goal: 'gain' },
};

const seedLogs: Record<string, DailyLog[]> = {
  u001: generateLogs(14, 1480, 68.5, -1, 118, 122, 80),
  u003: generateLogs(14, 1750, 89.0, -1, 98, 145, 94),
  u004: generateLogs(14, 2150, 51.5, 1, 88, 108, 70),
};

const seedNotes: DieticianNote[] = [
  { id: 'n001', dieticianId: 'u002', dieticianName: 'Dr. Jose Reyes', patientId: 'u001', content: 'Si Maria ay nagsisimula nang mag-respond nang maayos sa low-carb meal plan. Inirerekomenda ang pagpapatuloy ng 1500 kcal target at dagdag na gulay.', category: 'progress', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'n002', dieticianId: 'u002', dieticianName: 'Dr. Jose Reyes', patientId: 'u003', content: 'Ang blood pressure ni Pedro ay mataas pa rin. Bawasan ang sodium intake at iwasan ang processed foods. Follow-up sa 2 linggo.', category: 'warning', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'n003', dieticianId: 'u002', dieticianName: 'Dr. Jose Reyes', patientId: 'u004', content: 'Si Ana ay progresibo ang weight gain. Ituloy ang high-protein diet. Mag-add ng healthy fats tulad ng avocado at nuts.', category: 'recommendation', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
];

// Demo users already saw tutorial
const seedTutorialSeen = ['u001', 'u002', 'u003', 'u004'];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: seedUsers,
      profiles: seedProfiles,
      logs: seedLogs,
      mealPlans: {},
      notes: seedNotes,
      assignedPlans: [],
      tutorialSeen: seedTutorialSeen,

      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      register: (user) => set((state) => ({ users: [...state.users, user], currentUser: user })),

      markTutorialSeen: (userId) =>
        set((state) => ({
          tutorialSeen: state.tutorialSeen.includes(userId)
            ? state.tutorialSeen
            : [...state.tutorialSeen, userId],
        })),

      hasTutorialSeen: (userId) => get().tutorialSeen.includes(userId),

      saveProfile: (profile) =>
        set((state) => ({ profiles: { ...state.profiles, [profile.userId]: profile } })),

      getProfile: (userId) => get().profiles[userId] || null,

      addMealEntry: (userId, entry) =>
        set((state) => {
          const userLogs = state.logs[userId] || [];
          const todayDate = today();
          const existing = userLogs.find((l) => l.date === todayDate);
          const updatedLog: DailyLog = existing
            ? { ...existing, meals: [...existing.meals, entry], totalCalories: existing.totalCalories + entry.calories }
            : { date: todayDate, meals: [entry], totalCalories: entry.calories, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
          const newLogs = existing
            ? userLogs.map((l) => (l.date === todayDate ? updatedLog : l))
            : [...userLogs, updatedLog];
          return { logs: { ...state.logs, [userId]: newLogs } };
        }),

      getTodayLog: (userId) => {
        const userLogs = get().logs[userId] || [];
        return userLogs.find((l) => l.date === today()) || null;
      },

      updateHealthMetrics: (userId, data) =>
        set((state) => {
          const userLogs = state.logs[userId] || [];
          const todayDate = today();
          const existing = userLogs.find((l) => l.date === todayDate);
          const updated = existing
            ? { ...existing, ...data }
            : { date: todayDate, meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, ...data };
          const newLogs = existing
            ? userLogs.map((l) => (l.date === todayDate ? updated : l))
            : [...userLogs, updated];
          return { logs: { ...state.logs, [userId]: newLogs } };
        }),

      getLogs: (userId) => get().logs[userId] || [],

      saveMealPlan: (userId, plan) =>
        set((state) => ({
          mealPlans: { ...state.mealPlans, [userId]: [...(state.mealPlans[userId] || []), plan] },
        })),

      getMealPlans: (userId) => get().mealPlans[userId] || [],

      deleteMealPlan: (userId, planId) =>
        set((state) => ({
          mealPlans: {
            ...state.mealPlans,
            [userId]: (state.mealPlans[userId] || []).filter((p) => p.id !== planId),
          },
        })),

      renameMealPlan: (userId, planId, newName) =>
        set((state) => ({
          mealPlans: {
            ...state.mealPlans,
            [userId]: (state.mealPlans[userId] || []).map((p) =>
              p.id === planId ? { ...p, name: newName } : p
            ),
          },
        })),

      addNote: (noteData) =>
        set((state) => ({
          notes: [...state.notes, { ...noteData, id: `n${Date.now()}`, createdAt: new Date().toISOString() }],
        })),

      getNotesForPatient: (patientId) =>
        get().notes.filter((n) => n.patientId === patientId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

      deleteNote: (noteId) =>
        set((state) => ({ notes: state.notes.filter((n) => n.id !== noteId) })),

      assignMealPlan: (assignment) =>
        set((state) => ({
          assignedPlans: [...state.assignedPlans, { ...assignment, id: `ap${Date.now()}`, assignedAt: new Date().toISOString() }],
        })),

      getAssignedPlansForPatient: (patientId) =>
        get().assignedPlans.filter((p) => p.patientId === patientId),

      getAssignedPlansByDietician: (dieticianId) =>
        get().assignedPlans.filter((p) => p.dieticianId === dieticianId),

      getAllPatients: () => {
        const state = get();
        return state.users.filter((u) => u.role === 'patient').map((u) => ({
          user: u,
          profile: state.profiles[u.id] || null,
          lastLog: (state.logs[u.id] || []).sort((a, b) => b.date.localeCompare(a.date))[0] || null,
        }));
      },
    }),
    { name: 'healthyplate-store' }
  )
);
