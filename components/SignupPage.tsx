/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { signUpWithDetails, signInWithGoogle, signInWithApple, signInWithMicrosoft } from '../services/firebase';
import { GoogleIcon, CameraIcon, AppleIcon, MicrosoftIcon } from './icons';
import Spinner from './Spinner';
import type { UserProfile } from '../types';

type View = 'home' | 'tool' | 'contact' | 'faq' | 'features' | 'about' | 'blog' | 'login' | 'signup' | 'profile' | 'complete-profile';

interface SignupPageProps {
    onNavigate: (view: View) => void;
    onSignupSuccess: (profile: UserProfile) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onSignupSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Fix: Updated function signature to match the return type of social sign-in functions.
    const handleSocialAuthAction = async (action: () => Promise<{ profile: UserProfile | null, isNewUser: boolean, error: string | null }>) => {
        setError(null);
        setIsLoading(true);
        const result = await action();
        setIsLoading(false);
        if (result.error) {
            setError(result.error);
        }
        // For social auth, onSignupSuccess is not called here.
        // The onAuthStateChanged listener in App.tsx will handle the redirect
        // to the complete-profile page for new users or to the profile for existing users.
    };
    
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !fullName || !username) {
            setError("Please fill in all required fields.");
            return;
        }
        
        setError(null);
        setIsLoading(true);
        const result = await signUpWithDetails(email, password, fullName, username, profileImage);
        setIsLoading(false);
        
        if (result.error) {
            setError(result.error);
        } else if (result.profile) {
            onSignupSuccess(result.profile);
        }
    };


    const handleGoogleSignIn = () => {
        handleSocialAuthAction(signInWithGoogle);
    };

    const handleAppleSignIn = () => {
        handleSocialAuthAction(signInWithApple);
    };

    const handleMicrosoftSignIn = () => {
        handleSocialAuthAction(signInWithMicrosoft);
    };


    const getUsernameInputClass = () => {
        return "bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full";
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 animate-fade-in text-center">
            <div className="bg-gray-800/80 border border-gray-700/80 rounded-lg p-8">
                <h1 className="text-4xl font-extrabold text-white mb-6">Create Account</h1>
                {error && <p className="bg-red-900/50 border border-red-700 text-red-200 text-sm p-3 rounded-lg mb-4 text-center animate-fade-in">{error}</p>}
                
                <form onSubmit={handleSignUp} className="flex flex-col gap-4 text-left">
                    <div className="flex justify-center mb-2">
                        <label htmlFor="profile-image-upload" className="relative cursor-pointer group">
                            <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                                ) : (
                                    <CameraIcon className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-semibold">Change</span>
                            </div>
                        </label>
                        <input id="profile-image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={isLoading}/>
                    </div>

                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input id="fullName" type="text" placeholder="e.g., Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full" required disabled={isLoading} />
                    </div>
                    
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input id="username" type="text" placeholder="e.g., janedoe99" value={username} onChange={(e) => setUsername(e.target.value)} className={getUsernameInputClass()} required disabled={isLoading} />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full" required disabled={isLoading} />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input id="password" type="password" placeholder="6+ characters" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full" required disabled={isLoading} />
                    </div>
                    
                    <button type="submit" disabled={isLoading} className="w-full h-[52px] mt-2 flex items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed">
                       {isLoading ? <Spinner/> : 'Create Account'}
                    </button>
                </form>
                
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400 font-semibold text-xs">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <div className="flex flex-col gap-3">
                    <button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-gray-200 active:scale-95 text-base disabled:opacity-75 disabled:cursor-not-allowed">
                        <GoogleIcon className="w-6 h-6" />
                        Continue with Google
                    </button>
                     <button onClick={handleAppleSignIn} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-black text-white font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-gray-800 active:scale-95 text-base disabled:opacity-75 disabled:cursor-not-allowed">
                        <AppleIcon className="w-6 h-6" />
                        Continue with Apple
                    </button>
                     <button onClick={handleMicrosoftSignIn} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-gray-200 active:scale-95 text-base disabled:opacity-75 disabled:cursor-not-allowed">
                        <MicrosoftIcon className="w-5 h-5" />
                        Continue with Microsoft
                    </button>
                </div>
                
                <p className="text-center text-sm text-gray-400 mt-6">
                    Already have an account?{' '}
                    <button onClick={() => onNavigate('login')} className="font-semibold text-yellow-400 hover:text-yellow-300">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default React.memo(SignupPage);