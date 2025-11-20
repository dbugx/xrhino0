import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, Activity, XCircle } from 'lucide-react';
import { ai } from '../services/geminiService';
import { LiveServerMessage, Modality } from '@google/genai';

// Helper types for audio encoding/decoding
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const VoiceLounge: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  
  const nextStartTime = useRef(0);
  const inputAudioContext = useRef<AudioContext | null>(null);
  const outputAudioContext = useRef<AudioContext | null>(null);
  const outputNode = useRef<GainNode | null>(null);
  const sources = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startSession = async () => {
    try {
      inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputNode.current = outputAudioContext.current.createGain();
      outputNode.current.connect(outputAudioContext.current.destination);

      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Session opened');
            setIsConnected(true);
            
            if (!inputAudioContext.current || !mediaStreamRef.current) return;

            const source = inputAudioContext.current.createMediaStreamSource(mediaStreamRef.current);
            const scriptProcessor = inputAudioContext.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              if (isMuted) return; 
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContext.current && outputNode.current) {
              const ctx = outputAudioContext.current;
              nextStartTime.current = Math.max(nextStartTime.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                24000,
                1
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode.current);
              source.addEventListener('ended', () => sources.current.delete(source));
              source.start(nextStartTime.current);
              nextStartTime.current += audioBuffer.duration;
              sources.current.add(source);
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
               sources.current.forEach(s => s.stop());
               sources.current.clear();
               nextStartTime.current = 0;
            }

            // Handle Transcription
            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
               // Sometimes text comes in parts alongside audio or separately
               // Note: Native audio usually doesn't send text unless requested via transcription config
               // For this demo we rely on audio, but if we enabled transcription config we would handle it here.
            }
            
            // Input/Output Transcription if enabled in config
            if (message.serverContent?.outputTranscription?.text) {
                setTranscription(prev => [...prev, `Rhino: ${message.serverContent.outputTranscription.text}`].slice(-5));
            }
            if (message.serverContent?.inputTranscription?.text) {
                setTranscription(prev => [...prev, `You: ${message.serverContent.inputTranscription.text}`].slice(-5));
            }
          },
          onclose: () => {
            console.log('Session closed');
            setIsConnected(false);
          },
          onerror: (e) => {
            console.error('Session error', e);
            setIsConnected(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
             voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
          },
          systemInstruction: "You are RhinoBot Voice, a helpful assistant for xrhino developers. Keep responses short and conversational.",
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start voice session", err);
    }
  };

  const stopSession = () => {
    // Clean up
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    if (inputAudioContext.current) {
        inputAudioContext.current.close();
    }
    if (outputAudioContext.current) {
        outputAudioContext.current.close();
    }
    // There isn't a direct .close() on the session object exposed easily in this flow without unwrapping the promise properly in a stored var
    // Ideally, we'd call session.close() if the SDK supports it directly or just cut the connection.
    // Reloading or unmounting clears it.
    setIsConnected(false);
    window.location.reload(); // Brute force cleanup for prototype to ensure audio context release
  };

  useEffect(() => {
    return () => {
       // Unmount cleanup
       if (isConnected) stopSession();
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto pt-10 text-center space-y-8 animate-fade-in">
      <div>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 text-blue-400 mb-6 relative">
           <Mic className="w-10 h-10" />
           {isConnected && (
             <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-slate-900"></span>
           )}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Rhino Voice Lounge</h1>
        <p className="text-slate-400">
          Experience real-time, low-latency voice conversations with RhinoBot.
          <br/> Ask for help, brainstorm ideas, or just chat.
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-6">
        {!isConnected ? (
          <button 
            onClick={startSession}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
          >
            <Mic className="w-5 h-5" />
            Start Voice Chat
          </button>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full border-2 transition-all ${isMuted ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'}`}
            >
               {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button 
              onClick={stopSession}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-red-600/20 flex items-center gap-3"
            >
              <XCircle className="w-5 h-5" />
              End Session
            </button>
          </div>
        )}
      </div>

      {/* Visualization / Transcription */}
      {isConnected && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[200px] text-left relative overflow-hidden">
           <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-blue-400 font-mono">
              <Activity className="w-3 h-3 animate-pulse" />
              LIVE 24kHz
           </div>
           <div className="space-y-3 mt-4">
              {transcription.length === 0 && (
                 <p className="text-slate-600 italic text-center mt-10">Listening...</p>
              )}
              {transcription.map((line, i) => (
                 <p key={i} className={`text-sm ${line.startsWith('You:') ? 'text-slate-400' : 'text-blue-300'}`}>
                    {line}
                 </p>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default VoiceLounge;