import { useState, useEffect } from 'react';
import { useSeniorMode } from '../context/SeniorModeContext'; // or wherever your hook is
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldAlert, AlertTriangle, Send, MapPin, DollarSign, Tag, CheckCircle2, CreditCard, Heart, ShoppingCart, Home, Wrench, Shield, ArrowLeft } from 'lucide-react';

// Paste this INSIDE PostTaskPage.tsx, above the main component

 

const SeniorPostTaskFlow = ({ onSubmit }: { onSubmit: (data: any) => void }) => {

  const [step, setStep] = useState(1);

  const [category, setCategory] = useState('');

  const [details, setDetails] = useState({ location: '', datetime: '', notes: '' });

  const [contact, setContact] = useState({ name: '', phone: '' });

 

  const cats = [

    { id: 'medical', label: 'Medical Escort', color: 'bg-red-500', icon: Heart },

    { id: 'groceries', label: 'Groceries', color: 'bg-blue-500', icon: ShoppingCart },

    { id: 'cleaning', label: 'Cleaning', color: 'bg-amber-500', icon: Home },

    { id: 'tech', label: 'Tech Help', color: 'bg-emerald-500', icon: Wrench },

  ];

 

  const CatIcon = ({ icon: I }: { icon: any }) => <I size={40} strokeWidth={2} />;

 

  if (step === 1) return (

    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-3xl font-bold text-center mb-8">What help do you need?</h1>

      <div className="grid grid-cols-2 gap-4">

        {cats.map(c => (

          <button key={c.id} onClick={() => { setCategory(c.id); setStep(2); }}

            className={`${c.color} text-white p-6 rounded-2xl shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-3`}>

            <CatIcon icon={c.icon} />

            <span className="text-xl font-bold">{c.label}</span>

          </button>

        ))}

      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">

        <Shield size={20} /> <span className="text-sm font-medium">TRINITY OF TRUST PROTECTED</span>

      </div>

    </div>

  );

 

  if (step === 2) return (

    <div className="p-6 max-w-md mx-auto">

      <button onClick={() => setStep(1)} className="mb-4 flex items-center gap-2 text-gray-500 text-lg"><ArrowLeft size={20} /> Back</button>

      <h1 className="text-2xl font-bold mb-6">{cats.find(c => c.id === category)?.label} Help</h1>

      <div className="space-y-5">

        <div><label className="block text-lg font-bold mb-2">Where?</label>

          <input className="w-full p-4 text-xl border-2 rounded-xl focus:border-blue-500 outline-none" placeholder="Your address" value={details.location} onChange={e => setDetails({...details, location: e.target.value})} /></div>
<div>
  <label className="block text-lg font-bold mb-2">What day?</label>
  <input
    type="date"
    value={details.datetime.split(' ')[0] || ''}
    onChange={(e) => setDetails({...details, datetime: e.target.value + ' ' + (details.datetime.split(' ')[1] || '')})}
    className="w-full p-4 text-xl border-2 rounded-xl focus:border-blue-500 outline-none"
  />
</div>

<div>
  <label className="block text-lg font-bold mb-2">What time?</label>
  <div className="grid grid-cols-3 gap-3">
    {['Morning', 'Afternoon', 'Evening'].map((time) => (
      <button
        key={time}
        onClick={() => setDetails({...details, datetime: (details.datetime.split(' ')[0] || '') + ' ' + time})}
        className={`p-4 rounded-xl text-lg font-bold border-2 transition-all ${
          details.datetime.includes(time) 
            ? 'bg-blue-500 text-white border-blue-500' 
            : 'bg-white text-gray-700 border-gray-300'
        }`}
      >
        {time}
      </button>
    ))}
  </div>
</div>

        <div><label className="block text-lg font-bold mb-2">Anything else?</label>

          <textarea className="w-full p-4 text-xl border-2 rounded-xl focus:border-blue-500 outline-none" rows={3} placeholder="Tell us more..." value={details.notes} onChange={e => setDetails({...details, notes: e.target.value})} /></div>

        <button onClick={() => setStep(3)} className="w-full bg-blue-600 text-white text-2xl font-bold p-5 rounded-2xl shadow-lg active:scale-95 transition-transform">Next →</button>

      </div>

    </div>

  );

 

  return (

    <div className="p-6 max-w-md mx-auto">

      <button onClick={() => setStep(2)} className="mb-4 flex items-center gap-2 text-gray-500 text-lg"><ArrowLeft size={20} /> Back</button>

      <h1 className="text-2xl font-bold mb-2">Almost done!</h1>

      <p className="text-gray-500 mb-6">Emergency contact (optional)</p>

      <div className="space-y-5 mb-6">

        <input className="w-full p-4 text-xl border-2 rounded-xl focus:border-blue-500 outline-none" placeholder="Contact name" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} />

        <input className="w-full p-4 text-xl border-2 rounded-xl focus:border-blue-500 outline-none" placeholder="Phone number" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} />

      </div>

      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">

        <div className="flex items-center gap-2 mb-1"><Shield size={18} className="text-amber-700" /><h3 className="text-lg font-bold text-amber-800">Senior Safety Net</h3></div>

        <p className="text-amber-700 text-sm">We'll notify your contact when a Tasker accepts.</p>

      </div>

      <button onClick={() => onSubmit({ isSeniorMode: true, seniorCategory: category, ...details, emergencyContact: contact })} className="w-full bg-red-500 text-white text-2xl font-bold p-5 rounded-2xl shadow-lg active:scale-95 transition-transform">YES, POST HELP!</button>

    </div>

  );

};
// Initialize Stripe outside component
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const TaskForm = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
const API_URL = "https://021oj8qc13.execute-api.ap-southeast-1.amazonaws.com/tasks";

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [bounty, setBounty] = useState('');
  const [location, setLocation] = useState('');

  const [securityFlags, setSecurityFlags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // <-- Our new animation state!

  const RED_LINE_KEYWORDS = ['paylah', 'paynow', 'whatsapp', 'telegram', 'cash outside', 'off app'];

  useEffect(() => {
    const flags: string[] = [];
    const lowerTitle = title.toLowerCase();
    
    RED_LINE_KEYWORDS.forEach(keyword => {
      if (lowerTitle.includes(keyword)) {
        flags.push(`Keyword detected: "${keyword}". All payments and comms must remain on TaskLah!`);
      }
    });

    if (parseFloat(bounty) < 5) {
      flags.push('Minimum bounty is $5.00 SGD to ensure fair Tasker compensation.');
    }

    setSecurityFlags(flags);
  }, [title, bounty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (securityFlags.length > 0) {
      alert("Please resolve security flags before posting.");
      return;
    }

    if (!title || !category || !bounty || !location) {
      alert("Please fill in all fields.");
      return;
    }

    if (!stripe || !elements) {
      alert("Stripe hasn't loaded yet. Please wait a second.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Bypassing AWS Stripe check for UI prototyping...");
      const clientSecret = "dummy_secret_for_prototype";

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      console.log("Simulating secure Stripe hold with secret:", clientSecret);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const taskPayload = {
        title,
        category,
        bounty: parseFloat(bounty),
        location,
        posterId: 'user-123', 
      };

const dbResponse = await fetch(

  "https://021oj8qc13.execute-api.ap-southeast-1.amazonaws.com/tasks",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskPayload),
      });

      if (!dbResponse.ok) {
        throw new Error(`Failed to save task to database: ${dbResponse.status}`);
      }
      
      // TRIGGER THE SUCCESS ANIMATION!
      setShowSuccess(true);
      
      // Wait 2.5 seconds, then go to Browse page
      setTimeout(() => {
        navigate('/browse');
      }, 2500);

    } catch (error: any) {
      console.error("Task creation failed:", error);
      alert(`Error details: ${error.message}`);
      setIsSubmitting(false); // Only stop submitting if it fails
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-32">
      {/* Title Input */}
      <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
        <input 
          type="text" 
          placeholder="What do you need? (e.g., Deliver Laksa)" 
          className="w-full bg-transparent p-4 outline-none font-bold text-slate-800 text-lg placeholder:text-slate-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-xl"><Tag size={18} className="text-blue-600" /></div>
          <select 
            className="bg-transparent outline-none w-full font-bold text-sm text-slate-700 appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Category</option>
            <option value="Delivery">Delivery</option>
            <option value="Home">Home</option>
            <option value="Education">Education</option>
          </select>
        </div>

        {/* Bounty */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="bg-amber-50 p-2 rounded-xl"><DollarSign size={18} className="text-amber-600" /></div>
          <input 
            type="number" 
            placeholder="Budget" 
            className="bg-transparent outline-none w-full font-bold text-sm text-slate-700"
            value={bounty}
            onChange={(e) => setBounty(e.target.value)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-3">
        <div className="bg-indigo-50 p-2 rounded-xl"><MapPin size={18} className="text-indigo-600" /></div>
        <input 
          type="text" 
          placeholder="Location (e.g., Clementi)" 
          className="bg-transparent outline-none w-full font-bold text-sm text-slate-700"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* STRIPE PAYMENT SECTION */}
      <div className="bg-slate-900 rounded-[2rem] p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
        
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <CreditCard size={18} className="text-blue-400" />
          <h3 className="text-white text-xs font-black uppercase tracking-widest">Escrow Payment</h3>
        </div>
        
        <div className="bg-white p-4 rounded-xl relative z-10">
          <CardElement 
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1e293b',
                  '::placeholder': { color: '#94a3b8' },
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                },
              },
            }} 
          />
        </div>
        
        <p className="text-slate-400 text-[10px] font-medium leading-tight mt-3 text-center relative z-10">
          Your card is securely held by Stripe. It will only be charged when the task is completed and verified.
        </p>
      </div>

      {/* Submit Button */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={securityFlags.length > 0 || isSubmitting || !stripe}
        className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl transition-all ${
          securityFlags.length > 0 
            ? 'bg-slate-200 text-slate-400 shadow-none' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
        }`}
      >
        {isSubmitting ? (
          'Securing Funds...'
        ) : (
          <>
            {securityFlags.length > 0 ? <ShieldAlert size={20} /> : <Send size={20} />}
            Launch Quest
          </>
        )}
      </motion.button>

      {/* SUCCESS ANIMATION OVERLAY */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center w-full max-w-sm text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white -z-10"></div>
              
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-inner"
              >
                <CheckCircle2 size={48} strokeWidth={3} />
              </motion.div>
              
              <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-2">Quest Launched!</h2>
              <p className="text-sm font-medium text-slate-500">Your bounty is secure. Taskers are being notified.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};
export const PostTaskPage = () => {
  const navigate = useNavigate();
  const { isSeniorMode } = useSeniorMode();

const handleSeniorSubmit = async (data: any) => {
  const DEMO_MODE = true;
  alert('Posting your help request...');
  
  if (DEMO_MODE) {
    await new Promise(r => setTimeout(r, 1000));
    alert('Posted successfully!');
    navigate('/browse');
    return;
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.seniorCategory,
        category: data.seniorCategory,
        location: data.location,
        bounty: '15',
        description: data.notes || 'No notes'
      })
    });
    
    if (response.ok) {
      alert('Posted!');
      navigate('/browse');
    } else {
      alert('Server error: ' + response.status);
    }
  } catch (error) {
    alert('Connection failed');
  }
};
if (isSeniorMode) {

  return <SeniorPostTaskFlow onSubmit={handleSeniorSubmit} />;
}

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <div className="mb-6 mt-4">
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">Post a Quest</h1>
        <p className="text-sm font-medium text-slate-500">Need something done? The Kaki network is ready.</p>
      </div>

      <Elements stripe={stripePromise}>
        <TaskForm />
      </Elements>
      
      {/* Trust Note */}
      <div className="flex items-center justify-center gap-2 pb-8 mt-8 text-slate-400">
        <CheckCircle2 size={14} />
        <p className="text-[10px] font-bold uppercase tracking-widest">Protected by Trinity of Trust</p>
      </div>
    </div>
  );
};
