import React, { createContext, useContext, useState, useEffect } from 'react';

interface SeniorModeContextType {
  isSeniorMode: boolean;
  toggleSeniorMode: () => void;
}

const SeniorModeContext = createContext<SeniorModeContextType | undefined>(undefined);

export const SeniorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSeniorMode, setIsSeniorMode] = useState(() => {
    const saved = localStorage.getItem('seniorMode');
    return saved === 'true';
  });

  const toggleSeniorMode = () => {
    setIsSeniorMode((prev) => {
      const newValue = !prev;
      localStorage.setItem('seniorMode', String(newValue));
      return newValue;
    });
  };

  return (
    <SeniorModeContext.Provider value={{ isSeniorMode, toggleSeniorMode }}>
      <div className={isSeniorMode ? 'senior-theme' : 'standard-theme'}>
        {children}
      </div>
    </SeniorModeContext.Provider>
  );
};

export const useSeniorMode = () => {
  const context = useContext(SeniorModeContext);
  if (!context) throw new Error('useSeniorMode must be used within SeniorModeProvider');
  return context;
};