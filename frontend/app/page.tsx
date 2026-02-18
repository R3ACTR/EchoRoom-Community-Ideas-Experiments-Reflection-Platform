"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "./components/ui/Button";

import BulbSvg from "@/components/ui/bulb-svg";
import QuestionMark from "@/components/ui/question-mark";
import LibraryIcon from "@/components/ui/library-icon";
import ChartHistogramIcon from "@/components/ui/chart-histogram-icon";
import RadioIcon from "@/components/ui/radio-icon";

import WifiIcon from "@/components/ui/wifi-icon";
import WifiOffIcon from "@/components/ui/wifi-off-icon";

import { Ripple } from "@/components/ui/ripple";
import { MorphingText } from "@/components/ui/morphing-text";
import { TypingAnimation } from "@/components/ui/typing-animation";

import { Dock, DockIcon } from "@/components/ui/dock";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { MagicCard } from "@/components/ui/magic-card";

export default function HomePage() {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/health")
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center relative">

          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-extrabold">
            <RadioIcon className="w-6 h-6 text-slate-800 dark:text-white" />
            <span className="text-slate-900 dark:text-white hover:text-blue-500 transition-colors">
              EchoRoom
            </span>
          </div>

          {/* Navigation Dock */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <NavbarDock />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 ml-auto">

            <AnimatedThemeToggler className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition" />

            <Link href="/signup">
              <Button
                variant="primary"
                className="rounded-full px-6 py-2.5 text-sm"
              >
                Sign Up
              </Button>
            </Link>

            <Link
              href="/login"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600"
            >
              Login
            </Link>

          </div>

        </div>
      </nav>


      {/* HERO */}
      <section className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-20 pb-32">

        <div className="absolute inset-0 h-[600px] w-full overflow-hidden">
          <Ripple />
        </div>

        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          Community-Driven Learning Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white">
          Turn Ideas into
        </h1>

        <div className="mt-6 text-blue-600 dark:text-blue-400">
          <MorphingText
            texts={["Experiments", "Insights", "Knowledge", "Impact"]}
            className="h-[80px] md:h-[100px]"
          />
        </div>

        {/* Backend status */}
        <div className="mt-4 flex items-center justify-center gap-2">

          {backendOnline === null && (
            <span className="text-sm text-gray-400">Checking backend...</span>
          )}

          {backendOnline === true && (
            <>
              <WifiIcon className="w-4 h-4 text-green-500" />
              <span className="text-green-500 text-sm">Backend Online</span>
            </>
          )}

          {backendOnline === false && (
            <>
              <WifiOffIcon className="w-4 h-4 text-red-500" />
              <span className="text-red-500 text-sm">Backend Offline</span>
            </>
          )}

        </div>

        <div className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
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

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

          <Link href="/ideas">
            <Button
              variant="primary"
              className="rounded-full px-16 py-6 text-xl"
            >
              Start Exploring
            </Button>
          </Link>

          <Link href="/about">
            <Button
              variant="outline"
              className="rounded-full px-16 py-6 text-xl"
            >
              Learn More
            </Button>
          </Link>

        </div>

      </section>


      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-4 gap-6">

        <FeatureCard
          emoji={<BulbSvg className="w-6 h-6" />}
          title="Share Ideas"
          desc="Post and discuss ideas openly"
        />

        <FeatureCard
          emoji={<QuestionMark className="w-6 h-6" />}
          title="Run Experiments"
          desc="Validate ideas through experiments"
        />

        <FeatureCard
          emoji={<ChartHistogramIcon className="w-6 h-6" />}
          title="Track Outcomes"
          desc="Capture results and learn"
        />

        <FeatureCard
          emoji={<LibraryIcon className="w-6 h-6" />}
          title="Reflect"
          desc="Improve continuously"
        />

      </section>


    </main>
  );
}


function FeatureCard({
  emoji,
  title,
  desc,
}: any) {
  return (
    <MagicCard className="p-[1px] rounded-xl">

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl">

        {emoji}

        <h3 className="font-semibold mt-3">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          {desc}
        </p>

      </div>

    </MagicCard>
  );
}


function NavbarDock() {

  const router = useRouter();

  return (
    <Dock>

      <DockIcon onClick={() => router.push("/ideas")}>
        <BulbSvg className="w-5 h-5" />
      </DockIcon>

      <DockIcon onClick={() => router.push("/experiments")}>
        <ChartHistogramIcon className="w-5 h-5" />
      </DockIcon>

      <DockIcon onClick={() => router.push("/reflection")}>
        <LibraryIcon className="w-5 h-5" />
      </DockIcon>

    </Dock>
  );
}
