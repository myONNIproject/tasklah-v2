import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Upload, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

export const SetupPage = () => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  const categories = [
    'Delivery & Errands', 'Home & Assembly', 
    'Tutoring & Education', 'Moving', 
    'Pet Care', 'Events'
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleUpload = () => {
    // Simulate a file upload delay
    setTimeout(() => setFileUploaded(true), 1000);
  };

  return (
    <div className="min-h-screen bg-white pb-32 pt-8 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-2">
            Build Your Profile
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Singpass verified your ID. Now tell the community what you can do.
          </p>
        </div>

        {/* Form Sections */}
        <div className="space-y-8">
          
          {/* Bio Section */}
          <section>
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              <Briefcase size={16} /> About You
            </label>
            <textarea 
              rows={3}
              placeholder="E.g., I'm a university student who loves fixing IKEA furniture and walking dogs..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 transition-colors resize-none text-slate-700 font-medium"
            />
          </section>

          {/* Skills Section */}
          <section>
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              <Award size={16} /> Your Skill Sets
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Certifications Upload */}
          <section>
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              <ShieldCheck size={16} /> Certifications & Licenses
            </label>
            
            <button 
              onClick={handleUpload}
              className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${
                fileUploaded 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              {fileUploaded ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center text-green-600">
                  <CheckCircle2 size={32} className="mb-2" />
                  <span className="text-sm font-bold">Food Hygiene Cert.pdf</span>
                  <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">Uploaded Successfully</span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Upload size={32} className="mb-2" />
                  <span className="text-sm font-bold text-slate-600">Upload Documents</span>
                  <span className="text-[10px] font-medium mt-1 text-center px-4">
                    e.g., Class 3 Driving License, Food Hygiene Certificate, First Aid
                  </span>
                </div>
              )}
            </button>
          </section>

        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/browse')}
          className="w-full mt-10 bg-slate-900 text-white p-4 rounded-xl font-bold tracking-widest uppercase text-sm shadow-xl flex items-center justify-center gap-2"
        >
          Complete Setup
        </motion.button>
        
      </motion.div>
    </div>
  );
};
