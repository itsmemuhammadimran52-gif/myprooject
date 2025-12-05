/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { UploadIcon } from './icons';

interface ThumbnailOptionsPanelProps {
  category: string;
  setCategory: (category: string) => void;
  emotion: string;
  setEmotion: (emotion: string) => void;
  emotionIntensity: number;
  setEmotionIntensity: (intensity: number) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  title: string;
  setTitle: (title: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  fontStyle: string;
  setFontStyle: (style: string) => void;
  backgroundStyle: string;
  setBackgroundStyle: (style: string) => void;
  outlineThickness: string;
  setOutlineThickness: (thickness: string) => void;
  outlineColor: string;
  setOutlineColor: (color: string) => void;
  customBackgroundPrompt: string;
  setCustomBackgroundPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onSecondFileSelect: (files: FileList | null) => void;
  croppedImage2: string | null;
  numberOfVariations: 1 | 2;
  setNumberOfVariations: (count: 1 | 2) => void;
}

const CATEGORIES = [
  "Vlog", "Travel", "Gaming", "Food", "Documentary", "Education", "Finance", "Funny", 
  "Movie Review", "MrBeast Style", "Tutorial", "Product Review", 
  "Before & After", "Face Reaction"
];

const EMOTIONS = ["Happy", "Sad", "Angry", "Shocked", "Excited", "Serious"];

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

const TEXT_COLORS = {
  "AI Choice": "bg-gray-500",
  "White": "bg-white",
  "Black": "bg-black",
  "Yellow": "bg-yellow-400",
  "Red": "bg-red-500",
  "Cyan": "bg-cyan-400",
  "Green": "bg-green-500",
  "Blue": "bg-blue-500",
  "Pink": "bg-pink-500",
};

const FONT_STYLES = ["AI Choice", "Modern", "Classic", "Futuristic", "Bold"];
const BACKGROUND_STYLES = ["AI Choice", "Gradient", "Abstract", "In-Game", "Minimalist", "Custom"];
const OUTLINE_THICKNESSES = ["AI Choice", "Thin", "Medium", "Thick"];
const OUTLINE_COLORS = {
  "AI Choice": "bg-gray-500",
  "Black": "bg-black",
  "White": "bg-white",
  "Yellow": "bg-yellow-400",
  "Red": "bg-red-500",
};


const ThumbnailOptionsPanel: React.FC<ThumbnailOptionsPanelProps> = ({ 
  category, setCategory, emotion, setEmotion, emotionIntensity, setEmotionIntensity, difficulty, setDifficulty, title, setTitle, 
  textColor, setTextColor, fontStyle, setFontStyle, backgroundStyle, setBackgroundStyle,
  outlineThickness, setOutlineThickness, outlineColor, setOutlineColor,
  customBackgroundPrompt, setCustomBackgroundPrompt,
  onGenerate, isLoading, onSecondFileSelect, croppedImage2,
  numberOfVariations, setNumberOfVariations
}) => {
  const canGenerate = title.trim() && category && emotion && !isLoading;
  const needsSecondImage = category === "Before & After" || category === "Product Review" || category === "Food";
  const secondImagePrompt = category === "Before & After" 
    ? "Upload 'After' Image" 
    : category === "Product Review"
    ? "Upload Product Image"
    : "Upload Food Image";
  
  const renderSelectButtons = (
    options: string[], 
    selectedValue: string, 
    setter: (value: string) => void,
    gridClass: string = "grid-cols-2 sm:grid-cols-3 md:grid-cols-3"
  ) => (
    <div className={`grid ${gridClass} gap-2`}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => setter(opt)}
          disabled={isLoading}
          className={`w-full text-center border font-semibold py-3 px-2 rounded-md transition-all duration-200 ease-in-out hover:bg-white/20 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedValue === opt
            ? 'bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/30' 
            : 'bg-white/10 border-white/20 text-gray-200'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-gray-800/80 border border-gray-700/80 rounded-lg p-6 flex flex-col gap-6 animate-fade-in backdrop-blur-sm self-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">1. Choose a Style</h3>
        {renderSelectButtons(CATEGORIES, category, setCategory)}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">2. Set Difficulty</h3>
        {renderSelectButtons(DIFFICULTY_LEVELS, difficulty, setDifficulty, "grid-cols-3")}
      </div>

      {needsSecondImage && (
        <div className="border-t border-gray-700/60 pt-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">3. {secondImagePrompt}</h3>
            {croppedImage2 ? (
              <div className="flex items-center gap-4">
                <img src={croppedImage2} alt="Second image preview" className="w-24 h-auto rounded-md border-2 border-gray-600" />
                <label htmlFor="second-image-upload" className="text-yellow-400 cursor-pointer hover:text-yellow-300 font-semibold transition-colors">
                  Change Image
                </label>
                <input 
                  id="second-image-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => onSecondFileSelect(e.target.files)} 
                />
              </div>
            ) : (
              <label htmlFor="second-image-upload" className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="w-6 h-6 mb-2 text-gray-400"/>
                  <p className="text-sm text-gray-400">Click to upload</p>
                </div>
                <input 
                  id="second-image-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => onSecondFileSelect(e.target.files)} 
                />
              </label>
            )}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">{needsSecondImage ? '4.' : '3.'} Set Emotion &amp; Intensity</h3>
        {renderSelectButtons(EMOTIONS, emotion, setEmotion, "grid-cols-3")}
        <div className="mt-4">
            <label htmlFor="emotion-intensity" className="text-sm font-medium text-gray-300 mb-2 block">
                Intensity: <span className="font-bold text-yellow-400">{emotionIntensity}%</span>
            </label>
            <input
              id="emotion-intensity"
              type="range"
              min="0"
              max="100"
              value={emotionIntensity}
              onChange={(e) => setEmotionIntensity(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              disabled={isLoading}
            />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">{needsSecondImage ? '5.' : '4.'} Enter Title Text</h3>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 'I CAN'T BELIEVE THIS HAPPENED!'"
            className="bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base resize-none h-24"
            disabled={isLoading}
          />
      </div>

      <div className="border-t border-gray-700/60 pt-6">
         <h3 className="text-lg font-semibold text-gray-200 mb-3">{needsSecondImage ? '6.' : '5.'} Customize (Optional)</h3>
         <div className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Text Color</label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(TEXT_COLORS).map(([colorName, colorClass]) => (
                    <button
                      key={colorName}
                      onClick={() => setTextColor(colorName)}
                      disabled={isLoading}
                      className={`w-full h-10 rounded-md transition-transform active:scale-90 ${colorClass} ${textColor === colorName ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-yellow-400' : 'ring-1 ring-white/20'}`}
                    >
                      {colorName === 'AI Choice' && <span className="font-bold text-lg text-white">?</span>}
                    </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Text Outline Color</label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(OUTLINE_COLORS).map(([colorName, colorClass]) => (
                    <button
                      key={colorName}
                      onClick={() => setOutlineColor(colorName)}
                      disabled={isLoading}
                      className={`w-full h-10 rounded-md transition-transform active:scale-90 ${colorClass} ${outlineColor === colorName ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-yellow-400' : 'ring-1 ring-white/20'}`}
                    >
                      {colorName === 'AI Choice' && <span className="font-bold text-lg text-white">?</span>}
                    </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Font Style</label>
              {renderSelectButtons(FONT_STYLES, fontStyle, setFontStyle, "grid-cols-3")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="outline-thickness-select" className="text-sm font-medium text-gray-300 mb-2 block">Outline Thickness</label>
                  <div className="relative">
                    <select
                      id="outline-thickness-select"
                      value={outlineThickness}
                      onChange={(e) => setOutlineThickness(e.target.value)}
                      disabled={isLoading}
                      className="w-full appearance-none bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {OUTLINE_THICKNESSES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
              </div>
              <div>
                <label htmlFor="bg-style-select" className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                  Background Style
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/40 rounded-full text-xs font-semibold text-yellow-300 animate-pulse">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Try Custom
                  </span>
                </label>
                  <div className="relative">
                    <select
                      id="bg-style-select"
                      value={backgroundStyle}
                      onChange={(e) => setBackgroundStyle(e.target.value)}
                      disabled={isLoading}
                      className={`w-full appearance-none bg-gray-800 border rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60 text-gray-200 ${
                        backgroundStyle === 'Custom' 
                          ? 'border-yellow-500/60 bg-gradient-to-br from-gray-800 to-yellow-900/20 shadow-lg shadow-yellow-500/20' 
                          : 'border-gray-600'
                      }`}
                    >
                      {BACKGROUND_STYLES.map(opt => (
                        <option key={opt} value={opt}>
                          {opt === 'Custom' ? '✨ Custom (Recommended)' : opt}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
              </div>
            </div>
            {backgroundStyle === 'Custom' && (
              <div className="mt-4 p-4 bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-transparent border border-yellow-500/30 rounded-lg animate-fade-in shadow-lg shadow-yellow-500/10">
                <label htmlFor="custom-bg-prompt" className="text-sm font-semibold text-yellow-300 mb-1 block flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Custom Background Prompt
                  <span className="ml-auto px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/40 rounded text-xs font-bold text-yellow-300">MAIN FEATURE</span>
                </label>
                <p className="text-xs text-yellow-200/80 mb-3 font-medium">✨ Create unique, AI-generated backgrounds tailored to your vision. Be descriptive for best results!</p>
                  <textarea
                    id="custom-bg-prompt"
                    value={customBackgroundPrompt}
                    onChange={(e) => setCustomBackgroundPrompt(e.target.value)}
                    placeholder="e.g., A volcano erupting with lava, dramatic lighting, cinematic atmosphere"
                    className="bg-gray-900/50 border-2 border-yellow-500/40 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all w-full disabled:cursor-not-allowed disabled:opacity-60 text-sm resize-none h-24 shadow-inner"
                    disabled={isLoading}
                  />
              </div>
            )}
         </div>
      </div>

      <div className="border-t border-gray-700/60 pt-6">
         <h3 className="text-lg font-semibold text-gray-200 mb-3">Number of Variations</h3>
         <div className="grid grid-cols-2 gap-2">
            <button
                onClick={() => setNumberOfVariations(1)}
                disabled={isLoading}
                className={`w-full text-center border font-semibold py-3 px-2 rounded-md transition-all duration-200 ease-in-out hover:bg-white/20 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    numberOfVariations === 1
                    ? 'bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/30' 
                    : 'bg-white/10 border-white/20 text-gray-200'
                }`}
            >
                1 Variation (1 generation)
            </button>
            <button
                onClick={() => setNumberOfVariations(2)}
                disabled={isLoading}
                className={`w-full text-center border font-semibold py-3 px-2 rounded-md transition-all duration-200 ease-in-out hover:bg-white/20 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    numberOfVariations === 2
                    ? 'bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/30' 
                    : 'bg-white/10 border-white/20 text-gray-200'
                }`}
            >
                2 Variations (2 generations)
            </button>
         </div>
      </div>

      <div className="pt-2">
          <button
              onClick={onGenerate}
              className="w-full bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:from-gray-600 disabled:to-gray-500 disabled:text-gray-300 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              disabled={!canGenerate}
          >
              Generate Thumbnail
          </button>
      </div>
    </div>
  );
};

export default ThumbnailOptionsPanel;