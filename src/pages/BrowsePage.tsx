import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { Star, MapPin, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
export const BrowsePage = () => {
const [tasks, setTasks] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("https://021oj8qc13.execute-api.ap-southeast-1.amazonaws.com/tasks")
    .then(res => res.json())
    .then(data => {
      // Map TiDB field names to what the UI expects
      const mapped = (data.tasks || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        loc: t.location,
        price: t.bounty,
        cat: t.category,
        trust: 85,
        hot: false
      }));
      setTasks(mapped);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to fetch tasks:", err);
      setLoading(false);
    });
}, []);

  

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      
      {/* Hero Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 mt-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-1">Welcome back, Andrew</p>
        <h1 className="text-3xl font-black italic tracking-tighter leading-none mb-4">Ready to hustle?</h1>
        <div className="flex gap-2">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1">
            <MapPin size={12} /> SINGAPORE
          </span>
        </div>
      </motion.div>

      {/* Section Title */}
      <div className="flex justify-between items-end mb-4 px-2">
        <h2 className="text-slate-800 font-black italic uppercase text-lg tracking-tight">Nearby Quests</h2>
        <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest cursor-pointer">View All</span>
      </div>

      {/* Animated Task Cards */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }} // Staggered animation
          >
            <Link to={`/task/${task.id}`} className="block active:scale-95 transition-transform duration-200">
              <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-lg hover:border-blue-100 transition-all">
                
                {/* Hot Task Indicator */}
                {task.hot && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                    <Zap size={8} fill="white"/> High Demand
                  </div>
                )}

                <div className="flex justify-between items-start mb-2">
                  <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">{task.cat}</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">${task.price}</span>
                </div>
                
                <h3 className="font-bold text-slate-800 text-[17px] leading-tight mb-1 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mb-4">
                  <MapPin size={10} /> {task.loc}
                </p>
                
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 px-2">
                    <Star size={12} fill="#f59e0b" className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-700">{task.trust} Trust Score</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronRight size={16} strokeWidth={3} />
                  </div>
                  {/* Bid Button */}
<button
  onClick={async (e) => {
    e.preventDefault();
    const amount = prompt(`Enter your bid amount for "${task.title}" (SGD):`);
    if (!amount) return;
    try {
      const res = await fetch("https://021oj8qc13.execute-api.ap-southeast-1.amazonaws.com/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questId: task.id,
          taskerId: "tasker-demo-001",
          amount: parseFloat(amount)
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Bid of $${amount} placed successfully!`);
      } else {
        alert(data.message || "Failed to place bid");
      }
    } catch (err) {
      alert("Network error placing bid");
    }
  }}
  className="mt-2 w-full bg-blue-600 text-white text-[11px] font-bold py-1.5 rounded-lg hover:bg-blue-700 transition"
>
  Place Bid
</button>

                </div>

              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};



