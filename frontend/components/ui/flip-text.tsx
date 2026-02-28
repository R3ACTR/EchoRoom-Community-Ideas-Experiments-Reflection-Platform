"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface FlipTextProps {
  className?: string;
  children: string;
  duration?: number;
  delay?: number;
  loop?: boolean;
  separator?: string;
  together?: boolean;
}

export function FlipText({
  className,
  children,
  duration = 1.6,
  delay = 0,
  loop = false,
  separator = " ",
  together = false,
}: FlipTextProps) {
  const words = useMemo(
    () => children.split(separator),
    [children, separator]
  );

  const totalChars = children.length;

  const getCharIndex = (wordIndex: number, charIndex: number) => {
    let index = 0;
    for (let i = 0; i < wordIndex; i++) {
      index += words[i].length + (separator === " " ? 1 : separator.length);
    }
    return index + charIndex;
  };

  return (
    <div
      className="inline-block leading-none"
      style={{ perspective: "1000px" }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block whitespace-nowrap"
          style={{ transformStyle: "preserve-3d" }}
        >
          {word.split("").map((char, charIndex) => {
            const globalIndex = getCharIndex(wordIndex, charIndex);

            let calculatedDelay = delay;
            if (!together) {
              const normalized = globalIndex / totalChars;
              calculatedDelay =
                Math.sin(normalized * (Math.PI / 2)) *
                  (duration * 0.25) +
                delay;
            }

            return (
              <span
                key={charIndex}
                className={cn(
                  "flip-char inline-block",
                  className
                )}
                style={
                  {
                    animation: `flipAnimation ${duration}s ease forwards`,
                    animationDelay: `${calculatedDelay}s`,
                    animationIterationCount: loop ? "infinite" : 1,
                    transformStyle: "preserve-3d",
                  } as React.CSSProperties
                }
              >
                {char}
              </span>
            );
          })}

          {separator === " " && wordIndex < words.length - 1 && (
            <span>&nbsp;</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default FlipText;