import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  HealthProfile,
  DailyLog,
  MealPlan,
  MealEntry,
  DieticianNote,
  AssignedMealPlan,
} from "../types/index";

interface AppState {
  currentUser: User | null;
  users: User[];
  profiles: Record<string, HealthProfile>;
  logs: Record<string, DailyLog[]>;
  mealPlans: Record<string, MealPlan[]>;
  notes: DieticianNote[];
  assignedPlans: AssignedMealPlan[];

  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;

  saveProfile: (profile: HealthProfile) => void;
  getProfile: (userId: string) => HealthProfile | null;

  addMealEntry: (userId: string, entry: MealEntry) => void;
  getTodayLog: (userId: string) => DailyLog | null;
  updateHealthMetrics: (userId: string, data: Partial<DailyLog>) => void;
  getLogs: (userId: string) => DailyLog[];

  saveMealPlan: (userId: string, plan: MealPlan) => void;
  getMealPlans: (userId: string) => MealPlan[];

  // Dietician features
  addNote: (note: Omit<DieticianNote, "id" | "createdAt">) => void;
  getNotesForPatient: (patientId: string) => DieticianNote[];
  deleteNote: (noteId: string) => void;

  assignMealPlan: (
    assignment: Omit<AssignedMealPlan, "id" | "assignedAt">,
  ) => void;
  getAssignedPlansForPatient: (patientId: string) => AssignedMealPlan[];
  getAssignedPlansByDietician: (dieticianId: string) => AssignedMealPlan[];

  getAllPatients: () => {
    user: User;
    profile: HealthProfile | null;
    lastLog: DailyLog | null;
  }[];
}

const today = () => new Date().toISOString().split("T")[0];

const seedUsers: User[] = [
  {
    id: "u001",
    name: "Maria Santos",
    email: "patient@demo.com",
    role: "patient",
  },
  {
    id: "u002",
    name: "Dr. Jose Reyes",
    email: "dietician@demo.com",
    role: "dietician",
  },
  { id: "u003", name: "Pedro Reyes", email: "pedro@demo.com", role: "patient" },
  { id: "u004", name: "Ana Cruz", email: "ana@demo.com", role: "patient" },
];

const seedProfiles: Record<string, HealthProfile> = {
  u001: {
    userId: "u001",
    age: 35,
    gender: "female",
    height: 158,
    weight: 68,
    activityLevel: "moderate",
    healthConditions: ["Type 2 Diabetes"],
    allergies: [],
    goal: "lose",
  },
  u003: {
    userId: "u003",
    age: 42,
    gender: "male",
    height: 170,
    weight: 88,
    activityLevel: "light",
    healthConditions: ["Hypertension", "High Cholesterol"],
    allergies: ["Shellfish"],
    goal: "lose",
  },
  u004: {
    userId: "u004",
    age: 28,
    gender: "female",
    height: 162,
    weight: 52,
    activityLevel: "active",
    healthConditions: [],
    allergies: [],
    goal: "gain",
  },
};

const seedNotes: DieticianNote[] = [
  {
    id: "n001",
    dieticianId: "u002",
    dieticianName: "Dr. Jose Reyes",
    patientId: "u001",
    content:
      "Patient is responding well to the low-carb meal plan. Recommend continuing with 1500 kcal target and increasing vegetable intake.",
    category: "progress",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "n002",
    dieticianId: "u002",
    dieticianName: "Dr. Jose Reyes",
    patientId: "u003",
    content:
      "Blood pressure elevated. Advised to reduce sodium intake and avoid processed foods. Follow-up in 2 weeks.",
    category: "warning",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: seedUsers,
      profiles: seedProfiles,
      logs: {
        u001: [
          {
            date: today(),
            meals: [],
            totalCalories: 820,
            totalProtein: 42,
            totalCarbs: 95,
            totalFat: 28,
            weight: 68,
            bloodSugar: 110,
            bloodPressureSystolic: 118,
            bloodPressureDiastolic: 76,
          },
        ],
        u003: [
          {
            date: today(),
            meals: [],
            totalCalories: 1200,
            totalProtein: 55,
            totalCarbs: 140,
            totalFat: 38,
            weight: 88,
            bloodSugar: 95,
            bloodPressureSystolic: 142,
            bloodPressureDiastolic: 92,
          },
        ],
        u004: [
          {
            date: today(),
            meals: [],
            totalCalories: 1850,
            totalProtein: 78,
            totalCarbs: 210,
            totalFat: 55,
            weight: 52,
            bloodSugar: 88,
            bloodPressureSystolic: 110,
            bloodPressureDiastolic: 70,
          },
        ],
      },
      mealPlans: {},
      notes: seedNotes,
      assignedPlans: [],

      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      register: (user) =>
        set((state) => ({ users: [...state.users, user], currentUser: user })),

      saveProfile: (profile) =>
        set((state) => ({
          profiles: { ...state.profiles, [profile.userId]: profile },
        })),
      getProfile: (userId) => get().profiles[userId] || null,

      addMealEntry: (userId, entry) =>
        set((state) => {
          const userLogs = state.logs[userId] || [];
          const todayDate = today();
          const existing = userLogs.find((l) => l.date === todayDate);
          const updatedLog: DailyLog = existing
            ? {
                ...existing,
                meals: [...existing.meals, entry],
                totalCalories: existing.totalCalories + entry.calories,
              }
            : {
                date: todayDate,
                meals: [entry],
                totalCalories: entry.calories,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
              };
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
            : {
                date: todayDate,
                meals: [],
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                ...data,
              };
          const newLogs = existing
            ? userLogs.map((l) => (l.date === todayDate ? updated : l))
            : [...userLogs, updated];
          return { logs: { ...state.logs, [userId]: newLogs } };
        }),

      getLogs: (userId) => get().logs[userId] || [],

      saveMealPlan: (userId, plan) =>
        set((state) => ({
          mealPlans: {
            ...state.mealPlans,
            [userId]: [...(state.mealPlans[userId] || []), plan],
          },
        })),

      getMealPlans: (userId) => get().mealPlans[userId] || [],

      addNote: (noteData) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...noteData,
              id: `n${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      getNotesForPatient: (patientId) =>
        get()
          .notes.filter((n) => n.patientId === patientId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

      deleteNote: (noteId) =>
        set((state) => ({ notes: state.notes.filter((n) => n.id !== noteId) })),

      assignMealPlan: (assignment) =>
        set((state) => ({
          assignedPlans: [
            ...state.assignedPlans,
            {
              ...assignment,
              id: `ap${Date.now()}`,
              assignedAt: new Date().toISOString(),
            },
          ],
        })),

      getAssignedPlansForPatient: (patientId) =>
        get().assignedPlans.filter((p) => p.patientId === patientId),
      getAssignedPlansByDietician: (dieticianId) =>
        get().assignedPlans.filter((p) => p.dieticianId === dieticianId),

      getAllPatients: () => {
        const state = get();
        return state.users
          .filter((u) => u.role === "patient")
          .map((u) => ({
            user: u,
            profile: state.profiles[u.id] || null,
            lastLog:
              (state.logs[u.id] || []).sort((a, b) =>
                b.date.localeCompare(a.date),
              )[0] || null,
          }));
      },
    }),
    { name: "healthyplate-store" },
  ),
);
