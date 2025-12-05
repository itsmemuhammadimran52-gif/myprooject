/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in text-left">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 mb-10 text-center">
        About Pro Thumbnail Generator
      </h1>
      <div className="bg-gray-800/50 border border-gray-700/60 rounded-lg p-8">
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
          <p>
            In the fast-paced world of YouTube content creation, standing out is crucial. Your video thumbnail is the gateway to higher views, engagement, and subscriber growth. If you're searching for the best YouTube thumbnail generator, look no further than <strong className="text-yellow-400">Pro Thumbnail Generator</strong>, a powerful tool designed specifically for YouTubers and content creators. This innovative thumbnail maker for YouTube helps you create stunning, click-worthy thumbnails effortlessly, boosting your channel's performance in 2025 and beyond.
          </p>
          
          <h3 className="text-2xl font-bold text-gray-100 pt-4">
            Why Choose a Dedicated YouTube Thumbnail Maker?
          </h3>
          <p>
            YouTube's algorithm favors videos with high click-through rates (CTR), and thumbnails play a vital role—accounting for up to 80% of a viewer's decision to click. Generic tools fall short, but <strong className="text-yellow-400">Pro Thumbnail Generator</strong> is built as a specialized YouTube thumbnail creator that combines AI intelligence with user-friendly features. Whether you're a beginner vlogger or a gamer, this free YouTube thumbnail generator (with premium upgrades) ensures your visuals align with trending styles and audience preferences.
          </p>
          
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>No design experience needed. Build professional thumbnails in minutes.</li>
            <li>Export directly in YouTube's ideal 1280x720 resolution.</li>
            <li>Mobile-friendly access makes it the perfect online thumbnail maker for creators on the move.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-100 pt-4">
            Affordable Plans for Every Creator
          </h3>
          <p>
            Start with a free trial of our YouTube thumbnail generator free version. Upgrade to premium tiers starting at $6/month.
          </p>

          <h3 className="text-2xl font-bold text-gray-100 pt-4">
            Proven Boost in Engagement
          </h3>
          <p>
            Users report up to 30% higher views after using our best thumbnail maker for YouTube. Real testimonials: "This YouTube thumbnail creator transformed my channel—more clicks, more subs!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AboutPage);