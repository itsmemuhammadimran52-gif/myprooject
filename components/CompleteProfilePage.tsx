/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';
import { createGoogleUserProfile } from '../services/firebase';
import { UserIcon } from './icons';
import Spinner from './Spinner';
import type { UserProfile } from '../types';

interface CompleteProfilePageProps {
    user: User;
    onProfileComplete: (newProfile: UserProfile) => void;
}

const CompleteProfilePage: React.FC<CompleteProfilePageProps> = ({ user, onProfileComplete }) => {
    const [fullName, setFullName] = useState(user.displayName || '');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username.trim() || !fullName.trim()) {
            setError("Please enter a full name and username.");
            return;
        }

        setIsLoading(true);
        const { profile, error: resultError } = await createGoogleUserProfile(user, fullName, username);
        setIsLoading(false);

        if (resultError) {
            setError(resultError);
        } else if (profile) {
            onProfileComplete(profile);
        }
    };

    const getUsernameInputClass = () => {
        return "bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full";
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 animate-fade-in text-center">
            <div className="bg-gray-800/80 border border-gray-700/80 rounded-lg p-8">
                <h1 className="text-4xl font-extrabold text-white mb-2">Almost there!</h1>
                <p className="text-gray-400 mb-6">Confirm your details to complete your profile.</p>

                <div className="flex flex-col items-center gap-2 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <p className="font-semibold text-white">{user.displayName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                {error && <p className="bg-red-900/50 border border-red-700 text-red-200 text-sm p-3 rounded-lg mb-4 text-center animate-fade-in">{error}</p>}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                     <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input id="fullName" type="text" placeholder="e.g., Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition w-full" required disabled={isLoading} />
                    </div>
                    
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input id="username" type="text" placeholder="e.g., janedoe99" value={username} onChange={(e) => setUsername(e.target.value)} className={getUsernameInputClass()} required disabled={isLoading} />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full h-[52px] mt-2 flex items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed">
                       {isLoading ? <Spinner/> : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default React.memo(CompleteProfilePage);