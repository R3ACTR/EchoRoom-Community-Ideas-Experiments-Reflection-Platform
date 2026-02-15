"use client";

import "../styles/globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import PageWrapper from "./components/PageWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  function toggleReadable() {
    document.body.classList.toggle("readable");
  }

  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden text-gray-900 dark:text-white animated-bg">

        {/* Animated Background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "linear-gradient(120deg,#9333ea,#2563eb,#ec4899,#22c55e)",
            backgroundSize: "400% 400%",
            animation: "gradientMove 15s ease infinite",
            zIndex: -1,
          }}
        />

        <ThemeProvider>

          {/* Top Right Controls */}
          <div className="fixed top-4 right-4 z-50 flex gap-3">

            <ThemeToggle />

            {/* Readable Mode Toggle */}
            <button
              onClick={toggleReadable}
              className="px-3 py-2 rounded-lg bg-black text-white text-sm hover:scale-105 transition"
            >
              Readable
            </button>

          </div>

          {/* Page Content with Transitions */}
          <main className="relative z-10">
            <PageWrapper>
              {children}
            </PageWrapper>
          </main>

        </ThemeProvider>

      </body>
    </html>
  );
}
