"use client";

import { useState } from "react";

export default function EchionAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Icon */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
      >
        <img
          src="/echion.webp"
          alt="Echion Assistant"
          className="w-14 h-14 drop-shadow-lg hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Assistant Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-[#0f172a] text-white rounded-2xl shadow-2xl border border-white/10 p-4">
          <h2 className="text-lg font-semibold mb-2">Echion</h2>
          <p className="text-sm text-white/80">
            Echion is loading...
          </p>
        </div>
      )}
    </>
  );
}