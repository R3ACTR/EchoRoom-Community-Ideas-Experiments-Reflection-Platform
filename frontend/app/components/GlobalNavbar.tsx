"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, ChevronDown, ArrowRight } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import BrightnessDownIcon from "@/components/ui/brightness-down-icon";
import MoonIcon from "@/components/ui/moon-icon";
import RadioIcon from "@/components/ui/radio-icon";
import BulbSvg from "@/components/ui/bulb-svg";
import ChartHistogramIcon from "@/components/ui/chart-histogram-icon";
import LibraryIcon from "@/components/ui/library-icon";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const learningFlowItems: NavItem[] = [
  { to: "/ideas", label: "Ideas", icon: BulbSvg },
  { to: "/experiments", label: "Experiments", icon: ChartHistogramIcon },
  { to: "/reflection", label: "Reflection", icon: LibraryIcon },
];

const navItems: NavItem[] = [
  { to: "/community", label: "Community", icon: User },
  { to: "/about", label: "About", icon: User },
];

interface UserData {
  name?: string;
  email?: string;
  role?: string;
}

export function GlobalNavbar({ showLearningFlow = true }: { showLearningFlow?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const { dark, toggleTheme } = useTheme();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setUserMenuOpen(false);
    window.location.href = "/";
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold">
          <RadioIcon className={`w-6 h-6 ${dark ? "text-white" : "text-slate-800"}`} />
          <span className={`${dark ? "text-white" : "text-slate-900"} transition-colors hover:text-blue-500`}>
            EchoRoom
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {showLearningFlow && (
            <div className="flex items-center">
              {learningFlowItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.to} className="flex items-center">
                    <Link
                      href={item.to}
                      className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive(item.to) ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive(item.to) ? "text-blue-600 dark:text-blue-400" : dark ? "text-blue-300" : "text-blue-700"}`} />
                      <span className={`text-sm font-medium ${isActive(item.to) ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                        {item.label}
                      </span>
                      {isActive(item.to) && (
                        <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                      )}
                    </Link>
                    {index < learningFlowItems.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-400 mx-1" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive(item.to)
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                  : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {dark ? (
              <BrightnessDownIcon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            ) : (
              <MoonIcon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            )}
          </button>

          {/* Auth section - use suppressHydrationWarning to prevent mismatch */}
          <div suppressHydrationWarning>
            {!mounted ? (
              // Placeholder during SSR to prevent hydration mismatch
              <div className="flex items-center gap-2">
                <div className="w-16 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="w-20 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">
                    {user.name || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                  {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name || "User"}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-[#9CCFFF] hover:from-blue-400 hover:to-indigo-500 rounded-full transition-all hover:scale-105 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-slate-900 dark:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pb-4">
          {showLearningFlow && (
            <div className="px-6 pt-4 pb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Learning Flow</p>
              <div className="flex flex-col space-y-1">
                {learningFlowItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        isActive(item.to)
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          <div className="px-6 pt-2 pb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pages</p>
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive(item.to)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
