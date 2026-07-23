import { Shield, Lock, Users, Swords, Trophy, Sparkles } from 'lucide-react';

export const GuildsPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="relative z-10 text-center max-w-sm">
        <div className="mb-6 relative inline-block">
          <Shield size={64} className="text-blue-400 mx-auto" strokeWidth={1.5} />
          <Lock size={24} className="text-amber-400 absolute -bottom-1 -right-2" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter mb-2">Guilds</h1>
        <p className="text-blue-400 font-black uppercase tracking-widest text-xs mb-6">Coming Q2 2027</p>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-6 text-left">
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">Form your squad. Conquer community challenges. Unlock exclusive rewards.</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm"><Users size={16} className="text-blue-400 shrink-0" /><span className="text-slate-300">Create or join guilds with fellow Taskers</span></div>
            <div className="flex items-center gap-3 text-sm"><Swords size={16} className="text-red-400 shrink-0" /><span className="text-slate-300">Guild vs Guild weekly boss events</span></div>
            <div className="flex items-center gap-3 text-sm"><Trophy size={16} className="text-amber-400 shrink-0" /><span className="text-slate-300">Shared guild leaderboard and perks</span></div>
            <div className="flex items-center gap-3 text-sm"><Sparkles size={16} className="text-purple-400 shrink-0" /><span className="text-slate-300">Exclusive guild-only cosmetics</span></div>
          </div>
        </div>
        <button disabled className="w-full bg-slate-800 text-slate-500 font-black uppercase tracking-widest text-xs py-3 rounded-xl border border-slate-700 cursor-not-allowed">Unlock at Launch</button>
      </div>
    </div>
  );
};
