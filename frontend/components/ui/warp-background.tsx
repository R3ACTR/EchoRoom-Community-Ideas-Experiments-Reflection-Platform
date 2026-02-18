"use client"

import React, { HTMLAttributes, useCallback, useMemo } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface WarpBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  perspective?: number
  beamsPerSide?: number
  beamSize?: number
  beamDelayMax?: number
  beamDelayMin?: number
  beamDuration?: number
  gridColor?: string
}

const Beam = ({
  width,
  x,
  delay,
  duration,
  index
}: {
  width: string | number
  x: string | number
  delay: number
  duration: number
  index: number
}) => {
  // deterministic values (NO Math.random)
  const hue = 210 + (index * 7) % 40
  const ar = (index % 8) + 2

  return (
    <motion.div
      style={
        {
          "--x": `${x}`,
          "--width": `${width}`,
          "--aspect-ratio": `${ar}`,
          "--background": `linear-gradient(hsl(${hue} 80% 60%), transparent)`,
        } as React.CSSProperties
      }
      className="absolute top-0 left-[var(--x)] [aspect-ratio:1/var(--aspect-ratio)] [width:var(--width)] [background:var(--background)]"
      initial={{ y: "100cqmax", x: "-50%" }}
      animate={{ y: "-100%", x: "-50%" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

export const WarpBackground: React.FC<WarpBackgroundProps> = ({
  children,
  perspective = 100,
  className,
  beamsPerSide = 3,
  beamSize = 5,
  beamDelayMax = 3,
  beamDelayMin = 0,
  beamDuration = 3,
  gridColor = "var(--border)",
  ...props
}) => {
  const generateBeams = useCallback(() => {
    const beams = []
    const cellsPerSide = Math.floor(100 / beamSize)
    const step = cellsPerSide / beamsPerSide

    for (let i = 0; i < beamsPerSide; i++) {
      const x = Math.floor(i * step)

      // deterministic delay (NO random)
      const delay =
        beamDelayMin +
        (i / beamsPerSide) * (beamDelayMax - beamDelayMin)

      beams.push({ x, delay })
    }

    return beams
  }, [beamsPerSide, beamSize, beamDelayMax, beamDelayMin])

  const topBeams = useMemo(() => generateBeams(), [generateBeams])
  const rightBeams = useMemo(() => generateBeams(), [generateBeams])
  const bottomBeams = useMemo(() => generateBeams(), [generateBeams])
  const leftBeams = useMemo(() => generateBeams(), [generateBeams])

  return (
    <div className={cn("relative", className)} {...props}>
      <div
        style={
          {
            "--perspective": `${perspective}px`,
            "--grid-color": gridColor,
            "--beam-size": `${beamSize}%`,
          } as React.CSSProperties
        }
        className="[container-type:size] pointer-events-none absolute inset-0 overflow-hidden [perspective:var(--perspective)]"
      >
        {/* top */}
        <div className="absolute z-20 h-[100cqmax] w-[100cqi] [transform-origin:50%_0%] [transform:rotateX(-90deg)]">
          {topBeams.map((beam, index) => (
            <Beam
              key={`top-${index}`}
              index={index}
              width={`${beamSize}%`}
              x={`${beam.x * beamSize}%`}
              delay={beam.delay}
              duration={beamDuration}
            />
          ))}
        </div>

        {/* bottom */}
        <div className="absolute top-full h-[100cqmax] w-[100cqi] [transform-origin:50%_0%] [transform:rotateX(-90deg)]">
          {bottomBeams.map((beam, index) => (
            <Beam
              key={`bottom-${index}`}
              index={index}
              width={`${beamSize}%`}
              x={`${beam.x * beamSize}%`}
              delay={beam.delay}
              duration={beamDuration}
            />
          ))}
        </div>

        {/* left */}
        <div className="absolute top-0 left-0 h-[100cqmax] w-[100cqh] [transform-origin:0%_0%] [transform:rotate(90deg)_rotateX(-90deg)]">
          {leftBeams.map((beam, index) => (
            <Beam
              key={`left-${index}`}
              index={index}
              width={`${beamSize}%`}
              x={`${beam.x * beamSize}%`}
              delay={beam.delay}
              duration={beamDuration}
            />
          ))}
        </div>

        {/* right */}
        <div className="absolute top-0 right-0 h-[100cqmax] w-[100cqh] [transform-origin:100%_0%] [transform:rotate(-90deg)_rotateX(-90deg)]">
          {rightBeams.map((beam, index) => (
            <Beam
              key={`right-${index}`}
              index={index}
              width={`${beamSize}%`}
              x={`${beam.x * beamSize}%`}
              delay={beam.delay}
              duration={beamDuration}
            />
          ))}
        </div>
      </div>

      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
