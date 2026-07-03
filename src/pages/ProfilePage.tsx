import { Zap, Star, Shield, Award, Share2 } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';

export const ProfilePage = () => {
  const { user } = useTaskStore();

  const badges = [
    { name: "Pioneer", icon: <Shield size={20} />, earned: true },
    { name: "Fast Mover", icon: <Zap size={20} />, earned: true },
    { name: "Category King", icon: <Award size={20} />, earned: false },
  ];

  return (
    <div className="p-6">
      {/* --- HEADER / AVATAR --- */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-black italic">
            AW
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-full border-2 border-white shadow-lg">
            <Zap size={16} fill="white" className="text-white" />
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-black italic uppercase tracking-tighter">Andrew Wong</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Singapore / AP-SOUTHEAST-1</p>
      </div>

      {/* --- TRUST SCORE CARD --- */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Trust Infrastructure</h3>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg">JOURNEYMAN</span>
        </div>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-5xl font-black italic text-slate-900">{user.trustScore.toFixed(1)}</span>
          <span className="text-slate-400 font-bold mb-1">/ 5.0</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
            style={{ width: `${(user.trustScore / 5) * 100}%` }}
          ></div>
        </div>
        <p className="text-[9px] font-bold text-slate-400 mt-3 uppercase">Reliability: 98% • Response: 1.2h • No Disputes</p>
      </div>

      {/* --- BADGE GRID --- */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {badges.map((badge, i) => (
          <div key={i} className={`p-4 rounded-3xl flex flex-col items-center gap-2 border ${badge.earned ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-transparent opacity-40'}`}>
            <div className={`${badge.earned ? 'text-blue-600' : 'text-slate-400'}`}>
              {badge.icon}
            </div>
            <span className="text-[8px] font-black uppercase text-center leading-tight">{badge.name}</span>
          </div>
        ))}
      </div>

      {/* --- REFERRAL / KAKI CHAIN --- */}
      <button className="w-full bg-slate-900 p-5 rounded-2xl flex justify-between items-center shadow-2xl active:scale-95 transition-all">
        <div className="text-left">
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">The Kaki Chain</p>
          <p className="text-white font-bold text-sm italic">Refer a Kaki, earn $20</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-xl text-white">
          <Share2 size={18} />
        </div>
      </button>

      <p className="text-center text-[8px] font-bold text-slate-300 mt-8 uppercase">Member since May 2026 • TL-ID: #880227</p>
    </div>
  );
};
