
import React from 'react';

const TrendingTicker: React.FC = () => {
  const hashtags = [
    '#CLIMATEACTION', '#BREAKINGNEWS', '#CITIZENVOICE', '#TECHREPORT', 
    '#URBANDEVELOPMENT', '#GLOBALSOUTH', '#DEMOCRACYWATCH', '#HUMANRIGHTS',
    '#ELECTION2025', '#PUBLICSAFETY'
  ];

  return (
    <div className="bg-slate-900 py-3 overflow-hidden border-y border-slate-800">
      <div className="ticker-wrap">
        <div className="ticker-move">
          {hashtags.concat(hashtags).map((tag, i) => (
            <span key={i} className="text-white font-black italic px-8 text-sm tracking-widest uppercase">
              {tag} <span className="text-blue-500 mx-4">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingTicker;
