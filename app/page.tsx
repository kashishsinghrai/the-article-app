import React, { useState, useMemo, useCallback } from 'react';
import { ArrowRight, Tag, BookOpen, Search, BarChart3, Map, Zap, Globe } from 'lucide-react';
import { Article, Category } from '../types';
import { toast } from 'react-hot-toast';
import TrendingTopics from '../components/TrendingTopics';

interface HomePageProps {
  articles: Article[];
  isLoggedIn: boolean;
  onLogin: () => void;
  userRole: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewProfile: (id: string) => void;
  onReadArticle?: (article: Article) => void;
  isArchive?: boolean;
  currentUserId?: string;
}

const HomePage: React.FC<HomePageProps> = ({ 
  articles, 
  isLoggedIn, 
  onLogin, 
  onViewProfile,
  onReadArticle,
  isArchive = false,
  currentUserId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') return articles;
    return articles.filter(a => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  const getCategoryIcon = (cat: Category, size = 12) => {
    switch (cat) {
      case 'Investigative': return <Search size={size} />;
      case 'Economic': return <BarChart3 size={size} />;
      case 'Regional': return <Map size={size} />;
      default: return <Tag size={size} />;
    }
  };

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case 'Investigative': return 'bg-blue-600 shadow-blue-500/20';
      case 'Economic': return 'bg-emerald-600 shadow-emerald-500/20';
      case 'Regional': return 'bg-amber-500 shadow-amber-500/20';
      default: return 'bg-slate-900 dark:bg-slate-700';
    }
  };

  if (!isLoggedIn && !isArchive) {
    return (
      <main className="flex flex-col">
        <section className="py-40 px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400">
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Decentralized Press Protocol</span>
          </div>
          <h1 className="text-7xl md:text-[9.5rem] font-black text-slate-900 dark:text-white tracking-[-0.06em] mb-12 uppercase italic transition-colors">
            Restore <span className="text-blue-600">The Truth</span>
          </h1>
          <button 
            onClick={onLogin}
            className="group relative inline-flex items-center gap-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-14 py-7 rounded-full text-lg font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl"
          >
            Enter The Network
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </section>

        <section className="max-w-7xl mx-auto px-6 mb-32">
          <TrendingTopics />
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-32">
       <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
          <div className="space-y-4">
             <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter transition-colors">
                {isArchive ? 'Global Archive' : 'Global Wire'}
             </h1>
          </div>
          <div className="flex gap-4 flex-wrap justify-end">
             <FilterTag label="All" active={selectedCategory === 'All'} onClick={() => setSelectedCategory('All')} />
             <FilterTag label="Investigative" active={selectedCategory === 'Investigative'} onClick={() => setSelectedCategory('Investigative')} />
             <FilterTag label="Economic" active={selectedCategory === 'Economic'} onClick={() => setSelectedCategory('Economic')} />
             <FilterTag label="Regional" active={selectedCategory === 'Regional'} onClick={() => setSelectedCategory('Regional')} />
          </div>
       </div>

       {filteredArticles.length === 0 ? (
         <div className="py-40 text-center opacity-30">
            <Zap size={48} className="mx-auto mb-6 text-slate-400" />
            <p className="text-2xl font-black uppercase italic tracking-widest text-slate-400">No Intelligence Logged</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {filteredArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="group cursor-pointer bg-white dark:bg-white/5 p-8 rounded-[3.5rem] border border-slate-100 dark:border-white/5 hover:border-blue-600 dark:hover:border-blue-600 transition-all duration-500"
                  onClick={() => onReadArticle?.(article)}
                >
                  <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 relative shadow-sm transition-all">
                    <img src={article.image_url || 'https://images.unsplash.com/photo-1585829365234-781fcd04c83e?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0" alt={article.title} />
                    
                    <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                      <div className={`${getCategoryColor(article.category)} backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg`}>
                        {getCategoryIcon(article.category)} {article.category}
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-500 flex items-center justify-center">
                       <div className="bg-white text-slate-900 w-16 h-16 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                          <BookOpen size={24} />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-4">
                        <span 
                          onClick={(e) => { e.stopPropagation(); onViewProfile(article.author_id); }}
                          className="hover:text-blue-600 dark:hover:text-blue-400 cursor-help"
                        >
                          Node: {article.author_name}
                        </span>
                      </div>
                      <span>{article.created_at}</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-[1.1] uppercase italic tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm line-clamp-2 leading-relaxed italic">
                      {article.content}
                    </p>
                  </div>
                </div>
              ))}
         </div>
       )}
    </main>
  );
};

const FilterTag = ({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${active ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-transparent text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white'}`}
  >
    {label}
  </button>
);

export default HomePage;