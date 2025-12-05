/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { DownloadIcon, SparklesIcon } from './icons';
import { ThumbnailSkeleton } from './Skeletons';

interface ProFeaturePanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    generatedImage: string | null;
    onDownload: (imageUrl: string) => void;
    onCancel: () => void;
    error: string | null;
}

const ProFeaturePanel: React.FC<ProFeaturePanelProps> = ({
    prompt,
    setPrompt,
    onGenerate,
    isLoading,
    generatedImage,
    onDownload,
    onCancel,
    error,
}) => {
    const canGenerate = prompt.trim().length > 0 && !isLoading;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 animate-fade-in">
            <div className="text-center">
                <div className="flex justify-center items-center gap-3">
                    <SparklesIcon className="w-7 h-7 text-yellow-400" />
                    <h2 className="text-4xl font-extrabold text-white">PRO One-Prompt Generator</h2>
                </div>
                <p className="text-gray-400 mt-2 max-w-2xl">
                    Describe your Thumbnail in a few words, and let AI create a complete, high-CTR thumbnail for you instantly.
                </p>
            </div>
            
            <div className="w-full bg-gray-800/80 border border-gray-700/80 rounded-lg p-6 flex flex-col gap-4 backdrop-blur-sm">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., crypto rocket to the moon, delicious pizza deal, travel Paris..."
                    className="bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base resize-none h-24"
                    disabled={isLoading}
                />
                <button
                    onClick={onGenerate}
                    className="w-full bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:from-gray-600 disabled:to-gray-500 disabled:text-gray-300 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!canGenerate}
                >
                    Generate Thumbnail
                </button>
            </div>

            <div className="w-full">
                {error ? (
                    <div className="w-full aspect-video bg-red-900/80 rounded-lg flex flex-col items-center justify-center z-10 p-6 text-center animate-fade-in">
                        <h3 className="text-xl font-bold text-red-200">Generation Failed</h3>
                        <p className="mt-2 text-red-300">{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center"><ThumbnailSkeleton /></div>
                ) : generatedImage ? (
                    <div className="flex flex-col gap-4 items-center animate-fade-in">
                        <div className="w-full max-w-2xl aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                            <img src={generatedImage} alt="Generated pro thumbnail" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onDownload(generatedImage)}
                                className="flex items-center justify-center gap-3 bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base"
                            >
                                <DownloadIcon className="w-5 h-5" />
                                Download
                            </button>
                             <button
                                onClick={onCancel}
                                className="text-gray-400 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/10"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ProFeaturePanel;