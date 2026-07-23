import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, PlusSquare, User, Bell, ClipboardList } from 'lucide-react';
import { useTaskStore } from './store/useTaskStore';
import { SeniorModeProvider } from './context/SeniorModeContext';
import { Logo } from './components/Logo';
import { ChatbotWidget } from './components/ChatbotWidget';
import { SeniorToggle } from './components/SeniorToggle';

import { BrowsePage } from './pages/BrowsePage';
import { LoginPage } from './pages/LoginPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { MyQuestsPage } from './pages/MyQuestsPage';
import { MyBidsPage } from './pages/MyBidsPage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';
import { SetupPage } from './pages/SetupPage';
import { MessagingPage } from './pages/MessagingPage';
import { PostTaskPage } from './pages/PostTaskPage';
import { ProfilePage } from './pages/ProfilePage';
import { GuildsPage } from './pages/GuildsPage';

const AppContent = () => {
  const { user } = useTaskStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const isLoginPage = location.pathname === '/';
  const isSetupPage = location.pathname === '/setup';
  const hideNav = isLoginPage || isSetupPage;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center">
      <img src="/icon.png" className="w-24 h-24 animate-pulse rounded-full border-4 border-slate-800" />
      <h1 className="text-white text-xl font-black mt-6 tracking-widest uppercase italic">TaskLah!</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center overflow-x-hidden">
      <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative flex flex-col">
        
        {!hideNav && (
          <header className="bg-white/80 backdrop-blur-md px-4 py-5 sticky top-0 z-50 border-b border-slate-100 flex justify-between items-center">
            <Link to="/dashboard"><Logo size="sm" /></Link>
            <div className="flex gap-2 items-center relative">
              <SeniorToggle />
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 ml-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
            </div>
          </header>
        )}

        <main className={!hideNav ? 'pb-32 flex-1' : 'flex-1'}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/my-quests" element={<MyQuestsPage />} />
            <Route path="/my-bids" element={<MyBidsPage />} />
            <Route path="/task/:id" element={<TaskDetailPage />} />
            <Route path="/post" element={<PostTaskPage />} />
            <Route path="/messages" element={<MessagingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/dashboard" element={<AdminPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/guilds" element={<GuildsPage />} />
          </Routes>
        </main>

        <ChatbotWidget />

        {!hideNav && (
          <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 px-6 py-4 pb-10 flex justify-between items-center z-50">
            <Link to="/browse" className="flex flex-col items-center text-blue-600">
              <Search size={24} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase mt-1">Browse</span>
            </Link>
            <Link to="/post" className="flex flex-col items-center text-slate-400">
              <PlusSquare size={24} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase mt-1">Post</span>
            </Link>
            <Link to="/my-quests" className="flex flex-col items-center text-slate-400">
              <ClipboardList size={24} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase mt-1">Quests</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center text-slate-400">
              <User size={24} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase mt-1">Profile</span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SeniorModeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SeniorModeProvider>
  );
}