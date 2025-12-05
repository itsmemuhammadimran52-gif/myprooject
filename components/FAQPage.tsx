/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const faqs = [
    {
        question: "What is Pro Thumbnail Generator?",
        answer: "Pro Thumbnail Generator is an online tool that creates 2 professional YouTube thumbnails in just 1 minute. These thumbnails are designed to be eye-catching and help boost clicks and views on your videos."
    },
    {
        question: "Who can use this tool?",
        answer: "It’s perfect for YouTubers (beginners and professionals), marketers, and media marketing agencies who want quick, professional thumbnails."
    },
    {
        question: "Is the tool free to use?",
        answer: "Yes, Pro Thumbnail Generator has a free version where you can create thumbnails. However, the free version includes a watermark. To remove the watermark, you can upgrade for just $6 per month."
    },
    {
        question: "Do I need to create an account?",
        answer: "Creating an account is optional. But if you sign up, you’ll unlock additional features that free users don’t have access to."
    },
    {
        question: "On which devices can I use this tool?",
        answer: "Pro Thumbnail Generator works smoothly on both web and mobile devices."
    },
    {
        question: "How long does it take to generate thumbnails?",
        answer: "It only takes 1 minute to generate 2 professional thumbnails."
    },
    {
        question: "Are new features coming soon?",
        answer: "Yes ✅ our team is actively working on new features that will be released in upcoming updates."
    }
];

const FAQPage: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in text-left">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 mb-10 text-center">
                Frequently Asked Questions
            </h1>
            <div className="space-y-8">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-gray-800/50 border border-gray-700/60 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">
                           {faq.question}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                           {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(FAQPage);
