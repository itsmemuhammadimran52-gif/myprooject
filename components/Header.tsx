/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '../types';
import { UserIcon, SparklesIcon } from './icons';

type View = 'home' | 'tool' | 'contact' | 'faq' | 'features' | 'about' | 'blog' | 'login' | 'signup' | 'profile' | 'complete-profile' | 'pricing' | 'terms-and-conditions' | 'privacy-policy' | 'refund-policy';

interface HeaderProps {
    currentUser: User | null;
    userProfile: UserProfile | null;
    onSignOut: () => void;
    onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, userProfile, onSignOut, onNavigate }) => {

  const handleNavClick = (view: View) => {
    onNavigate(view);
  };

  const UserAvatar: React.FC = () => (
    <button
      onClick={() => handleNavClick('profile')}
      className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden transition-transform duration-200 ease-in-out hover:scale-110 active:scale-100"
      aria-label="View your profile"
    >
        {userProfile?.photoURL ? (
            <img src={userProfile.photoURL} alt={userProfile.username} className="w-full h-full object-cover" />
        ) : (
            <UserIcon className="w-6 h-6 text-gray-400" />
        )}
    </button>
  );
  
  return (
    <header className="py-6 px-4 sm:px-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Title */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <button onClick={() => handleNavClick('home')} className="flex items-center gap-3 text-xl sm:text-2xl font-bold tracking-tight text-white text-left transition-opacity hover:opacity-90">
            <svg aria-hidden="true" width="40" height="40" viewBox="0 0 104 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                <defs>
                    <linearGradient id="shield-gradient-header" x1="0" y1="51" x2="104" y2="51" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3A321B"/>
                        <stop offset="1" stopColor="var(--color-accent)"/>
                    </linearGradient>
                </defs>
                <path d="M52 0C50.1118 1.1856 13 12.875 13 24.625V77.375C13 89.125 50.1118 100.814 52 102C53.8882 100.814 91 89.125 91 77.375V24.625C91 12.875 53.8882 1.1856 52 0Z" fill="url(#shield-gradient-header)"/>
                <circle cx="52" cy="51" r="28" fill="white"/>
                <path d="M52 30C49.9333 30 47.9333 30.4667 46.2 31.4L61.2 57.4C63.4 54.1333 64.5 50.1667 64.5 46C64.5 37.2 59.1 30 52 30Z" fill="#2D2817"/>
                <path d="M39.6 46.3L31.9 33.8C31.2667 34.7 30.8 35.7667 30.8 37C30.8 40.2 32.75 42.85 35.45 44.2L39.6 46.3Z" fill="var(--color-accent)"/>
                <path d="M49.25 73.6L42.9 63.3L27.9 37.3C25.7 40.5667 24.6 44.5333 24.6 48C24.6 56.4 29.95 63.2 37.05 63.2C40.45 63.2 43.55 61.9 45.9 59.95L49.25 73.6Z" fill="var(--color-accent)"/>
                <path d="M56.45 45.5L50.1 35L52 30L78.1 68.6C76.5 69.7333 74.7 70.6 72.7 71.2C68.9 71.2 65.5 69.4 63.3 66.7L56.45 45.5Z" fill="#2D2817"/>
                <path d="M69.1 70.6C69.7333 69.7 70.2 68.6333 70.2 67.5C70.2 64.3 68.25 61.65 65.55 60.2L61.4 57.9L69.1 70.6Z" fill="var(--color-accent)"/>
                <path d="M72.1144 32.4284C73.8644 31.2284 76.1144 31.7284 77.1144 33.4284L86.6144 50.1284C87.6144 51.8284 86.8644 54.1284 85.1144 55.1284L82.1144 56.8284L72.1144 32.4284Z" fill="white"/>
                <path d="M46 51L46 41L58 51L46 61V51Z" fill="white"/>
                <circle cx="28" cy="22" r="2" fill="white"/>
                <circle cx="76" cy="22" r="2" fill="white"/>
            </svg>
            <span className="leading-tight hidden sm:block">
                Pro <span className="text-[var(--color-accent)]">Thumbnail Generator</span>
            </span>
          </button>
        </div>
        
        {/* Right Side: Auth */}
        <div className="flex items-center gap-4">
            {currentUser && userProfile ? (
              <div className="flex items-center gap-4">
                 {userProfile.hasPaid ? (
                   <div className="hidden sm:flex items-center gap-2 bg-[var(--color-base-200)]/50 border border-[var(--color-base-300)] px-3 py-1.5 rounded-full" title={`${userProfile.plan} Plan - ${userProfile.remainingGenerations} generations remaining this month.`}>
                      <SparklesIcon className="w-4 h-4 text-[var(--color-accent)]" />
                      <p className="text-sm font-semibold text-white">
                          {userProfile.remainingGenerations} <span className="text-[var(--color-muted-content)] font-normal">left</span>
                      </p>
                  </div>
                 ) : (
                   <button
                     onClick={() => handleNavClick('pricing')}
                     className="hidden sm:flex items-center gap-2 bg-yellow-600/20 border border-yellow-500/50 px-3 py-1.5 rounded-full hover:bg-yellow-600/30 transition-colors"
                     title="Purchase a plan to start generating"
                   >
                      <SparklesIcon className="w-4 h-4 text-yellow-400" />
                      <p className="text-sm font-semibold text-yellow-300">
                          Buy Plan
                      </p>
                  </button>
                 )}
                <UserAvatar />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="bg-[var(--color-base-200)] text-white font-semibold py-2 px-5 text-base rounded-lg transition-colors hover:bg-[var(--color-base-300)] active:scale-95"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="bg-[var(--color-accent)] text-[var(--color-accent-content)] font-bold py-2 px-5 text-base rounded-lg transition-colors hover:bg-[var(--color-accent-dark)] active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);