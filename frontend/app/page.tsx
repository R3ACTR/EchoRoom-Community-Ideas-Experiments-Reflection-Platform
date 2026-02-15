"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/health")
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus("✅ Backend Connected: " + data.message);
      })
      .catch(() => {
        setBackendStatus("❌ Backend Not Connected");
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            EchoRoom
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/ideas" className="hover:text-blue-600 transition">
              Ideas
            </Link>

            <Link href="/experiments" className="hover:text-blue-600 transition">
              Experiments
            </Link>

            <Link href="/reflection" className="hover:text-blue-600 transition">
              Reflection
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">

            {/* Signup */}
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:shadow-lg transition"
            >
              Sign Up
            </Link>

            {/* Login */}
            <Link
              href="/login"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
            >
              Login
            </Link>

          </div>
        </div>
      </nav>


      {/* HERO */}
      <section className="relative max-w-5xl mx-auto text-center px-6 pt-20 pb-20">

        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          Community-Driven Learning Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Turn Ideas into{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Actionable Learning
          </span>
        </h1>

        <div className="mt-4">
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {backendStatus}
          </span>
        </div>

        <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          EchoRoom helps communities transform ideas into experiments, insights,
          and meaningful learning — collaboratively and transparently.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            href="/ideas"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-xl hover:scale-105 transition duration-200 inline-block"
          >
            Start Exploring →
          </Link>

          <Link
            href="/about"
            className="px-8 py-3 rounded-full font-semibold border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition inline-block"
          >
            Learn More
          </Link>

        </div>
      </section>


      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <FeatureCard emoji="💡" title="Share Ideas" desc="Post and discuss ideas openly with your community to spark innovation." />
          <FeatureCard emoji="🧪" title="Run Experiments" desc="Validate ideas through focused real-world experiments and tests." />
          <FeatureCard emoji="📊" title="Track Outcomes" desc="Capture results and build collective knowledge from detailed outcomes." />
          <FeatureCard emoji="🧠" title="Reflect & Learn" desc="Improve continuously through shared insights and reflection." />
        </div>
      </section>


      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white">
            Start building and learning together
          </h2>
          <p className="text-blue-100 mt-4">
            Join EchoRoom and turn your ideas into meaningful experiments today.
            No credit card required.
          </p>
          <Link
            href="/community"
            className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-100 inline-block"
          >
            Get Started
          </Link>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left">
          <p className="text-sm text-slate-500">
            © 2026 EchoRoom — Built during Open Source Quest
          </p>

          <div className="flex gap-4 sm:gap-6 text-sm text-slate-500 mt-4 md:mt-0 justify-center md:justify-start">
            <Link href="/about" className="hover:text-blue-600">About</Link>
            <Link href="/community" className="hover:text-blue-600">Community</Link>
            <Link href="https://github.com/R3ACTR/EchoRoom-Community-Ideas-Experiments-Reflection-Platform" className="hover:text-blue-600">
              GitHub
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
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300">

      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-2xl mb-4 group-hover:scale-110 transition">
        {emoji}
      </div>

      <h3 className="font-semibold text-lg text-slate-800 dark:text-white">
        {title}
      </h3>

      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
        {desc}
      </p>

    </div>
  );
}
