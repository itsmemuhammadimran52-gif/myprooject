/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const features = [
    {
        title: "Very Simple to Use",
        description: "Just upload your picture, choose your video type (vlog, funny, educational, documentary), select an emotion, and our tool instantly generates professional thumbnails.",
        emoji: "🎯"
    },
    {
        title: "Customization Options",
        description: "Edit thumbnails your way — change fonts, colors, and layout. You can fully customize designs or let AI make the smart choice for you.",
        emoji: "🛠️"
    },
    {
        title: "AI-Powered Smart Selection",
        description: "Our AI automatically suggests and applies the best design style, ensuring your thumbnails always look professional and engaging.",
        emoji: "🤖"
    },
    {
        title: "High-Quality Downloads",
        description: "Download your thumbnails in PNG format, ready to upload directly to YouTube.",
        emoji: "📂"
    },
    {
        title: "Free to Start",
        description: "Currently, Pro Thumbnail Generator is completely free to use. (Premium version with advanced features is coming soon.)",
        emoji: "💡"
    },
    {
        title: "Face & Emotion Integration",
        description: "Upload your face image and select an emotion — our AI will match your expression and apply it to the thumbnail for maximum impact.",
        emoji: "👤"
    },
    {
        title: "Background Control",
        description: "Choose your own background image or upload a custom one to make your thumbnails unique and brand-focused.",
        emoji: "🌆"
    },
    {
        title: "More Features Coming Soon",
        description: "Exciting new updates and ready-made templates are on the way — stay tuned!",
        emoji: "🚀"
    }
];

const FeaturesPage: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in text-left">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 mb-2 text-center">
                <span className="text-yellow-400">✨</span> Features
            </h1>
            <h2 className="text-2xl font-bold text-gray-300 mb-10 text-center">Pro Thumbnail Generator</h2>
            <div className="space-y-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-gray-800/50 border border-gray-700/60 rounded-lg p-6 flex items-start gap-6">
                        <div className="text-4xl mt-1">{feature.emoji}</div>
                        <div>
                            <h3 className="text-xl font-bold text-yellow-400 mb-2">
                               {feature.title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                               {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(FeaturesPage);