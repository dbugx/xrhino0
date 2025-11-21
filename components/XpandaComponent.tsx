
import React from 'react';

interface XpandaComponentProps {
  title: string;
  description: string;
}

const XpandaComponent: React.FC<XpandaComponentProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col p-6 bg-slate-800/40 border border-slate-700 rounded-xl hover:border-emerald-500/50 transition-all duration-300 hover:bg-slate-800/60 group cursor-default">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-1 rounded bg-emerald-500 group-hover:w-12 transition-all duration-300"></div>
        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default XpandaComponent;
