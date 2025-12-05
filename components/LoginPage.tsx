/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { signInUserWithEmailAndPassword, signInWithGoogle, signInWithApple, signInWithMicrosoft } from '../services/firebase';
import { GoogleIcon, AppleIcon, MicrosoftIcon } from './icons';
import Spinner from './Spinner';
import type { UserProfile } from '../types';

type View = 'home' | 'tool' | 'contact' | 'faq' | 'features' | 'about' | 'blog' | 'login' | 'signup' | 'profile' | 'complete-profile';

interface LoginPageProps {
    onNavigate: (view: View) => void;
    onLoginSuccess: (profile: UserProfile) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        setError(null);
        setIsLoading(true);
        const { profile, error: resultError } = await signInUserWithEmailAndPassword(email, password);
        setIsLoading(false);
        if (resultError) {
            setError(resultError);
        } else if (profile) {
            onLoginSuccess(profile);
        }
    };

    const handleSocialSignIn = async (provider: 'google' | 'apple' | 'microsoft') => {
        setError(null);
        setIsLoading(true);

        let result;
        if (provider === 'google') result = await signInWithGoogle();
        else if (provider === 'apple') result = await signInWithApple();
        else result = await signInWithMicrosoft();
        
        setIsLoading(false);

        if (result.error) {
            setError(result.error);
        } else if (result.profile) {
            // Existing user, log them in successfully.
            onLoginSuccess(result.profile);
        } else if (result.isNewUser) {
            // New user, the onAuthStateChanged listener in App.tsx will
            // automatically route them to the complete-profile page.
        }
    };


    return (
        <div className="w-full max-w-md mx-auto p-8 animate-fade-in text-center">
            <div className="bg-gray-800/80 border border-gray-700/80 rounded-lg p-8">
                <h1 className="text-4xl font-extrabold text-white mb-6">Welcome Back</h1>
                {error && <p className="bg-red-900/50 border border-red-700 text-red-200 text-sm p-3 rounded-lg mb-4 text-center animate-fade-in">{error}</p>}
                
                <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
                    <input 
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full"
                        required
                        disabled={isLoading}
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full"
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[52px] mt-2 flex items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed"
                    >
                       {isLoading ? <Spinner /> : 'Sign In'}
                    </button>
                </form>
                
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400 font-semibold text-xs">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleSocialSignIn('google')}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-gray-200 active:scale-95 text-base disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        <GoogleIcon className="w-6 h-6" />
                        Continue with Google
                    </button>
                     <button
                        onClick={() => handleSocialSignIn('apple')}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-black text-white font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-gray-800 active:scale-95 text-base disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        <AppleIcon className="w-6 h-6" />
                        Continue with Apple
                    </button>
                     <button
                        onClick={() => handleSocialSignIn('microsoft')}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-gray-200 active:scale-95 text-base disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        <MicrosoftIcon className="w-5 h-5" />
                        Continue with Microsoft
                    </button>
                </div>
                
                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <button onClick={() => onNavigate('signup')} className="font-semibold text-yellow-400 hover:text-yellow-300">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default React.memo(LoginPage);
