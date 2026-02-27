"use client";

import { useState, useEffect, useRef } from "react";

interface SmoothSliderProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
}

export default function SmoothSlider({
  min = 1,
  max = 10,
  value,
  onChange,
}: SmoothSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Calculate the percentage for the thumb position
  const percentage = ((value - min) / (max - min)) * 100;

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    const newValue = Math.round(percent * (max - min) + min);
    onChange(newValue);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const onPointerUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging]);

  return (
    <div className="w-full flex items-center gap-4 select-none touch-none py-4">
      <span className="text-xs font-medium text-gray-500">{min}</span>
      
      {/* Track */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        className="relative flex-1 h-3 bg-gray-200 dark:bg-zinc-800 rounded-full cursor-pointer group"
      >
        {/* Fill Line */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-100 ease-out"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white dark:bg-zinc-200 border-2 border-blue-600 rounded-full shadow-lg transition-transform duration-150 flex items-center justify-center ${
            isDragging ? "scale-125" : "group-hover:scale-110"
          }`}
          style={{ left: `${percentage}%` }}
        >
          {/* Tooltip that appears when dragging */}
          <div
            className={`absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded transition-opacity duration-200 ${
              isDragging ? "opacity-100" : "opacity-0"
            }`}
          >
            {value}
          </div>
        </div>
      </div>

      <span className="text-xs font-medium text-gray-500">{max}</span>
    </div>
  );
}