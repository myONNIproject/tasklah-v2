import { Zap, MapPin, Clock } from 'lucide-react';

interface TaskProps {
  title: string;
  budget: number;
  xp: number;
  location: string;
}

export const TaskCard = ({ title, budget, xp, location }: TaskProps) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-4 active:scale-[0.98] transition-all">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-slate-900 text-lg pr-4">{title}</h3>
        <span className="text-indigo-600 font-black text-xl">${budget}</span>
      </div>
      
      <div className="flex gap-4 mb-4 text-slate-500 text-sm">
        <div className="flex items-center gap-1"><MapPin size={14} /> {location}</div>
        <div className="flex items-center gap-1"><Clock size={14} /> 2h ago</div>
      </div>

      <div className="bg-yellow-50 rounded-2xl p-3 flex justify-between items-center border border-yellow-100">
        <div className="flex items-center gap-2 text-yellow-700 font-bold uppercase text-[10px] tracking-widest">
          <Zap size={14} fill="currentColor" /> Reward
        </div>
        <span className="text-yellow-700 font-black">+{xp} XP</span>
      </div>
    </div>
  );
};
