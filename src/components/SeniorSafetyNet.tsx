import React, { useState } from 'react';
import { useSeniorMode } from '../context/SeniorModeContext';

export const SeniorSafetyNet = ({ onComplete }: { onComplete: (contact: string) => void }) => {
  const [contact, setContact] = useState('');
  const { isSeniorMode } = useSeniorMode();

  if (!isSeniorMode) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 border-8 border-red-600 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-7xl">🛡️</span>
          <h2 className="text-4xl font-black text-slate-800 mt-4 leading-none">Who should we notify?</h2>
          <p className="text-xl font-bold text-slate-500 mt-2">We will tell them you are safe.</p>
        </div>

        <input
          type="tel"
          placeholder="Son / Daughter's Phone No."
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full p-6 text-3xl font-black border-4 border-slate-200 rounded-2xl mb-8 focus:border-red-600 outline-none text-center"
        />

        <button 
          onClick={() => onComplete(contact)}
          className="w-full py-8 bg-red-600 text-white text-3xl font-black rounded-3xl shadow-[0_10px_0_0_rgba(185,28,28,1)] active:translate-y-2 active:shadow-none transition-all"
        >
          DONE
        </button>
      </div>
    </div>
  );
};