import React, { useState } from 'react';
import { ViewState, UserProfile, Notification } from '../types';
import { Hexagon, Box, Server, MessageSquare, Palette, Mic, Bell, User, LogOut, Github } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: UserProfile;
  onLogin: () => void;
  onLogout: () => void;
  notifications: Notification[];
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, onLogin, onLogout, notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItemClass = (view: ViewState, baseColor: string, activeColor: string) => `
    flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm
    ${currentView === view 
      ? `${activeColor} text-white shadow-lg shadow-${baseColor}-500/20` 
      : 'text-slate-400 hover:text-white hover:bg-slate-800'}
  `;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group mr-4"
            onClick={() => setView(ViewState.HOME)}
          >
            <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg border border-slate-600 group-hover:border-slate-400 transition-colors">
              <Hexagon className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight hidden sm:block">xrhino</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => setView(ViewState.XPANDA)}
              className={navItemClass(ViewState.XPANDA, 'emerald', 'bg-emerald-600')}
            >
              <Box className="w-4 h-4" />
              <span>xpanda</span>
            </button>

            <button 
              onClick={() => setView(ViewState.XTIGER)}
              className={navItemClass(ViewState.XTIGER, 'orange', 'bg-orange-600')}
            >
              <Server className="w-4 h-4" />
              <span>xtiger</span>
            </button>

            <div className="h-6 w-px bg-slate-700 mx-2" />

            <button 
              onClick={() => setView(ViewState.COMMUNITY)}
              className={navItemClass(ViewState.COMMUNITY, 'indigo', 'bg-indigo-600')}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Community</span>
            </button>
            
             <button 
              onClick={() => setView(ViewState.STUDIO)}
              className={navItemClass(ViewState.STUDIO, 'pink', 'bg-pink-600')}
            >
              <Palette className="w-4 h-4" />
              <span>Studio</span>
            </button>
            
            <button 
              onClick={() => setView(ViewState.VOICE)}
              className={navItemClass(ViewState.VOICE, 'blue', 'bg-blue-600')}
            >
              <Mic className="w-4 h-4" />
              <span>Live</span>
            </button>
          </div>

          <div className="flex-1" />

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {/* GitHub Publish (Mock) */}
             <button 
               className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs hover:border-slate-500 transition-colors"
               onClick={() => alert('Codebase publishing to GitHub... (Mock)')}
             >
               <Github className="w-3 h-3" />
               <span>Deploy</span>
             </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full relative transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-white text-sm">Notifications</span>
                    <span className="text-xs text-slate-500">Mark all read</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-sm">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                          <div className="flex gap-2">
                            <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                              n.type === 'xpanda' ? 'bg-emerald-500' : n.type === 'xtiger' ? 'bg-orange-500' : 'bg-indigo-500'
                            }`} />
                            <div>
                              <p className="text-sm text-slate-200 font-medium">{n.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                              <p className="text-[10px] text-slate-600 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            {user.isLoggedIn ? (
              <div className="relative">
                <button 
                  className="flex items-center gap-2 hover:bg-slate-800 p-1 rounded-full transition-colors pr-3"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-300">{user.name}</span>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1">
                    <div className="px-4 py-2 border-b border-slate-800">
                       <p className="text-sm text-white font-medium">{user.name}</p>
                       <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                      Account Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between">
                      <span>Subscriptions</span>
                      <span className="text-[10px] bg-indigo-900 text-indigo-300 px-1.5 rounded">PRO</span>
                    </button>
                    <div className="border-t border-slate-800 my-1" />
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center gap-2"
                    >
                      <LogOut className="w-3 h-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex justify-around border-t border-slate-800 bg-slate-900 p-2 overflow-x-auto">
         {[ViewState.XPANDA, ViewState.XTIGER, ViewState.COMMUNITY, ViewState.STUDIO, ViewState.VOICE].map(view => (
            <button 
              key={view}
              onClick={() => setView(view)} 
              className={`p-2 rounded flex flex-col items-center min-w-[60px] ${currentView === view ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
                {view === ViewState.XPANDA && <Box className="w-5 h-5 mb-1" />}
                {view === ViewState.XTIGER && <Server className="w-5 h-5 mb-1" />}
                {view === ViewState.COMMUNITY && <MessageSquare className="w-5 h-5 mb-1" />}
                {view === ViewState.STUDIO && <Palette className="w-5 h-5 mb-1" />}
                {view === ViewState.VOICE && <Mic className="w-5 h-5 mb-1" />}
               <span className="text-[10px] capitalize">{view.toString().toLowerCase()}</span>
            </button>
         ))}
      </div>
    </nav>
  );
};

export default Navbar;