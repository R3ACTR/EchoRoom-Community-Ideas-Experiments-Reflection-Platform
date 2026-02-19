"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { PageLayout } from "../../community/PageLayout";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";

interface Outcome {
  id: number;
  result: string;
}

const CONTENT_LIMIT = 1000;

export default function NewReflectionPage() {
  const router = useRouter();

  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [content, setContent] = useState("");

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

    if (!selectedOutcome || !content.trim()) {
      setError("Outcome and reflection content are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await apiFetch("/reflection", {
        method: "POST",
        body: JSON.stringify({
          outcomeId: selectedOutcome,
          content,
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
                    {o.result}
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

            {/* Reflection Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Reflection
              </label>

              <textarea
                rows={6}
                maxLength={CONTENT_LIMIT}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                placeholder="What did you learn? What would you improve?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="text-xs text-right mt-1 text-gray-500">
                {content.length}/{CONTENT_LIMIT}
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
  );
}
