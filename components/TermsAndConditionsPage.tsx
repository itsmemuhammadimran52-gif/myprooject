/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in text-left">
      <div className="bg-gray-800/50 border border-gray-700/60 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">Terms of Service</h1>
        <div className="space-y-4 text-gray-400">
            <p className="text-sm text-gray-500">Effective Date: October 22, 2025</p>
            <p>Welcome to prothumbnailgenerator.com! Our AI-powered thumbnail generator helps YouTubers, TikTokers, and creators make thumbnails that pop. These Terms of Service (“Terms”) govern your use of our website, platform, and related services (the “Service”), operated by Pro Thumbnail Generator. By using the Service, you agree to these Terms. If you don’t agree, please do not use the Service.</p>
            <p>We may update these Terms occasionally. Changes will be posted on this page with an updated effective date. Your continued use means you accept the updated Terms.</p>
            
            <h3 className="text-xl font-semibold text-gray-200 pt-2">1. Account Registration &amp; Security</h3>
            <p>To use our AI thumbnail generator, you may need an account. You agree to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Provide accurate and complete information during registration.</li>
                <li>Keep your account credentials secure and notify us at <a href="mailto:support@prothumbnailgenerator.com" className="text-yellow-400 hover:underline">support@prothumbnailgenerator.com</a> of any unauthorized access.</li>
                <li>Be responsible for all activities under your account.</li>
            </ul>
            <p>We may suspend or terminate accounts that violate these Terms.</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">2. Use of the Service</h3>
            <p>We grant you a limited, non-exclusive, non-transferable, revocable license to use the Service for personal or commercial purposes, like creating thumbnails for YouTube or TikTok. You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Use the Service for illegal or unauthorized purposes.</li>
                <li>Reverse-engineer, modify, or copy our AI technology.</li>
                <li>Use bots, scrapers, or automated tools without permission.</li>
                <li>Upload content that’s harmful, offensive, or infringes third-party rights.</li>
            </ul>
            <p>Our Service provides AI-generated thumbnail suggestions, but you’re responsible for ensuring your thumbnails comply with platform policies (e.g., YouTube’s Community Guidelines).</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">3. User Content</h3>
            <p>You may upload images, screenshots, or text prompts to create thumbnails. You retain ownership of your content but grant us a worldwide, royalty-free, non-exclusive license to use, store, and process it to provide the Service (e.g., generating thumbnails). You confirm your content:</p>
             <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Does not infringe any rights (e.g., copyright).</li>
                <li>Is not unlawful or harmful.</li>
            </ul>
            <p>We may remove content that violates these Terms.</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">4. Payments &amp; Subscriptions</h3>
            <p>We offer free and paid plans (e.g., $9/month for unlimited thumbnails). For paid plans:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Subscriptions are billed in advance (monthly) via Lemon Squeezy.</li>
                <li>You authorize Lemon Squeezy to charge your payment method.</li>
                <li>Fees are non-refundable except as noted in our Refund Policy.</li>
                <li>Cancel anytime via your account dashboard; no refunds for partial periods.</li>
                <li>Pricing may change with prior notice.</li>
                <li>You’re responsible for applicable taxes.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">5. Termination</h3>
            <p>We may suspend or terminate your access for violating these Terms, non-payment, or misuse. You can close your account anytime by contacting <a href="mailto:support@prothumbnailgenerator.com" className="text-yellow-400 hover:underline">support@prothumbnailgenerator.com</a>.</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">6. Limitation of Liability</h3>
            <p>The Service is provided “as is.” We don’t guarantee uninterrupted access or specific results (e.g., higher CTR). We’re not liable for damages from your use of the Service, to the extent permitted by law.</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">7. Contact Us</h3>
            <p>Questions or concerns? Email us at <a href="mailto:support@prothumbnailgenerator.com" className="text-yellow-400 hover:underline">support@prothumbnailgenerator.com</a> or visit our Contact page.</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TermsAndConditionsPage);