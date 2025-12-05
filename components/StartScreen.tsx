/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { UploadIcon, MagicWandIcon, PaletteIcon, SunIcon, SparklesIcon } from './icons';

interface StartScreenProps {
  onFileSelect: (files: FileList | null) => void;
  onRecreateClick: () => void;
  onStartProFeature: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onFileSelect, onRecreateClick, onStartProFeature }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files);
  };

  return (
    <div 
      className={`w-full max-w-5xl mx-auto text-center p-8 transition-all duration-300 rounded-2xl border-2 ${isDraggingOver ? 'bg-yellow-500/10 border-dashed border-yellow-400' : 'border-transparent'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        onFileSelect(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <h1 className="text-5xl font-extrabold text-gray-100 sm:text-6xl md:text-7xl">
          Create Viral YouTube Thumbnails, <span className="text-yellow-400">Instantly</span>.
        </h1>
        <p className="max-w-2xl text-lg text-gray-400 md:text-xl">
          Upload your image, choose a style, and let our AI generate high-click-through-rate thumbnails in seconds.
        </p>

        <div className="mt-6 flex flex-col items-center gap-4">
            <label htmlFor="image-upload-start" className="relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-yellow-600 rounded-full cursor-pointer group hover:bg-yellow-500 transition-colors">
                <UploadIcon className="w-6 h-6 mr-3 transition-transform duration-500 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110" />
                Upload Your Image
            </label>
            <input id="image-upload-start" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
             <p className="text-sm text-gray-500">
                or drag and drop a file
            </p>
            <div className="flex items-center my-2 w-full max-w-sm">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-400 font-semibold text-xs">OR</span>
                <div className="flex-grow border-t border-gray-600"></div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onRecreateClick}
                className="text-white font-semibold hover:text-yellow-300 transition-colors py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Re-create an Existing Thumbnail
              </button>
              <button
                onClick={onStartProFeature}
                className="flex items-center gap-2 text-yellow-400 font-semibold hover:text-yellow-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/10"
              >
                <SparklesIcon className="w-5 h-5" />
                Try the New PRO Feature
              </button>
            </div>
        </div>

        <div className="mt-16 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <MagicWandIcon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">AI Face Enhancement</h3>
                    <p className="mt-2 text-gray-400">Automatically cut out, sharpen, and enhance your face to make it pop, just like top YouTubers.</p>
                </div>
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <PaletteIcon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">Viral Styles & Categories</h3>
                    <p className="mt-2 text-gray-400">Select from proven styles like Vlogs, Gaming, or "MrBeast" to match your video's content instantly.</p>
                </div>
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <SunIcon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">High-CTR Text & Colors</h3>
                    <p className="mt-2 text-gray-400">Our AI adds bold, outlined text and uses color psychology to create thumbnails that demand to be clicked.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(StartScreen);