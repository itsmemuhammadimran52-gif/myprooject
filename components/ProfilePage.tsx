/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '../types';
import { updateUserProfile } from '../services/firebase';
import { CameraIcon, UserIcon } from './icons';
import Spinner from './Spinner';

type View = 'home' | 'tool' | 'contact' | 'faq' | 'features' | 'about' | 'blog' | 'login' | 'signup' | 'profile' | 'complete-profile';

interface ProfilePageProps {
    user: User;
    profile: UserProfile | null;
    onProfileUpdate: (newProfileData: UserProfile) => void;
    onNavigate: (view: View) => void;
    onSignOut: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, profile, onProfileUpdate, onNavigate, onSignOut }) => {
    const [fullName, setFullName] = useState(profile?.fullName || '');
    const [username, setUsername] = useState(profile?.username || '');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(profile?.photoURL || null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Reset fields if the profile prop changes
        if (profile) {
            setFullName(profile.fullName);
            setUsername(profile.username);
            setImagePreview(profile.photoURL);
        }
    }, [profile]);
    
    if (!profile) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    const isChanged = fullName !== profile.fullName || username !== profile.username || profileImage !== null;

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

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isChanged) return;

        setMessage(null);
        setIsLoading(true);

        const result = await updateUserProfile(user.uid, profile.username, { fullName, username }, profileImage);
        
        setIsLoading(false);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            // Optimistically update local profile state
            onProfileUpdate({ ...profile, ...result.newProfileData });
            setProfileImage(null); // Reset file input after successful upload
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const InfoCard: React.FC<{ label: string; value: string | number | null; isLoading?: boolean }> = ({ label, value, isLoading: valueIsLoading = false }) => (
        <div className="bg-gray-700/50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400 font-medium">{label}</p>
            {valueIsLoading ? (
                 <div className="h-7 mt-1 flex justify-center items-center">
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                 </div>
            ) : (
                <p className="text-xl font-bold text-white mt-1 truncate">{value}</p>
            )}
        </div>
    );

    return (
        <div className="w-full max-w-2xl mx-auto p-8 animate-fade-in">
             <h1 className="text-4xl font-extrabold text-white mb-8 text-center">My Profile</h1>
            <div className="bg-gray-800/80 border border-gray-700/80 rounded-lg p-8">
               
                {message && (
                    <p className={`border ${
                        message.type === 'success' 
                        ? 'bg-green-900/50 border-green-700 text-green-200' 
                        : 'bg-red-900/50 border-red-700 text-red-200'
                    } text-sm p-3 rounded-lg mb-6 text-center animate-fade-in`}>
                        {message.text}
                    </p>
                )}
                
                <form onSubmit={handleSaveChanges} className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <label htmlFor="profile-image-upload" className="relative cursor-pointer group">
                            <div className="w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <CameraIcon className="w-8 h-8 text-white" />
                            </div>
                        </label>
                        <input id="profile-image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={isLoading}/>
                         <div>
                            <p className="text-2xl font-bold text-white text-center">{profile.fullName}</p>
                            <p className="text-gray-400 text-center">@{profile.username}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InfoCard label="Current Plan" value={profile.plan} />
                        <InfoCard label="Generations Left" value={profile.hasPaid ? (profile.remainingGenerations ?? 0) : 'Not Paid'} />
                        <InfoCard label="Total Created" value={profile.thumbnailCount ?? 0} />
                    </div>
                    
                    {!profile.hasPaid && (
                        <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 text-center animate-fade-in">
                            <p className="text-yellow-200 font-semibold mb-2">⚠️ Payment Required</p>
                            <p className="text-yellow-300 text-sm mb-4">Please purchase a subscription plan to start generating thumbnails.</p>
                            <button
                                onClick={() => onNavigate('pricing')}
                                className="bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-px active:scale-95"
                            >
                                View Plans
                            </button>
                        </div>
                    )}
                    
                    {profile.hasPaid && (
                        <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 text-center animate-fade-in">
                            <p className="text-blue-200 font-semibold mb-1">✅ Active Subscription</p>
                            <p className="text-blue-300 text-sm">
                                {profile.plan} Plan - {profile.remainingGenerations ?? 0} generations remaining this month
                            </p>
                        </div>
                    )}

                    <div className="space-y-6 pt-6 border-t border-gray-700">
                        <h2 className="text-xl font-bold text-white text-center -mb-2">Edit Profile</h2>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition" required disabled={isLoading} />
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition" required disabled={isLoading} />
                        </div>
                        <button type="submit" disabled={isLoading || !isChanged} className="w-full h-[52px] flex items-center justify-center bg-white/10 border border-white/20 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500">
                           {isLoading ? <Spinner/> : 'Save Changes'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 flex flex-col gap-4">
                    <button
                        type="button"
                        onClick={() => onNavigate('tool')}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:from-gray-600 disabled:to-gray-500 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                       Create a Thumbnail
                    </button>
                    <button
                        onClick={onSignOut}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProfilePage);