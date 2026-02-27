"use client";

import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { PageLayout } from "../../community/PageLayout";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";
import TrashIcon from "@/components/ui/trash-icon";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import FileDescriptionIcon from "@/components/ui/file-description-icon";

interface Idea {
  id: string;
  title: string;
  description: string;
  status: string;
  complexity: "LOW" | "MEDIUM" | "HIGH";
  goal?: string;
  category?: string;
  expectedImpact?: string;
  effort?: string;
  timeHorizon?: string;
}

const API_BASE_URL = "http://localhost:5000";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDraft, setDeleteDraft] = useState<Idea | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const draftsData = await apiFetch<Idea[]>("/ideas/drafts");
        setDrafts(draftsData);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handleDelete = async () => {
    if (!deleteDraft || deleting) return;

    try {
      setDeleting(true);

      await apiFetch(`/ideas/${deleteDraft.id}`, {
        method: "DELETE",
      });

      setDrafts((prev) =>
          prev.filter((i) => i.id !== deleteDraft.id)
      );

      setDeleteDraft(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete draft");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading drafts..." />
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
      <div className="section px-4 sm:px-0">
        <div className="mb-8">
          <div className="mb-4">
            <Button
              onClick={() => router.push("/ideas")}
              className="rounded-full px-6 py-2"
            >
              ← Back to Ideas
            </Button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileDescriptionIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white">
                My Drafts
              </h1>
            </div>

            <Button
              onClick={() => router.push("/ideas/create")}
              className="w-full sm:w-auto"
            >
              + New Draft
            </Button>
          </div>

          <p className="text-base sm:text-lg max-w-2xl text-black dark:text-white">
            Drafts are private ideas that can be edited and published later.
          </p>
        </div>

        {drafts.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard
              className="p-[1px] rounded-xl w-full"
              gradientColor="rgba(59,130,246,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 px-6 sm:px-10 py-10 sm:py-12 text-center">
                <FileDescriptionIcon className="w-10 h-10 mx-auto mb-5 text-blue-400 opacity-80" />
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  No drafts yet
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-7">
                  Start drafting your next idea.
                </p>
                <Button onClick={() => router.push("/ideas/create")}>
                  + Create Draft
                </Button>
              </div>
            </MagicCard>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <MagicCard
                key={draft.id}
                className="p-[1px] rounded-xl relative group cursor-pointer"
                gradientColor="rgba(59,130,246,0.6)"
              >
                <div
                  className="relative h-[300px] p-5 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 flex flex-col transition-colors hover:bg-white/20 dark:hover:bg-slate-900/60"
                  onClick={() => router.push(`/ideas/drafts/${draft.id}`)}
                >
                  {/* Delete */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDraft(draft);
                      }}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* MAIN CONTENT */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex flex-col gap-3 pr-16 mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white line-clamp-2">
                        {draft.title}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold border ${
                            draft.complexity === "HIGH"
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : draft.complexity === "MEDIUM"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          }`}
                        >
                          {draft.complexity}
                        </span>

                        {draft.category && (
                          <span className="inline-flex items-center text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold border bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
                            {draft.category}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 dark:text-slate-200 text-sm line-clamp-3">
                        {draft.description}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-2 pt-2 min-h-[70px]">

                      {draft.goal ? (
                          <div className="text-xs text-slate-500 dark:text-slate-400 border-l-2 border-blue-500/40 pl-2 py-0.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              Goal:
                            </span>
                            <span className="ml-1 line-clamp-1">{draft.goal}</span>
                          </div>
                      ) : (
                          <div className="text-xs text-slate-400/60 pl-2 py-0.5">
                            No goal specified
                          </div>
                      )}

                      {(draft.expectedImpact || draft.effort || draft.timeHorizon) ? (
                          <div className="flex flex-wrap gap-1.5">
                            {draft.expectedImpact && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                            Impact:
                            <strong className="ml-1 text-slate-700 dark:text-slate-200">
                              {draft.expectedImpact}
                            </strong>
                          </span>
                            )}
                            {draft.effort && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                            Effort:
                            <strong className="ml-1 text-slate-700 dark:text-slate-200">
                              {draft.effort}
                            </strong>
                          </span>
                            )}
                            {draft.timeHorizon && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                            Time:
                            <strong className="ml-1 text-slate-700 dark:text-slate-200">
                              {draft.timeHorizon}
                            </strong>
                          </span>
                            )}
                          </div>
                      ) : (
                          <div className="text-[10px] text-slate-400/60">
                            No additional metadata
                          </div>
                      )}

                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-400">
                      Draft
                    </span>
                  </div>
                </div>
              </MagicCard>
            ))}
          </div>
        )}
      </div>
      {deleteDraft && (
          <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
              onClick={() => !deleting && setDeleteDraft(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <MagicCard className="p-[1px] rounded-2xl">
                <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl px-6 py-6 w-[90vw] sm:w-[380px]">
                  <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                    Delete Draft
                  </h2>

                  <p className="text-slate-600 dark:text-slate-200 text-sm mb-6">
                    "{deleteDraft.title}" will be permanently removed.
                  </p>

                  <div className="flex gap-4">
                    <Button
                        className="w-full"
                        onClick={() => setDeleteDraft(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                        className="w-full"
                        onClick={handleDelete}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </MagicCard>
            </div>
          </div>
      )}
    </PageLayout>

  );
}