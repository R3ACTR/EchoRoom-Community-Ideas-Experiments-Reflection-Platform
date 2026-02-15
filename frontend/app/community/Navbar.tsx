"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import BrightnessDownIcon from "@/components/ui/brightness-down-icon";
import MoonIcon from "@/components/ui/moon-icon";


const navLinks = [
  { to: "/ideas", label: "Ideas" },
  { to: "/experiments", label: "Experiments" },
  { to: "/reflection", label: "Reflection" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();

return (
  <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        EchoRoom
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            href={link.to}
            className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              pathname === link.to ? "text-blue-600 dark:text-blue-400" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle theme"
        >
          {dark ? (
  <BrightnessDownIcon className="w-5 h-5" />
) : (
  <MoonIcon className="w-5 h-5" />
)}
        </button>

        <Link href="/community" className="hidden md:inline-flex">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-4 py-2 rounded-md hover:shadow-lg transition">
            Join Community
          </button>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-900 dark:text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </div>

    {/* Mobile Nav */}
    {mobileOpen && (
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pb-4">
        <div className="container flex flex-col space-y-3 pt-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                pathname === link.to ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    )}
  </nav>
);
};
