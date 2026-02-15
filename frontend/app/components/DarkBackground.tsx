"use client";

export default function DarkBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(120deg,#9333ea,#2563eb,#ec4899,#22c55e)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 15s ease infinite",
        zIndex: -1,
      }}
    />
  );
}
