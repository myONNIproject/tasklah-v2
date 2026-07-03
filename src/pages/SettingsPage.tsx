import { useState, useEffect } from 'react';
import { User, Shield, CreditCard, ChevronRight, BellRing, Globe, LogOut } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { Link } from 'react-router-dom';

export const SettingsPage = () => {
  const { user } = useTaskStore();
  const [pushStatus, setPushStatus] = useState<string>('default');

  // Check current permission on load
  useEffect(() => {
    if ('Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  const requestPushPermissions = async () => {
    if (!('Notification' in window)) {
      alert("Your browser doesn't support push notifications.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      
      if (permission === 'granted') {
        new Notification("TaskLah! Notifications Enabled", {
          body: "You'll now receive alerts for new tasks and escrow updates.",
          icon: "/icon.png"
        });
      }
    } catch (error) {
      console.error("Error requesting push permissions", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Profile Header */}
      <div className="bg-blue-600 px-6 pt-8 pb-12 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full p-1 shadow-inner">
            <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
              <User size={32} className="text-slate-400" />
            </div>
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-black">{user.name}</h1>
            <p className="text-blue-100 font-medium text-sm flex items-center gap-1 mt-0.5">
              <Shield size={14} /> Singpass Verified
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Content */}
      <div className="px-4 -mt-6 relative z-20 space-y-4">
        
        {/* Account Menu block */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          
                  {/* --- ACCOUNT SETTINGS --- */}
          <Link to="/profile" className="w-full bg-white border-b border-slate-100 p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <User size={16} />
              </div>
              <span className="font-bold text-sm text-slate-800">My Profile & Badges</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </Link>


          
          {/* --- PAYMENT METHODS --- */}
          <button className="w-full bg-white border-b border-slate-100 p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <CreditCard size={16} />
              </div>
              <span className="font-bold text-sm text-slate-800">Payment Methods</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>

          {/* --- PUSH NOTIFICATIONS SETTING --- */}
          <div className="w-full bg-white border-b border-slate-100 p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <BellRing size={16} />
              </div>
              <span className="font-bold text-sm text-slate-800">Push Notifications</span>
            </div>
            
            {pushStatus === 'granted' ? (
              <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                Enabled
              </span>
            ) : (
              <button 
                onClick={requestPushPermissions}
                className="text-[10px] font-black uppercase text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
              >
                Enable
              </button>
            )}
          </div>

          {/* --- LANGUAGE SETTING --- */}
          <button className="w-full bg-white border-b border-slate-100 p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Globe size={16} />
              </div>
              <span className="font-bold text-sm text-slate-800">Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">English (SG)</span>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
          </button>

          {/* --- LOGOUT BUTTON --- */}
          <button className="w-full bg-white p-4 flex items-center justify-between hover:bg-red-50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-100">
                <LogOut size={16} />
              </div>
              <span className="font-bold text-sm text-red-600">Log Out</span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};
