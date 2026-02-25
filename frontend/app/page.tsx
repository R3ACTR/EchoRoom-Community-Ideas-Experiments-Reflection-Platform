"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "./components/ui/Button";
import BulbSvg from "@/components/ui/bulb-svg";
import QuestionMark from "@/components/ui/question-mark";
import LibraryIcon from "@/components/ui/library-icon";
import ChartHistogramIcon from "@/components/ui/chart-histogram-icon";
import RadioIcon from "@/components/ui/radio-icon";
import { Ripple } from "@/components/ui/ripple";
import { MorphingText } from "@/components/ui/morphing-text";
import { TypingAnimation } from "@/components/ui/typing-animation";
import WifiIcon from "@/components/ui/wifi-icon";
import WifiOffIcon from "@/components/ui/wifi-off-icon";
import { Dock, DockIcon } from "@/components/ui/dock";
import { useRouter } from "next/navigation";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { MagicCard } from "@/components/ui/magic-card";
import GithubIcon from "@/components/ui/github-icon";
import UsersGroupIcon from "@/components/ui/users-group-icon";
import InfoCircleIcon from "@/components/ui/info-circle-icon";

export default function HomePage() {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/health")
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between relative">

          {/* Logo */}
          <div className="flex items-center gap-1.5 md:gap-2 text-xl md:text-2xl font-extrabold z-10">
            <RadioIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-800 dark:text-white" />
            <span className="text-slate-900 dark:text-white hover:text-blue-500 transition-colors">
              EchoRoom
            </span>
          </div>

          {/* Desktop Navigation Dock (Hidden on Mobile) */}
          <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-0">
            <div className="pointer-events-auto">
              <NavbarDock />
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3 md:gap-4 z-10">
            <AnimatedThemeToggler className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full transition-all duration-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:scale-105 active:scale-95" />

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/signup">
                <Button
                  variant="primary"
                  className="rounded-full px-6 py-2.5 text-sm font-normal tracking-tight"
                >
                  Sign Up
                </Button>
              </Link>
              <Link
                href="/login"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-base"
              >
                Login
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              className="md:hidden p-2 text-slate-800 dark:text-white hover:text-blue-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg md:hidden flex flex-col p-4 gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
            <Link href="/ideas" className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
              <BulbSvg className="w-5 h-5 text-blue-500" />
              Ideas
            </Link>
            <Link href="/experiments" className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
              <ChartHistogramIcon className="w-5 h-5 text-blue-500" />
              Experiments
            </Link>
            <Link href="/reflection" className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
              <LibraryIcon className="w-5 h-5 text-blue-500" />
              Reflection
            </Link>
            
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
            
            <div className="flex flex-col gap-3 sm:hidden">
              <Link href="/signup">
                <Button variant="primary" className="w-full rounded-full">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login" className="text-center text-slate-600 dark:text-slate-300 hover:text-blue-500 font-medium py-2">
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative z-10 max-w-5xl mx-auto text-center px-4 md:px-6 pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="absolute inset-0 h-[400px] md:h-[600px] w-full overflow-hidden">
          <Ripple />
        </div>

        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
          Community-Driven Learning Platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Turn Ideas into
        </h1>

        <div className="mt-4 md:mt-6 text-blue-600 dark:text-blue-400">
          <MorphingText
            texts={["Experiments", "Insights", "Knowledge", "Impact"]}
            className="h-[60px] md:h-[100px] lg:h-[110px]"
          />
        </div>

        {/* Backend Status */}
        <div className="mt-2 flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-fit mx-auto">
          {backendOnline === null ? (
            <span className="text-xs text-slate-400">Checking...</span>
          ) : backendOnline ? (
            <>
              <WifiIcon className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">
                Backend Online
              </span>
            </>
          ) : (
            <>
              <WifiOffIcon className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-medium text-rose-400">
                Backend Offline
              </span>
            </>
          )}
        </div>

        <div className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed h-[60px] md:h-auto">
          <TypingAnimation
            words={[
              "Where ideas become experiments.",
              "Experiments become insights.",
              "Insights become knowledge.",
              "Knowledge becomes impact.",
            ]}
            loop
          />
        </div>

        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link href="/ideas" className="w-full sm:w-auto">
            <Button
              variant="primary"
              className="w-full rounded-full px-8 py-4 md:px-16 md:py-6 text-lg md:text-xl font-normal tracking-tight"
            >
              Start Exploring
            </Button>
          </Link>

          <Link href="/about" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full rounded-full px-8 py-4 md:px-16 md:py-6 text-lg md:text-xl font-normal tracking-tight bg-[#7EACB5] text-slate-900 dark:text-white hover:bg-[#6e9ca5] border border-slate-300 dark:border-white/20"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-24 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <FeatureCard
            emoji={<BulbSvg className="w-6 h-6" />}
            title="Share Ideas"
            desc="Post and discuss ideas openly with your community to spark innovation."
          />
          <FeatureCard
            emoji={<QuestionMark className="w-6 h-6" />}
            title="Run Experiments"
            desc="Validate ideas through focused real-world experiments and tests."
          />
          <FeatureCard
            emoji={<ChartHistogramIcon className="w-6 h-6" />}
            title="Track Outcomes"
            desc="Capture results and build collective knowledge from detailed outcomes."
          />
          <FeatureCard
            emoji={<LibraryIcon className="w-6 h-6" />}
            title="Reflect & Learn"
            desc="Improve continuously through shared insights and reflection."
          />
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-blue-600 py-12 md:py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Start building and learning together
          </h2>
          <p className="text-blue-100 mt-3 md:mt-4 text-sm md:text-base">
            Join EchoRoom and turn your ideas into meaningful experiments today.
            No credit card required.
          </p>
          <Link href="/community" className="mt-8 md:mt-10 inline-block w-full sm:w-auto">
            <button
              className="
                w-full sm:w-auto
                px-8 py-3 md:px-12 md:py-4
                rounded-full
                font-normal
                text-base md:text-lg
                text-white
                bg-white/30
                backdrop-blur-xl
                border border-white/40
                shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                transition-all duration-300
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]
                hover:scale-[1.04]
                active:scale-[0.97]
              "
            >
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16 md:py-24 bg-blue-50 dark:bg-slate-900 border-t border-blue-100 dark:border-slate-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-8 md:mb-12">
            Built With Modern Technologies
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <img
              src="/react.svg"
              alt="React"
              className="w-8 h-8 md:w-12 md:h-12 opacity-60 grayscale dark:invert dark:opacity-70 dark:grayscale-0 hover:opacity-100 hover:scale-110 hover:invert-0 hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="/nextdotjs.svg"
              alt="Next.js"
              className="w-8 h-8 md:w-12 md:h-12 opacity-60 grayscale dark:invert dark:opacity-70 dark:grayscale-0 hover:opacity-100 hover:scale-110 hover:invert-0 hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="/nodedotjs.svg"
              alt="Node.js"
              className="w-8 h-8 md:w-12 md:h-12 opacity-60 grayscale dark:invert dark:opacity-70 dark:grayscale-0 hover:opacity-100 hover:scale-110 hover:invert-0 hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="/tailwindcss.svg"
              alt="Tailwind CSS"
              className="w-8 h-8 md:w-12 md:h-12 opacity-60 grayscale dark:invert dark:opacity-70 dark:grayscale-0 hover:opacity-100 hover:scale-110 hover:invert-0 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-700 py-10 pb-10 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-6">
          
          {/* Left Side */}
          <div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              © 2026 EchoRoom — Built during Open Source Quest
            </p>
            <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 mt-1">
              Community-driven experimentation platform
            </p>
          </div>

          {/* Right Side Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 text-xs md:text-sm text-slate-500 dark:text-slate-400 items-center">
            <Link
              href="/about"
              className="flex items-center gap-1.5 md:gap-2 hover:text-blue-600 transition"
            >
              <InfoCircleIcon className="w-4 h-4 opacity-70 dark:opacity-60" />
              <span>About</span>
            </Link>

            <Link
              href="/community"
              className="flex items-center gap-1.5 md:gap-2 hover:text-blue-600 transition"
            >
              <UsersGroupIcon className="w-4 h-4 opacity-70 dark:opacity-60" />
              <span>Community</span>
            </Link>

            <Link
              href="https://github.com/R3ACTR/EchoRoom-Community-Ideas-Experiments-Reflection-Platform"
              className="flex items-center gap-1.5 md:gap-2 hover:text-blue-600 transition"
            >
              <GithubIcon className="w-4 h-4 opacity-70 dark:opacity-60" />
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  emoji,
  title,
  desc,
}: {
  emoji: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <MagicCard
      className="p-[1px] rounded-2xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
      gradientColor="rgba(59,130,246,0.6)"
    >
      <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 h-full">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 mb-4 group-hover:scale-110 transition">
          {emoji}
        </div>
        <h3 className="font-semibold text-lg text-slate-800 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          {desc}
        </p>
      </div>
    </MagicCard>
  );
}

function NavbarDock() {
  const router = useRouter();
  const iconColor = "text-blue-700 dark:text-blue-300";

  return (
    <Dock direction="middle" className="bg-transparent border-none shadow-none flex items-center h-20">
      <DockIcon onClick={() => router.push("/ideas")} className="group relative w-12 h-12 flex items-center justify-center">
        <BulbSvg className={`w-5 h-5 ${iconColor}`} />
      </DockIcon>

      <DockIcon onClick={() => router.push("/experiments")} className="group relative w-12 h-12 flex items-center justify-center">
        <ChartHistogramIcon className={`w-5 h-5 ${iconColor}`} />
      </DockIcon>

      <DockIcon onClick={() => router.push("/reflection")} className="group relative w-12 h-12 flex items-center justify-center">
        <LibraryIcon className={`w-5 h-5 ${iconColor}`} />
      </DockIcon>
    </Dock>
  );
}