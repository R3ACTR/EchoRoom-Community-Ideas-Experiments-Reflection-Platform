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

interface Experiment {
  id: number;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  statusLabel: "Planned" | "In Progress" | "Completed";
  progress: number;
}

interface BackendExperiment {
  id: number;
  title: string;
  description: string;
  status: string;
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
  const router = useRouter();

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiFetch<BackendExperiment[]>("/experiments");
        setExperiments(data.map(normalizeExperiment));
      } catch (err: any) {
        setError(err.message || "Failed to fetch experiments");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  const getStatusTextColor = (status: string) => {
    if (status === "completed") return "text-green-600 dark:text-green-400";
    if (status === "in-progress") return "text-blue-600 dark:text-blue-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getProgressColor = (status: string) => {
    if (status === "completed") return "bg-green-500";
    if (status === "in-progress") return "bg-blue-500";
    return "bg-gray-400";
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
              <h1 className="text-4xl font-bold text-black dark:text-white">
                Experiments
              </h1>
            </div>

            {/* RIGHT SIDE BUTTON GROUP */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/outcomes")}
                className="rounded-full px-6 py-2"
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

          <p className="text-lg max-w-2xl text-black dark:text-white">
            Track and manage experiments to test ideas and learn quickly.
          </p>
        </div>

        {experiments.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard
              className="p-[1px] rounded-xl w-full"
              gradientColor="rgba(59,130,246,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 px-10 py-12 text-center">
                <ChartHistogramIcon className="w-10 h-10 mx-auto mb-5 text-blue-400 opacity-80" />

                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  No experiments yet
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-7">
                  Start your first experiment to test and validate ideas.
                </p>

                <Button
                  onClick={() => router.push("/experiments/new")}
                  className="rounded-full px-6 py-2"
                >
                  + Create First Experiment
                </Button>
              </div>
            </MagicCard>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {experiments.map((exp) => (
              <div key={exp.id} className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {exp.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {exp.description}
                </p>

                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-sm font-medium ${getStatusTextColor(exp.status)}`}
                  >
                    Status: {exp.statusLabel}
                  </span>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {exp.progress}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(exp.status)}`}
                    style={{ width: `${exp.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
