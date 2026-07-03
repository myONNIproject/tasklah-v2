import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Star, Zap, MessageCircle, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isClaiming, setIsClaiming] = useState(false);

  // Simulation: Fetching task data
  const task = {
    title: "Deliver 2x Chicken Rice from Maxwell",
    poster: "Uncle Roger",
    posterTrust: 4.9,
    price: 25,
    xp: 250,
    loc: "Maxwell Food Centre → Bedok North",
    desc: "Please ensure the packaging is tight. I need it by 1:30 PM for a lunch meeting. Will provide a small tip if delivered hot!",
    tags: ["Delivery", "Express"]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Action Bar */}
      <div className="p-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-50 rounded-full text-slate-900">
          <ChevronLeft size={24} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quest Details</span>
        <button className="p-2 text-slate-400"><ShieldCheck size={20} /></button>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              {task.tags.map(tag => (
                <span key={tag} className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider">{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter leading-none">{task.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-blue-600">${task.price}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase">+{task.xp} XP</p>
          </div>
        </div>

        {/* Poster Info */}
        <div className="bg-slate-50 p-4 rounded-3xl flex items-center justify-between mb-8 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-300 rounded-full"></div>
            <div>
              <p className="font-bold text-sm text-slate-800">{task.poster}</p>
              <div className="flex items-center gap-1">
                <Star size={10} fill="#f59e0b" className="text-amber-500" />
                <span className="text-[10px] font-black text-slate-600">{task.posterTrust} Trust Score</span>
              </div>
            </div>
          </div>
          <button className="bg-white p-2.5 rounded-xl text-blue-600 shadow-sm border border-slate-100">
            <MessageCircle size={18} />
          </button>
        </div>

        {/* Details Section */}
        <div className="space-y-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><MapPin size={20} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</p>
              <p className="font-bold text-slate-700">{task.loc}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Clock size={20} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</p>
              <p className="font-bold text-slate-700">Today, 1:30 PM (SGT)</p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Requirement</p>
            <p className="text-slate-600 leading-relaxed font-medium">{task.desc}</p>
          </div>
        </div>

        {/* Claim Button */}
        <button 
          onClick={() => setIsClaiming(true)}
          className="w-full bg-blue-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all"
        >
          Claim this Quest
        </button>
      </div>

      {/* --- CLAIM MODAL (KIASU CONFIRMATION) --- */}
      {isClaiming && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md p-8 rounded-t-[3rem] animate-slide-up">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8"></div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-center">Confirm Claim?</h2>
            <p className="text-slate-500 text-center text-xs font-medium mb-8 px-6">
              By claiming, you agree to the TaskLah! <span className="text-blue-600 font-bold underline">Trinity of Trust</span>. Cancellation will lower your Trust Score.
            </p>
            
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-100">
                Confirm & Start
              </button>
              <button 
                onClick={() => setIsClaiming(false)}
                className="w-full bg-slate-100 text-slate-500 p-5 rounded-2xl font-black uppercase tracking-widest"
              >
                Wait, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
