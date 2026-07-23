import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Award, Star, Share2, ChevronRight, PlusSquare, Target, Handshake, CheckCircle2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const API = 'https://021oj8qc13.execute-api.ap-southeast-1.amazonaws.com';

export const ProfilePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/badges?userId=user-123`)
      .then(res => res.json())
      .then(data => setBadges(data.badges || []))
      .catch(err => console.error('Failed to fetch badges:', err));
  }, []);

  const iconMap: Record<string, JSX.Element> = {
    Shield: <Shield size={14} className="text-blue-500" />,
    Zap: <Zap size={14} className="text-amber-500" />,
    Award: <Award size={14} className="text-purple-500" />,
    PlusSquare: <PlusSquare size={14} className="text-green-500" />,
    Target: <Target size={14} className="text-blue-500" />,
    Handshake: <Handshake size={14} className="text-amber-500" />,
    CheckCircle2: <CheckCircle2 size={14} className="text-green-500" />,
    DollarSign: <DollarSign size={14} className="text-emerald-500" />,
  };

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100',
    amber: 'bg-amber-100',
    purple: 'bg-purple-100',
    green: 'bg-green-100',
    emerald: 'bg-emerald-100',
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Profile Header */}
      <div className="bg-white p-6 pt-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter">ANDREW WONG</h1>
            <p className="text-xs font-bold text-slate-500">L1 • LVL 1</p>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4">
          {[1,2,3,4,5].map((_, i) => (
            <Star key={i} size={14} className={i < 3 ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
          ))}
          <span className="text-xs font-bold text-slate-400 ml-1">3.5</span>
        </div>

        {/* Trust Score */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-slate-600">Trust Score</span>
            <span className="text-slate-900">85%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-xl font-black text-slate-900">12</p>
            <p className="text-[10px] font-bold uppercase text-slate-500">Tasks Completed</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-xl font-black text-slate-900">$340</p>
            <p className="text-[10px] font-bold uppercase text-slate-500">Total Earned</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="p-4">
        <h2 className="text-lg font-black italic tracking-tighter mb-3">Earned Badges</h2>
        {badges.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No badges earned yet. Complete quests to unlock!</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge, idx) => (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.95 }}
                className={`${colorMap[badge.color] || 'bg-slate-100'} rounded-xl p-3 flex flex-col items-center gap-2`}
              >
                {iconMap[badge.icon] || <Award size={14} className="text-slate-500" />}
                <span className="text-[10px] font-black uppercase text-center leading-tight">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Level Progress */}
      <div className="px-4 mb-6">
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="text-slate-600">Level Up</span>
          <span className="text-slate-900">340/500 XP</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }} />
        </div>
      </div>

      {/* Referral */}
      <div className="px-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-2">The Kaki Chain</h3>
          <p className="text-xs text-slate-500 mb-3">Refer a Kaki, earn $20</p>
          <button className="w-full bg-blue-600 text-white text-sm font-black uppercase py-3 rounded-xl flex items-center justify-center gap-2">
            <Share2 size={16} />
            Share Invite Link
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[10px] font-bold text-slate-400">Member since May 2026 • TL-ID: #880227</p>
      </div>
    </div>
  );
};
