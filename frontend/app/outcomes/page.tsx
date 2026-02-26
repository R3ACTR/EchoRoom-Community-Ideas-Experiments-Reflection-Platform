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
import { ArrowLeft, Calendar, CheckCircle, XCircle, MinusCircle, FileText, HelpCircle, PenTool } from "lucide-react";

interface Outcome {
  id: string;
  experimentId: string;
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

  const updateResult = async (result: "Success" | "Failed" | "Mixed") => {
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

  const getResultStyle = (result?: string) => {
    if (result === "Success") {
      return {
        wrapper: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        icon: <CheckCircle className="w-3.5 h-3.5" />
      };
    }
    if (result === "Failed") {
      return {
        wrapper: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
        icon: <XCircle className="w-3.5 h-3.5" />
      };
    }
    if (result === "Mixed") {
      return {
        wrapper: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
        icon: <MinusCircle className="w-3.5 h-3.5" />
      };
    }
    return {
      wrapper: "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400",
      icon: <HelpCircle className="w-3.5 h-3.5" />
    };
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
        
        {/* Header Area */}
        <div className="mb-10">
          <div className="mb-6">
            <Button
             onClick={() => router.push("/experiments")}
             className="primary"
             >
             ← Back to experiments
           </Button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <ChartLineIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Outcomes
            </h1>
          </div>

          <p className="text-lg max-w-2xl text-slate-600 dark:text-slate-300">
            Review experiment results, measure impact, and reflect on what moved the needle.
          </p>
        </div>

        {outcomes.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard
              className="p-[1px] rounded-xl w-full"
              gradientColor="rgba(59,130,246,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 px-10 py-16 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ChartLineIcon className="w-10 h-10 mx-auto mb-5 text-blue-400 opacity-80" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  No outcomes yet
                </h3>
                <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed mb-8">
                  Complete experiments to log their results and start generating insights here.
                </p>
                <Button
                  onClick={() => router.push("/experiments")}
                  className="rounded-full px-8 py-2.5 shadow-lg shadow-blue-500/20"
                >
                  View Active Experiments
                </Button>
              </div>
            </MagicCard>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((outcome) => {
              const style = getResultStyle(outcome.result);
              
              return (
                <div
                  key={outcome.id}
                  onClick={() => setSelectedOutcome(outcome)}
                  className="cursor-pointer group h-full flex flex-col"
                >
                  <MagicCard
                    className="p-[1px] rounded-2xl relative h-full flex-grow transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                    gradientColor="rgba(59,130,246,0.4)"
                  >
                    <div className="p-6 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/5 h-full flex flex-col">

                      {/* Card Header */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
                          {outcome.experimentTitle}
                        </h3>
                      </div>

                      {/* Status Badge */}
                      <div className="mb-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${style.wrapper}`}>
                          {style.icon}
                          {outcome.result || "Pending"}
                        </span>
                      </div>

                      {/* Notes Section */}
                      <div className="flex-grow mb-5">
                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/5 h-full">
                          <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Notes</span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                            {outcome.notes?.trim() ? outcome.notes : <span className="italic text-slate-400">No notes recorded yet.</span>}
                          </p>
                        </div>
                      </div>

                      {/* Footer: Date */}
                      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-white/5 flex items-center text-slate-500 dark:text-slate-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(outcome.createdAt)}
                      </div>

                    </div>
                  </MagicCard>
                </div>
              );
            })}
          </div>
        )}

        {/* Improved Outcome Modal */}
        {selectedOutcome && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOutcome(null)}
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
              <MagicCard
                className="p-[1px] rounded-2xl w-full shadow-2xl"
                gradientColor="rgba(59,130,246,0.6)"
              >
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 flex flex-col max-h-[85vh]">
                  
                  {/* Modal Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white pr-4 mb-3">
                        {selectedOutcome.experimentTitle}
                      </h2>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getResultStyle(selectedOutcome.result).wrapper}`}>
                        {getResultStyle(selectedOutcome.result).icon}
                        {selectedOutcome.result}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedOutcome(null)}
                      className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Scrollable Notes Area */}
                  <div className="overflow-y-auto pr-2 custom-scrollbar mb-8">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-5 border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-slate-400">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Outcome Notes</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                        {selectedOutcome.notes?.trim() ? selectedOutcome.notes : <span className="italic text-slate-400">No notes were recorded for this outcome.</span>}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center mb-2">Update Status</p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => updateResult("Success")}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-green"
                        variant={selectedOutcome.result === "Success" ? "primary" : "secondary"}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Success
                      </Button>

                      <Button
                        onClick={() => updateResult("Mixed")}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                        variant={selectedOutcome.result === "Mixed" ? "primary" : "secondary"}
                      >
                        <MinusCircle className="w-4 h-4 mr-2" />
                        Mixed
                      </Button>

                      <Button
                        onClick={() => updateResult("Failed")}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-red"
                        variant={selectedOutcome.result === "Failed" ? "primary" : "secondary"}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Failed
                      </Button>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => router.push(`/reflection/new?outcomeId=${selectedOutcome.id}`)}
                        className="w-full rounded-xl py-3 flex items-center justify-center gap-2"
                      >
                        <PenTool className="w-4 h-4" />
                        Write Reflection
                      </Button>
                    </div>
                  </div>

                </div>
              </MagicCard>
            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
}
