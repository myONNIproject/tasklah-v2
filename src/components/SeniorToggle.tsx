import { useSeniorMode } from '../context/SeniorModeContext';

export const SeniorToggle = () => {
  const { isSeniorMode, toggleSeniorMode } = useSeniorMode();

  return (
    <button 
      onClick={toggleSeniorMode}
      className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3 border-4 ${
        isSeniorMode 
        ? 'bg-red-600 text-white border-white' 
        : 'bg-slate-800 text-white border-slate-700'
      }`}
    >
      <span className="text-3xl">{isSeniorMode ? '👵' : '👤'}</span>
      <span className="font-black uppercase tracking-tight">
        {isSeniorMode ? 'Standard Mode' : 'Senior Mode'}
      </span>
    </button>
  );
};