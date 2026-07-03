import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Image as ImageIcon, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/useTaskStore';

export const MessagingPage = () => {
  const navigate = useNavigate();
  const { user } = useTaskStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulation: Pre-existing chat history
  const [chatLog, setChatLog] = useState([
    { id: 1, sender: 'other', text: 'Hi Andrew, I can deliver the Chicken Rice by 1:15 PM.', time: '12:05 PM' },
    { id: 2, sender: 'me', text: 'Perfect! Please make sure the chilli sauce is included.', time: '12:08 PM' },
    { id: 3, sender: 'other', text: 'Noted. I am at Maxwell now.', time: '12:15 PM' },
  ]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add to log
    setChatLog([...chatLog, { 
      id: Date.now(), 
      sender: 'me', 
      text: message, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative">
      
      {/* --- HEADER: Recipient Info --- */}
      <div className="bg-white px-4 py-4 border-b border-slate-100 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-slate-100 transition-colors">
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-black text-slate-800 leading-none mb-1">Felix T.</h2>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={10} className="text-green-500" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID Verified</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider block mb-1">Quest: #8892</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">In Progress</span>
        </div>
      </div>

      {/* --- TRUST REMINDER BANNER --- */}
      <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center gap-2">
        <ShieldAlert size={14} className="text-amber-600 shrink-0" />
        <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wide leading-tight">
          Keep all comms in-app. Off-platform chats cannot be used in disputes.
        </p>
      </div>

      {/* --- CHAT HISTORY --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {chatLog.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                msg.sender === 'me' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
              }`}
            >
              <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
            </div>
            <span className="text-[9px] font-bold text-slate-400 mt-1">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* --- MESSAGE INPUT --- */}
      <div className="absolute bottom-[80px] w-full max-w-md bg-white border-t border-slate-100 p-4">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-[2rem] p-1.5 pr-2 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-inner">
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <ImageIcon size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium px-2 placeholder:text-slate-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className={`p-2.5 rounded-full transition-all ${message.trim() ? 'bg-blue-600 text-white shadow-md active:scale-95' : 'bg-slate-200 text-slate-400'}`}
          >
            <Send size={16} className={message.trim() ? 'ml-0.5' : ''} />
          </button>
        </div>
      </div>

    </div>
  );
};
