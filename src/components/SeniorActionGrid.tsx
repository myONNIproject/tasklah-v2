import React from 'react';
import { useSeniorMode } from '../context/SeniorModeContext';
import { MedicalEscortFlow } from './MedicalEscortFlow';
const SENIOR_ACTIONS = [
  { id: 'grocery', icon: '🛒', label: 'Buy Groceries', sub: 'Market / Sheng Siong', color: 'bg-orange-100 border-orange-600' },
  { id: 'cleaning', icon: '🧹', label: 'House Cleaning', sub: 'Weekly / Ad-hoc', color: 'bg-blue-100 border-blue-600' },
  { id: 'medical', icon: '🏥', label: 'Medical Escort', sub: 'Clinic / Hospital', color: 'bg-green-100 border-green-600' },
  { id: 'tech', icon: '📱', label: 'Phone Help', sub: 'WhatsApp / Zoom', color: 'bg-purple-100 border-purple-600' }
];

export const SeniorActionGrid = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const { isSeniorMode } = useSeniorMode();

  if (!isSeniorMode) return null;
const [activeFlow, setActiveFlow] = useState<'grid' | 'medical'>('grid');
  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-black text-slate-800 mb-2 uppercase tracking-tight">
        What do you need help with?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SENIOR_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => onSelect(action.id)}
            className={`flex flex-col items-center justify-center p-10 rounded-[2.5rem] border-8 transition-all active:scale-95 shadow-[0_12px_0_0_rgba(0,0,0,0.1)] ${action.color}`}
          >
            <span className="text-8xl mb-6">{action.icon}</span>
            <span className="text-4xl font-black text-slate-900 mb-2">{action.label}</span>
            <span className="text-xl font-bold text-slate-600">{action.sub}</span>
          </button>
        ))}
      </div>

      {/* Voice Shortcut - The ONNI Preview */}
      <div className="mt-12 p-8 bg-white border-4 border-slate-800 rounded-3xl flex items-center justify-between">
        <div>
          <p className="text-2xl font-black text-slate-800">Or just tell ONNI</p>
          <p className="text-lg font-bold text-slate-500 italic">"I need help with my rice..."</p>
        </div>
        <button className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-3xl shadow-lg animate-pulse">
          🎙️
        </button>
      </div>
    </div>
  );
};
if (activeFlow === 'medical') {

  return (

    <MedicalEscortFlow 

      onBack={() => setActiveFlow('grid')} 

      onComplete={(details) => {

        // This is where you send the data to your backend!

        console.log("Senior Medical Request Submitted:", details);

        // Example API call:

        // fetch('/api/quests', { method: 'POST', body: JSON.stringify({ category: 'Medical', ...details }) })

        

        // Show a success toast or animation here, then go back

        setActiveFlow('grid');

      }} 

    />

  );

}