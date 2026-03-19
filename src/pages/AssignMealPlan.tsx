import { useState } from "react";
import { useStore } from "../store/useStore";
import { generateMealPlan } from "../utils/mealPlanGenerator";
import { calculateTargetCalories } from "../utils/calculations";
import {
  ClipboardList,
  Sparkles,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AssignMealPlan() {
  const {
    currentUser,
    getAllPatients,
    getProfile,
    assignMealPlan,
    getAssignedPlansForPatient,
  } = useStore();
  const patients = getAllPatients();

  const [selectedPatient, setSelectedPatient] = useState(
    patients[0]?.user.id || "",
  );
  const [customCals, setCustomCals] = useState("");
  const [note, setNote] = useState("");
  const [assigned, setAssigned] = useState(false);
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

  const patient = patients.find((p) => p.user.id === selectedPatient);
  const profile = getProfile(selectedPatient);
  const targetCals = profile ? calculateTargetCalories(profile) : 1800;
  const assignedPlans = getAssignedPlansForPatient(selectedPatient);

  const handleAssign = () => {
    if (!currentUser || !patient) return;
    const cals = customCals ? parseInt(customCals) : targetCals;
    const plan = generateMealPlan(cals, 7);

    assignMealPlan({
      mealPlanId: plan.id,
      mealPlanName: plan.name,
      patientId: selectedPatient,
      dieticianId: currentUser.id,
      dieticianName: currentUser.name,
      targetCalories: cals,
      note: note.trim() || undefined,
    });

    setNote("");
    setCustomCals("");
    setAssigned(true);
    setTimeout(() => setAssigned(false), 2500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Assign Meal Plan
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Generate and assign a personalized Filipino meal plan to a patient.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient selector */}
        <div className="md:col-span-1 space-y-2">
          <p className="text-sm font-semibold text-gray-600 mb-3">
            Select Patient
          </p>
          {patients.map(({ user, profile: prof }) => (
            <button
              key={user.id}
              onClick={() => setSelectedPatient(user.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                selectedPatient === user.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-100 bg-white hover:border-green-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Target: {prof ? calculateTargetCalories(prof) : "—"} kcal
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Assign panel */}
        <div className="md:col-span-2 space-y-4">
          {/* Patient info */}
          {profile && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                {patient?.user.name}'s Profile
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Goal",
                    val:
                      profile.goal === "lose"
                        ? "🔻 Lose"
                        : profile.goal === "gain"
                          ? "📈 Gain"
                          : "⚖️ Maintain",
                  },
                  { label: "Calculated target", val: `${targetCals} kcal` },
                  { label: "Activity", val: profile.activityLevel },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white rounded-xl px-3 py-2">
                    <p className="text-xs text-blue-400">{label}</p>
                    <p className="text-sm font-semibold text-blue-800 mt-0.5">
                      {val}
                    </p>
                  </div>
                ))}
              </div>
              {profile.healthConditions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.healthConditions.map((c) => (
                    <span
                      key={c}
                      className="bg-amber-100 text-amber-700 text-xs px-2.5 py-0.5 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assignment form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Generate & Assign 7-Day Meal Plan
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Custom calories (optional — default is patient's calculated
                  target)
                </label>
                <input
                  type="number"
                  value={customCals}
                  onChange={(e) => setCustomCals(e.target.value)}
                  placeholder={`Default: ${targetCals} kcal`}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Note to patient (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Follow this plan for 2 weeks. Avoid high-sodium foods."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              onClick={handleAssign}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                assigned
                  ? "bg-green-100 text-green-700"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-100"
              }`}
            >
              {assigned ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {assigned ? "Plan Assigned!" : "Generate & Assign Plan"}
            </button>
          </div>

          {/* Previous assignments */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">
              Previously Assigned Plans ({assignedPlans.length})
            </p>
            {assignedPlans.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                <ClipboardList className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No plans assigned yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {assignedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() =>
                        setExpandedPatient(
                          expandedPatient === plan.id ? null : plan.id,
                        )
                      }
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-left">
                        <p className="font-semibold text-gray-800 text-sm">
                          {plan.mealPlanName}
                        </p>
                        <p className="text-xs text-gray-400">
                          Assigned{" "}
                          {new Date(plan.assignedAt).toLocaleDateString(
                            "en-PH",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}{" "}
                          by {plan.dieticianName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          {plan.targetCalories} kcal/day
                        </span>
                        {expandedPatient === plan.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                    {expandedPatient === plan.id && plan.note && (
                      <div className="px-5 pb-4 border-t border-gray-50">
                        <p className="text-xs text-gray-500 mt-3 font-medium mb-1">
                          Dietician note:
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          "{plan.note}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
