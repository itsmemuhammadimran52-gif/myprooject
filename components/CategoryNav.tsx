/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type View = 'home' | 'tool' | 'contact' | 'faq' | 'features' | 'about' | 'blog' | 'login' | 'signup' | 'profile' | 'complete-profile' | 'pricing' | 'terms-and-conditions' | 'privacy-policy' | 'refund-policy';

interface CategoryNavProps {
    currentView: View;
    onNavigate: (view: View) => void;
}

const navLinks: { label: string; view: View }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Features', view: 'features' },
    { label: 'Subscriptions Plans', view: 'pricing' },
    { label: 'About Us', view: 'about' },
    { label: 'Contact', view: 'contact' },
    { label: 'FAQ', view: 'faq' },
    { label: 'Blog', view: 'blog' },
    { label: 'Terms', view: 'terms-and-conditions' },
    { label: 'Privacy', view: 'privacy-policy' },
    { label: 'Refunds', view: 'refund-policy' },
];

const CategoryNav: React.FC<CategoryNavProps> = ({ currentView, onNavigate }) => {
    return (
        <div className="container mx-auto px-4 sm:px-8 pb-4">
            <div className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4 scrollbar-hide">
                {navLinks.map(link => (
                    <button
                        key={link.view}
                        onClick={() => onNavigate(link.view)}
                        className={`px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-colors duration-200 ease-in-out
                            ${currentView === link.view
                                ? 'bg-[var(--color-accent)] text-[var(--color-accent-content)]'
                                : 'bg-[var(--color-base-200)]/60 text-[var(--color-muted-content)] hover:bg-[var(--color-base-300)] hover:text-[var(--color-base-content)]'
                            }
                        `}
                    >
                        {link.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default React.memo(CategoryNav);