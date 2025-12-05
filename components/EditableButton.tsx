/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import type { AuthButtonProperties } from '../App';

interface EditableButtonProps {
  buttonProps: AuthButtonProperties;
  setButtonProps: (value: React.SetStateAction<AuthButtonProperties>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  onButtonClick: () => void;
}

const EditableButton: React.FC<EditableButtonProps> = ({ buttonProps, setButtonProps, containerRef, onButtonClick }) => {
  const { visible, content, fontSize, color, backgroundColor, position, bold, hoverBackgroundColor, hoverEffect, fontFamily } = buttonProps;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scaledFontSize, setScaledFontSize] = useState(fontSize);

  useEffect(() => {
    const calculateScaledSize = () => {
      if (containerRef.current) {
        const scale = containerRef.current.offsetWidth / 1280;
        setScaledFontSize(fontSize * scale);
      }
    };
    calculateScaledSize();
    
    window.addEventListener('resize', calculateScaledSize);
    return () => window.removeEventListener('resize', calculateScaledSize);
  }, [fontSize, containerRef]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current || !buttonRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    let newX = e.clientX - containerRect.left;
    let newY = e.clientY - containerRect.top;

    newX = Math.max(0, Math.min(newX, containerRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height));

    const newXPercent = (newX / containerRect.width) * 100;
    const newYPercent = (newY / containerRect.height) * 100;
    
    setButtonProps(prev => ({ ...prev, position: { x: newXPercent, y: newYPercent } }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
        e.stopPropagation();
        return;
    }
    onButtonClick();
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!visible) {
    return null;
  }

  const buttonStyle: React.CSSProperties = {
    fontFamily: `"${fontFamily}", sans-serif`,
    fontSize: `${scaledFontSize}px`,
    fontWeight: bold ? 'bold' : 'normal',
    color: color,
    backgroundColor: isHovered ? hoverBackgroundColor : backgroundColor,
    padding: `${scaledFontSize * 0.4}px ${scaledFontSize * 0.8}px`,
    borderRadius: `${scaledFontSize * 0.3}px`,
    boxShadow: isHovered
      ? `0 10px 20px rgba(0,0,0,0.2), 0 6px 6px rgba(0,0,0,0.25)`
      : `0 4px 6px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.2)`,
    transform: isHovered && hoverEffect === 'scale' ? 'scale(1.05)' : 'scale(1)',
    filter: isHovered && hoverEffect === 'lighten' ? 'brightness(1.15)' :
            isHovered && hoverEffect === 'darken' ? 'brightness(0.85)' : 'brightness(1)',
    transition: 'transform 0.15s ease-in-out, background-color 0.15s ease-in-out, filter 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className="absolute select-none cursor-move z-20"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="active:scale-95"
          style={buttonStyle}
        >
          {content}
        </button>
    </div>
  );
};

export default EditableButton;