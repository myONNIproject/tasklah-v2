import { useState } from 'react';
import { ShieldAlert, Search, AlertOctagon, CheckCircle, Ban } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'audit'>('queue');
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation: Flagged items from the Stage 1/2 filters
  const [queue] = useState([
    { id: 'RPT-001', type: 'Keyword Flag', user: 'User489', content: 'call me on whatsapp', risk: 0.8, status: 'Pending' },
    { id: 'RPT-002', type: 'User Report', user: 'Felix T.', content: 'Off-platform payment requested', risk: 0.9, status: 'Pending' }
  ]);

  return (
    <div className="min-h-screen bg-slate-900 pb-32">
      
      {/* Admin Header */}
      <div className="bg-red-600 px-6 py-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3 text-white mb-2">
          <ShieldAlert size={28} />
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Ops Command</h1>
        </div>
        <p className="text-red-200 text-[10px] font-bold uppercase tracking-widest">Singapore (AP-SE-1) Moderation</p>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-4">
        <div className="bg-white p-1 rounded-2xl shadow-lg flex">
          <button 
            onClick={() => setActiveTab('queue')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'queue' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
          >
            Review Queue
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'audit' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 mt-4">
        {activeTab === 'queue' ? (
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <Search className="text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Content ID or User..." 
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-slate-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {queue.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={item.id} 
                className="bg-white rounded-[2rem] p-5 shadow-lg border-2 border-red-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-red-100 text-red-700 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider">{item.type}</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">ID: {item.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-red-600">{item.risk.toFixed(2)}</span>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Risk Score</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Flagged Content:</p>
                  <p className="text-sm font-medium text-slate-800">"{item.content}"</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform">
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform">
                    <Ban size={16} /> Hard Block
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-3xl p-8 text-center border border-slate-700">
            <AlertOctagon size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-white font-bold tracking-widest uppercase">Audit Log Locked</p>
            <p className="text-slate-400 text-xs mt-2">Requires Senior_Admin privilege.</p>
          </div>
        )}
      </div>
    </div>
  );
};
