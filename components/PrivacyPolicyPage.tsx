/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in text-left">
      <div className="bg-gray-800/50 border border-gray-700/60 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">Privacy Policy</h1>
        <div className="space-y-4 text-gray-400">
            <p className="text-sm text-gray-500">Effective Date: October 22, 2025</p>
            <p>At prothumbnailgenerator.com, we respect your privacy. Our AI-powered thumbnail generator helps YouTubers and TikTokers create thumbnails that pop, and this Privacy Policy explains how we collect, use, and protect your data when you use our service (“Service”).</p>
            
            <h3 className="text-xl font-semibold text-gray-200 pt-2">1. Information We Collect</h3>
            <p>We collect the following to provide and improve the Service:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-gray-300">Account Details:</strong> Name, email, and payment info (processed securely via Lemon Squeezy).</li>
                <li><strong className="text-gray-300">Prompts & Uploads:</strong> Text prompts, images, or screenshots you provide to generate thumbnails.</li>
                <li><strong className="text-gray-300">Contact Info:</strong> Details you share when reaching out (e.g., via our Contact form).</li>
                <li><strong className="text-gray-300">Usage Data:</strong> IP address, device info, browser type, and logs (anonymized via Google Analytics).</li>
                <li><strong className="text-gray-300">Cookies:</strong> Used for functionality, analytics, and personalized ads. You can opt out via your browser settings.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">2. How We Use Your Data</h3>
            <p>We use your data to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Generate and deliver thumbnails that boost your click-through rates.</li>
                <li>Manage accounts, process payments, and handle subscriptions.</li>
                <li>Send updates, offers, or respond to inquiries (you can unsubscribe anytime).</li>
                <li>Improve our AI and ensure security/compliance.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">3. Who We Share Data With</h3>
            <p>We only share data with trusted partners to run the Service:</p>
             <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-gray-300">Lemon Squeezy:</strong> For secure payment processing.</li>
                <li><strong className="text-gray-300">Analytics Providers:</strong> Anonymized data for usage insights (e.g., Google Analytics).</li>
            </ul>
            <p>We never sell your data.</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">4. Data Security</h3>
            <p>We use HTTPS and secure servers to protect your data. While we take reasonable measures, no system is 100% secure, and you use the Service at your own risk.</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">5. Data Retention</h3>
            <p>We keep your data only as long as needed to provide the Service or comply with legal obligations (e.g., tax records). You can request deletion anytime.</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">6. Your Rights (GDPR/CCPA)</h3>
            <p>You can:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Access, correct, or delete your data.</li>
                <li>Opt out of marketing emails or cookies.</li>
                <li>File a complaint with a data protection authority.</li>
            </ul>
            <p>Contact us at <a href="mailto:support@prothumbnailgenerator.com" className="text-yellow-400 hover:underline">support@prothumbnailgenerator.com</a> to exercise these rights.</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">7. Contact Us</h3>
            <p>Questions? Email <a href="mailto:support@prothumbnailgenerator.com" className="text-yellow-400 hover:underline">support@prothumbnailgenerator.com</a> or visit our Contact page.</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrivacyPolicyPage);