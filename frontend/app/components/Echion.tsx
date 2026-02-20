"use client";

import { useState } from "react";
import { echionIntents, fallbackResponse } from "@/app/lib/echionKnowledge";

export default function Echion() {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const handleUserInput = () => {
  const text = input
  .toLowerCase()
  .replace(/[^\w\s]/g, "")
  .trim();
  const words = text.split(/\s+/);

  let bestMatch = null;
  let highestScore = 0;

  for (const intent of echionIntents) {
    let score = 0;

    for (const keyword of intent.keywords) {
      const keywordWords = keyword.split(/\s+/);

      for (const kw of keywordWords) {
        if (words.includes(kw)) {
          score++;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = intent;
    }
  }

  // Require at least 1 meaningful match
  if (bestMatch && highestScore > 0) {
    setResponse(bestMatch.response);
  } else {
    setResponse(fallbackResponse);
  }

  setInput("");
};

  const triggerIntent = (keyword: string) => {
    const intent = echionIntents.find((i) =>
      i.keywords.includes(keyword)
    );

    setResponse(intent ? intent.response : fallbackResponse);
  };

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

          <p className="text-sm text-white/80 mb-3">
            I’m Echion 👋 I can guide you through EchoRoom.
          </p>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => triggerIntent("what is echoroom")}
              className="text-xs px-3 py-1 bg-white/10 rounded-full hover:bg-white/20"
            >
              What is EchoRoom?
            </button>

            <button
              onClick={() => triggerIntent("create idea")}
              className="text-xs px-3 py-1 bg-white/10 rounded-full hover:bg-white/20"
            >
              How do I create an idea?
            </button>

            <button
              onClick={() => triggerIntent("how to start")}
              className="text-xs px-3 py-1 bg-white/10 rounded-full hover:bg-white/20"
            >
              Where should I start?
            </button>
          </div>

          {/* Response Area */}
          {response && (
            <div className="text-sm text-white/90 whitespace-pre-line border-t border-white/10 pt-3 mb-3">
              {response}
            </div>
          )}

          {/* Input Field */}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUserInput()}
              placeholder="Ask about ideas, experiments, reflections..."
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-white/10 outline-none"
            />
            <button
              onClick={handleUserInput}
              className="px-3 py-2 text-sm bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </>
  );
}