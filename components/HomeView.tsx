import React from 'react';
import { ArrowRight, Layers, Code, Users } from 'lucide-react';
import { ViewState } from '../types';

interface HomeViewProps {
  setView: (view: ViewState) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setView }) => {
  return (
    <div className="space-y-20 animate-fade-in pb-20">
      
      {/* Main Hero */}
      <div className="text-center space-y-8 pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>RhinoBot Community AI is online</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tight">
          xrhino
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          One community. Two powerful engines. 
          <span className="text-emerald-400 font-semibold"> xpanda</span> for the eyes, 
          <span className="text-orange-400 font-semibold"> xtiger</span> for the muscle.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button 
            onClick={() => setView(ViewState.COMMUNITY)}
            className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            Join Community
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold border border-slate-700 hover:bg-slate-700 transition-colors">
            Read Manifesto
          </button>
        </div>
      </div>

      {/* Product Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* XPANDA CARD */}
        <div 
          onClick={() => setView(ViewState.XPANDA)}
          className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer h-[400px]"
        >
          <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="relative p-8 h-full flex flex-col justify-between z-10">
             <div>
               <Layers className="w-12 h-12 text-emerald-500 mb-6" />
               <h2 className="text-3xl font-bold text-white mb-2">xpanda</h2>
               <p className="text-slate-400">The frontend framework that feels like magic.</p>
             </div>
             <div className="flex items-center text-emerald-400 font-medium group-hover:translate-x-2 transition-transform">
               Explore Frontend <ArrowRight className="w-4 h-4 ml-2" />
             </div>
          </div>
          {/* Abstract Visual */}
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all"></div>
        </div>

        {/* XTIGER CARD */}
        <div 
          onClick={() => setView(ViewState.XTIGER)}
          className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer h-[400px]"
        >
          <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors"></div>
          <div className="relative p-8 h-full flex flex-col justify-between z-10">
             <div>
               <Code className="w-12 h-12 text-orange-500 mb-6" />
               <h2 className="text-3xl font-bold text-white mb-2">xtiger</h2>
               <p className="text-slate-400">The backend engine that never sleeps.</p>
             </div>
             <div className="flex items-center text-orange-400 font-medium group-hover:translate-x-2 transition-transform">
               Explore Backend <ArrowRight className="w-4 h-4 ml-2" />
             </div>
          </div>
          {/* Abstract Visual */}
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-orange-500/20 blur-3xl rounded-full group-hover:bg-orange-500/30 transition-all"></div>
        </div>

      </div>

      {/* Community Teaser */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 rounded-3xl p-8 md:p-12 text-center border border-indigo-500/30 relative overflow-hidden">
        <div className="relative z-10">
          <Users className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Powered by Intelligence</h2>
          <p className="text-slate-300 max-w-lg mx-auto mb-8">
            Need help configuring your xtiger database or styling your xpanda components? 
            Our AI-powered community manager is here to assist 24/7.
          </p>
          <button 
            onClick={() => setView(ViewState.COMMUNITY)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-indigo-500/25"
          >
            Talk to RhinoBot
          </button>
        </div>
      </div>

    </div>
  );
};

export default HomeView;