/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { MagicWandIcon, PaletteIcon, SunIcon } from './icons';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  // Array of thumbnail images to display in the gallery
  const exampleThumbnails = [
    'https://i.postimg.cc/j5Gn59cG/How-to-create-Youtube-channle-thumb-1.png',
    'https://i.postimg.cc/B6t2t20P/thumbsai-thumbnail.png',
    'https://i.postimg.cc/QNym2CqS/What-thumb.png',
    'https://i.postimg.cc/ZqwKwGh9/youtybe-Copy.png'
  ];

  return (
    <div className="w-full max-w-5xl mx-auto text-center p-8">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <h1 className="text-5xl font-extrabold text-gray-100 sm:text-6xl md:text-7xl">
          Create Viral YouTube Thumbnails, <span className="text-yellow-400">Instantly</span>.
        </h1>
        <p className="max-w-2xl text-lg text-gray-400 md:text-xl">
          Upload your image, choose a style, and let our AI generate high-click-through-rate thumbnails in seconds.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={onGetStarted}
                  className="px-10 py-5 text-xl font-bold text-black bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full group transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-yellow-400/30 hover:-translate-y-1"
                >
                    Get Started for Free
                </button>
            </div>
            <p className="text-sm text-gray-500">
                Already trusted by 10k+ creators to design thumbnails that get noticed.
            </p>
        </div>

        <div className="mt-16 w-full">
            <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
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

        <div className="mt-16 w-full">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center justify-center gap-3">
                <span role="img" aria-label="lightbulb">💡</span> Why Choose Us
            </h2>
            <div className="max-w-3xl mx-auto bg-black/20 p-8 rounded-lg border border-gray-700/50">
                <ul className="space-y-4 text-lg text-gray-300 text-left">
                    <li className="flex items-start gap-4">
                        <span className="text-2xl mt-1">✅</span>
                        <span><strong className="text-white">AI-Powered Perfection</strong> – Smart technology that designs eye-catching thumbnails in seconds.</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <span className="text-2xl mt-1">😎</span>
                        <span><strong className="text-white">Emotion Detection</strong> – Our AI captures real human emotions that boost viewer curiosity.</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <span className="text-2xl mt-1">🎯</span>
                        <span><strong className="text-white">High Engagement</strong> – Thumbnails built to increase clicks and audience retention.</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <span className="text-2xl mt-1">⚡</span>
                        <span><strong className="text-white">Super Fast & Easy</strong> – No design experience needed — generate with one click.</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <span className="text-2xl mt-1">🌟</span>
                        <span><strong className="text-white">Trusted by Creators</strong> – Hundreds of YouTubers already growing with ProThumbnailGenerator.</span>
                    </li>
                </ul>
            </div>
        </div>

        {/* --- New Section: See What Creators Are Making --- */}
        <div className="mt-24 w-full">
          <h2 className="text-4xl font-bold text-white mb-4">
            See What Creators Are Making
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-12">
            Explore real thumbnails created by our users — powered by AI to inspire your next viral design.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {exampleThumbnails.map((src, index) => (
              <div key={index} className="group aspect-video bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg transition-all duration-300 hover:shadow-yellow-400/20 hover:-translate-y-1">
                <img 
                  src={src} 
                  alt={`Example thumbnail created with the generator ${index + 1}`} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <button 
              onClick={onGetStarted}
              className="px-10 py-5 text-xl font-bold text-black bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full group transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-yellow-400/30 hover:-translate-y-1"
            >
              Generate Your Own Thumbnail
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default React.memo(HomePage);