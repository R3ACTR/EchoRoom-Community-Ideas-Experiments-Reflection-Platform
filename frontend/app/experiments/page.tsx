"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";
import { PageLayout } from "../community/PageLayout";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import BackButton from "../components/BackButton";
import Button from "@/app/components/ui/Button";
import ChartHistogramIcon from "@/components/ui/chart-histogram-icon";
import { MagicCard } from "@/components/ui/magic-card";
import TrashIcon from "@/components/ui/trash-icon";
import { Link2, Check, Clock, Lightbulb, Target, ShieldAlert } from "lucide-react";
import { differenceInDays, parseISO, isAfter } from "date-fns";
import BulbSvg from "@/components/ui/bulb-svg";

interface Experiment {
  id: number;
  title: string;
  description: string;
  hypothesis: string;
  successMetric: string;
  falsifiability: string;
  status: "planned" | "in-progress" | "completed";
  statusLabel: "Planned" | "In Progress" | "Completed";
  progress: number;
  endDate: string;
}

interface BackendExperiment {
  id: number;
  title: string;
  description: string;
  hypothesis: string;
  successMetric: string;
  falsifiability: string;
  status: string;
  endDate: string;
  progress?: number;
}

const STATUS_LABELS: Record<Experiment["status"], Experiment["statusLabel"]> = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
};

const STATUS_PROGRESS: Record<Experiment["status"], number> = {
  planned: 0,
  "in-progress": 50,
  completed: 100,
};

const normalizeStatus = (status: string): Experiment["status"] => {
  const normalized = status.trim().toLowerCase().replace(/[_\s]+/g, "-");

  if (
    normalized === "planned" ||
    normalized === "in-progress" ||
    normalized === "completed"
  ) {
    return normalized;
  }

  return "planned";
};

const normalizeProgress = (
  status: Experiment["status"],
  progress?: number
): number => {
  if (typeof progress === "number" && Number.isFinite(progress)) {
    return Math.max(0, Math.min(100, Math.round(progress)));
  }
  return STATUS_PROGRESS[status];
};

const normalizeExperiment = (exp: BackendExperiment): Experiment => {
  const status = normalizeStatus(exp.status);
  return {
    ...exp,
    status,
    statusLabel: STATUS_LABELS[status],
    progress: normalizeProgress(status, exp.progress),
  };
};

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteExperiment, setDeleteExperiment] = useState<Experiment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyLink = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const url = `${window.location.origin}/experiments/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiFetch<BackendExperiment[]>("/experiments");
        const normalized = data.map(normalizeExperiment);
        setExperiments(normalized);
      } catch (err: any) {
        setError(err.message || "Failed to fetch experiments");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  const handleDelete = async () => {
    if (!deleteExperiment || deleting) return;

    try {
      setDeleting(true);

      await apiFetch(`/experiments/${deleteExperiment.id}`, {
        method: "DELETE",
      });

      setExperiments(prev =>
        prev.filter(exp => exp.id !== deleteExperiment.id)
      );

      setDeleteExperiment(null);
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete experiment");
    } finally {
      setDeleting(false);
    }
  };

  // NEW: Shared status badge styling matching the detail page
  const getStatusBadge = (status: string) => {
    if (status === "completed") return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    if (status === "in-progress") return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  };

  const getProgressColor = (status: string) => {
    if (status === "completed") return "bg-green-500";
    if (status === "in-progress") return "bg-blue-500";
    return "bg-slate-400";
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading experiments..." />
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

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <BackButton />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">
              <ChartHistogramIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold text-black dark:text-white tracking-tight">
                Experiments
              </h1>
            </div>

            {/* RIGHT SIDE BUTTON GROUP */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/outcomes")}
                className="rounded-full px-6 py-2"
                variant="secondary"
              >
                View Outcomes
              </Button>

              <Button
                onClick={() => router.push("/experiments/new")}
                className="rounded-full px-6 py-2"
              >
                + New Experiment
              </Button>
            </div>
          </div>

          <p className="text-lg max-w-2xl text-slate-600 dark:text-slate-300">
            Track and manage experiments to test ideas and learn quickly.
          </p>
        </div>

        {experiments.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard
              className="p-[1px] rounded-xl w-full"
              gradientColor="rgba(59,130,246,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 px-10 py-16 text-center">
                <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ChartHistogramIcon className="w-8 h-8 text-blue-500" />
                </div>

                <h3 className="text-2xl font-bold text-black dark:text-white mb-3">
                  No experiments yet
                </h3>

                <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed mb-8">
                  Start your first experiment to test assumptions and validate ideas using a structured approach.
                </p>

                <Button
                  onClick={() => router.push("/experiments/new")}
                  className="rounded-full px-8 py-2.5 shadow-lg shadow-blue-500/20"
                >
                  + Create First Experiment
                </Button>
              </div>
            </MagicCard>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {experiments.map((exp) => (
              <div
                key={exp.id}
                onClick={() => router.push(`/experiments/${exp.id}`)}
                className="cursor-pointer group h-full flex flex-col"
              >
                <MagicCard
                  className="p-[1px] rounded-2xl relative h-full flex-grow transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                  gradientColor="rgba(59,130,246,0.4)"
                >
                  <div className="relative p-6 md:p-7 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/5 h-full flex flex-col">

                    {/* Action Buttons */}
                    <div className="absolute top-5 right-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleCopyLink(e, exp.id)}
                        className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-500 rounded-lg transition-all"
                        title="Copy link"
                      >
                        {copiedId === exp.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Link2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteExperiment(exp);
                        }}
                        className="p-2 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-lg transition-all"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Header */}
                    <div className="mb-5 pr-20">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight line-clamp-2">
                        {exp.title}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>

                    {/* Refined Experiment Details */}
                    <div className="flex flex-col gap-3 mb-8 flex-grow">
                      {exp.hypothesis && (
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-1.5 rounded-md bg-amber-500/10 text-amber-500 shrink-0">
                            <BulbSvg className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-sm mt-0.5">
                            <strong className="text-slate-900 dark:text-slate-100 font-semibold mr-1.5">Hypothesis:</strong>
                            {exp.hypothesis}
                          </p>
                        </div>
                      )}
                      {exp.successMetric && (
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-1.5 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0">
                            <Target className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-sm mt-0.5">
                            <strong className="text-slate-900 dark:text-slate-100 font-semibold mr-1.5">Metric:</strong>
                            {exp.successMetric}
                          </p>
                        </div>
                      )}
                      {exp.falsifiability && (
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-1.5 rounded-md bg-rose-500/10 text-rose-500 shrink-0">
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-sm mt-0.5">
                            <strong className="text-slate-900 dark:text-slate-100 font-semibold mr-1.5">Falsifiability:</strong>
                            {exp.falsifiability}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Progress Section */}
                    <div className="mt-auto pt-5 border-t border-slate-200 dark:border-white/5">
                      <div className="flex justify-between items-center mb-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusBadge(exp.status)}`}>
                          {exp.statusLabel}
                        </span>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {exp.progress}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(exp.status)}`}
                          style={{ width: `${exp.progress}%` }}
                        />
                      </div>

                      {exp.endDate && exp.status !== "completed" && (
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Clock className={`w-3.5 h-3.5 ${differenceInDays(parseISO(exp.endDate), new Date()) <= 3
                                ? "text-red-500 animate-pulse"
                                : "text-blue-400"
                              }`} />
                            <span className={`font-medium ${
                              differenceInDays(parseISO(exp.endDate), new Date()) <= 3
                                ? "text-red-500"
                                : "text-slate-500 dark:text-slate-400"
                            }`}>
                              {isAfter(new Date(), parseISO(exp.endDate))
                                ? "Deadline passed"
                                : `${differenceInDays(parseISO(exp.endDate), new Date())} days remaining`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </MagicCard>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteExperiment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteExperiment(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MagicCard
              className="p-[1px] rounded-2xl shadow-2xl"
              gradientColor="rgba(59,130,246,0.6)"
            >
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl px-7 py-7 w-[380px] border border-white/20">

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-black dark:text-white">
                    Delete Experiment
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
                    "{deleteExperiment.title}" will be permanently removed.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="secondary"
                    className={`w-full ${deleting ? "opacity-50 pointer-events-none" : ""}`}
                    onClick={() => setDeleteExperiment(null)}
                  >
                    Cancel
                  </Button>

                  <Button
                    className={`w-full bg-red-500 hover:bg-red-600 text-white ${deleting ? "opacity-50 pointer-events-none" : ""}`}
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

      {/* Error Modal */}
      {deleteError && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setDeleteError(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MagicCard
              className="p-[1px] rounded-2xl shadow-2xl"
              gradientColor="rgba(239,68,68,0.6)"
            >
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl px-7 py-7 w-[380px] border border-white/20">

                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  Cannot Delete
                </h2>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {deleteError}
                </p>

                <Button
                  className="w-full"
                  onClick={() => setDeleteError(null)}
                >
                  Okay
                </Button>

              </div>
            </MagicCard>
          </div>
        </div>
      )}
    </PageLayout>
  );
}