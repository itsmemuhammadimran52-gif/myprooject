/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { MagicWandIcon } from './icons';

const HeaderSkeleton: React.FC = () => (
    <header className="py-6 px-4 sm:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="h-8 w-48 sm:w-64 bg-gray-700 rounded animate-pulse"></div>
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="h-10 w-20 sm:w-24 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-10 w-20 sm:w-24 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>
);

export const ContentSkeleton: React.FC = () => (
    <div className="w-full max-w-5xl mx-auto p-8">
        <div className="h-96 bg-gray-800/50 rounded-lg animate-pulse"></div>
    </div>
);

export const ProfilePageSkeleton: React.FC = () => (
    <div className="w-full max-w-2xl mx-auto p-8 animate-fade-in">
        <div className="h-10 w-48 mx-auto bg-gray-700 rounded animate-pulse mb-8"></div>
        <div className="bg-gray-800/80 border border-gray-700/80 rounded-lg p-8">
            <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-gray-700 animate-pulse"></div>
                <div className="h-8 w-56 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="h-20 bg-gray-700/50 rounded-lg animate-pulse"></div>
                <div className="h-20 bg-gray-700/50 rounded-lg animate-pulse"></div>
                <div className="h-20 bg-gray-700/50 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex flex-col gap-6">
                <div>
                    <div className="h-5 w-24 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-12 bg-gray-900 rounded-lg animate-pulse"></div>
                </div>
                 <div>
                    <div className="h-5 w-24 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-12 bg-gray-900 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-14 mt-4 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
        </div>
    </div>
);

export const ThumbnailSkeleton: React.FC = () => (
    <div className="flex flex-col gap-4 items-center animate-pulse">
        <div className="h-6 w-3/4 bg-gray-700 rounded-md"></div>
        <div className="w-full aspect-video bg-gray-700/80 rounded-lg"></div>
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="w-full sm:w-auto flex flex-col items-center gap-2">
                <div className="h-12 w-48 bg-gray-700 rounded-lg"></div>
                <div className="h-5 w-24 bg-gray-700 rounded-md"></div>
            </div>
            <div className="h-12 w-48 bg-gray-700/50 rounded-lg"></div>
        </div>
    </div>
);

export const ImagePreviewSkeleton: React.FC<{ text?: string }> = ({ text = "Applying Edits..." }) => (
    <div className="w-full aspect-video bg-gray-800 rounded-lg animate-pulse flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
             <MagicWandIcon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-gray-600" />
             <p className="font-semibold text-lg text-gray-400">{text}</p>
        </div>
    </div>
);

export const AppSkeleton: React.FC = () => (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
      <HeaderSkeleton />
      <main className="flex-grow container mx-auto p-4 sm:p-8">
        <ContentSkeleton />
      </main>
    </div>
);