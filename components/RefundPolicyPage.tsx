/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in text-left">
        <div className="bg-gray-800/50 border border-gray-700/60 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">Refund Policy</h1>
        <div className="space-y-4 text-gray-400">
            <p className="text-sm text-gray-500">Effective Date: October 22, 2025</p>
            <p>At prothumbnailgenerator.com, we’re committed to helping YouTubers and TikTokers create thumbnails that pop with our AI-powered tool. This Refund Policy explains when and how you can request a refund.</p>
            
            <h3 className="text-xl font-semibold text-gray-200 pt-2">1. Subscription Services</h3>
            <p>Our plans (e.g., Basic at $9/month, Standard, Premium) are non-refundable except as noted below. Once payment is processed via Lemon Squeezy, you get immediate access to your plan’s features for the billing cycle (e.g., monthly). No partial refunds or credits are issued for unused portions.</p>
            <p>To avoid further charges, cancel your subscription before the next billing date via your account dashboard.</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">2. 30-Day Money-Back Guarantee</h3>
            <p>We want you thrilled with our Service! If you’re not satisfied with your first subscription cycle, you can request a full refund within 30 days of your initial purchase. This applies only to your first subscription, not renewals or subsequent cycles.</p>
            <p>To request a refund, email <a href="mailto:support@prothumbnailgenerator.com" className="text-yellow-400 hover:underline">support@prothumbnailgenerator.com</a> with your order ID. Refunds are processed via Lemon Squeezy within 5-10 business days, back to your original payment method, subject to applicable consumer laws.</p>
            
            <h3 className="text-xl font-semibold text-gray-200 pt-2">3. Technical Issues</h3>
            <p>If you face technical issues preventing use of our Service, contact <a href="mailto:support@prothumbnailgenerator.com" className="text-yellow-400 hover:underline">support@prothumbnailgenerator.com</a>. We’ll investigate promptly. Technical issues alone don’t qualify for refunds unless covered by the 30-day guarantee.</p>
            
            <h3 className="text-xl font-semibold text-gray-200 pt-2">4. Policy Updates</h3>
            <p>We may update this Refund Policy anytime. Changes will be posted here with an updated effective date. Your continued use of the Service means you accept the changes.</p>

            <h3 className="text-xl font-semibold text-gray-200 pt-2">5. Contact Us</h3>
            <p>Questions? Email <a href="mailto:support@prothumbnailgenerator.com" className="text-yellow-400 hover:underline">support@prothumbnailgenerator.com</a> or visit our Contact page.</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RefundPolicyPage);