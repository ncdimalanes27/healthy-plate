import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChevronRight, ChevronLeft, X, Leaf } from 'lucide-react';

const patientSteps = [
  {
    emoji: '👋',
    title: 'Maligayang pagdating sa HealthyPlate!',
    desc: 'Ang HealthyPlate ay isang nutrition companion na tumutulong sa iyo na masubaybayan ang iyong kalusugan at pagkain araw-araw.',
    tip: null,
  },
  {
    emoji: '👤',
    title: 'I-setup ang iyong Profile',
    desc: 'Una, pumunta sa Profile page at i-fill out ang iyong edad, taas, timbang, at health goals. Ito ang basehan ng iyong calorie target at meal plans.',
    tip: '💡 Tip: I-update ang profile mo kapag nagbago ang iyong weight para accurate ang calorie target.',
  },
  {
    emoji: '🍽️',
    title: 'Mag-log ng Pagkain',
    desc: 'Sa Log Food page, pwede kang maghanap ng pagkain mula sa aming database ng 170+ Filipino at international na pagkain. May Budget-Friendly filter din para sa abot-kayang pagkain!',
    tip: '💡 Tip: I-log ang bawat kain — breakfast, lunch, dinner, at snacks para makita ang buong calorie intake mo.',
  },
  {
    emoji: '📋',
    title: 'Kumuha ng Meal Plan',
    desc: 'Sa Meal Plans page, pwede kang mag-generate ng 7-day Filipino meal plan base sa iyong calorie target. I-save ito para ma-follow mo buong linggo!',
    tip: '💡 Tip: Pwede mong i-customize ang calorie target kapag nag-ge-generate ng meal plan.',
  },
  {
    emoji: '📈',
    title: 'I-monitor ang Kalusugan',
    desc: 'Sa Health Monitoring page, i-log ang iyong weight, blood sugar, at blood pressure araw-araw. Makikita mo ang iyong progress sa pamamagitan ng mga charts.',
    tip: '💡 Tip: Regular na pag-log ng health metrics ay tumutulong sa dietician mo na ma-monitor ang iyong kondisyon.',
  },
  {
    emoji: '🩺',
    title: 'Handa ka na!',
    desc: 'Maaari na kang magsimula! Ang iyong dietician ay magmo-monitor ng iyong progress at magpapadala ng mga rekomendasyon para sa iyo.',
    tip: null,
  },
];

const dieticianSteps = [
  {
    emoji: '👋',
    title: 'Welcome, Dietician!',
    desc: 'Ang HealthyPlate Dietician Dashboard ay nagbibigay sa iyo ng access sa lahat ng iyong patients — kanilang health profiles, meal logs, at progress data.',
    tip: null,
  },
  {
    emoji: '👥',
    title: 'Patient Overview',
    desc: 'Sa Patients page, makikita mo ang lahat ng registered patients. I-click ang isang patient para makita ang kanilang full health profile, BMI, calorie intake, at health conditions.',
    tip: '💡 Tip: May health alert badges para sa mga patients na may serious na kondisyon tulad ng Diabetes at Hypertension.',
  },
  {
    emoji: '📋',
    title: 'Mag-assign ng Meal Plan',
    desc: 'Sa Assign Plan page, pwede kang mag-generate ng personalized 7-day Filipino meal plan para sa isang patient base sa kanilang calorie target at health goals.',
    tip: '💡 Tip: Pwede mong i-customize ang calories at magdagdag ng note para sa patient.',
  },
  {
    emoji: '📝',
    title: 'Mag-send ng Notes',
    desc: 'Sa Notes page, pwede kang mag-send ng clinical notes at recommendations sa bawat patient — may categories: Recommendation, Warning, Progress update, at General.',
    tip: '💡 Tip: Gamitin ang Warning category para sa mga patients na kailangan ng immediate attention.',
  },
  {
    emoji: '📊',
    title: 'Progress Reports',
    desc: 'Sa Progress page, makikita mo ang table ng lahat ng patients na may BMI, calorie adherence, weight change, at trend status. I-click ang isang row para sa detailed charts.',
    tip: '💡 Tip: May "Needs attention" badge para sa mga patients na hindi sumusunod sa kanilang nutrition goals.',
  },
  {
    emoji: '✅',
    title: 'Handa ka na!',
    desc: 'Simulan na ang pag-monitor ng iyong mga patients. Ang HealthyPlate ay tumutulong sa iyo na mas epektibong ma-manage ang nutritional care ng bawat patient.',
    tip: null,
  },
];

interface TutorialProps {
  role: 'patient' | 'dietician';
  onClose: () => void;
}

export default function Tutorial({ role, onClose }: TutorialProps) {
  const [step, setStep] = useState(0);
  const { currentUser, markTutorialSeen } = useStore();
  const navigate = useNavigate();

  const steps = role === 'patient' ? patientSteps : dieticianSteps;
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const isFirst = step === 0;

  const handleFinish = () => {
    if (currentUser) markTutorialSeen(currentUser.id);
    onClose();
    navigate(role === 'dietician' ? '/dietician' : '/dashboard');
  };

  const handleSkip = () => {
    if (currentUser) markTutorialSeen(currentUser.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 pt-6 pb-8 relative">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium">HealthyPlate Tutorial</span>
          </div>
          <div className="text-5xl mb-3">{current.emoji}</div>
          <h2 className="text-xl font-bold text-white leading-snug">{current.title}</h2>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pt-4 px-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === step
                  ? 'w-6 h-2 bg-green-600'
                  : i < step
                  ? 'w-2 h-2 bg-green-300'
                  : 'w-2 h-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-600 leading-relaxed text-sm">{current.desc}</p>

          {current.tip && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <p className="text-sm text-green-700">{current.tip}</p>
            </div>
          )}
        </div>

        {/* Step counter */}
        <div className="px-6 pb-2">
          <p className="text-xs text-gray-400 text-center">
            Step {step + 1} of {steps.length}
          </p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          {!isFirst && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={isLast ? handleFinish : () => setStep(step + 1)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            {isLast ? '🚀 Magsimula na!' : (
              <>
                Susunod
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Skip */}
        {!isLast && (
          <div className="px-6 pb-5 text-center -mt-2">
            <button onClick={handleSkip} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Skip tutorial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
