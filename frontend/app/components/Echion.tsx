"use client";

import { useState } from "react";
import { echionIntents, fallbackResponse } from "@/app/lib/echionKnowledge";
import { TypingAnimation } from "@/components/ui/typing-animation";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { useEffect } from "react";
import EchionIcon from "@/components/ui/echion-icon";
import UsersIcon from "@/components/ui/users-icon";
export default function Echion() {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const getTimeGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};
  const handleUserInput = () => {
    const text = input
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

    const greetings = [
  "hi",
  "hello",
  "hey",
  "good morning",
  "good afternoon",
  "good evening"
];

if (greetings.includes(text)) {
  const timeGreeting = getTimeGreeting();

  setResponse(`${timeGreeting} 👋 I’m Echion — your EchoRoom guide.

EchoRoom runs on a structured learning cycle:

Idea → Experiment → Outcome → Reflection

You can ask me:
• What to do after creating an Idea?
• How experiment lifecycle works
• Why completed experiments are locked
• What comes next in the flow

How can I help you today?`);

  setInput("");
  return;
}

const words = text.split(/\s+/);

    let bestMatch = null;
    let highestScore = 0;

    for (const intent of echionIntents) {
      let score = 0;

      for (const keyword of intent.keywords) {
  const normalizedKeyword = keyword.toLowerCase();

  // Strong match: full phrase match
  if (text.includes(normalizedKeyword)) {
    score += 5; // High priority for exact phrase
    continue;
  }

  // Partial match: require majority of words
  const keywordWords = normalizedKeyword.split(/\s+/);
  let matchCount = 0;

  for (const kw of keywordWords) {
    if (words.includes(kw)) matchCount++;
  }

  // Only count if more than half the words match
  if (matchCount >= Math.ceil(keywordWords.length / 2)) {
    score += matchCount;
  }
}

      if (score > highestScore) {
        highestScore = score;
        bestMatch = intent;
      }
    }

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
  useEffect(() => {
  if (open) {
    setResponse(null);
    setInput("");
  }
}, [open]);
  useEffect(() => {
  if (open) {
    setShowBubble(false);
    return;
  }

  const interval = setInterval(() => {
    setShowBubble(true);

    const timeout = setTimeout(() => {
      setShowBubble(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, 30000);

  return () => clearInterval(interval);
}, [open]);

  return (
    <>
    
      {/* Floating Icon */}
      <div
  onClick={() => setOpen(!open)}
  className="fixed bottom-6 right-6 z-50 cursor-pointer group"
>
    
  <div className="relative">
    
    {showBubble && !open && (
  <div className="absolute bottom-16 right-14 z-50 animate-in fade-in slide-in-from-bottom-4 slide-in-from-right-4 zoom-in-95 duration-500 ease-out">
    <div className="
      relative
      bg-gradient-to-br from-[#3A9AFF] via-[#2F7CF6] to-[#0992C2]
      text-white
      px-5 py-3
      rounded-2xl
      shadow-lg shadow-blue-500/30
      
      w-max
      max-w-[200px]
    ">
      
      {/* Cloud Trail: Medium Circle */}
      <div className="absolute -bottom-3 -right-1 w-3.5 h-3.5 bg-[#0F2854] rounded-full shadow-sm z-[-1]"></div>
      
      {/* Cloud Trail: Smallest Circle (closest to icon) */}
      <div className="absolute -bottom-5 -right-3 w-2 h-2 bg-[#0F2854] rounded-full shadow-sm z-[-1]"></div>

      <TypingAnimation 
        duration={50} 
        className="relative z-10 text-white text-sm font-medium tracking-wide"
      >
        Hi I’m Echion
      </TypingAnimation>
    </div>
  </div>
)}
    {/* Glow ring */}
    <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl animate-pulse"></div>

  <EchionIcon
  className="relative w-14 h-14 drop-shadow-lg animate-breathe group-hover:scale-110 transition-transform duration-300"
/>
  </div>
</div>

      {/* Assistant Panel */}
      {open && (
  <div className="fixed bottom-24 right-6 z-50 w-80">
    <MagicCard
      className="rounded-2xl border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl p-5 text-white shadow-2xl"
      gradientColor="#3b82f6"
    >
          <AnimatedGradientText className="text-lg font-semibold mb-3">
          
            Echion
            </AnimatedGradientText>

          {/* Animated Intro Text */}
          <div className="mb-5">
  <TypingAnimation
    duration={15}
    className="block text-sm text-black/80 dark:text-white/80"
  >
    I’m Echion 👋 I can guide you through EchoRoom.
  </TypingAnimation>
</div>
          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            
            <button
              onClick={() => triggerIntent("what is echoroom")}
              className="text-black/80 dark:text-white/80 text-xs px-3 py-1 bg-black/10 dark:bg-white/10 rounded-full hover:bg-black/20 dark:hover:bg-white/20"
            >
              What is EchoRoom?
            </button>

            <button
              onClick={() => triggerIntent("create idea")}
              className="text-black/80 dark:text-white/80 text-xs px-3 py-1 bg-black/10 dark:bg-white/10 rounded-full hover:bg-black/20 dark:hover:bg-white/20"
            >
              How do I create an idea?
            </button>

            <button
              onClick={() => triggerIntent("how to start")}
              className="text-black/80 dark:text-white/80 text-xs px-3 py-1 bg-black/10 dark:bg-white/10 rounded-full hover:bg-black/20 dark:hover:bg-white/20"
            >
              Where should I start?
            </button>
          </div>

          {/* Animated Response */}
          {response && (
            <div className="text-sm text-black/80 dark:text-white/80 border-t border-white/10 pt-3 mb-3">
              <TypingAnimation
                key={response}
                duration={20}
                className="whitespace-pre-line leading-5"
              >
                {response.trim()}
              </TypingAnimation>
            </div>
          )}

          {/* Input Field */}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUserInput()}
              placeholder="Ask about ideas, experiments, reflections..."
              className="text-black/80 dark:text-white/80 flex-1 px-3 py-2 text-sm rounded-lg bg-black/20 dark:bg-white/20 outline-none"
            />
            <Button
  onClick={handleUserInput}
  variant="primary"
  size="sm"
  className="rounded-lg"
>
  Ask
</Button>
          </div>
            </MagicCard>
  </div>
      )}
    </>
  );
}