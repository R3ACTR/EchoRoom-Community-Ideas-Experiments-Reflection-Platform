"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { PageLayout } from "@/app/community/PageLayout";
import LoadingState from "@/app/components/LoadingState";
import ErrorState from "@/app/components/ErrorState";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { RetroGrid } from "@/components/ui/retro-grid";

interface Experiment {
  id: number;
  title: string;
  description: string;
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

      // NEW: Check linked idea
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
    const progressValue =
      status === "in-progress" ? 50 : 100;

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

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading experiment..." />
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
    <div className="flex justify-center py-16">
      <MagicCard
        className="p-[1px] rounded-2xl w-full max-w-3xl"
        gradientColor="rgba(59,130,246,0.6)"
      >
        <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-10 border border-white/10 space-y-8">

          <Button onClick={() => router.push("/experiments")}>
            ← Back to Experiments
          </Button>

          <div>
            <h1 className="text-3xl font-bold mb-3">
  {experiment.title}
</h1>

{/* Linked Idea Display */}
{experiment.linkedIdeaId && ideaExists && ideaTitle && (
  <div className="mb-4 text-sm text-blue-500 hover:underline cursor-pointer"
       onClick={() => router.push(`/ideas/${experiment.linkedIdeaId}`)}>
    Linked Idea: {ideaTitle}
  </div>
)}

{/* Deleted Idea Warning */}
{experiment.linkedIdeaId && !ideaExists && (
  <div className="mb-4 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm">
    ⚠ Original idea has been deleted.
  </div>
)}

<p className="text-gray-600 dark:text-gray-300">
  {experiment.description}
</p>
          </div>

          <div className="space-y-4">
            <div className="text-lg font-medium">
              Status:{" "}
              <span
                className={
                  experiment.status === "completed"
                    ? "text-green-500"
                    : "text-blue-400"
                }
              >
                {experiment.status}
              </span>
            </div>

            {experiment.status !== "completed" ? (
              <div className="flex gap-4">
                <Button
                  onClick={() => updateStatus("in-progress")}
                  disabled={experiment.status === "in-progress"}
                >
                  Mark In Progress
                </Button>

                <Button
                  onClick={() => updateStatus("completed")}
                  disabled={experiment.status === "planned"}
                >
                  Mark Completed
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button
                  onClick={() =>
                    router.push(`/outcomes?experimentId=${experiment.id}`)
                  }
                >
                  View Outcome
                </Button>
              </div>
            )}
          </div>

        </div>
      </MagicCard>
    </div>
  </PageLayout>
  </>
);
}