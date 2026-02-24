"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { PageLayout } from "../../community/PageLayout";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { RetroGrid } from "@/components/ui/retro-grid";
import SmoothSlider from "@/components/ui/SmoothSlider"; 
interface Outcome {
  id: number;
  experimentId: number;
  experimentTitle: string;
  result: string;
}

const emotionOptions = [
  { value: 1, emoji: "😞", label: "Very Low" },
  { value: 2, emoji: "😕", label: "Low" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

type Visibility = "private" | "public";

export default function NewReflectionPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New state for the custom toast/popup notification
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  const [form, setForm] = useState({
    outcomeId: null as number | null,
    context: {
      emotionBefore: 3,
      confidenceBefore: 5,
    },
    breakdown: {
      whatHappened: "",
      whatWorked: "",
      whatDidntWork: "",
    },
    growth: {
      lessonLearned: "",
      nextAction: "",
    },
    result: {
      emotionAfter: 3,
      confidenceAfter: 5,
    },
    evidenceLink: "",
    visibility: "private" as Visibility,
  });

  useEffect(() => {
    const fetchOutcomes = async () => {
      try {
        const data = await apiFetch<Outcome[]>("/outcomes");
        setOutcomes(data);
      } catch {
        setError("Failed to load outcomes");
      }
    };
    fetchOutcomes();
  }, []);

  const validateURL = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = () => {
    setError(null);

    if (step === 1) {
      if (!form.outcomeId) {
        setError("Please select an outcome before continuing.");
        return false;
      }
    }

    if (step === 3) {
      if (
        !form.breakdown.whatHappened.trim() ||
        !form.breakdown.whatWorked.trim() ||
        !form.breakdown.whatDidntWork.trim()
      ) {
        setError("All breakdown fields must be completed.");
        return false;
      }
    }

    if (step === 4) {
      if (
        !form.growth.lessonLearned.trim() ||
        !form.growth.nextAction.trim()
      ) {
        setError("Please complete all growth fields.");
        return false;
      }
    }

    if (step === 5) {
      if (!validateURL(form.evidenceLink)) {
        setError("Please enter a valid demo link URL.");
        return false;
      }
    }

    return true;
  };

  // Helper to trigger the notification popup
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => {
        const next = prev + 1;
        showToast(`Step ${next}!`);
        return next;
      });
    }
  };

  const prevStep = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      await apiFetch("/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      showToast("Reflection Submitted Successfully!");
      setTimeout(() => {
         router.push("/reflection");
      }, 1000); // Slight delay so they can see the success toast
    } catch (err: any) {
      setError(err.message || "Failed to create reflection");
      setLoading(false); // Make sure to re-enable button on fail
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RetroGrid />
      </div>

      <PageLayout>
        <div className="section max-w-2xl mx-auto relative z-10">
          <div className="mb-6">
            <Button
              onClick={() => router.push("/reflection")}
              className="rounded-full px-6 py-2"
            >
              ← Back to Reflections
            </Button>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">
            Create New Reflection
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Structured reflection builds real growth.
          </p>

          <MagicCard
            gradientColor="rgba(59,130,246,0.6)"
            className="p-8 rounded-3xl bg-white/75 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/10 shadow-xl"
          >
            {/* Visual Stepper UI added here */}
            <div className="flex items-center justify-center w-full mb-8 mt-2 px-2 overflow-hidden">
  {[1, 2, 3, 4, 5].map((s, index) => (
    <div key={s} className="flex items-center flex-shrink-0">
      
      {/* Step Node */}
      <div
        className={`
          flex items-center justify-center
          w-6 h-6 sm:w-8 sm:h-8
          text-xs sm:text-sm
          rounded-full font-semibold
          transition-all duration-300
          ${
            s < step
              ? "bg-blue-600 text-white"
              : s === step
              ? "bg-blue-600 text-white ring-2 sm:ring-4 ring-blue-500/30 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
              : "bg-gray-200 dark:bg-zinc-800 text-gray-500"
          }
        `}
      >
        {s < step ? (
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          s
        )}
      </div>

      {/* Connector */}
      {index < 4 && (
        <div
          className={`
            w-4 sm:w-10 md:w-16
            h-[2px]
            mx-1 sm:mx-2
            rounded transition-all duration-300
            ${
              s < step
                ? "bg-blue-600"
                : "bg-gray-200 dark:bg-zinc-800"
            }
          `}
        />
      )}
    </div>
  ))}
</div>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <label className="block text-sm font-medium">Select Outcome</label>
                <select
                  className="w-full p-3 rounded-xl border bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={form.outcomeId ?? ""}
                  onChange={(e) => setForm({ ...form, outcomeId: Number(e.target.value) })}
                >
                  <option value="">Choose outcome</option>
                  {outcomes.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.experimentTitle}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end pt-4">
                  <Button onClick={nextStep} className="rounded-full px-8 py-2">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <h2 className="font-semibold text-lg">Before Starting</h2>

                <div>
                  <label className="block text-sm mb-3 text-gray-700 dark:text-gray-300">How did you feel?</label>
                  <div className="flex justify-between max-w-sm">
                    {emotionOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            context: { ...form.context, emotionBefore: option.value },
                          })
                        }
                        className={`text-2xl p-3 rounded-xl transition-all duration-200 ${
                          form.context.emotionBefore === option.value
                            ? "bg-blue-500/20 scale-110 shadow-sm"
                            : "hover:scale-110 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {option.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
    Confidence (1–10)
  </label>
  <SmoothSlider
    min={1}
    max={10}
    value={form.context.confidenceBefore}
    onChange={(val) =>
      setForm({
        ...form,
        context: { ...form.context, confidenceBefore: val },
      })
    }
  />
</div>

                <div className="flex justify-between pt-4">
                  <Button onClick={prevStep} variant="outline" className="rounded-full px-6">
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="rounded-full px-8">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <h2 className="font-semibold text-lg">Breakdown</h2>

                {[
                  { 
                    key: "whatHappened", 
                    label: "What happened?", 
                    placeholder: "Briefly describe the event, context, and the final outcome..." 
                  },
                  { 
                    key: "whatWorked", 
                    label: "What worked?", 
                    placeholder: "List the strategies, actions, or decisions that yielded positive results..." 
                  },
                  { 
                    key: "whatDidntWork", 
                    label: "What didn’t work?", 
                    placeholder: "Note any challenges, bottlenecks, or assumptions that proved wrong..." 
                  },
                ].map((field) => {
                  const currentValue = (form.breakdown as any)[field.key];
                  const wordCount = currentValue.trim().split(/\s+/).filter(Boolean).length;
                  const maxWords = 50; // Change limit here if needed

                  return (
                    <div key={field.key}>
                      <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">{field.label}</label>
                      <textarea
                        rows={3}
                        placeholder={field.placeholder}
                        className="w-full p-3 rounded-xl border bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                        value={currentValue}
                        onChange={(e) => {
                          const inputText = e.target.value;
                          const currentWords = inputText.trim().split(/\s+/).filter(Boolean).length;
                          
                          // Only allow typing if under word limit OR if they are deleting characters
                          if (currentWords <= maxWords || inputText.length < currentValue.length) {
                            setForm({
                              ...form,
                              breakdown: { ...form.breakdown, [field.key]: inputText },
                            });
                          }
                        }}
                      />
                      <div className={`text-xs text-right mt-1 ${wordCount >= maxWords ? 'text-red-500' : 'text-gray-400'}`}>
                        {wordCount} / {maxWords} words
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-between pt-4">
                  <Button onClick={prevStep} variant="outline" className="rounded-full px-6">
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="rounded-full px-8">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <h2 className="font-semibold text-lg">Growth</h2>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Lesson Learned</label>
                  <textarea
                    rows={3}
                    placeholder="What is the core takeaway or insight you gained from this experience?"
                    className="w-full p-3 rounded-xl border bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                    value={form.growth.lessonLearned}
                    onChange={(e) => {
                      const inputText = e.target.value;
                      const currentWords = inputText.trim().split(/\s+/).filter(Boolean).length;
                      if (currentWords <= 50 || inputText.length < form.growth.lessonLearned.length) {
                        setForm({
                          ...form,
                          growth: { ...form.growth, lessonLearned: inputText },
                        });
                      }
                    }}
                  />
                  <div className={`text-xs text-right mt-1 ${form.growth.lessonLearned.trim().split(/\s+/).filter(Boolean).length >= 50 ? 'text-red-500' : 'text-gray-400'}`}>
                    {form.growth.lessonLearned.trim().split(/\s+/).filter(Boolean).length} / 50 words
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">What will you do differently next time?</label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific, actionable changes you will make moving forward..."
                    className="w-full p-3 rounded-xl border bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                    value={form.growth.nextAction}
                    onChange={(e) => {
                      const inputText = e.target.value;
                      const currentWords = inputText.trim().split(/\s+/).filter(Boolean).length;
                      if (currentWords <= 50 || inputText.length < form.growth.nextAction.length) {
                        setForm({
                          ...form,
                          growth: { ...form.growth, nextAction: inputText },
                        });
                      }
                    }}
                  />
                  <div className={`text-xs text-right mt-1 ${form.growth.nextAction.trim().split(/\s+/).filter(Boolean).length >= 50 ? 'text-red-500' : 'text-gray-400'}`}>
                    {form.growth.nextAction.trim().split(/\s+/).filter(Boolean).length} / 50 words
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button onClick={prevStep} variant="outline" className="rounded-full px-6">
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="rounded-full px-8">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <h2 className="font-semibold text-lg">After Outcome</h2>

                <div>
                  <label className="block text-sm mb-3 text-gray-700 dark:text-gray-300">
                    How did you feel?
                  </label>
                  <div className="flex justify-between max-w-sm">
                    {emotionOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            result: { ...form.result, emotionAfter: option.value },
                          })
                        }
                        className={`text-2xl p-3 rounded-xl transition-all duration-200 ${
                          form.result.emotionAfter === option.value
                            ? "bg-blue-500/20 scale-110 shadow-sm"
                            : "hover:scale-110 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {option.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Confidence (1–10)
                  </label>
                  <SmoothSlider
                    min={1}
                    max={10}
                    value={form.result.confidenceAfter}
                    onChange={(val) =>
                      setForm({
                        ...form,
                        result: { ...form.result, confidenceAfter: val },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Experiment Demo Link (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-username/your-repo"
                    className="w-full p-3 rounded-xl border bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                    value={form.evidenceLink}
                    onChange={(e) => setForm({ ...form, evidenceLink: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Visibility
                  </label>
                  <select
                    className="w-full p-3 rounded-xl border bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value as Visibility })}
                  >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>

                <div className="flex justify-between pt-4">
                  <Button onClick={prevStep} variant="outline" className="rounded-full px-6">
                    Previous
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-full px-8"
                  >
                    {loading ? "Creating..." : "Submit Reflection"}
                  </Button>
                </div>
              </div>
            )}
          </MagicCard>
        </div>
      </PageLayout>

      {/* Toast Notification Popup */}
      {toast.visible && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300 pointer-events-none">
          <div className="flex items-center gap-3 bg-zinc-900 dark:bg-black text-white px-5 py-3 rounded-xl shadow-2xl border border-zinc-800">
            <span className="text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p className="text-sm font-medium tracking-wide">{toast.message}</p>
          </div>
        </div>
      )}
    </>
  );
}