"use client";

import { useEffect, useState } from "react";
import { TrendingUp, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageLayout } from "../community/PageLayout";
import { apiFetch } from "../lib/api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import BackButton from "../components/BackButton";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";

interface Outcome {
  id: number;
  experimentId: number;
  result: string;
  notes: string;
  createdAt: string;
}

const outcomeColors: Record<string, string> = {
  Success:
    "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  Mixed:
    "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30",
  Failed:
    "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
};

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchOutcomes = async () => {
      try {
        setLoading(true);
        setError(null);

        const outcomesData = await apiFetch<Outcome[]>("/outcomes");
        setOutcomes(outcomesData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch outcomes");
      } finally {
        setLoading(false);
      }
    };

    fetchOutcomes();
  }, []);

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
          <BackButton />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Outcomes
          </h1>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          Outcomes are the results of your experiments. Track what works,
          what doesn't, and reflect on each result.
        </p>

        {outcomes.length === 0 ? (
  <div className="mt-10">
    <MagicCard
      className="p-[1px] rounded-2xl w-full"
      gradientColor="rgba(59,130,246,0.6)"
    >
      <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 px-10 py-16 text-center">
        <TrendingUp className="w-12 h-12 mx-auto mb-6 text-blue-400 opacity-80" />

        <h3 className="text-2xl font-semibold text-black dark:text-white mb-3">
          No outcomes yet
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
          Run experiments to generate outcomes and start reflecting on results.
        </p>

        <Button
          onClick={() => router.push("/experiments")}
          className="rounded-full px-8 py-3"
        >
          View Experiments
        </Button>
      </div>
    </MagicCard>
  </div>
) : (


          <div className="space-y-6">
            {outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Experiment #{outcome.experimentId}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Outcome #{outcome.id}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      outcomeColors[outcome.result] ||
                      "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {outcome.result}
                  </span>
                </div>

                {outcome.notes && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {outcome.notes}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">
                    {formatDate(outcome.createdAt)}
                  </span>

                  <Button
                    onClick={() =>
                      router.push(
                        `/reflection/new?outcomeId=${outcome.id}`
                      )
                    }
                    className="rounded-full px-4 py-2 text-sm"
                  >
                    + Add Reflection
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
