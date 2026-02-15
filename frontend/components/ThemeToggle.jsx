"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "light" : "dark");
    setDark(!dark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-20 h-10 rounded-full overflow-hidden
      transition-all duration-700 ease-[cubic-bezier(.68,-0.6,.32,1.6)]
      bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400
      dark:from-slate-700 dark:via-slate-800 dark:to-slate-900
      shadow-inner"
    >
      {/* liquid blob */}
      <div
        className={`absolute w-16 h-16 rounded-full blur-xl opacity-60
        transition-all duration-700
        ${
          dark
            ? "translate-x-10 -translate-y-2 bg-blue-500 scale-125"
            : "-translate-x-2 -translate-y-2 bg-yellow-300 scale-110"
        }`}
      />

      {/* knob */}
      <div
        className={`absolute top-1 left-1 w-8 h-8 rounded-full
        flex items-center justify-center
        backdrop-blur-md text-lg
        transition-all duration-700
        ${
          dark
            ? "translate-x-10 bg-slate-800 text-yellow-300 shadow-2xl"
            : "translate-x-0 bg-white text-orange-400 shadow-lg"
        }`}
      >
        {dark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}
