"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { PageLayout } from "@/app/community/PageLayout";
import LoadingState from "@/app/components/LoadingState";
import ErrorState from "@/app/components/ErrorState";
import Button from "@/app/components/ui/Button";
import BackButton from "@/app/components/BackButton";
import { MagicCard } from "@/components/ui/magic-card";
import { RetroGrid } from "@/components/ui/retro-grid";
import ShareButton from "@/app/components/ShareButton";
import { Lightbulb, Target, ShieldAlert, Play, CheckCircle, Link2, AlertTriangle } from "lucide-react";

interface Experiment {
  id: number;
  title: string;
  description: string;
  hypothesis: string;
  successMetric: string;
  falsifiability: string;
  status: "planned" | "in-progress" | "completed";
  progress: number;
  linkedIdeaId?: number | null; 
}

export default function ExperimentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideaTitle, setIdeaTitle] = useState<string | null>(null);
  const [ideaExists, setIdeaExists] = useState<boolean>(true);

  useEffect(() => {
    const fetchExperiment = async () => {
      try {
        setLoading(true);

        const data = await apiFetch<Experiment>(`/experiments/${id}`);
        setExperiment(data);

        // Check linked idea
        if (data.linkedIdeaId) {
          try {
            const idea = await apiFetch<any>(`/ideas/${data.linkedIdeaId}`);
            setIdeaTitle(idea.title);
            setIdeaExists(true);
          } catch {
            setIdeaExists(false);
          }
        }

      } catch (err: any) {
        setError(err.message || "Failed to load experiment");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExperiment();
  }, [id]);

  const updateStatus = async (status: "completed" | "in-progress") => {
    if (!experiment) return;

    try {
      const progressValue = status === "in-progress" ? 50 : 100;

      const updated = await apiFetch<Experiment>(
        `/experiments/${experiment.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            progress: progressValue,
          }),
        }
      );

      setExperiment(updated);

      if (status === "completed") {
        router.push(`/outcomes/new?experimentId=${experiment.id}`);
      } else if (status === "in-progress") {
        router.push("/experiments");
      }

    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") return "bg-green-500/10 text-green-500 border-green-500/20";
    if (status === "in-progress") return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading experiment details..." />
      </PageLayout>
    );
  }

  if (error || !experiment) {
    return (
      <PageLayout>
        <ErrorState message={error || "Experiment not found"} />
      </PageLayout>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RetroGrid />
      </div>
      
      <PageLayout>
        <div className="flex justify-center py-10 relative z-10">
          <MagicCard
            className="p-[1px] rounded-2xl w-full max-w-4xl"
            gradientColor="rgba(59,130,246,0.6)"
          >
            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10 flex flex-col min-h-[60vh]">

              {/* Top Navigation Bar */}
              <div className="flex justify-between items-center mb-10">
               <Button
                           onClick={() => router.push("/experiments")}
                           className="primary"
                           >
                         ← Back to experiments
                         </Button>
                <ShareButton 
                  title={experiment.title} 
                  description={experiment.description} 
                  type="experiment"
                />
              </div>

              {/* Header Section */}
              <div className="mb-10">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <h1 className="text-4xl font-bold text-black dark:text-white tracking-tight">
                    {experiment.title}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusBadge(experiment.status)}`}>
                    {experiment.status.replace("-", " ")}
                  </span>
                </div>

                {/* Linked Idea Badge */}
                {experiment.linkedIdeaId && ideaExists && ideaTitle && (
                  <button
                    onClick={() => router.push(`/ideas/${experiment.linkedIdeaId}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-6 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-colors text-sm font-medium"
                  >
                    <Link2 className="w-4 h-4" />
                    Origin Idea: {ideaTitle}
                  </button>
                )}

                {/* Deleted Idea Warning */}
                {experiment.linkedIdeaId && !ideaExists && (
                  <div className="inline-flex items-center gap-1.5 mb-6 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    Original idea has been deleted.
                  </div>
                )}

                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                  {experiment.description}
                </p>
              </div>

              {/* Core Details Grid */}
              <div className="grid gap-6 md:grid-cols-1 mb-12">
                <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/10 transition-all hover:bg-amber-500/10">
                  <div className="flex items-center gap-2 mb-3 text-amber-500">
                    <Lightbulb className="w-5 h-5" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Hypothesis</h3>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-lg">
                    {experiment.hypothesis}
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/10 transition-all hover:bg-emerald-500/10">
                  <div className="flex items-center gap-2 mb-3 text-emerald-500">
                    <Target className="w-5 h-5" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Success Metric</h3>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-lg">
                    {experiment.successMetric}
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-rose-500/5 border border-rose-500/10 transition-all hover:bg-rose-500/10">
                  <div className="flex items-center gap-2 mb-3 text-rose-500">
                    <ShieldAlert className="w-5 h-5" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Falsifiability</h3>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-lg">
                    {experiment.falsifiability}
                  </p>
                </div>
              </div>

              {/* Action Area (Pushed to bottom) */}
              <div className="mt-auto pt-8 border-t border-black/10 dark:border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Current Progress: <strong className="text-slate-900 dark:text-white">{experiment.progress}%</strong>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {experiment.status !== "completed" ? (
                      <>
                        <Button
                          onClick={() => updateStatus("in-progress")}
                          disabled={experiment.status === "in-progress"}
                          className={`flex items-center gap-2 px-6 ${experiment.status === "in-progress" ? "opacity-50" : ""}`}
                          variant="secondary"
                        >
                          <Play className="w-4 h-4" />
                          Start Experiment
                        </Button>

                        <Button
                          onClick={() => updateStatus("completed")}
                          disabled={experiment.status === "planned"}
                          className={`flex items-center gap-2 px-6 ${experiment.status === "planned" ? "opacity-50" : "bg-green-600 hover:bg-green-700 text-white"}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Complete & Log Outcome
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => router.push(`/outcomes?experimentId=${experiment.id}`)}
                        className="flex items-center gap-2 px-8"
                      >
                        
                        View Outcome
                      </Button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </MagicCard>
        </div>
      </PageLayout>
    </>
  );
}
