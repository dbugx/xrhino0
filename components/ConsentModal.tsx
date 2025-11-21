import React from 'react';
import { Shield, Mic, Cookie, Check, X } from 'lucide-react';

interface ConsentModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Privacy & Permissions</h2>
              <p className="text-slate-400 text-sm mt-1">
                We value your privacy. In accordance with European data protection laws (GDPR), 
                we need your consent to enhance your experience.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-800">
              <Cookie className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="block text-slate-200 font-medium">Storage & Personalization</span>
                <span className="text-slate-500">We use cookies to remember your login state and preferences so you don't have to sign in every time.</span>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-800">
              <Mic className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="block text-slate-200 font-medium">Microphone Access</span>
                <span className="text-slate-500">To enable the AI Voice Lounge, we require access to your microphone. Audio is processed in real-time and not stored.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={onDecline}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors text-sm"
            >
              Necessary Cookies Only
            </button>
            <button 
              onClick={onAccept}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20 text-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Accept & Enable Mic
            </button>
          </div>
        </div>
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-center text-slate-600">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;