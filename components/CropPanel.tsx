/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface CropPanelProps {
  onApplyCrop: () => void;
  onCancel: () => void;
  isLoading: boolean;
  isCropping: boolean;
}

const CropPanel: React.FC<CropPanelProps> = ({ onApplyCrop, onCancel, isLoading, isCropping }) => {
  return (
    <div className="w-full max-w-md bg-gray-800/80 border border-gray-700/80 rounded-lg p-6 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-gray-200">Frame Your Shot</h3>
      <p className="text-base text-gray-400 -mt-2 text-center">Adjust the 16:9 area to perfectly frame the subject for your thumbnail.</p>
      
      <div className="w-full max-w-xs flex flex-col gap-3 mt-2">
          <button
            onClick={onApplyCrop}
            disabled={isLoading || !isCropping}
            className="w-full bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-gray-600 disabled:to-gray-500 disabled:text-gray-300 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          >
            Confirm Crop &amp; Continue
          </button>
          <button 
            onClick={onCancel} 
            className="w-full text-gray-400 hover:text-white transition-colors text-sm disabled:opacity-50 py-2 rounded-lg hover:bg-white/10"
            disabled={isLoading}
          >
            Cancel
          </button>
      </div>
    </div>
  );
};

export default CropPanel;