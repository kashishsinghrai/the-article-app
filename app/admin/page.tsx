
import React from 'react';
import { ShieldAlert, Trash2, Search, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Article } from '../../types';

interface AdminPageProps {
  articles: Article[];
  onDelete: (id: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ articles, onDelete }) => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-32">
       <div className="bg-slate-900 rounded-[3.5rem] p-16 text-white shadow-[0_64px_128px_-24px_rgba(15,23,42,0.4)] relative overflow-hidden">
          <ShieldAlert size={400} className="absolute -bottom-20 -right-20 text-white/[0.03] rotate-12" />
          
          <div className="relative z-10 space-y-20">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-blue-500">
                      <AlertCircle size={20} />
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">Authority Terminal</span>
                   </div>
                   <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">Intelligence <br/>Purge</h1>
                </div>
                <div className="bg-white/10 px-8 py-4 rounded-full border border-white/10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database Load</p>
                   <p className="text-2xl font-black italic">{articles.length} Records</p>
                </div>
             </div>

             <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-12 border border-white/10 space-y-8">
                <div className="flex items-center gap-6 bg-slate-950/50 px-8 py-4 rounded-full border border-white/5">
                   <Search className="text-slate-500" />
                   <input className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium" placeholder="Query Record ID..." />
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {articles.length === 0 ? (
                     <div className="text-center py-20 opacity-20">
                        <p className="text-4xl font-black italic uppercase">No Records Logged</p>
                     </div>
                   ) : articles.map(article => (
                     <div key={article.id} className="flex flex-col md:flex-row justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-red-500 transition-all group">
                        <div className="flex gap-6 items-center">
                           <img src={article.image_url} className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                           <div>
                              <h4 className="text-lg font-bold uppercase italic tracking-tight">{article.title}</h4>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Source: {article.author_name} • {article.created_at}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => onDelete(article.id)} 
                          className="mt-4 md:mt-0 flex items-center gap-2 px-8 py-3 bg-red-600/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 size={14} /> Purge Record
                        </button>
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </main>
  );
};

export default AdminPage;
