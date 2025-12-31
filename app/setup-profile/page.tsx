import React, { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { Profile } from '../../types';

interface SetupProfilePageProps {
  onComplete: (data: Profile) => void;
}

const SetupProfilePage: React.FC<SetupProfilePageProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');

  const handleFinish = () => {
    if (!name || !username || !gender) return;
    const profile: Profile = {
      id: '', // Will be set by App.tsx using real auth UID
      full_name: name,
      username: username.toLowerCase().replace(/\s/g, '_'),
      gender: gender,
      serial_id: `#ART-0${Math.floor(1000 + Math.random() * 9000)}-IND`,
      budget: 150,
      role: 'user', // Default role
      is_private: false,
      bio: bio || 'Professional correspondent for the ThE-ARTICLES Global Network.',
      is_online: true
    };
    onComplete(profile);
  };

  const genders = ['Male', 'Female', 'Non-Binary', 'Transgender', 'Prefer not to say'];

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc] dark:bg-slate-950">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3.5rem] p-16 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 animate-in fade-in duration-700">
        <div className="text-center space-y-4 mb-16">
          <div className="bg-blue-50 dark:bg-blue-900/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-blue-600 mb-6">
             <ShieldCheck size={40} />
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic transition-colors">Identity Verification</h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Step 01: Establish Operational Credentials</p>
        </div>

        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">Full Legal Name</label>
               <input 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white transition-all"
                 placeholder="Alexander Pierce"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">Handle / Callsign</label>
               <input 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white transition-all"
                 placeholder="alex_reports"
               />
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">Gender Identity</label>
             <div className="flex flex-wrap gap-3">
                {genders.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${gender === g ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-transparent text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}
                  >
                    {g}
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">Professional Bio / Manifesto</label>
             <textarea 
               value={bio}
               onChange={(e) => setBio(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm font-medium dark:text-white transition-all"
               placeholder="Brief summary of your journalistic focus..."
               rows={4}
             />
          </div>

          <div className="pt-10 border-t border-slate-50 dark:border-slate-800">
             <button 
               onClick={handleFinish}
               disabled={!name || !username || !gender}
               className="w-full py-6 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 dark:hover:bg-blue-100 transition-all flex items-center justify-center gap-3 disabled:opacity-30 active:scale-[0.98]"
             >
               Finalize Credentials
               <Check size={20} />
             </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SetupProfilePage;