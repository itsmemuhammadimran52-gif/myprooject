/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { CrossIcon } from './icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title?: string;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message, title = 'Confirm Action', secondaryAction }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center animate-fade-in p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl w-full max-w-md text-gray-300 transform transition-all duration-300 animate-enter relative text-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
          aria-label="Close confirmation"
        >
          <CrossIcon className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-400 mb-8">
            {message}
        </p>
        
        <div className="flex justify-center gap-4 flex-wrap">
            <button 
                onClick={onClose} 
                className="w-full sm:w-auto flex-grow sm:flex-grow-0 bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors hover:bg-gray-500"
            >
                Cancel
            </button>
            {secondaryAction && (
                <button
                    onClick={secondaryAction.onClick}
                    className="w-full sm:w-auto flex-grow sm:flex-grow-0 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors hover:bg-blue-500"
                >
                    {secondaryAction.label}
                </button>
            )}
            <button 
                onClick={onConfirm} 
                className="w-full sm:w-auto flex-grow sm:flex-grow-0 bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors hover:bg-yellow-400"
            >
                Confirm
            </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ConfirmationModal);