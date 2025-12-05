/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import type { TextProperties } from '../App';

interface EditableTextProps {
  textProps: TextProperties;
  setTextProps: React.Dispatch<React.SetStateAction<TextProperties>>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const EditableText: React.FC<EditableTextProps> = ({ textProps, setTextProps, containerRef }) => {
  const { content, fontSize, color, outlineColor, outlineWidth, position, bold, italic, fontFamily } = textProps;
  
  const textRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
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
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current || !textRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate new position in pixels, relative to the container
    let newX = e.clientX - containerRect.left;
    let newY = e.clientY - containerRect.top;

    // Clamp to container boundaries
    newX = Math.max(0, Math.min(newX, containerRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height));

    // Convert to percentage and update state
    const newXPercent = (newX / containerRect.width) * 100;
    const newYPercent = (newY / containerRect.height) * 100;
    
    setTextProps(prev => ({ ...prev, position: { x: newXPercent, y: newYPercent } }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
  
  const createTextShadow = (width: number, color: string) => {
    if (width === 0) return 'none';
    const shadows = [];
    for (let x = -width; x <= width; x++) {
      for (let y = -width; y <= width; y++) {
        if (Math.sqrt(x*x + y*y) <= width) {
            shadows.push(`${x}px ${y}px 0 ${color}`);
        }
      }
    }
    return shadows.join(', ');
  };
  
  const scaledOutlineWidth = (containerRef.current ? (outlineWidth * (containerRef.current.offsetWidth / 1280)) : outlineWidth).toFixed(1);

  const textStyle: React.CSSProperties = {
    fontFamily: `"${fontFamily}", sans-serif`,
    fontSize: `${scaledFontSize}px`,
    fontWeight: bold ? '900' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    color: color,
    textShadow: createTextShadow(parseFloat(scaledOutlineWidth), outlineColor),
    whiteSpace: 'pre-wrap',
    lineHeight: 1.2,
  };

  return (
    <div
      ref={textRef}
      onMouseDown={handleMouseDown}
      className="absolute text-center select-none cursor-move p-2 z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div style={textStyle}>
        {content}
      </div>
    </div>
  );
};

export default EditableText;