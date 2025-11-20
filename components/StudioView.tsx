import React, { useState, useRef } from 'react';
import { Palette, Upload, Wand2, Download, X, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { generateEditedImage } from '../services/geminiService';

const StudioView: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Extract base64 data part
      const base64Data = selectedImage.split(',')[1];
      const response = await generateEditedImage(base64Data, mimeType, prompt);
      
      // Iterate through parts to find the image
      let foundImage = false;
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const newImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            setGeneratedImage(newImageUrl);
            foundImage = true;
          }
        }
      }
      if (!foundImage) {
          // Fallback if only text is returned or error
          console.warn("No image returned");
      }
    } catch (error) {
      console.error("Failed to edit image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
       <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-sm">
            <Palette className="w-4 h-4" />
            <span>AI Photo Studio</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Magic Editor</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Upload a photo and describe how you want to change it. 
            Remove backgrounds, add objects, or change the style completely.
          </p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
             {/* Upload Area */}
             <div 
               onClick={() => fileInputRef.current?.click()}
               className={`relative h-[300px] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4 overflow-hidden
                 ${selectedImage 
                   ? 'border-pink-500/50 bg-slate-900' 
                   : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600'
                 }`}
             >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
                
                {selectedImage ? (
                  <>
                    <img src={selectedImage} alt="Original" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                       <ImageIcon className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-300 font-medium">Click to upload</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </>
                )}
             </div>

             {/* Prompt Input */}
             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
               <label className="block text-sm text-slate-400 mb-2">Instructions</label>
               <textarea
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="E.g., Add a neon sign in the background, turn this into a cyberpunk city..."
                 className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-pink-500 transition-colors resize-none"
               />
               <div className="flex justify-end mt-4">
                 <button
                   onClick={handleGenerate}
                   disabled={!selectedImage || !prompt.trim() || isGenerating}
                   className="flex items-center gap-2 px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                   Generate
                 </button>
               </div>
             </div>
          </div>

          {/* Result Section */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-1 h-[460px] flex flex-col">
             <div className="flex-1 rounded-xl bg-black/40 flex items-center justify-center relative overflow-hidden">
                {generatedImage ? (
                   <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-slate-600">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>AI generated result will appear here</p>
                  </div>
                )}
                
                {isGenerating && (
                  <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center backdrop-blur-sm">
                     <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-3" />
                     <p className="text-pink-200 font-medium animate-pulse">Applying magic...</p>
                  </div>
                )}
             </div>
             
             {generatedImage && (
               <div className="p-4 flex justify-end">
                  <a href={generatedImage} download="rhino-edit.png" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                     <Download className="w-4 h-4" /> Download
                  </a>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default StudioView;