import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Smartphone, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeniorMode } from '../context/SeniorModeContext';

 
export const LoginPage = () => {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [scanStatus, setScanStatus] = useState<'waiting' | 'scanned' | 'success'>('waiting');
 const { isSeniorMode } = useSeniorMode();

  useEffect(() => {
    if (showQR) {
      const timer1 = setTimeout(() => setScanStatus('scanned'), 2500); 
      const timer2 = setTimeout(() => setScanStatus('success'), 4000); 
      const timer3 = setTimeout(() => navigate('/setup'), 5500); 
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }
  }, [showQR, navigate]);

  return (
    <div className="min-h-screen bg-white relative flex flex-col">
      <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-slate-50 to-white -z-10"></div>

      <div className="p-8 flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        
        <div className="text-center mb-10 mt-12">
          <h1 className="text-4xl font-black italic tracking-tighter text-[#E5202D] mb-4">
            TaskLah!
          </h1>
          <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-2">
            Welcome Back.
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Singapore's most trusted task marketplace.
          </p>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-green-800 text-xs font-black uppercase tracking-widest mb-1">PDPA Compliant</h3>
            <p className="text-green-700 text-[10px] font-medium leading-relaxed">
              TaskLah! uses Singpass Myinfo. We only request the minimum data required to secure the platform.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowQR(true)}
          className="w-full bg-[#E5202D] hover:bg-[#CC1D28] text-white p-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-red-200 active:scale-95 transition-all"
        >
          <div className="font-bold tracking-tight text-lg flex items-center">
            sing<span className="font-light">pass</span>
          </div>
          <div className="h-5 w-px bg-white/30 mx-1"></div>
          <span className="font-bold text-sm">Log in</span>
        </button>

        <div className="mt-6 text-center">
          <button className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center justify-center w-full gap-1">
            Other Login Methods <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => { setShowQR(false); setScanStatus('waiting'); }}
                className="absolute top-4 right-4 text-slate-400 p-2"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <div className="text-[#E5202D] font-bold text-2xl tracking-tight mb-2">
                  sing<span className="font-light">pass</span>
                </div>
                <h3 className="text-slate-800 font-bold">Log in with Singpass app</h3>
              </div>

              <div className="w-48 h-48 mx-auto border-2 border-slate-100 rounded-2xl p-2 mb-6 relative flex items-center justify-center">
                {scanStatus === 'waiting' && (
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=tasklah-myinfo-mock`} alt="QR Code" className="opacity-80" />
                )}
                {scanStatus === 'scanned' && (
                  <div className="flex flex-col items-center text-[#E5202D]">
                    <Smartphone className="animate-pulse mb-2" size={32} />
                    <span className="text-xs font-bold">Confirm on your phone...</span>
                  </div>
                )}
                {scanStatus === 'success' && (
                  <div className="flex flex-col items-center text-green-500">
                    <ShieldCheck size={48} />
                    <span className="text-sm font-bold mt-2">Identity Verified!</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                <Lock className="text-slate-400 shrink-0" size={16} />
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  By logging in, you agree to share your verified NRIC/FIN and full name via GovTech Myinfo.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  <div className={`min-height-screen flex flex-col items-center justify-center p-6 ${isSeniorMode ? 'bg-white' : 'bg-slate-900'}`}>

      <h1 className={`font-black tracking-tighter mb-2 ${isSeniorMode ? 'text-6xl text-red-600' : 'text-4xl text-white'}`}>

        TaskLah!

      </h1>

      

      <p className={`font-bold mb-12 ${isSeniorMode ? 'text-2xl text-slate-800' : 'text-slate-400'}`}>

        {isSeniorMode ? 'Tap below to log in safely' : 'Welcome back.'}

      </p>

 

      {/* The Mega-Button for Seniors */}

      <button className={`w-full flex items-center justify-center gap-4 rounded-3xl shadow-2xl transition-all active:scale-95 ${

        isSeniorMode 

        ? 'py-10 bg-red-600 border-8 border-red-100' 

        : 'py-4 bg-red-500'

      }`}>

        <img src="/singpass-logo.png" className={isSeniorMode ? 'h-12' : 'h-6'} alt="Singpass" />

        <span className={`font-black uppercase ${isSeniorMode ? 'text-4xl text-white' : 'text-xl text-white'}`}>

          Log In

        </span>

      </button>

 

      {!isSeniorMode && (

        <button className="mt-8 text-slate-500 font-bold uppercase tracking-widest text-xs">

          Other Login Methods {'>'}

        </button>

      )}

      

      {isSeniorMode && (

        <p className="mt-12 text-center text-slate-500 font-bold text-xl">

          🔒 Secure & PDPA Compliant

        </p>

      )}

    </div>

};

