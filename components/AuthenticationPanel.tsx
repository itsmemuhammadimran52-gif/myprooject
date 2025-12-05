/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import type { AuthButtonsState, AuthButtonProperties } from '../App';

interface AuthenticationPanelProps {
  buttonProps: AuthButtonsState;
  setButtonProps: React.Dispatch<React.SetStateAction<AuthButtonsState>>;
  isLoading: boolean;
}

type ActiveTab = 'login' | 'signup';

const colorPresets = {
    Primary: {
        color: '#111827', // Almost black
        backgroundColor: '#FBBF24', // Yellow
        hoverBackgroundColor: '#FCD34D', // Lighter Yellow
    },
    Secondary: {
        color: '#111827', // Almost black
        backgroundColor: '#FFFFFF', // White
        hoverBackgroundColor: '#F3F4F6', // Light Gray
    },
    Accent: {
        color: '#FFFFFF', // White
        backgroundColor: '#DC2626', // Red-600
        hoverBackgroundColor: '#EF4444', // Red-500
    },
};

const fontStylePresets = {
    Modern: { fontFamily: 'Inter', bold: true },
    Playful: { fontFamily: 'Poppins', bold: true },
    Classic: { fontFamily: 'Roboto', bold: false },
};

const FONT_FAMILIES = ['Inter', 'Poppins', 'Roboto', 'Montserrat'];

const AuthenticationPanel: React.FC<AuthenticationPanelProps> = ({ buttonProps, setButtonProps, isLoading }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('login');
  
  const areButtonsVisible = buttonProps.login.visible || buttonProps.signup.visible;
  const currentProps = buttonProps[activeTab];

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isVisible = e.target.checked;
    setButtonProps(prev => ({
      login: { ...prev.login, visible: isVisible },
      signup: { ...prev.signup, visible: isVisible },
    }));
  };

  const handlePropChange = (prop: keyof AuthButtonProperties, value: any) => {
    setButtonProps(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [prop]: value,
      },
    }));
  };
  
  const handleApplyColorPreset = (preset: typeof colorPresets[keyof typeof colorPresets]) => {
    setButtonProps(prev => ({
        ...prev,
        [activeTab]: {
            ...prev[activeTab],
            ...preset,
        },
    }));
  };

  const handleApplyFontStylePreset = (preset: typeof fontStylePresets[keyof typeof fontStylePresets]) => {
    setButtonProps(prev => ({
        ...prev,
        [activeTab]: {
            ...prev[activeTab],
            ...preset,
        },
    }));
  };

  const ControlWrapper: React.FC<{label: string, children: React.ReactNode, className?: string}> = ({ label, children, className }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      {children}
    </div>
  );

  const TabButton: React.FC<{tabId: ActiveTab, label: string}> = ({ tabId, label }) => (
     <button
        onClick={() => setActiveTab(tabId)}
        className={`flex-1 py-2 text-center font-semibold rounded-md transition-colors ${
            activeTab === tabId 
            ? 'bg-yellow-500 text-black' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
     >
        {label}
     </button>
  );

  return (
    <div className="w-full bg-gray-800 border border-t-0 border-gray-700 rounded-b-lg p-6 flex flex-col gap-5 animate-fade-in">
        <div className="flex items-center justify-between">
            <label htmlFor="show-button-toggle" className="text-lg font-semibold text-gray-200">
                Show Auth Buttons
            </label>
              <div className="relative inline-flex items-center cursor-pointer">
                  <input
                      type="checkbox"
                      id="show-button-toggle"
                      checked={areButtonsVisible}
                      onChange={handleVisibilityChange}
                      className="sr-only peer"
                      disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-yellow-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </div>
        </div>

        {areButtonsVisible && (
            <div className="flex flex-col gap-5 pt-4 border-t border-gray-700 animate-fade-in">
                  <div className="flex bg-gray-900 p-1 rounded-lg">
                      <TabButton tabId="login" label="Login Button" />
                      <TabButton tabId="signup" label="Sign Up Button" />
                  </div>
                
                {/* --- PRESETS --- */}
                <div className="pt-2">
                    <h4 className="text-base font-semibold text-gray-200 mb-3 text-center">Style Presets</h4>
                    <div className="flex flex-col gap-4">
                        <ControlWrapper label="Color Scheme">
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(colorPresets).map(([name, preset]) => (
                                      <button
                                          key={name}
                                          onClick={() => handleApplyColorPreset(preset)}
                                          disabled={isLoading}
                                          className="w-full text-center border font-semibold py-2 px-2 rounded-md transition-colors text-sm capitalize bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 active:scale-95 disabled:opacity-50"
                                      >
                                          {name}
                                      </button>
                                ))}
                            </div>
                        </ControlWrapper>
                        <ControlWrapper label="Font Style">
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(fontStylePresets).map(([name, preset]) => (
                                      <button
                                          key={name}
                                          onClick={() => handleApplyFontStylePreset(preset)}
                                          disabled={isLoading}
                                          className="w-full text-center border font-semibold py-2 px-2 rounded-md transition-colors text-sm capitalize bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 active:scale-95 disabled:opacity-50"
                                      >
                                          {name}
                                      </button>
                                ))}
                            </div>
                        </ControlWrapper>
                    </div>
                </div>

                <div className="flex items-center my-1">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400 font-semibold text-xs">CUSTOMIZE</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <ControlWrapper label="Button Text">
                    <input
                        type="text"
                        value={currentProps.content}
                        onChange={(e) => handlePropChange('content', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                        disabled={isLoading}
                    />
                </ControlWrapper>

                 <ControlWrapper label="Font">
                    <div className="relative">
                        <select
                            value={currentProps.fontFamily}
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


                <ControlWrapper label={`Font Size: ${currentProps.fontSize}px`}>
                    <input
                        type="range"
                        min="8"
                        max="80"
                        value={currentProps.fontSize}
                        onChange={(e) => handlePropChange('fontSize', parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        disabled={isLoading}
                    />
                </ControlWrapper>

                <div className="grid grid-cols-2 gap-4">
                    <ControlWrapper label="Text Color">
                        <input
                            type="color"
                            value={currentProps.color}
                            onChange={(e) => handlePropChange('color', e.target.value)}
                            className="w-full h-12 p-1 bg-gray-900 border border-gray-600 rounded-lg cursor-pointer"
                            disabled={isLoading}
                        />
                    </ControlWrapper>
                    <ControlWrapper label="Background Color">
                        <input
                            type="color"
                            value={currentProps.backgroundColor}
                            onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
                            className="w-full h-12 p-1 bg-gray-900 border border-gray-600 rounded-lg cursor-pointer"
                            disabled={isLoading}
                        />
                    </ControlWrapper>
                </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                      <input
                          type="checkbox"
                          checked={currentProps.bold}
                          onChange={(e) => handlePropChange('bold', e.target.checked)}
                          className="w-5 h-5 rounded text-yellow-500 bg-gray-700 border-gray-600 focus:ring-yellow-600"
                          disabled={isLoading}
                      />
                      <span className="text-gray-200 font-semibold">Bold</span>
                  </label>

                <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-base font-semibold text-gray-200 mb-3">Hover Effects</h4>
                    
                    <ControlWrapper label="Hover Background Color">
                        <input
                            type="color"
                            value={currentProps.hoverBackgroundColor}
                            onChange={(e) => handlePropChange('hoverBackgroundColor', e.target.value)}
                            className="w-full h-12 p-1 bg-gray-900 border border-gray-600 rounded-lg cursor-pointer"
                            disabled={isLoading}
                        />
                    </ControlWrapper>
                    
                    <ControlWrapper label="Hover Animation" className="mt-4">
                        <div className="grid grid-cols-2 gap-2">
                            {(['none', 'scale', 'lighten', 'darken'] as const).map(effect => (
                                  <button
                                      key={effect}
                                      onClick={() => handlePropChange('hoverEffect', effect)}
                                      disabled={isLoading}
                                      className={`w-full text-center border font-semibold py-2 px-2 rounded-md transition-colors text-sm capitalize ${
                                          currentProps.hoverEffect === effect
                                          ? 'bg-yellow-500 border-yellow-400 text-black' 
                                          : 'bg-white/10 border-white/20 text-gray-200 hover:bg-white/20'
                                      }`}
                                  >
                                      {effect}
                                  </button>
                            ))}
                        </div>
                    </ControlWrapper>
                </div>
            </div>
        )}
    </div>
  );
};

export default AuthenticationPanel;