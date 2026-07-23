import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Zap, DollarSign, MapPin, ChevronDown, ChevronUp, Target, Award, RefreshCw } from 'lucide-react';

const API = 'https://021oj8qc13.execute-api.ap-southeast-1.amazonaws.com';
const TASKER_ID = 'tasker-demo-001';

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const statusIcon: Record<string, any> = {
  PENDING: <Clock size={12} />,
  ACCEPTED: <Zap size={12} />,
  COMPLETED: <CheckCircle2 size={12} />,
  REJECTED: <Target size={12} />,
};

export const MyBidsPage = () => {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBid, setExpandedBid] = useState<string | null>(null);

  const fetchMyBids = async () => {
    try {
      const res = await fetch(`${API}/bids/my?taskerId=${TASKER_ID}`);
      const data = await res.json();
      setBids(data.bids || []);
    } catch (err) {
      console.error('Failed to fetch bids:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBids();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse text-slate-400 font-bold uppercase tracking-widest text-sm">Loading Bids...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 min-h-screen pb-32">
      <div className="mb-6 mt-4">
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">My Bids</h1>
        <div className="flex items-center justify-between">
    <p className="text-sm font-medium text-slate-500">{loading ? "Refreshing..." : "Track your bids and quest status."}</p>
    <button 
      onClick={fetchMyBids} 
      className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition active:scale-95"
      disabled={loading}
    >
      <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
    </button>
  </div>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Target size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold uppercase tracking-widest text-sm">No bids yet</p>
          <p className="text-xs mt-1">Browse quests and place your first bid!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <motion.div
              key={bid.id}
              layout
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedBid(expandedBid === bid.id ? null : bid.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 ${statusColor[bid.status] || 'bg-slate-100 text-slate-600'}`}>
                    {statusIcon[bid.status]} {bid.status}
                  </span>
                  <span className="text-xl font-black text-slate-900">${bid.amount}</span>
                </div>

                <h3 className="font-bold text-slate-800 text-base leading-tight mb-1">{bid.title}</h3>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    <MapPin size={10} /> {bid.location || 'No location'}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <DollarSign size={10} />
                    Quest: ${bid.bounty}
                    {expandedBid === bid.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedBid === bid.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-100"
                  >
                    <div className="p-4 bg-slate-50 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        Quest Details
                      </p>
                      <div className="bg-white rounded-xl p-3 border border-slate-100">
                        <p className="text-xs text-slate-600 mb-1"><span className="font-bold">Category:</span> {bid.category || 'N/A'}</p>
                        <p className="text-xs text-slate-600 mb-1"><span className="font-bold">Quest Status:</span> {bid.quest_status}</p>
                        <p className="text-xs text-slate-600"><span className="font-bold">Posted by:</span> {bid.poster_id}</p>
                      </div>

                      {bid.status === 'ACCEPTED' && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                          <Award size={16} className="text-green-600" />
                          <p className="text-xs font-bold text-green-700">Your bid was accepted! Complete the quest to earn.</p>
                        </div>
                      )}

                      {bid.status === 'COMPLETED' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-blue-600" />
                          <p className="text-xs font-bold text-blue-700">Quest completed! Payment released.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
