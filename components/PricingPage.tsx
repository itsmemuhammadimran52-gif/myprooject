/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import type { User } from 'firebase/auth';

type View = 'signup' | 'tool';

interface PricingPageProps {
    onNavigate: (view: View) => void;
    currentUser: User | null;
}

interface Plan {
    name: string;
    monthly: number;
    features: string[];
    bestFor: string;
    button: { text: string; style: string };
    popular: boolean;
    emoji: string;
    borderColor: string;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, currentUser }) => {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const YEARLY_DISCOUNT = 0.2;
    const plansData: Plan[] = [
        {
            name: 'Starter',
            monthly: 5,
            emoji: '💰',
            features: [
                '30 images per month',
                'No watermarks',
                'AI thumbnail generation (2 variations)',
                '14+ categories (Vlog, Gaming, Food, etc.)',
                '6 emotions with intensity control',
                'Basic text customization',
                'AI background generation',
                'Image cropping (16:9)',
                'PNG download',
                'Email support',
            ],
            bestFor: 'Bohot affordable entry point!',
            button: {
                text: 'Start Now',
                style: 'bg-blue-600 text-white hover:bg-blue-500',
            },
            popular: false,
            borderColor: 'border-blue-500',
        },
        {
            name: 'Pro',
            monthly: 12,
            emoji: '⭐',
            features: [
                '100 images per month',
                'No watermarks',
                'All Starter features',
                'Advanced text editor (7 fonts, full control)',
                '7 AI filters (Cinematic, Vintage, Anime, etc.)',
                'Custom background upload',
                '4K upscaling',
                'Pro Feature (one-prompt generation)',
                'Recreate thumbnails feature',
                'Undo/Redo functionality',
                'Auth button editor',
                'Secondary image support',
                'Priority email support',
            ],
            bestFor: 'Best value for regular users',
            button: {
                text: 'Start Now',
                style: 'bg-purple-600 text-white hover:bg-purple-500',
            },
            popular: true,
            borderColor: 'border-purple-500',
        },
        {
            name: 'Business',
            monthly: 29,
            emoji: '🚀',
            features: [
                '300 images per month',
                'No watermarks',
                'All Pro features',
                'Team collaboration (up to 10 users)',
                'Shared templates library',
                'Usage analytics & reporting',
                'Bulk download options',
                'Priority support (24/7)',
                'Custom branding options',
                'Advanced cache management',
            ],
            bestFor: 'Teams ke liye perfect',
            button: {
                text: 'Start Now',
                style: 'bg-yellow-400 text-black hover:bg-yellow-300',
            },
            popular: false,
            borderColor: 'border-yellow-400',
        },
        {
            name: 'Agency',
            monthly: 59,
            emoji: '👑',
            features: [
                '800 images per month',
                'No watermarks',
                'All Business features',
                'White-label options',
                'Team collaboration (up to 20 users)',
                'Volume play + white-label value',
                'Custom integrations',
                'Dedicated account manager',
                'Priority support (24/7)',
                'Advanced analytics dashboard',
                'API access (coming soon)',
            ],
            bestFor: 'Volume play + white-label value',
            button: {
                text: 'Start Now',
                style: 'bg-gray-800 text-white hover:bg-gray-700',
            },
            popular: false,
            borderColor: 'border-gray-600',
        },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 animate-fade-in text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 mb-4">
                Subscriptions Plans
            </h1>
            <div className="flex items-center justify-center gap-3 mb-4">
                <button onClick={() => setBillingPeriod('monthly')} className={`px-4 py-2 rounded-full font-semibold text-sm ${billingPeriod==='monthly' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Monthly</button>
                <button onClick={() => setBillingPeriod('yearly')} className={`px-4 py-2 rounded-full font-semibold text-sm ${billingPeriod==='yearly' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Yearly</button>
            </div>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                {billingPeriod==='monthly' ? 'Monthly billing. Upgrade anytime.' : 'Yearly billing with 20% off. Billed annually.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plansData.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative bg-gray-800/50 border rounded-xl shadow-lg p-8 flex flex-col transition-transform duration-300 hover:-translate-y-2 text-left ${plan.borderColor} ${plan.popular ? 'shadow-purple-500/10' : ''}`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-purple-500 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                                Most Popular
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.emoji} {plan.name}</h3>
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                                {(() => {
                                    const isYearly = billingPeriod==='yearly';
                                    const yearlyOriginal = Math.round(plan.monthly * 12);
                                    const yearlyDiscounted = Math.round(plan.monthly * 12 * (1 - YEARLY_DISCOUNT));
                                    const displayPrice = isYearly ? yearlyDiscounted : plan.monthly;
                                    return (
                                        <>
                                            <span className="text-4xl font-extrabold text-white">${displayPrice}</span>
                                            {isYearly && (
                                                <span className="text-lg text-gray-500 line-through">${yearlyOriginal}</span>
                                            )}
                                            <span className="text-gray-400">{isYearly ? '/year' : '/month'}</span>
                                        </>
                                    );
                                })()}
                            </div>
                            {billingPeriod==='yearly' && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Save {Math.round(YEARLY_DISCOUNT*100)}%</span>
                                    <span className="text-xs text-gray-400">≈ ${(Math.round(plan.monthly * 12 * (1 - YEARLY_DISCOUNT))/12).toFixed(2)}/mo</span>
                                </div>
                            )}
                        </div>
                        
                        <ul className="space-y-3 text-left mb-6 flex-grow">
                            {plan.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-start gap-3">
                                    <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                                    <span className="text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto pt-8">
                            <button
                                disabled
                                className={`block text-center w-full font-bold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out shadow-md active:scale-95 text-lg ${plan.button.style} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {plan.button.text}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 bg-gray-800/50 border border-gray-700/60 rounded-lg p-8 max-w-4xl mx-auto text-left">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Plan Details &amp; Features</h2>
                
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-blue-400">💰 Starter Plan – $5/month</h3>
                    <p className="text-gray-400 mt-2">30 images per month - Perfect for small creators.</p>
                    <ul className="list-disc list-inside space-y-1 pl-4 mt-2 text-gray-300">
                        <li><strong>30 images per month</strong> - Perfect for small creators</li>
                        <li><strong>No watermarks</strong> - Professional quality downloads</li>
                        <li><strong>AI thumbnail generation</strong> - Get 2 variations per generation</li>
                        <li><strong>14+ categories</strong> - Vlog, Gaming, Food, Travel, Documentary, Education, Finance, Funny, Movie Review, MrBeast Style, Tutorial, Product Review, Before & After, Face Reaction</li>
                        <li><strong>6 emotions with intensity control</strong> - Happy, Sad, Angry, Shocked, Excited, Serious (0-100% intensity)</li>
                        <li><strong>Basic text customization</strong> - Add title text with AI-suggested colors and fonts</li>
                        <li><strong>AI background generation</strong> - AI creates backgrounds based on your style choice</li>
                        <li><strong>Image cropping</strong> - 16:9 aspect ratio cropping tool</li>
                        <li><strong>PNG download</strong> - High-quality downloads ready for YouTube</li>
                        <li><strong>Email support</strong> - Get help when you need it</li>
                    </ul>
                    <p className="mt-2"><span className="font-semibold">👉 Best for:</span> Bohot affordable entry point! Perfect for beginners and hobbyists who want to try professional thumbnail creation.</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-purple-400">⭐ Pro Plan (Most Popular) – $12/month</h3>
                    <p className="text-gray-400 mt-2">100 images per month - Best value for regular users.</p>
                    <ul className="list-disc list-inside space-y-1 pl-4 mt-2 text-gray-300">
                        <li><strong>100 images per month</strong> - 3x more than Starter</li>
                        <li><strong>All Starter features included</strong> - Everything from the Starter plan</li>
                        <li><strong>Advanced text editor</strong> - 7 font families (Anton, Bebas Neue, Inter, Montserrat, Oswald, Poppins, Roboto), full color control, outline customization, bold/italic, position control</li>
                        <li><strong>7 AI filters</strong> - Harmonize, Cinematic, Vintage, Synthwave, Anime, Lomo, Glitch + custom filter prompts</li>
                        <li><strong>Custom background upload</strong> - Upload your own background images</li>
                        <li><strong>4K upscaling</strong> - Upscale thumbnails to 3840x2160 resolution</li>
                        <li><strong>Pro Feature</strong> - One-prompt thumbnail generation (describe your idea, AI creates it)</li>
                        <li><strong>Recreate thumbnails</strong> - Recreate existing thumbnails with new characters</li>
                        <li><strong>Undo/Redo functionality</strong> - Edit history for easy corrections</li>
                        <li><strong>Auth button editor</strong> - Add customizable Login/Signup buttons to thumbnails</li>
                        <li><strong>Secondary image support</strong> - Upload second images for Before & After, Product Review, Food categories</li>
                        <li><strong>Priority email support</strong> - Faster response times</li>
                    </ul>
                    <p className="mt-2"><span className="font-semibold">👉 Best for:</span> Best value for regular users. Ideal for active YouTubers and content creators who need professional tools and more generations.</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-yellow-400">🚀 Business Plan – $29/month</h3>
                    <p className="text-gray-400 mt-2">300 images per month - Teams ke liye perfect.</p>
                    <ul className="list-disc list-inside space-y-1 pl-4 mt-2 text-gray-300">
                        <li><strong>300 images per month</strong> - 3x more than Pro plan</li>
                        <li><strong>All Pro features included</strong> - Complete access to all Pro tools</li>
                        <li><strong>Team collaboration</strong> - Up to 10 team members can share and collaborate</li>
                        <li><strong>Shared templates library</strong> - Save and share thumbnail templates with your team</li>
                        <li><strong>Usage analytics & reporting</strong> - Track team usage, popular categories, and generation trends</li>
                        <li><strong>Bulk download options</strong> - Download multiple thumbnails at once</li>
                        <li><strong>Priority support (24/7)</strong> - Round-the-clock support availability</li>
                        <li><strong>Custom branding options</strong> - Add your team's branding to thumbnails</li>
                        <li><strong>Advanced cache management</strong> - Better storage and faster access to previous generations</li>
                    </ul>
                    <p className="mt-2"><span className="font-semibold">👉 Best for:</span> Teams ke liye perfect. Great for marketing teams, agencies, and businesses that need collaboration features and higher volume.</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-300">👑 Agency Plan – $59/month</h3>
                    <p className="text-gray-400 mt-2">800 images per month - Volume play + white-label value.</p>
                    <ul className="list-disc list-inside space-y-1 pl-4 mt-2 text-gray-300">
                        <li><strong>800 images per month</strong> - Highest volume tier</li>
                        <li><strong>All Business features included</strong> - Complete access to all features</li>
                        <li><strong>White-label options</strong> - Remove branding and customize the experience</li>
                        <li><strong>Team collaboration (up to 20 users)</strong> - Support for larger teams</li>
                        <li><strong>Volume play + white-label value</strong> - Perfect for agencies serving multiple clients</li>
                        <li><strong>Custom integrations</strong> - Integrate with your existing tools and workflows</li>
                        <li><strong>Dedicated account manager</strong> - Personal support from our team</li>
                        <li><strong>Priority support (24/7)</strong> - Immediate assistance when needed</li>
                        <li><strong>Advanced analytics dashboard</strong> - Comprehensive insights and reporting</li>
                        <li><strong>API access (coming soon)</strong> - Programmatic access for automation</li>
                    </ul>
                    <p className="mt-2"><span className="font-semibold">👉 Best for:</span> Volume play + white-label value. Perfect for agencies, large content teams, and businesses that need high-volume production with white-label capabilities.</p>
                </div>

                <div className="border-t border-gray-700 my-8"></div>
                
                <div>
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Choose Pro Thumbnail Generator?</h2>
                    <ul className="space-y-4 text-lg text-gray-300 max-w-lg mx-auto text-left">
                        <li className="flex items-center gap-3">
                            <span>✅</span>
                            <span>Easy-to-use editor designed for creators</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span>✅</span>
                            <span>Affordable plans with clear limits</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span>✅</span>
                            <span>AI-powered tools for faster workflow</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span>✅</span>
                            <span>No hidden charges or complicated contracts</span>
                        </li>
                    </ul>
                </div>
                
                <div className="text-center mt-8">
                    <p className="text-center font-bold text-lg text-yellow-400">
                        ⚡ Start free, upgrade anytime.
                    </p>
                    <p className="text-gray-400 mt-2">
                        Find the plan that matches your workflow and take your content to the next level today!
                    </p>
                </div>
            </div>

        </div>
    );
};

export default React.memo(PricingPage);
