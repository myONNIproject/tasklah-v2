import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

import { useTaskStore } from './store/useTaskStore';
import { Logo } from './components/Logo';

// 1. ADD THE CHATBOT IMPORT HERE
import { ChatbotWidget } from './components/ChatbotWidget';

import { LoginPage } from './pages/LoginPage';
import { BrowsePage } from './pages/BrowsePage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { PostTaskPage } from './pages/PostTaskPage';
import { MessagingPage } from './pages/MessagingPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { SetupPage } from './pages/SetupPage';
import { Search, PlusSquare, User, MessageCircle, Zap, Star, Bell, Settings } from 'lucide-react';
import { ProfilePage } from './pages/ProfilePage';

// We create an inner component to handle the routing logic
const AppContent = () => {
  const { user } = useTaskStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Is it the login or setup page? If yes, hide the navigation.
  const isLoginPage = location.pathname === '/';
  const isSetupPage = location.pathname === '/setup';
  const hideNav = isLoginPage || isSetupPage;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center">
      <img src="/icon.png" className="w-24 h-24 animate-pulse rounded-full object-cover aspect-square border-4 border-slate-800" />
      <h1 className="text-white text-xl font-black mt-6 tracking-widest uppercase italic">TaskLah!</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center overflow-x-hidden">
      <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative flex flex-col">
        
               {/* --- DYNAMIC HEADER --- */}
        {!hideNav && (
          <header className="bg-white/80 backdrop-blur-md px-4 py-5 sticky top-0 z-50 border-b border-slate-100 flex justify-between items-center gap-4">
            <div className="flex-1">
              <Link to="/admin">
                <Logo size="sm" />
              </Link>
            </div>
            
            <div className="flex gap-2 items-center relative">
              {/* Stats */}
              <div className="bg-blue-600 text-white px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1 shadow-lg shadow-blue-200">
                <Zap size={8} fill="white" /> LVL {user.level}
              </div>
              <div className="bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1 shadow-sm">
                <Star size={8} fill="#f59e0b" className="text-amber-500" /> {user.trustScore.toFixed(1)}
              </div>
              
              {/* Notification Bell */}
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 ml-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Bell size={20} />
                {/* Red Unread Dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              {/* Notification Dropdown Menu */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-black text-xs uppercase tracking-wider text-slate-800">Notifications</span>
                    <span className="text-[10px] text-blue-600 font-bold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto flex flex-col">
                    
                    {/* Dummy Notification 1 */}
                    <div className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Zap size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 leading-tight">
                          <span className="font-bold text-slate-800">David Lee</span> offered to do your <span className="font-bold">IKEA Malm</span> task.
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1 font-medium uppercase">2 mins ago</p>
                      </div>
                    </div>

                    {/* Dummy Notification 2 */}
                    <div className="p-3 hover:bg-slate-50 cursor-pointer flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Star size={14} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 leading-tight">
                          Task complete! <span className="font-bold">Kiasu Kompromise</span> has released your $25 escrow.
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1 font-medium uppercase">1 hr ago</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </header>
        )}


        {/* --- MAIN CONTENT AREA --- */}
        <main className={`flex-1 ${!isLoginPage ? 'pb-32 overflow-y-auto' : ''}`}>
                   <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/task/:id" element={<TaskDetailPage />} />
            <Route path="/post" element={<PostTaskPage />} />
            <Route path="/messages" element={<MessagingPage />} />
            <Route path="/dashboard" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/profile" element={<ProfilePage />} />  {/* MAKE SURE THIS IS HERE */}
          </Routes>

        </main>

        {/* 2. DROP THE CHATBOT HERE! It will float above everything else. */}
        <ChatbotWidget />

        {/* --- DYNAMIC BOTTOM NAVIGATION --- */}
        {!hideNav && (
          <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 px-6 py-4 pb-10 flex justify-around items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <Link to="/browse" className="flex flex-col items-center text-blue-600">
              <Search size={24} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase mt-1">Browse</span>
            </Link>
            <Link to="/post" className="flex flex-col items-center text-slate-400 hover:text-blue-500 transition-colors">
              <PlusSquare size={24} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase mt-1">Post</span>
            </Link>
            <Link to="/messages" className="flex flex-col items-center text-slate-400 hover:text-blue-500 transition-colors">
              <MessageCircle size={24} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase mt-1">Chats</span>
            </Link>
                       <Link to="/dashboard" className="flex flex-col items-center text-slate-400 hover:text-blue-500 transition-colors">
              <Settings size={24} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase mt-1">Settings</span>
            </Link>

          </nav>
        )}

      </div>
    </div>
  );
};

// Main App wrapper provides the routing context
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
