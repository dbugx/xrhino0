import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MapPin, ExternalLink } from 'lucide-react';
import { sendMessageStream } from '../services/geminiService';
import { Message } from '../types';
import { GenerateContentResponse } from '@google/genai';

const ChatBot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      text: "Welcome to the xrhino community hub! I'm RhinoBot. Ask me anything about xpanda, xtiger, or ask for directions using Google Maps.",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await sendMessageStream(userMsg.text);
      
      const botMsgId = (Date.now() + 1).toString();
      let fullText = '';
      let groundingMetadata: any = null;
      
      // Add placeholder for bot message
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of stream) {
        const content = chunk as GenerateContentResponse;
        if (content.text) {
          fullText += content.text;
        }
        // Capture grounding metadata if present (usually in the last chunk or accumulated)
        if (content.candidates?.[0]?.groundingMetadata) {
           groundingMetadata = content.candidates[0].groundingMetadata;
        }

        setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullText, groundingMetadata } : msg
        ));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting to the xrhino hive mind right now. Please try again later.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to render grounding chunks (Maps)
  const renderGrounding = (metadata: any) => {
    if (!metadata?.groundingChunks) return null;

    const mapChunks = metadata.groundingChunks.filter((c: any) => 
      (c.web?.uri || c.web?.title) || (c.maps?.uri || c.maps?.title)
    );
    
    if (mapChunks.length === 0) return null;

    return (
      <div className="mt-3 grid gap-2">
        {mapChunks.map((chunk: any, idx: number) => {
          const data = chunk.web || chunk.maps;
          if (!data) return null;
          
          return (
            <a 
              key={idx} 
              href={data.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-colors group"
            >
              <div className="w-8 h-8 rounded bg-indigo-900/30 flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                 <div className="text-sm font-medium text-indigo-200 truncate">{data.title || 'Location Link'}</div>
                 <div className="text-xs text-slate-500 truncate">{data.uri}</div>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white">RhinoBot AI</h3>
          <p className="text-xs text-indigo-300">Community Assistant • Powered by Gemini</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-gradient-to-b from-slate-900 to-slate-900/95">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className="flex flex-col">
                <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-slate-200 rounded-tr-none border border-slate-700' 
                    : 'bg-indigo-900/30 text-indigo-100 rounded-tl-none border border-indigo-500/30'
                }`}>
                  {msg.text || (isLoading && msg.id === messages[messages.length-1].id ? <Loader2 className="w-4 h-4 animate-spin" /> : '')}
                </div>
                {msg.groundingMetadata && renderGrounding(msg.groundingMetadata)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800/30 border-t border-slate-700">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about components, APIs, or finding directions..."
            className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-center text-slate-600 text-xs mt-2">
          AI may produce inaccurate information.
        </p>
      </div>
    </div>
  );
};

export default ChatBot;