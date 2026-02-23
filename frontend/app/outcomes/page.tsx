"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "../community/PageLayout";
import { apiFetch } from "../lib/api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import ChartLineIcon from "@/components/ui/chart-line-icon";

interface Outcome {
  id: number;
  experimentId: number;
  experimentTitle: string;
  result: string;
  notes: string;
  createdAt: string;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Unknown date";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function OutcomesPage() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchOutcomes = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiFetch<Outcome[]>("/outcomes");
        setOutcomes(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch outcomes");
      } finally {
        setLoading(false);
      }
    };

    fetchOutcomes();
  }, []);

  const updateResult = async (result: "Success" | "Failed") => {
    if (!selectedOutcome) return;

    try {
      await apiFetch(`/outcomes/${selectedOutcome.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });

      const refreshed = await apiFetch<Outcome[]>("/outcomes");
      setOutcomes(refreshed);
      setSelectedOutcome(null);
    } catch {
      alert("Failed to update outcome result");
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading outcomes..." />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <ErrorState message={error} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="section">

        <div className="mb-4">
          <Button
            onClick={() => router.push("/experiments")}
            className="rounded-full px-6 py-2"
          >
            ← Back to Experiments
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <ChartLineIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Outcomes
          </h1>
        </div>

        {outcomes.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard
              className="p-[1px] rounded-xl w-full"
              gradientColor="rgba(59,130,246,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 px-10 py-12 text-center">
                <ChartLineIcon className="w-10 h-10 mx-auto mb-5 text-blue-400 opacity-80" />
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  No outcomes yet
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  Complete experiments to generate outcomes.
                </p>
              </div>
            </MagicCard>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {outcomes.map((outcome) => (
              <div
                key={outcome.id}
                onClick={() => setSelectedOutcome(outcome)}
                className="cursor-pointer hover:scale-[1.02] transition"
              >
                <MagicCard
                  className="p-[1px] rounded-xl"
                  gradientColor="rgba(59,130,246,0.6)"
                >
                  <div className="p-6 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10">

                    <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                      
                      {outcome.experimentTitle}
                    
                    </h3>

                    <div className="text-sm text-gray-500 mb-3">
                      {formatDate(outcome.createdAt)}
                    </div>

                    <div className="text-sm">
                      Result:{" "}
                      <span className="font-medium">
                        {outcome.result}
                      </span>
                    </div>
                   <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Notes:</span>
                    <p className="mt-1 whitespace-pre-wrap">
                      {outcome.notes?.trim() ? outcome.notes : "No notes added."}
                    </p>
                  </div>

                  </div>
                </MagicCard>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedOutcome && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedOutcome(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <MagicCard
                className="p-[1px] rounded-2xl w-[400px]"
                gradientColor="rgba(59,130,246,0.6)"
              >
                <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 space-y-6">

                  <h2 className="text-xl font-bold text-black dark:text-white">
                  {selectedOutcome.experimentTitle}
                </h2>
                  {selectedOutcome.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Notes:</span>
                      <p className="mt-1 whitespace-pre-wrap">
                        {selectedOutcome.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={() => updateResult("Success")}
                      className="w-full"
                    >
                      Mark Success
                    </Button>

                    <Button
                      onClick={() => updateResult("Failed")}
                      className="w-full"
                    >
                      Mark Failed
                    </Button>
                  </div>

                  <Button
                    onClick={() =>
                      router.push(
                        `/reflection/new?outcomeId=${selectedOutcome.id}`
                      )
                    }
                    className="w-full rounded-full"
                  >
                    + Write Reflection
                  </Button>

                </div>
              </MagicCard>
            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
}