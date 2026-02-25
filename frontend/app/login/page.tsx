"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagicCard } from "@/components/ui/magic-card";
import { Meteors } from "@/components/ui/meteors";
import { ShinyButton } from "@/components/ui/shiny-button";
import HomeIcon from "@/components/ui/home-icon";

const demoAccounts = [
  { role: "User", email: "user@echoroom.dev", password: "user123", name: "Demo User" },
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
      // 1. Check Demo Accounts
      let account = demoAccounts.find(
        (acc) => acc.email === email && acc.password === password
      );

      // 2. If not a demo, check localStorage (Signup data)
      if (!account) {
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        account = storedUsers.find(
          (acc: any) => acc.email === email && acc.password === password
        );
      }

      if (account) {
        localStorage.setItem("user", JSON.stringify({ 
            email: account.email, 
            name: account.name, 
            role: account.role 
        }));
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
      <Meteors number={18} className="opacity-40 dark:opacity-60" />

      <div className="relative z-10 w-full max-w-md">
        <MagicCard className="p-[1px] rounded-xl" gradientColor="rgba(99,102,241,0.8)">
          <div className="p-6 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl shadow-xl">
            <Link href="/" className="inline-block mb-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
              <HomeIcon className="w-6 h-6" />
            </Link>
            
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access EchoRoom to explore ideas and experiments
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-3 mb-4 text-sm border border-red-200 dark:border-red-800">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white mb-1.5 block">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white mb-1.5 block">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <ShinyButton type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Signing in..." : "Sign In"}
              </ShinyButton>
            </form>

            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Demo Access</p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded block text-slate-600 dark:text-slate-300">
                user@echoroom.dev / user123
              </code>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-6">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Join the community
              </Link>
            </p>
          </div>
        </MagicCard>
      </div>
    </main>
  );
}