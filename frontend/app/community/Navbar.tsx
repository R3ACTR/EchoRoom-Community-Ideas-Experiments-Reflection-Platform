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
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center relative">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold">
          <RadioIcon className="w-6 h-6 text-slate-800 dark:text-white" />
          <span className="text-slate-900 dark:text-white hover:text-blue-500 transition">
            EchoRoom
          </span>
        </Link>

        {/* Desktop Dock Nav */}
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
        <div className="flex items-center space-x-4 ml-auto">

          {/* NEW Animated Theme Toggle */}
          <AnimatedThemeToggler className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition" />

          {/* CTA */}
          <Link href="/community">
            <RainbowButton>
              Join Community
            </RainbowButton>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-slate-900 dark:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pb-4">
          <div className="px-6 flex flex-col space-y-3 pt-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.to;

              return (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-2 text-sm font-medium px-2 py-1 rounded-md
                    ${
                      active
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
