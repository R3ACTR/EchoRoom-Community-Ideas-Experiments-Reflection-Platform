"use client";

import { useEffect, useState } from "react";
import { BookOpen, MessageSquare, Plus, X } from "lucide-react";
import { PageLayout } from "../community/PageLayout";
import { apiFetch } from "../lib/api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import BackButton from "../components/BackButton";
import RefreshIcon from "@/components/ui/refresh-icon";
import LibraryIcon from "@/components/ui/library-icon";
import { MagicCard } from "@/components/ui/magic-card";

interface Reflection {
  id: number;
  title: string;
  outcome: string;
  learning: string;
  author: string;
  date: string;
}

interface ReflectionApiResponse {
  id: number;
  outcomeId: number;
  content: string;
  createdAt: string;
}

interface OutcomeApiResponse {
  id: number;
  result: string;
}

const outcomeColors: Record<string, string> = {
  Success: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  Mixed: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30",
  Failed: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
};

const formatReflectionDate = (createdAt?: string): string => {
  if (!createdAt) return "Unknown date";

  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const mapReflectionToViewModel = (
  reflection: ReflectionApiResponse,
  outcomeMap: Map<number, string>
): Reflection => {
  const outcome = outcomeMap.get(reflection.outcomeId) || "Outcome";
  const title = `Outcome #${reflection.outcomeId}`;

  return {
    id: reflection.id,
    title,
    outcome,
    learning: reflection.content || "No reflection content",
    author: "Community member",
    date: formatReflectionDate(reflection.createdAt),
  };
};

export default function ReflectionPage() {

  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Creation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReflection, setNewReflection] = useState({
    outcomeId: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {

    const fetchReflections = async () => {

      try {

        setLoading(true);
        setError(null);

        const [reflectionsData, outcomesData] = await Promise.all([
          apiFetch<ReflectionApiResponse[]>("/reflections"),
          apiFetch<OutcomeApiResponse[]>("/outcomes"),
        ]);

        setOutcomes(outcomesData);

        const outcomeMap = new Map<number, string>(
          outcomesData.map((outcome) => [outcome.id, outcome.result])
        );

        const mappedReflections = reflectionsData.map((reflection) =>
          mapReflectionToViewModel(reflection, outcomeMap)
        );

        setReflections(mappedReflections);

      } catch (err: any) {

        setError(err.message || "Failed to fetch reflections");

      } finally {

        setLoading(false);

      }

    };

    fetchReflections();
  }, []);

  const handleCreateReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReflection.outcomeId || !newReflection.content) return;

    setIsSubmitting(true);
    try {
      await apiFetch("/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcomeId: Number(newReflection.outcomeId),
          content: newReflection.content,
        }),
      });

      // Refresh data
      const [reflectionsData, outcomesData] = await Promise.all([
        apiFetch<ReflectionApiResponse[]>("/reflections"),
        apiFetch<OutcomeApiResponse[]>("/outcomes"),
      ]);

      setOutcomes(outcomesData);

      const outcomeMap = new Map<number, string>(
        outcomesData.map((outcome) => [outcome.id, outcome.result])
      );

      const mappedReflections = reflectionsData.map((reflection) =>
        mapReflectionToViewModel(reflection, outcomeMap)
      );

      setReflections(mappedReflections);

      // Reset and close
      setNewReflection({ outcomeId: "", content: "" });
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to create reflection");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Error state
  if (error) {
    return (
      <PageLayout>
        <ErrorState message={error} />
      </PageLayout>
    );
  }


  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading reflections..." />
      </PageLayout>
    );
  }


  return (

    <PageLayout>

      <main>

        <div className="section">

          {/* Header */}
          <div className="mb-4">
            <BackButton />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <RefreshIcon className="h-8 w-8 text-blue-600 dark:text-white" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Reflection
            </h1>
          </div>

          <div className="flex justify-between items-center mb-10">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Reflection is where learning becomes meaningful.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Create Reflection
            </button>
          </div>

          {/* Empty state */}
          {reflections.length === 0 ? (
            <div className="flex justify-center mt-14">
              <MagicCard
                className="p-[1px] rounded-xl w-full max-w-2xl"
                gradientColor="rgba(59,130,246,0.6)"
              >
                <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 px-10 py-12 text-center">
                  <LibraryIcon className="w-10 h-10 mx-auto mb-5 text-blue-400 opacity-80" />
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                    No reflections yet
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Reflections will appear here once outcomes are reviewed and learning is recorded.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary"
                  >
                    Add First Reflection
                  </button>
                </div>
              </MagicCard>
            </div>
          ) : (
            <div className="space-y-6">
              {reflections.map((ref) => (
                <div
                  key={ref.id}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6"
                >
                  {/* Title + outcome */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {ref.title}
                    </h3>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${outcomeColors[ref.outcome] || ""
                        }`}
                    >
                      {ref.outcome}
                    </span>
                  </div>

                  {/* Learning */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <p className="text-sm italic">
                        "{ref.learning}"
                      </p>
                    </div>
                  </div>

                  {/* Author + date */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      By {ref.author}
                    </span>
                    <span>
                      {ref.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>



      </main>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold dark:text-white">New Reflection</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateReflection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Related Outcome
                </label>
                <select
                  required
                  value={newReflection.outcomeId}
                  onChange={(e) =>
                    setNewReflection({ ...newReflection, outcomeId: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg appearance-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an outcome...</option>
                  {outcomes.map((outcome) => (
                    <option key={outcome.id} value={outcome.id}>
                      {outcome.result} (ID: {outcome.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Key Learning
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReflection.content}
                  onChange={(e) =>
                    setNewReflection({ ...newReflection, content: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="What did you learn from this outcome?"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? "Saving..." : "Save Reflection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PageLayout>

  );

}
