/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';

// Refactored content into a structured array to allow for filtering
const blogContent = [
    {
        id: 'intro',
        title: 'Pro Thumbnail Generator — Create Eye-Catching YouTube Thumbnails in 1 Minute',
        content: [
            { type: 'p', text: 'Thumbnails are the first thing viewers see — and a great thumbnail can mean the difference between a view and a scroll. <strong class="text-yellow-400">Pro Thumbnail Generator</strong> is an AI-powered, super-simple YouTube thumbnail generator that creates 2 professional thumbnails in just 1 minute. It’s built for YouTubers, content creators, marketers, and agencies who want fast, high-converting visuals without the headache.' }
        ]
    },
    {
        id: 'why-matters',
        title: 'Why thumbnails matter (and why this tool helps)',
        content: [
            { type: 'p', text: 'A strong thumbnail improves your CTR (click-through rate), boosts discoverability, and encourages more clicks and watch time. Instead of spending hours in Photoshop, use an AI thumbnail maker that understands video type and emotion, producing polished PNGs ready for upload. Pro Thumbnail Generator focuses on speed, simplicity, and results — so you can spend more time creating content.' }
        ]
    },
    {
        id: 'features',
        title: 'What Pro Thumbnail Generator does (quick features)',
        content: [
            { type: 'ul', items: [
                'Generates 2 eye-catching thumbnails in 1 minute.',
                'Works on web and mobile.',
                'Upload your face image and choose an emotion — the AI adapts the design to match.',
                'Pick a video type (vlog, funny, educational, documentary) to tune style.',
                'Customize fonts, colors, layout, or let the AI auto-select the best look.',
                'Download final thumbnails in PNG (high quality).',
                'Free to use with a watermark; $6/month removes watermark and unlocks extra features.',
                'Background upload and logo support for branded thumbnails.',
                'New features are coming soon — stay tuned!',
            ]}
        ]
    },
    {
        id: 'how-to',
        title: 'How to use Pro Thumbnail Generator — step-by-step (easy tutorial)',
        content: [
            { type: 'ol', items: [
                'Open the tool on web or mobile.',
                'Upload your picture (a clear face close-up works best).',
                'Choose the video type: vlog, funny, educational, documentary, etc. This helps the AI pick the right layout and mood.',
                'Select an emotion (e.g., surprised, happy, dramatic). The AI tailors facial emphasis and color tone to boost expressiveness.',
                'Let AI generate — the tool instantly creates two polished thumbnail options for you.',
                'Customize if you want: change text, font size, colors, add your logo, or upload a custom background image.',
                'Preview both generated thumbnails and compare which one fits your title and audience.',
                'Download the chosen thumbnails as PNG. If you’re on the free plan, your image will include a watermark; upgrade to remove it.',
                'Optional: Sign up or subscribe to unlock more features and upcoming updates.',
            ]},
            { type: 'p', text: 'That’s it — 1 minute to two thumbnails that are formatted, optimized, and ready to upload.' }
        ]
    },
    {
        id: 'pricing',
        title: 'Pricing & Account Details',
        content: [
            { type: 'ul', items: [
                '<strong>Free plan:</strong> Create thumbnails with watermark — perfect for trying the tool and quick tests.',
                '<strong>Pro subscription:</strong> $6/month to remove watermark and unlock additional features.',
                '<strong>Account:</strong> Optional, but signing up unlocks saved designs and future premium features.',
            ]}
        ]
    },
    {
        id: 'pro-tips',
        title: 'Pro tips to get more clicks with your thumbnails',
        content: [
            { type: 'ul', items: [
                'Use a close-up face and strong emotion — faces sell.',
                'Keep text short and bold (3–4 words max).',
                'High contrast between text and background improves readability on mobile.',
                'Use consistent branding (logo, color palette) across thumbnails.',
                'Test two thumbnails on different uploads — small variations can change CTR.',
                'Make sure the thumbnail matches your title and video content (no clickbait mismatch).',
            ]}
        ]
    },
    {
        id: 'seo',
        title: 'SEO & Keywords to Help Your Site',
        content: [
            { type: 'p', text: 'Use phrases like “AI YouTube thumbnails”, “YouTube thumbnail generator”, “create YouTube thumbnails”, “best YouTube thumbnail maker”, and “free thumbnail maker” on your landing page, blog posts, and meta tags to attract creators searching for fast, AI-powered solutions.' },
            { type: 'blockquote', content: [
                { type: 'p', text: 'Suggested meta description:', className: 'font-semibold text-gray-200' },
                { type: 'p', text: 'Create 2 professional YouTube thumbnails in 1 minute with Pro Thumbnail Generator — an AI thumbnail maker for YouTubers, creators, and agencies. Free plan available; remove watermark for $6/month.', className: 'italic text-gray-400' }
            ]}
        ]
    },
    {
        id: 'cta',
        title: 'Final Call to Action',
        content: [
            { type: 'p', text: 'Ready to level up your thumbnails and get more clicks? Try Pro Thumbnail Generator now — upload a photo, choose your video type and emotion, and get two professional thumbnails in just one minute. Your next viral thumbnail might be one click away.' }
        ]
    }
];

// Helper to convert structured content to searchable plain text
const contentToText = (content: any[]): string => {
    return content.map(item => {
        if (item.text) return item.text.replace(/<[^>]*>?/gm, ''); // Strip HTML tags for searching
        if (item.items) return item.items.join(' ').replace(/<[^>]*>?/gm, '');
        if (item.content) return contentToText(item.content);
        return '';
    }).join(' ');
};


const BlogPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContent = useMemo(() => {
        if (!searchTerm) {
            return blogContent;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return blogContent.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(lowercasedFilter);
            const contentMatch = contentToText(post.content).toLowerCase().includes(lowercasedFilter);
            return titleMatch || contentMatch;
        });
    }, [searchTerm]);

    const renderContentItem = (item: any, index: number) => {
        switch (item.type) {
            case 'p':
                return <p key={index} className={item.className} dangerouslySetInnerHTML={{ __html: item.text }} />;
            case 'ul':
                return (
                    <ul key={index} className="list-disc list-inside space-y-2 pl-4">
                        {item.items.map((li: string, i: number) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}
                    </ul>
                );
            case 'ol':
                return (
                    <ol key={index} className="list-decimal list-inside space-y-2 pl-4">
                        {item.items.map((li: string, i: number) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}
                    </ol>
                );
            case 'blockquote':
                return (
                     <blockquote key={index} className="border-l-4 border-yellow-500 pl-4 py-2 bg-gray-900/50 my-4">
                        {item.content.map(renderContentItem)}
                    </blockquote>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-100 mb-4 text-center leading-tight">
                Pro Thumbnail Generator <span className="text-yellow-400">Blog</span>
            </h1>

            <div className="mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                    aria-label="Search blog posts"
                />
            </div>

            <div className="bg-gray-800/50 border border-gray-700/60 rounded-lg p-8 space-y-6 text-gray-300 leading-relaxed text-lg">
                {filteredContent.length > 0 ? (
                    filteredContent.map(post => (
                        <div key={post.id} className="space-y-4">
                             {/* The main title is handled by the page h1, so we render section titles */}
                             <h2 className="text-2xl font-bold text-gray-100 pt-4" dangerouslySetInnerHTML={{ __html: post.title.replace(/—/g, '<br/>—') }}/>
                            {post.content.map(renderContentItem)}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-xl font-semibold text-gray-400">No results found for "{searchTerm}"</p>
                        <p className="text-gray-500 mt-2">Try searching for a different keyword.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(BlogPage);
