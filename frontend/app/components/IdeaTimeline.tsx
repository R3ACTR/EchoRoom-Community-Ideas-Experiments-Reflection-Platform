"use client";

import React from "react";
import { Check, Lightbulb, FlaskConical, Target, BookOpen, LibraryIcon, TargetIcon } from "lucide-react";
import BulbSvg from "@/components/ui/bulb-svg";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
  icon: React.ElementType;
}

export default function IdeaTimeline({ current }: { current: string }) {
  // Define steps with associated Lucide icons
  const baseSteps = [
    { label: "Idea", icon: BulbSvg },
    { label: "Experiment", icon: FlaskConical },
    { label: "Outcome", icon: TargetIcon },
    { label: "Reflection", icon: LibraryIcon },
  ];

  // Safely find the current index (fallback to 0 if not found)
  const currentIndex = Math.max(
    0,
    baseSteps.findIndex((s) => s.label.toLowerCase() === (current || "").toLowerCase())
  );

  // Map steps to include their calculated status
  const steps: Step[] = baseSteps.map((step, index) => {
    let status: Step["status"] = "upcoming";
    if (index < currentIndex) status = "completed";
    if (index === currentIndex) status = "current";
    return { ...step, status };
  });

  return (
    <div className="w-full py-4 relative">
      {/* BACKGROUND TRACK 
        Calculated to connect the exact centers of the first and last circles.
        Since there are 4 items (25% width each), centers are at 12.5% and 87.5%.
        Total width = 75%. Left offset = 12.5%.
      */}
      <div className="absolute top-[34px] left-[12.5%] w-[75%] h-1 bg-gray-200 dark:bg-slate-700/50 rounded-full -z-10" />

      {/* ACTIVE PROGRESS TRACK 
        Smoothly animates width based on the current step.
      */}
      <div
        className="absolute top-[34px] left-[12.5%] h-1 bg-blue-500 rounded-full -z-10 transition-all duration-700 ease-in-out"
        style={{ width: `${(currentIndex / (steps.length - 1)) * 75}%` }}
      />

      <div className="flex items-start justify-between w-full relative z-10">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          const isUpcoming = step.status === "upcoming";

          return (
            <div key={step.label} className="flex flex-col items-center w-1/4 group">
              
              {/* Icon / Circle Container */}
              <div className="relative mb-3 flex items-center justify-center">
                
                {/* Subtle pulsing background for the current step */}
                {isCurrent && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-75" />
                )}

                <div
                  className={`
                    relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                    ${
                      isCompleted
                        ? "bg-blue-500 text-white shadow-blue-500/30 ring-4 ring-blue-50 dark:ring-blue-500/10"
                        : isCurrent
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-2 border-blue-500 ring-4 ring-blue-50 dark:ring-blue-500/20 shadow-md scale-110"
                        : "bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 border-2 border-gray-200 dark:border-slate-700"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={isCurrent ? 2.5 : 2} />
                  )}
                </div>
              </div>

              {/* Step Label */}
              <div className="text-center px-1">
                <p
                  className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                    isCurrent
                      ? "text-blue-600 dark:text-blue-400 font-bold"
                      : isCompleted
                      ? "text-slate-800 dark:text-slate-200"
                      : "text-gray-400 dark:text-slate-500"
                  }`}
                >
                  {step.label}
                </p>
                
                {/* Optional Status Text below the label for extra clarity */}
                <p className={`text-[10px] sm:text-xs mt-0.5 ${
                  isCurrent ? "text-blue-500/70" : "text-transparent"
                }`}>
                  In Progress
                </p>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}