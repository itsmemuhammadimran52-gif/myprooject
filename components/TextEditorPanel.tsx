/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import type { TextProperties } from '../App';

interface TextEditorPanelProps {
  textProps: TextProperties;
  setTextProps: React.Dispatch<React.SetStateAction<TextProperties>>;
  isLoading: boolean;
}

const FONT_FAMILIES = ['Anton', 'Bebas Neue', 'Inter', 'Montserrat', 'Oswald', 'Poppins', 'Roboto'];

const TextEditorPanel: React.FC<TextEditorPanelProps> = ({ textProps, setTextProps, isLoading }) => {
  const { content, fontSize, color, outlineColor, outlineWidth, bold, italic } = textProps;
  
  const handlePropChange = (prop: keyof TextProperties, value: any) => {
    // Ensure font size doesn't go below a minimum or become NaN
    if (prop === 'fontSize') {
        const newSize = parseInt(value, 10);
        if (isNaN(newSize) || newSize < 10) {
            value = 10;
        } else if (newSize > 300) {
            value = 300;
        }
    }
    setTextProps(prev => ({ ...prev, [prop]: value }));
  };

  const ControlWrapper: React.FC<{label: string, children: React.ReactNode, className?: string}> = ({ label, children, className }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="w-full bg-gray-800 border border-t-0 border-gray-700 rounded-b-lg p-6 flex flex-col gap-5 animate-fade-in">
      <ControlWrapper label="Text Content">
          <textarea
            value={content}
            onChange={(e) => handlePropChange('content', e.target.value)}
            placeholder="Your text here..."
            className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60 text-base resize-none h-24"
            disabled={isLoading}
          />
      </ControlWrapper>
      
      <ControlWrapper label={`Font Size: ${fontSize}px`}>
        <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="300"
                value={fontSize}
                onChange={(e) => handlePropChange('fontSize', parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                disabled={isLoading}
              />
              <input
                type="number"
                min="10"
                max="300"
                value={fontSize}
                onChange={(e) => handlePropChange('fontSize', e.target.value)}
                className="w-24 bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-2 text-center focus:ring-2 focus:ring-yellow-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}
              />
        </div>
      </ControlWrapper>

      <ControlWrapper label="Font Family">
        <div className="relative">
          <select
            value={textProps.fontFamily}
            onChange={(e) => handlePropChange('fontFamily', e.target.value)}
            disabled={isLoading}
            className="w-full appearance-none bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {FONT_FAMILIES.map(font => <option key={font} value={font}>{font}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </ControlWrapper>

       <div className="grid grid-cols-2 gap-4">
          <ControlWrapper label="Text Color" className="flex flex-col">
              <input
                type="color"
                value={color}
                onChange={(e) => handlePropChange('color', e.target.value)}
                className="w-full h-12 p-1 bg-gray-900 border border-gray-600 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                disabled={isLoading}
              />
          </ControlWrapper>
          <ControlWrapper label="Outline Color" className="flex flex-col">
              <input
                type="color"
                value={outlineColor}
                onChange={(e) => handlePropChange('outlineColor', e.target.value)}
                className="w-full h-12 p-1 bg-gray-900 border border-gray-600 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                disabled={isLoading}
              />
          </ControlWrapper>
        </div>

      <ControlWrapper label={`Outline Width: ${outlineWidth}px`}>
          <input
            type="range"
            min="0"
            max="20"
            value={outlineWidth}
            onChange={(e) => handlePropChange('outlineWidth', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            disabled={isLoading}
          />
      </ControlWrapper>

      <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
              <input 
                  type="checkbox"
                  checked={bold}
                  onChange={(e) => handlePropChange('bold', e.target.checked)}
                  className="w-5 h-5 rounded text-yellow-500 bg-gray-700 border-gray-600 focus:ring-yellow-600"
                  disabled={isLoading}
              />
              <span className="text-gray-200 font-semibold">Bold</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
              <input 
                  type="checkbox"
                  checked={italic}
                  onChange={(e) => handlePropChange('italic', e.target.checked)}
                  className="w-5 h-5 rounded text-yellow-500 bg-gray-700 border-gray-600 focus:ring-yellow-600"
                  disabled={isLoading}
              />
              <span className="text-gray-200 font-semibold">Italic</span>
          </label>
      </div>
    </div>
  );
};

export default TextEditorPanel;