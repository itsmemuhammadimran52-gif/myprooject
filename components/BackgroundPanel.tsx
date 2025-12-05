/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { UploadIcon } from './icons';

interface BackgroundPanelProps {
  onApplyBackground: (prompt: string) => void;
  isLoading: boolean;
  onCustomBackgroundSelectForCrop: (files: FileList | null) => void;
  onApplyCustomBackground: (bgImageUrl: string) => void;
  customBgImageSrc: string | null;
  clearCustomBgImage: () => void;
}

const presets = [
    { name: 'Neon City', prompt: 'A vibrant, futuristic neon city at night with flying cars and towering skyscrapers.' },
    { name: 'Explosion', prompt: 'A dramatic, cinematic explosion with fire, smoke, and debris, in a wide-angle shot.' },
    { name: 'Galaxy', prompt: 'A stunning, colorful nebula in deep space with swirling gases and bright stars.' },
    { name: 'Speed Lines', prompt: 'Dynamic, anime-style radial speed lines converging towards the center, creating a sense of intense motion.' },
];

const BackgroundPanel: React.FC<BackgroundPanelProps> = ({ 
    onApplyBackground, 
    isLoading,
    onCustomBackgroundSelectForCrop,
    onApplyCustomBackground,
    customBgImageSrc,
    clearCustomBgImage
}) => {
  const [backgroundPrompt, setBackgroundPrompt] = useState('');

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBackgroundPrompt(e.target.value);
    if (customBgImageSrc) {
      clearCustomBgImage();
    }
  };

  const handlePresetClick = (prompt: string) => {
    setBackgroundPrompt(prompt);
    if (customBgImageSrc) {
      clearCustomBgImage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomBackgroundSelectForCrop(e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      setBackgroundPrompt('');
    }
  };

  const handleApplyAIGenerated = () => {
    if (backgroundPrompt) {
      onApplyBackground(backgroundPrompt);
    }
  };

  const handleApplyCustom = () => {
    if (customBgImageSrc) {
      onApplyCustomBackground(customBgImageSrc);
    }
  }

  return (
    <div className="w-full bg-gray-800 border border-t-0 border-gray-700 rounded-b-lg p-6 flex flex-col gap-5 animate-fade-in">
      {/* --- AI Generation Section --- */}
      <div>
        <h3 className="text-xl font-semibold text-center text-gray-200">Change Background with AI</h3>
        
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-3 text-center">Quick Presets</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {presets.map(preset => (
                  <button
                      key={preset.name}
                      onClick={() => handlePresetClick(preset.prompt)}
                      disabled={isLoading}
                      className={`w-full text-center border font-semibold py-3 px-2 rounded-md transition-all duration-200 ease-in-out hover:bg-white/20 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                          backgroundPrompt === preset.prompt && !customBgImageSrc
                          ? 'bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/30' 
                          : 'bg-white/10 border-white/20 text-gray-200'
                      }`}
                  >
                      {preset.name}
                  </button>
                ))}
            </div>
        </div>
        
          <textarea
              value={backgroundPrompt}
              onChange={handlePromptChange}
              placeholder="Or describe a custom background... e.g., 'a volcano erupting with lava'"
              className="mt-4 flex-grow bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base resize-none h-28"
              disabled={isLoading}
          />
        <p className="text-xs text-gray-400 mt-2 text-center">Be descriptive! Mention the style, mood, and key elements you want to see.</p>
        
        {backgroundPrompt && !customBgImageSrc && (
            <div className="animate-fade-in flex flex-col pt-2 mt-2">
              <button
                  onClick={handleApplyAIGenerated}
                  className="w-full bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-gray-600 disabled:to-gray-500 disabled:text-gray-300 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading || !backgroundPrompt.trim()}
              >
                  Generate with AI
              </button>
            </div>
        )}
      </div>

      {/* --- Separator --- */}
      <div className="flex items-center">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="flex-shrink mx-4 text-gray-400 font-semibold text-xs">OR</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>
      
      {/* --- Custom Upload Section --- */}
      <div>
        <h3 className="text-xl font-semibold text-center text-gray-200">Upload Your Own</h3>
        <div className="mt-4">
            {customBgImageSrc ? (
                <div className="flex flex-col items-center gap-4">
                    <img src={customBgImageSrc} alt="Custom background preview" className="w-full h-auto rounded-md border-2 border-gray-600 aspect-video object-cover" />
                    <div className="w-full flex items-center gap-3">
                        <label htmlFor="custom-bg-upload" className="w-full text-center bg-white/10 border border-white/20 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                            Change Image
                        </label>
                        <button onClick={clearCustomBgImage} className="text-gray-400 hover:text-white transition-colors text-sm">Remove</button>
                    </div>
                     <input 
                        id="custom-bg-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        disabled={isLoading}
                    />
                </div>
            ) : (
                  <label htmlFor="custom-bg-upload" className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                          <UploadIcon className="w-8 h-8 mb-2 text-gray-400"/>
                          <p className="text-sm text-gray-400">Click to upload background</p>
                      </div>
                      <input 
                          id="custom-bg-upload" 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          disabled={isLoading}
                      />
                  </label>
            )}
        </div>
         {customBgImageSrc && (
            <div className="animate-fade-in flex flex-col pt-2 mt-4">
              <button
                  onClick={handleApplyCustom}
                  className="w-full bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-gray-600 disabled:to-gray-500 disabled:text-gray-300 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}
              >
                  Apply Uploaded Background
              </button>
            </div>
        )}
      </div>

    </div>
  );
};

export default BackgroundPanel;