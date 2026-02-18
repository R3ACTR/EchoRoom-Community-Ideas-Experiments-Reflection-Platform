"use client";

import { useEffect, useState } from "react";
import { TrendingUp, FileText } from "lucide-react";
import { PageLayout } from "../community/PageLayout";
import { apiFetch } from "../lib/api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import BackButton from "../components/BackButton";

interface Outcome {
  id: number;
  experimentId: number;
  result: string;
  notes: string;
  createdAt: string;
}

const outcomeColors: Record<string, string> = {
  Success: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  Mixed: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30",
  Failed: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
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
          Outcomes are the results of your experiments. Track what works, what doesn't, and learn from each result.
        </p>

        {outcomes.length === 0 ? (
          <div className="card text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              No outcomes yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Run experiments to see outcomes here.
            </p>
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
                      outcomeColors[outcome.result] || "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {outcome.result}
                  </span>
                </div>

                {outcome.notes && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg p-4">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {outcome.notes}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-500">
                  {formatDate(outcome.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
