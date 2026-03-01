"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MagicCard } from "@/components/ui/magic-card";
import { Meteors } from "@/components/ui/meteors";
import { ShinyButton } from "@/components/ui/shiny-button";
import HomeIcon from "@/components/ui/home-icon";
import { apiFetch } from "@/app/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

 useEffect(() => {
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (accessToken && refreshToken) {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    
    fetch("http://localhost:5000/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/ideas");
      });
  }
}, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await apiFetch<any>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const { user, tokens } = result;

      localStorage.setItem("token", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.username,
          role: user.role,
          id: user.id,
          avatar: user.avatar || null,
        })
      );

      router.push("/ideas");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
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
            <Link
              href="/"
              className="inline-block mb-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
              <HomeIcon className="w-6 h-6" />
            </Link>

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

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
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
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <ShinyButton type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Signing in..." : "Sign In"}
              </ShinyButton>
            </form>

            {/* Optional: Google Button */}
            <div className="mt-4">
              <a
                href="http://localhost:5000/auth/google"
                className="block text-center py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm font-medium"
              >
                Continue with Google
              </a>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-6">
              Don’t have an account?{" "}
              <Link
                href="/signup"
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