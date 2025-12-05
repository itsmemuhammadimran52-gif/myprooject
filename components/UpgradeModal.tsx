/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { CrossIcon, SparklesIcon } from './icons';

type View = 'home' | 'tool' | 'contact' | 'faq' | 'features' | 'about' | 'blog' | 'login' | 'signup' | 'profile' | 'complete-profile' | 'pricing' | 'terms-and-conditions' | 'privacy-policy' | 'refund-policy';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: View) => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;
  
  const handleViewPlans = () => {
    onClose();
    if (onNavigate) {
      onNavigate('pricing');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center animate-fade-in p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl w-full max-w-lg text-gray-300 transform transition-all duration-300 animate-enter relative text-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
          aria-label="Close upgrade modal"
        >
          <CrossIcon className="w-5 h-5" />
        </button>
        <SparklesIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Generation Limit Reached</h2>
        <p className="text-gray-400 mb-6">
            You've used all your generations for the month. Upgrade your plan to get more generations!
        </p>
        
        <div className="flex flex-col gap-4">
            <button 
                onClick={handleViewPlans}
                className="w-full text-center bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-px active:scale-95"
            >
                View All Plans
            </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UpgradeModal);