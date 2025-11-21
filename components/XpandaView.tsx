
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Layout, Smartphone, Zap, Eye } from 'lucide-react';
import XpandaComponent from './XpandaComponent';

const data = [
  { subject: 'Performance', A: 120, fullMark: 150 },
  { subject: 'A11y', A: 98, fullMark: 150 },
  { subject: 'SEO', A: 86, fullMark: 150 },
  { subject: 'Design', A: 99, fullMark: 150 },
  { subject: 'Reusability', A: 85, fullMark: 150 },
  { subject: 'DX', A: 95, fullMark: 150 },
];

const XpandaView: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero for Xpanda */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 to-slate-900 p-8 md:p-12 border border-emerald-800/50">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-mono border border-emerald-500/30">v2.4.0-stable</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">xpanda</h1>
          <p className="text-emerald-100/80 text-lg leading-relaxed">
            The frontend framework designed for the next generation of web interfaces. 
            Pixel-perfect, lightning-fast, and built for the xrhino ecosystem.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-colors">
              Get Started
            </button>
            <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-600">
              Documentation
            </button>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#10b981" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.7C91.4,-34.3,98.1,-19.6,95.8,-5.4C93.5,8.8,82.2,22.5,70.6,33.6C59,44.7,47.1,53.2,34.5,61.3C21.9,69.4,8.6,77.1,-3.4,83C-15.4,88.9,-29.8,93,-41.4,86.3C-53,79.6,-61.8,62.1,-69.7,46.4C-77.6,30.7,-84.6,16.8,-84.1,3.1C-83.6,-10.6,-75.6,-24.1,-65.4,-34.7C-55.2,-45.3,-42.8,-53,-30.5,-61.3C-18.2,-69.6,-6,-78.5,7.4,-91.3L20.8,-104.1" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Layout, title: 'Component First', desc: 'Atomic design principles built-in.' },
          { icon: Zap, title: 'Zero Runtime', desc: 'Compiles away for maximum speed.' },
          { icon: Smartphone, title: 'Adaptive Touch', desc: 'Mobile-native feel on the web.' },
        ].map((feature, idx) => (
          <div key={idx} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all">
            <feature.icon className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* New Components Showcase using XpandaComponent */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Core Philosophies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <XpandaComponent 
            title="Declarative Syntax" 
            description="Write UI that is predictable and easy to debug. Our API surface is minimal by design, letting you focus on what matters." 
          />
          <XpandaComponent 
            title="Type Safety" 
            description="Built with strict TypeScript configuration. Catch errors at compile time, not runtime, ensuring robust applications." 
          />
        </div>
      </div>

      {/* Visualization Section */}
      <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Eye className="text-emerald-400" />
              Visual Benchmarks
            </h2>
            <p className="text-slate-400">
              xpanda outperforms traditional frameworks in layout shift stability and interaction readiness.
              See how your app scores against industry standards.
            </p>
            <div className="p-4 bg-slate-800 rounded-lg font-mono text-sm text-emerald-300">
              $ npx xpanda audit --visual<br/>
              > Running generic lighthouse checks...<br/>
              > Score: 99/100
            </div>
          </div>
          <div className="flex-1 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="xpanda"
                  dataKey="A"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XpandaView;
