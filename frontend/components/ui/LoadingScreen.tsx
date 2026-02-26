"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Motion value to track the exact percentage from 0 to 100
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  
  // Map the 0-100 percentage directly to the Y-axis position of the SVG wave.
  // When count is 0, wave is at Y=150 (below text). When count is 100, wave is at Y=-150 (above text).
  const waveY = useTransform(count, [0, 100], [120, -120]);

  useEffect(() => {
  let controls: any;

  const start = () => {
    controls = animate(count, 100, {
      duration: 5,
      ease: "linear",
    });

    controls.then(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    });
  };

  const raf = requestAnimationFrame(start);

  return () => {
    cancelAnimationFrame(raf);
    controls?.stop();
  };
}, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* Main Container */}
          <div className="relative w-full max-w-5xl px-4 flex flex-col items-center select-none">
            
            {/* SVG Masking System:
              This is the secret to the NeoLeaf effect. We use the text as a <clipPath>
              and animate a physical SVG wave shape behind it.
            */}
            <svg viewBox="0 0 1000 300" className="w-full h-auto">
              <defs>
                <clipPath id="text-mask">
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize="170"
                    fontWeight="900" // Maximum bold to match the reference
                    letterSpacing="-0.03em"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                  >
                    EchoRoom
                  </text>
                </clipPath>
              </defs>

              {/* Base Layer: Dark Grey Text Background */}
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="#2a2a2a" // This matches the dark grey empty text color in your screenshot
                clipPath="url(#text-mask)"
              />

              {/* Foreground Layer: The White Wave Fill */}
              <motion.g clipPath="url(#text-mask)">
                <motion.g
                  // Move left by 800px infinitely. 
                  // Since the sine wave repeats every 400px, shifting by 800px creates a flawless seamless loop.
                  animate={{ x: [0, -800] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 2.5 }}
                  style={{ y: waveY }}
                >
                  {/* Mathematically perfect repeating sine wave path */}
                  <path
                    d="M 0,150 
                       Q 100,180 200,150 
                       T 400,150 
                       T 600,150 
                       T 800,150 
                       T 1000,150 
                       T 1200,150 
                       T 1400,150 
                       T 1600,150 
                       T 1800,150 
                       T 2000,150 
                       L 2000,600 L 0,600 Z"
                    fill="#9CD5FF"
                  />
                </motion.g>
              </motion.g>
            </svg>

            {/* Loading Percentage Counter */}
            <div className="absolute bottom-[18%] right-[12%] text-[#e0e0e0] text-sm md:text-base font-sans tracking-widest flex items-center gap-2 font-medium">
              <span>loading...</span>
              <div className="w-[3ch] text-right">
                {/* Framer motion automatically renders the ticking number here */}
                <motion.span>{rounded}</motion.span>
              </div>
              <span>%</span>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}