import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, Server, Terminal, Lock } from 'lucide-react';
import { LogEntry } from '../types';

const data = [
  { name: '00:00', rps: 4000 },
  { name: '04:00', rps: 3000 },
  { name: '08:00', rps: 2000 },
  { name: '12:00', rps: 2780 },
  { name: '16:00', rps: 1890 },
  { name: '20:00', rps: 2390 },
  { name: '23:59', rps: 3490 },
];

const fakeLogs: LogEntry[] = [
  { id: 1, timestamp: '10:23:41', level: 'INFO', message: 'Connection pool initialized [500/500]' },
  { id: 2, timestamp: '10:23:42', level: 'INFO', message: 'Migration applied: 2024_05_add_users' },
  { id: 3, timestamp: '10:24:15', level: 'WARN', message: 'High latency detected on node-us-east-4' },
  { id: 4, timestamp: '10:25:00', level: 'INFO', message: 'Snapshot created successfully' },
];

const XtigerView: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(fakeLogs);

  // Simulate live logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        level: Math.random() > 0.9 ? 'WARN' : 'INFO',
        message: Math.random() > 0.7 ? 'Incoming request validated' : 'Heartbeat signal received'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 6));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero for Xtiger */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-900 to-slate-900 p-8 md:p-12 border border-orange-800/50">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-mono border border-orange-500/30">v1.0.2-LTS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">xtiger</h1>
          <p className="text-orange-100/80 text-lg leading-relaxed">
            The industrial-strength backend engine. Secure by default, scalable by design, 
            and ready for your mission-critical workloads in the xrhino ecosystem.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors">
              Deploy Instance
            </button>
            <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-600">
              API Docs
            </button>
          </div>
        </div>
        
        {/* Hexagon Pattern BG */}
        <div className="absolute right-0 bottom-0 opacity-10">
           <Server size={300} className="text-orange-500 transform translate-y-1/4 translate-x-1/4" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stats Chart */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="text-orange-500" />
              Throughput (RPS)
            </h3>
            <span className="text-green-400 text-sm font-mono">● Online</span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Area type="monotone" dataKey="rps" stroke="#f97316" fillOpacity={1} fill="url(#colorRps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Terminal */}
        <div className="bg-black p-6 rounded-xl border border-slate-800 font-mono text-sm shadow-inner relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-xs text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> root@xtiger-core</span>
           </div>
           <div className="mt-6 space-y-2 h-[250px] overflow-hidden relative">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3">
                  <span className="text-slate-500">[{log.timestamp}]</span>
                  <span className={`${log.level === 'WARN' ? 'text-yellow-400' : 'text-blue-400'}`}>{log.level}</span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
              <div className="animate-pulse text-orange-500 mt-2">_</div>
           </div>
        </div>
      </div>

      {/* Features List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
           { icon: Lock, title: 'Encrypted Streams', desc: 'ChaCha20-Poly1305 default encryption.' },
           { icon: Terminal, title: 'CLI First', desc: 'Control everything from your terminal.' },
           { icon: Server, title: 'Edge Ready', desc: 'Deploy to global edge networks instantly.' },
        ].map((f, i) => (
           <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
              <div className="p-2 bg-orange-900/30 rounded text-orange-500">
                 <f.icon size={20} />
              </div>
              <div>
                 <h4 className="font-bold text-white">{f.title}</h4>
                 <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default XtigerView;
