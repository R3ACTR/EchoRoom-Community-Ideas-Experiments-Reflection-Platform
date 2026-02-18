import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
}: ButtonProps) {
  const baseStyle = `
    group relative overflow-hidden
    rounded-full text-sm
    transition-all duration-300 ease-out
    transform
    hover:-translate-y-1
    hover:scale-[1.04]
    active:translate-y-[2px]
    active:scale-[0.97]
    shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)]
    hover:shadow-[0_14px_34px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.45)]
  `;

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const variants = {
    primary: `
      text-white
      bg-gradient-to-br from-[#3A9AFF] via-[#2F7CF6] to-[#0992C2]
    `,
    secondary: `
      text-black
      bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300
    `,
    outline: `
      text-black
      border border-black
      bg-white/40 backdrop-blur
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {/* Gloss */}
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-white/0 via-white/10 to-white/30 opacity-70" />

      {/* Shine */}
      <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 bg-white/30 blur-md rotate-12 transition-all duration-700 group-hover:left-full" />

      <span className="relative z-10">{children}</span>
    </button>
  );
}
