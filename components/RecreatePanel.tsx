/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { UploadIcon, CrossIcon } from './icons';

interface RecreatePanelProps {
    originalThumbnail: string | null;
    setOriginalThumbnail: (dataUrl: string | null) => void;
    onOriginalThumbnailSelect: (files: FileList | null) => void;
    recreateCharacterImage: string | null;
    setRecreateCharacterImage: (dataUrl: string | null) => void;
    onCharacterSelectForCrop: (files: FileList | null) => void;
    recreateText: string;
    setRecreateText: (text: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    onCancel: () => void;
}

const ImageUploader: React.FC<{
    id: string;
    label: string;
    subLabel: string;
    imageDataUrl: string | null;
    onFileSelect: (files: FileList | null) => void;
    onClear: () => void;
    isLoading: boolean;
}> = ({ id, label, subLabel, imageDataUrl, onFileSelect, onClear, isLoading }) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileSelect(e.target.files);
    };

    return (
        <div>
            <label className="text-lg font-semibold text-gray-200 mb-2 block">{label}</label>
              {imageDataUrl ? (
                  <div className="relative group w-full">
                      <img src={imageDataUrl} alt="Preview" className="w-full h-auto rounded-lg border-2 border-gray-600 aspect-video object-contain bg-gray-900" />
                      <button
                          onClick={onClear}
                          className="absolute top-2 right-2 z-10 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100"
                          aria-label="Clear image"
                          disabled={isLoading}
                      >
                          <CrossIcon className="w-4 h-4" />
                      </button>
                  </div>
              ) : (
                  <label htmlFor={id} className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700/50 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                          <UploadIcon className="w-6 h-6 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-400">{subLabel}</p>
                      </div>
                      <input
                          id={id}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={isLoading}
                      />
                  </label>
              )}
        </div>
    );
};


const RecreatePanel: React.FC<RecreatePanelProps> = ({
    originalThumbnail, setOriginalThumbnail, onOriginalThumbnailSelect, 
    recreateCharacterImage, setRecreateCharacterImage, onCharacterSelectForCrop,
    recreateText, setRecreateText, onGenerate, isLoading, onCancel
}) => {
    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-800/80 border border-gray-700/80 rounded-lg p-8 flex flex-col gap-8 animate-fade-in backdrop-blur-sm">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-white">Re-create a Thumbnail</h2>
                <p className="text-gray-400 mt-2">Upload an existing thumbnail and let our AI create a modern, high-CTR version.</p>
            </div>

            <div className="flex flex-col gap-6">
                <ImageUploader
                    id="original-thumbnail-upload"
                    label="1. Upload Original Thumbnail (Required)"
                    subLabel="Click to upload"
                    imageDataUrl={originalThumbnail}
                    onFileSelect={onOriginalThumbnailSelect}
                    onClear={() => setOriginalThumbnail(null)}
                    isLoading={isLoading}
                />
                <ImageUploader
                    id="character-image-upload"
                    label="2. Upload New Person Image (Required)"
                    subLabel="Upload an image of the entire person to replace the one in the original thumbnail."
                    imageDataUrl={recreateCharacterImage}
                    onFileSelect={onCharacterSelectForCrop}
                    onClear={() => setRecreateCharacterImage(null)}
                    isLoading={isLoading}
                />
                <div>
                    <label htmlFor="recreate-text" className="text-lg font-semibold text-gray-200 mb-2 block">
                        3. Enter New Title Text (Optional)
                    </label>
                     <p className="text-sm text-gray-400 mb-2 -mt-1">To replace the text in the original.</p>
                      <textarea
                          id="recreate-text"
                          value={recreateText}
                          onChange={(e) => setRecreateText(e.target.value)}
                          placeholder="e.g., I BUILT A REAL IRON MAN SUIT"
                          className="bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base resize-none h-24"
                          disabled={isLoading}
                      />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                  <button
                      onClick={onGenerate}
                      className="w-full bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:from-gray-600 disabled:to-gray-500 disabled:text-gray-300 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                      disabled={isLoading || !originalThumbnail || !recreateCharacterImage}
                  >
                      {isLoading ? "Generating..." : "Modernize Thumbnail"}
                  </button>
                  <button 
                      onClick={onCancel} 
                      className="w-full text-gray-400 hover:text-white transition-colors text-sm disabled:opacity-50 py-2 rounded-lg hover:bg-white/10"
                      disabled={isLoading}
                  >
                      Cancel
                  </button>
            </div>
        </div>
    );
};

export default RecreatePanel;