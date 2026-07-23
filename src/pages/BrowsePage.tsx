import { useState, useEffect } from 'react';
import { Search, MapPin, Heart, ShoppingCart, Home, Wrench, Circle, Pill, Languages, Check, ArrowLeft, Phone, Shield } from 'lucide-react';
import { useSeniorMode } from '../context/SeniorModeContext';

// --- MEDICAL ESCORT FLOW (Defined Inline to avoid import errors) ---
interface MedicalEscortFlowProps {
  onBack: () => void;
  onComplete: (details: any) => void;
}

function MedicalEscortFlow({ onBack, onComplete }: MedicalEscortFlowProps) {
  const [step, setStep] = useState<'options' | 'summary'>('options');
  const [requirements, setRequirements] = useState({
    wheelchair: false,
    dialect: false,
    medication: false,
    malayTamil: false,
  });
  const [selectedDialect, setSelectedDialect] = useState('Hokkien');

  const toggleReq = (key: string) => {
    setRequirements(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const dialects = ['Hokkien', 'Teochew', 'Cantonese', 'Hakka', 'Mandarin'];

  const handleConfirm = () => {
    onComplete({ ...requirements, dialect: requirements.dialect ? selectedDialect : null });
  };

  if (step === 'summary') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex flex-col justify-center">
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xl space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone size={32} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Confirm Your Request</h2>
            <p className="text-slate-500 font-medium mt-2">We will find a trusted Kaki for you</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">1</div>
              <span className="font-bold text-slate-800">Medical Escort Appointment</span>
            </div>
            {requirements.wheelchair && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <Check size={20} className="text-green-600" />
                <span className="font-bold text-green-800">Wheelchair Friendly Transport</span>
              </div>
            )}
            {requirements.dialect && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <Check size={20} className="text-green-600" />
                <span className="font-bold text-green-800">Speaks {selectedDialect} Dialect</span>
              </div>
            )}
            {requirements.medication && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <Check size={20} className="text-green-600" />
                <span className="font-bold text-green-800">Help with Medication & Prescriptions</span>
              </div>
            )}
            {requirements.malayTamil && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <Check size={20} className="text-green-600" />
                <span className="font-bold text-green-800">Malay / Tamil Speaker</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setStep('options')}
              className="flex-1 py-4 rounded-xl border-2 border-slate-200 font-bold text-slate-600 text-lg active:bg-slate-100"
            >
              Change
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 py-4 rounded-xl bg-black text-white font-black text-lg shadow-xl active:bg-slate-800 active:scale-95 transition-transform"
            >
              YES, FIND HELP!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col relative">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center active:bg-slate-100"
        >
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Medical Escort</h1>
          <p className="text-sm font-bold text-slate-500">Tell us what you need help with</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <button onClick={() => toggleReq('wheelchair')} className="w-full p-6 rounded-2xl border-4 flex items-center gap-4 active:scale-95" style={{ borderColor: requirements.wheelchair ? '#22c55e' : '#e2e8f0', backgroundColor: requirements.wheelchair ? '#f0fdf4' : '#ffffff' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: requirements.wheelchair ? '#22c55e' : '#f1f5f9', color: requirements.wheelchair ? '#ffffff' : '#94a3b8' }}>
          <Circle size={28} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-xl font-black text-slate-900">Wheelchair Friendly</h3>
            <p className="text-sm font-medium text-slate-500">Transport with wheelchair access</p>
          </div>
          {requirements.wheelchair && <Check size={32} className="text-green-600" strokeWidth={4} />}
        </button>

        <button onClick={() => toggleReq('dialect')} className="w-full p-6 rounded-2xl border-4 flex items-center gap-4 active:scale-95" style={{ borderColor: requirements.dialect ? '#22c55e' : '#e2e8f0', backgroundColor: requirements.dialect ? '#f0fdf4' : '#ffffff' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: requirements.dialect ? '#22c55e' : '#f1f5f9', color: requirements.dialect ? '#ffffff' : '#94a3b8' }}>
            <Languages size={28} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-xl font-black text-slate-900">Speaks Dialect</h3>
            <p className="text-sm font-medium text-slate-500">Tasker speaks mother tongue</p>
          </div>
          {requirements.dialect && <Check size={32} className="text-green-600" strokeWidth={4} />}
        </button>

        {requirements.dialect && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-4">
            <p className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wide">Select Dialect:</p>
            <div className="grid grid-cols-2 gap-3">
              {dialects.map((d) => (
                <button key={d} onClick={() => setSelectedDialect(d)} className="py-3 px-4 rounded-xl border-2 font-bold text-lg" style={{ backgroundColor: selectedDialect === d ? '#2563eb' : '#f8fafc', borderColor: selectedDialect === d ? '#2563eb' : '#e2e8f0', color: selectedDialect === d ? '#ffffff' : '#334155' }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => toggleReq('medication')} className="w-full p-6 rounded-2xl border-4 flex items-center gap-4 active:scale-95" style={{ borderColor: requirements.medication ? '#22c55e' : '#e2e8f0', backgroundColor: requirements.medication ? '#f0fdf4' : '#ffffff' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: requirements.medication ? '#22c55e' : '#f1f5f9', color: requirements.medication ? '#ffffff' : '#94a3b8' }}>
            <Pill size={28} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-xl font-black text-slate-900">Help with Medication</h3>
            <p className="text-sm font-medium text-slate-500">Reminders & collecting prescriptions</p>
          </div>
          {requirements.medication && <Check size={32} className="text-green-600" strokeWidth={4} />}
        </button>

        <button onClick={() => toggleReq('malayTamil')} className="w-full p-6 rounded-2xl border-4 flex items-center gap-4 active:scale-95" style={{ borderColor: requirements.malayTamil ? '#22c55e' : '#e2e8f0', backgroundColor: requirements.malayTamil ? '#f0fdf4' : '#ffffff' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: requirements.malayTamil ? '#22c55e' : '#f1f5f9', color: requirements.malayTamil ? '#ffffff' : '#94a3b8' }}>
            <Heart size={28} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-xl font-black text-slate-900">Malay / Tamil Speaker</h3>
            <p className="text-sm font-medium text-slate-500">For our Pioneer & Merdeka generation</p>
          </div>
          {requirements.malayTamil && <Check size={32} className="text-green-600" strokeWidth={4} />}
        </button>

        <div className="flex items-center justify-center gap-2 py-2 text-slate-400">
          <Shield size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Trinity of Trust Protected</span>
        </div>
      </div>

      <div className="sticky bottom-0 pt-4 pb-8 bg-slate-50">
        <button 
          onClick={() => setStep('summary')}
          className="w-full py-5 bg-black text-white rounded-2xl font-black text-xl uppercase tracking-wider shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-3"
        >
          <span>Find Help Now</span>
          <Phone size={24} />
        </button>
        <p className="text-center text-xs font-bold text-slate-400 mt-3 flex items-center justify-center gap-1">
          <Shield size={12} /> Protected by TaskLah! Trinity of Trust
        </p>
      </div>
    </div>
  );
}

// --- MAIN BROWSE PAGE ---
export function BrowsePage() {
  const { isSeniorMode } = useSeniorMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('browse');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://021oj8qc13.execute-api.ap-southeast-1.amazonaws.com/tasks")
      .then(res => res.json())
      .then(data => {
        const mapped = (data.tasks || []).map((t) => ({
          id: t.id,
          title: t.title,
          loc: t.location,
          price: t.bounty,
          cat: t.category,
          trust: 85,
          hot: false
        }));
        setTasks(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tasks:", err);
        setLoading(false);
      });
  }, []);

  if (isSeniorMode && activeView === 'medical') {
    return (
      <MedicalEscortFlow 
        onBack={() => setActiveView('browse')} 
        onComplete={(details) => {
          console.log("Senior Medical Request:", details);
          setActiveView('browse');
        }} 
      />
    );
  }

  if (isSeniorMode) {
    return (
      <div className="p-4 bg-slate-50 min-h-screen">
        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">What do you need?</h2>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setActiveView('medical')} className="bg-red-500 text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 shadow-lg">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Heart size={32} />
            </div>
            <span className="text-xl font-black">Medical</span>
          </button>
          <button className="bg-blue-500 text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 shadow-lg">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingCart size={32} />
            </div>
            <span className="text-xl font-black">Groceries</span>
          </button>
          <button className="bg-amber-500 text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 shadow-lg">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Home size={32} />
            </div>
            <span className="text-xl font-black">Cleaning</span>
          </button>
          <button className="bg-emerald-500 text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 shadow-lg">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Wrench size={32} />
            </div>
            <span className="text-xl font-black">Tech Help</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search for tasks..."
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
        {['All', 'Delivery', 'Cleaning', 'Handyman', 'Tech Help'].map((cat) => (
          <button key={cat} className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium whitespace-nowrap">
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">Available Quests</h2>
        {loading ? (
          <p className="text-center py-10 text-slate-400">Loading tasks...</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{task.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs">
                    <MapPin size={12} />
                    <span>{task.loc}</span>
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-black">
                  ${task.price}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}