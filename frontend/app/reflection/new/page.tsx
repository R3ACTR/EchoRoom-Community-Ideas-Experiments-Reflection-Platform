"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { PageLayout } from "../../community/PageLayout";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { RetroGrid } from "@/components/ui/retro-grid";

interface Outcome {
  id: number;
  experimentId: number;
  experimentTitle: string;
  result: string;
}

const CONTENT_LIMIT = 1000;

export default function NewReflectionPage() {
  const router = useRouter();

  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    whatWentWell: "",
    challenges: "",
    surprises: "",
    nextSteps: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch outcomes
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { whatWentWell, challenges, surprises, nextSteps } = formData;
    if (!selectedOutcome || !whatWentWell.trim() || !challenges.trim() || !surprises.trim() || !nextSteps.trim()) {
      setError("Outcome and all structured fields are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await apiFetch("/reflections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          outcomeId: selectedOutcome,
          context: {
            emotionBefore: 3, // Defaulting for now
            confidenceBefore: 5,
          },
          breakdown: {
            whatHappened: `Reflection on ${outcomes.find(o => o.id === selectedOutcome)?.experimentTitle}`,
            whatWorked: whatWentWell,
            whatDidntWork: challenges,
            surprises: surprises,
          },
          growth: {
            lessonLearned: "See breakdown what worked",
            nextAction: nextSteps,
          },
          result: {
            emotionAfter: 4,
            confidenceAfter: 7,
          },
          visibility: "public",
        }),
      });
      router.push("/reflection");
    } catch (err: any) {
      setError(err.message || "Failed to create reflection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RetroGrid />
      </div>
      <PageLayout>
        <div className="section max-w-2xl mx-auto">

          {/* Back Button */}
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
            Reflect on what you learned from an outcome.
          </p>

          <MagicCard
            gradientColor="rgba(59,130,246,0.6)"
            className="p-8 rounded-3xl bg-white/75 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/10 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">

              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Outcome Select */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Outcome
                </label>

                <select
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                  value={selectedOutcome ?? ""}
                  onChange={(e) =>
                    setSelectedOutcome(Number(e.target.value))
                  }
                >
                  <option value="">Choose outcome</option>
                  {outcomes.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.experimentTitle}
                    </option>
                  ))}
                </select>

                {/* Show message if no outcomes */}
                {outcomes.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    No outcomes available. Create an outcome first.
                  </p>
                )}
              </div>

              {/* Structured Reflection Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    What went better than expected?
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    placeholder="E.g., Team collaboration was smoother than planned..."
                    value={formData.whatWentWell}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatWentWell: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    What challenges did we face?
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-rose-500 outline-none transition"
                    placeholder="E.g., We struggled with API rate limits..."
                    value={formData.challenges}
                    onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    What surprised us?
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 outline-none transition"
                    placeholder="E.g., Users preferred the older UI for this specific task..."
                    value={formData.surprises}
                    onChange={(e) => setFormData(prev => ({ ...prev, surprises: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    What would we change next time?
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="E.g., Start with smaller data sets..."
                    value={formData.nextSteps}
                    onChange={(e) => setFormData(prev => ({ ...prev, nextSteps: e.target.value }))}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || outcomes.length === 0}
                className="w-full rounded-full py-3"
              >
                {loading ? "Creating..." : "+ Create Reflection"}
              </Button>

            </form>
          </MagicCard>
        </div>
      </PageLayout>
    </>
  );
}
