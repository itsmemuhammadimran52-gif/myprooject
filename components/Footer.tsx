/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

type View = 'home' | 'tool' | 'contact' | 'faq' | 'features' | 'about' | 'blog' | 'login' | 'signup' | 'profile' | 'complete-profile' | 'pricing' | 'terms-and-conditions' | 'privacy-policy' | 'refund-policy';


interface FooterProps {
    onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[var(--color-base-300)]/50 mt-16 py-8 px-4">
      <div className="container mx-auto text-center text-[var(--color-muted-content)] text-sm">
        <div className="flex justify-center items-center gap-4 sm:gap-6 mb-4 flex-wrap">
            <button onClick={() => onNavigate('terms-and-conditions')} className="hover:text-[var(--color-accent)] transition-colors">
              Terms of Service
            </button>
            <span className="hidden sm:inline">|</span>
             <button onClick={() => onNavigate('privacy-policy')} className="hover:text-[var(--color-accent)] transition-colors">
              Privacy Policy
            </button>
            <span className="hidden sm:inline">|</span>
            <button onClick={() => onNavigate('refund-policy')} className="hover:text-[var(--color-accent)] transition-colors">
              Refund Policy
            </button>
            <span className="hidden sm:inline">|</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-[var(--color-accent)] transition-colors">
              Contact
            </button>
        </div>
        <p className="text-[var(--color-muted-content)]/80 text-xs mt-4">
          &copy; {new Date().getFullYear()} Pro Thumbnail Generator. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default React.memo(Footer);