import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Zap, DollarSign, MapPin, ChevronDown, ChevronUp, UserCheck, RefreshCw, Check } from 'lucide-react';

const API = 'https://021oj8qc13.execute-api.ap-southeast-1.amazonaws.com';
const POSTER_ID = 'user-123';

const statusColor: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const statusIcon: Record<string, any> = {
  OPEN: <Clock size={12} />,
  IN_PROGRESS: <Zap size={12} />,
  COMPLETED: <CheckCircle2 size={12} />,
};

export const MyQuestsPage = () => {
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  const fetchMyQuests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/quests/my?posterId=${POSTER_ID}`);
      const data = await res.json();
      setQuests(data.quests || []);
    } catch (err) {
      console.error('Failed to fetch quests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyQuests();
  }, []);

  const handleAcceptBid = async (bidId: string, questId: string) => {
    setAccepting(bidId);
    try {
      const res = await fetch(`${API}/bids/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId, questId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Bid accepted! Quest is now IN_PROGRESS.');
        fetchMyQuests();
      } else {
        alert(data.message || 'Failed to accept bid');
      }
    } catch (err) {
      alert('Network error accepting bid');
    } finally {
      setAccepting(null);
    }
  };

  const handleCompleteQuest = async (questId: string) => {
    setCompleting(questId);
    try {
      const res = await fetch(`${API}/quests/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Quest completed! Payment released to Tasker.');
        fetchMyQuests();
      } else {
        alert(data.message || 'Failed to complete quest');
      }
    } catch (err) {
      alert('Network error completing quest');
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse text-slate-400 font-bold uppercase tracking-widest text-sm">Loading Quests...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 min-h-screen pb-32">
      <div className="mb-6 mt-4">
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">My Quests</h1>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">{loading ? 'Refreshing...' : 'Manage your posted tasks and incoming bids.'}</p>
          <button 
            onClick={fetchMyQuests} 
            className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition active:scale-95"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {quests.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Zap size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold uppercase tracking-widest text-sm">No quests yet</p>
          <p className="text-xs mt-1">Post your first quest to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quests.map((quest) => (
            <motion.div
              key={quest.id}
              layout
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedQuest(expandedQuest === quest.id ? null : quest.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 ${statusColor[quest.status] || 'bg-slate-100 text-slate-600'}`}>
                    {statusIcon[quest.status]} {quest.status}
                  </span>
                  <span className="text-xl font-black text-slate-900">${quest.bounty}</span>
                </div>

                <h3 className="font-bold text-slate-800 text-base leading-tight mb-1">{quest.title}</h3>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    <MapPin size={10} /> {quest.location || 'No location'}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <DollarSign size={10} />
                    {quest.bids?.length || 0} bid{quest.bids?.length !== 1 ? 's' : ''}
                    {expandedQuest === quest.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedQuest === quest.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-100"
                  >
                    <div className="p-4 bg-slate-50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                        Incoming Bids
                      </p>

                      {quest.bids?.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No bids yet. Hang tight!</p>
                      ) : (
                        <div className="space-y-2">
                          {quest.bids.map((bid: any) => (
                            <div
                              key={bid.id}
                              className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between"
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <UserCheck size={14} className="text-blue-500" />
                                  <span className="text-xs font-bold text-slate-700">{bid.tasker_id}</span>
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                    bid.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                    bid.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-500'
                                  }`}>
                                    {bid.status}
                                  </span>
                                </div>
                                <span className="text-lg font-black text-slate-900">${bid.amount}</span>
                              </div>

                              {quest.status === 'OPEN' && bid.status === 'PENDING' && (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAcceptBid(bid.id, quest.id)}
                                  disabled={accepting === bid.id}
                                  className="bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest px-3 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                  {accepting === bid.id ? 'Accepting...' : 'Accept'}
                                </motion.button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {quest.status === 'IN_PROGRESS' && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCompleteQuest(quest.id)}
                          disabled={completing === quest.id}
                          className="w-full mt-3 bg-green-600 text-white text-sm font-black uppercase tracking-widest py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {completing === quest.id ? (
                            <>
                              <Zap size={16} className="animate-pulse" /> Completing...
                            </>
                          ) : (
                            <>
                              <Check size={16} /> Complete Quest & Release Payment
                            </>
                          )}
                        </motion.button>
                      )}

                      {quest.status === 'COMPLETED' && (
                        <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-center gap-2">
                          <CheckCircle2 size={16} className="text-green-600" />
                          <p className="text-xs font-bold text-green-700">Quest completed! Payment released.</p>
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
