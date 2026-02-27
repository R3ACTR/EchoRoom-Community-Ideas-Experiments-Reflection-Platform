"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagicCard } from "@/components/ui/magic-card";
import { Meteors } from "@/components/ui/meteors";
import { ShinyButton } from "@/components/ui/shiny-button";
import HomeIcon from "@/components/ui/home-icon";

const demoAccounts = [
  { role: "User", email: "user@echoroom.dev", password: "user123" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const account = demoAccounts.find(
        (acc) => acc.email === email && acc.password === password
      );

      if (account) {
        localStorage.setItem("user", JSON.stringify({ email, role: account.role }));
        router.push("/ideas");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-16">

      {/* Meteors */}
      <Meteors number={18} className="opacity-40 dark:opacity-60" />

      <div className="relative z-10 w-full max-w-md">
        <MagicCard
          className="p-[1px] rounded-xl"
          gradientColor="rgba(99,102,241,0.8)"
        >
          <div className="p-6 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl shadow-xl">
            <Link
    href="/"
    className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
  >
    <HomeIcon className="w-5 h-5" />
  </Link> <br />
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Sign In
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access EchoRoom to explore ideas and experiments
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-3 mb-4 text-sm border border-red-200 dark:border-red-800">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white mb-1.5 block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>

              <ShinyButton
  type="submit"
  disabled={loading}
  className="w-full mt-2 text-white font-semibold"
>
  {loading ? "Signing in..." : "Sign In"}
</ShinyButton>

            </form>

            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-5">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Demo Account:
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                user@echoroom.dev / user123
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-5">
              Don’t have an account?{" "}
              <Link
                href="/community"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Join the community
              </Link>
            </p>

            
          </div>
        </MagicCard>
      </div>
    </main>
  );
}
