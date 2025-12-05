/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface FilterPanelProps {
  onApplyFilter: (prompt: string) => void;
  isLoading: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilter, isLoading }) => {
  const [selectedPresetPrompt, setSelectedPresetPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const presets = [
    { name: 'Harmonize', prompt: 'Improve visual consistency. Analyze the background\'s lighting and color palette, then apply realistic adjustments to the foreground subject to make them look naturally integrated. Adjust the subject\'s color temperature, saturation, highlights, and shadows to match the environment. Do not change the background, the subject\'s identity, or any text.' },
    { name: 'Cinematic', prompt: 'Apply a professional cinematic look with dramatic color grading, deep shadows, high contrast, and a subtle teal and orange color palette to enhance the mood.' },
    { name: 'Vintage', prompt: 'Apply a vintage film effect with warm tones, subtle film grain, and a slightly desaturated, faded look to give the image a nostalgic, aged feel.' },
    { name: 'Synthwave', prompt: 'Apply a vibrant 80s synthwave aesthetic with neon magenta and cyan glows, and subtle scan lines.' },
    { name: 'Anime', prompt: 'Give the image a vibrant Japanese anime style, with bold outlines, cel-shading, and saturated colors.' },
    { name: 'Lomo', prompt: 'Apply a Lomography-style cross-processing film effect with high-contrast, oversaturated colors, and dark vignetting.' },
    { name: 'Glitch', prompt: 'Transform the image into a futuristic holographic projection with digital glitch effects and chromatic aberration.' },
  ];
  
  const activePrompt = selectedPresetPrompt || customPrompt;

  const handlePresetClick = (prompt: string) => {
    setSelectedPresetPrompt(prompt);
    setCustomPrompt('');
  };
  
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPrompt(e.target.value);
    setSelectedPresetPrompt(null);
  };

  const handleApply = () => {
    if (activePrompt) {
      onApplyFilter(activePrompt);
    }
  };

  return (
    <div className="w-full bg-[var(--color-base-200)] border border-t-0 border-[var(--color-base-300)] rounded-b-lg p-6 flex flex-col gap-4 animate-fade-in">
      <h3 className="text-xl font-semibold text-center text-[var(--color-base-content)]">Apply a Filter</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset.prompt)}
              disabled={isLoading}
              className={`w-full text-center border font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-[var(--color-base-content)]/20 active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedPresetPrompt === preset.prompt 
                  ? 'bg-[var(--color-accent)] border-[var(--color-accent-dark)] text-[var(--color-accent-content)] shadow-lg shadow-[rgba(var(--color-accent-shadow),0.3)]' 
                  : 'bg-[var(--color-base-content)]/10 border-[var(--color-base-content)]/20 text-[var(--color-base-content)]'
              }`}
            >
              {preset.name}
            </button>
        ))}
      </div>

        <input
          type="text"
          value={customPrompt}
          onChange={handleCustomChange}
          placeholder="Or describe a custom filter..."
          className="flex-grow bg-[var(--color-base-100)] border border-[var(--color-base-300)] text-[var(--color-base-content)] rounded-lg p-4 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
          disabled={isLoading}
        />
      
      {activePrompt && (
        <div className="animate-fade-in flex flex-col gap-4 pt-2">
            <button
              onClick={handleApply}
              className="w-full bg-gradient-to-br from-[var(--color-accent-dark)] to-[var(--color-accent)] text-[var(--color-accent-content)] font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-[rgba(var(--color-accent-shadow),0.2)] hover:shadow-xl hover:shadow-[rgba(var(--color-accent-shadow),0.4)] hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-gray-600 disabled:to-gray-500 disabled:text-gray-300 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading || !activePrompt.trim()}
            >
              Apply Filter
            </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;