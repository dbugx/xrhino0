import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import XpandaView from './components/XpandaView';
import XtigerView from './components/XtigerView';
import ChatBot from './components/ChatBot';
import StudioView from './components/StudioView';
import VoiceLounge from './components/VoiceLounge';
import { ViewState, UserProfile, Notification } from './types';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    avatar: '',
    isLoggedIn: false,
    preferences: { notifications: true, theme: 'dark' }
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simulate fetching notifications on load
  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        { id: '1', title: 'xpanda v2.5 Beta', message: 'Early access is now open.', timestamp: Date.now(), read: false, type: 'xpanda' },
        { id: '2', title: 'System Alert', message: 'Scheduled maintenance for xtiger clusters.', timestamp: Date.now() - 3600000, read: false, type: 'system' },
      ]);
    }, 1000);
  }, []);

  const handleLogin = () => {
    // Mock login
    setUser({
      name: 'Alex Developer',
      email: 'alex@xrhino.dev',
      avatar: 'AD',
      isLoggedIn: true,
      preferences: { notifications: true, theme: 'dark' }
    });
  };

  const handleLogout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setView(ViewState.HOME);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.XPANDA:
        return <XpandaView />;
      case ViewState.XTIGER:
        return <XtigerView />;
      case ViewState.COMMUNITY:
        return (
          <div className="max-w-4xl mx-auto animate-fade-in pt-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Community Hub</h2>
              <p className="text-slate-400">Connect with the RhinoBot to accelerate your development.</p>
            </div>
            <ChatBot />
          </div>
        );
      case ViewState.STUDIO:
        return <StudioView />;
      case ViewState.VOICE:
        return <VoiceLounge />;
      case ViewState.HOME:
      default:
        return <HomeView setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans">
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        notifications={notifications}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {renderView()}
      </main>

      <footer className="border-t border-slate-900 mt-auto py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm">
          <p>© 2024 xrhino. Built for builders.</p>
          <div className="flex justify-center gap-4 mt-4">
             <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
             <span className="hover:text-slate-400 cursor-pointer">Terms</span>
             <span className="hover:text-slate-400 cursor-pointer">GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;