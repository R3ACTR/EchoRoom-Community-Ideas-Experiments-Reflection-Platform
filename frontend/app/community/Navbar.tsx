"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import RadioIcon from "@/components/ui/radio-icon";
import BulbSvg from "@/components/ui/bulb-svg";
import ChartHistogramIcon from "@/components/ui/chart-histogram-icon";
import LibraryIcon from "@/components/ui/library-icon";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const navLinks = [
  { to: "/ideas", label: "Ideas", icon: BulbSvg },
  { to: "/experiments", label: "Experiments", icon: ChartHistogramIcon },
  { to: "/reflection", label: "Reflection", icon: LibraryIcon },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center relative">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold">
          <RadioIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 dark:text-white" />
          <span className="text-slate-900 dark:text-white hover:text-blue-500 transition">
            EchoRoom
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.to;

            return (
              <Link
                key={link.to}
                href={link.to}
                className="group relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
              >
                <div
                  className={`
                    flex items-center gap-2 transition-all duration-300
                    group-hover:scale-110
                    ${active ? "scale-110" : ""}
                  `}
                >
                  <Icon
                    className={`
                      w-5 h-5
                      ${
                        active
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-blue-700 dark:text-blue-300"
                      }
                    `}
                  />

                  <span
                    className={`
                      text-sm font-medium
                      ${
                        active
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300"
                      }
                    `}
                  >
                    {link.label}
                  </span>
                </div>

                <span className="absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3 sm:space-x-4 ml-auto">

          {/* Theme Toggle */}
          <AnimatedThemeToggler className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition" />

          {/* Desktop CTA only */}
          <Link href="/community" className="hidden sm:block">
            <RainbowButton>
              Join Community
            </RainbowButton>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-900 dark:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide Panel */}
      <div
        className={`
          md:hidden fixed inset-0 z-[100] transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Background Overlay */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col space-y-6">

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              Menu
            </span>
            <button onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.to;

              return (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition
                    ${
                      active
                        ? "bg-black text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 bg-black dark:hover:bg-slate-800"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="mt-auto">
            <Link href="/community" onClick={() => setMobileOpen(false)}>
              <RainbowButton className="w-full">
                Join Community
              </RainbowButton>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};