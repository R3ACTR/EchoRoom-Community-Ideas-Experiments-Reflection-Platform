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
import { ArrowLeft, Calendar, CheckCircle, XCircle, MinusCircle, FileText, HelpCircle, PenTool, Zap, Activity, SignalLow, SignalHigh, TrendingUp, TrendingDown, Eye } from "lucide-react";

interface Outcome {
  id: string;
  experimentId: string;
  experimentTitle: string;
  result: "SUCCESS" | "FAILED" | "MIXED";
  impactLevel: "LOW" | "MODERATE" | "STRONG" | "BREAKTHROUGH";
  wasExpected: boolean;
  momentum: "RISING" | "STABLE" | "DROPPING";
  notes: string;
  createdAt: string;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Unknown date";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
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

  const getResultStyle = (result?: string) => {
    switch(result) {
      case "SUCCESS": return { wrapper: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400", icon: <CheckCircle className="w-3.5 h-3.5" />, label: "Success" };
      case "FAILED": return { wrapper: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400", icon: <XCircle className="w-3.5 h-3.5" />, label: "Failed" };
      case "MIXED": return { wrapper: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400", icon: <MinusCircle className="w-3.5 h-3.5" />, label: "Mixed" };
      default: return { wrapper: "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400", icon: <HelpCircle className="w-3.5 h-3.5" />, label: "Pending" };
    }
  };

  const getImpactStyle = (impact?: string) => {
    switch(impact) {
      case "BREAKTHROUGH": return { icon: <Zap className="w-3.5 h-3.5 text-purple-500" />, label: "Breakthrough" };
      case "STRONG": return { icon: <SignalHigh className="w-3.5 h-3.5 text-blue-500" />, label: "Strong" };
      case "MODERATE": return { icon: <Activity className="w-3.5 h-3.5 text-amber-500" />, label: "Moderate" };
      case "LOW": return { icon: <SignalLow className="w-3.5 h-3.5 text-slate-400" />, label: "Low" };
      default: return { icon: <Activity className="w-3.5 h-3.5 text-slate-400" />, label: "Unknown" };
    }
  };

  const getMomentumConfig = (momentum?: string) => {
    switch(momentum) {
      case "RISING": return { text: "Momentum: RISING", desc: "This experiment is moving in the right direction.", icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400", border: "border-l-4 border-l-emerald-500" };
      case "DROPPING": return { text: "Momentum: DROPPING", desc: "Results suggest a need to pivot or re-evaluate.", icon: <TrendingDown className="w-5 h-5 text-rose-500" />, bg: "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400", border: "border-l-4 border-l-rose-500" };
      default: return { text: "Momentum: STABLE", desc: "Metrics are holding steady for now.", icon: <MinusCircle className="w-5 h-5 text-blue-500" />, bg: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400", border: "border-l-4 border-l-blue-500" };
    }
  };

  if (loading) return <PageLayout><LoadingState message="Loading outcomes..." /></PageLayout>;
  if (error) return <PageLayout><ErrorState message={error} /></PageLayout>;

  return (
    <PageLayout>
      <div className="section animate-in fade-in duration-500">
        
        {/* Header Area */}
        <div className="mb-10">
          <div className="mb-6">
            <Button onClick={() => router.push("/experiments")} variant="secondary" className="text-sm">
              ← Back to experiments
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <ChartLineIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Outcomes</h1>
          </div>
          <p className="text-lg max-w-2xl text-slate-600 dark:text-slate-300">
            Review experiment results, measure impact, and reflect on what moved the needle.
          </p>
        </div>

        {outcomes.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard className="p-[1px] rounded-2xl w-full" gradientColor="rgba(59,130,246,0.5)">
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 px-10 py-16 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-blue-500/10 border border-blue-500/20">
                  <ChartLineIcon className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">No outcomes yet</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed mb-8">Complete experiments to log their results and start generating insights here.</p>
                <Button onClick={() => router.push("/experiments")} className="rounded-xl px-8 py-3 shadow-lg shadow-blue-500/20">
                  View Active Experiments
                </Button>
              </div>
            </MagicCard>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((outcome) => {
              const resStyle = getResultStyle(outcome.result);
              const impStyle = getImpactStyle(outcome.impactLevel);
              const momStyle = getMomentumConfig(outcome.momentum);
              
              return (
                <div key={outcome.id} onClick={() => setSelectedOutcome(outcome)} className="cursor-pointer group h-full flex flex-col">
                  <MagicCard className="p-[1px] rounded-2xl relative h-full flex-grow transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10" gradientColor="rgba(59,130,246,0.3)">
                    <div className={`p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/5 h-full flex flex-col overflow-hidden ${momStyle.border}`}>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {outcome.experimentTitle}
                        </h3>
                      </div>

                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${resStyle.wrapper}`}>
                          {resStyle.icon} {resStyle.label}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {impStyle.icon} {impStyle.label}
                        </span>
                      </div>

                      {/* Notes Preview */}
                      <div className="flex-grow mb-5">
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {outcome.notes?.trim() ? outcome.notes : <span className="italic opacity-60">No notes recorded.</span>}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {formatDate(outcome.createdAt)}
                        </div>
                        <div className="flex items-center text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                          View Details <ArrowLeft className="w-3.5 h-3.5 ml-1 rotate-180" />
                        </div>
                      </div>

                    </div>
                  </MagicCard>
                </div>
              );
            })}
          </div>
        )}

        {/* Premium Outcome Modal */}
        {selectedOutcome && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6" onClick={() => setSelectedOutcome(null)}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl animate-in zoom-in-95 fade-in duration-200">
              <MagicCard className="p-[1px] rounded-3xl w-full shadow-2xl" gradientColor="rgba(59,130,246,0.6)">
                <div className="bg-white dark:bg-[#0B1120] rounded-3xl flex flex-col max-h-[90vh] overflow-hidden">
                  
                  {/* Momentum Banner (Top) */}
                  <div className={`px-6 py-4 flex items-center gap-3 border-b border-white/10 ${getMomentumConfig(selectedOutcome.momentum).bg}`}>
                    {getMomentumConfig(selectedOutcome.momentum).icon}
                    <div>
                      <h4 className="font-bold text-sm tracking-wide">{getMomentumConfig(selectedOutcome.momentum).text}</h4>
                      <p className="text-xs opacity-80 mt-0.5">{getMomentumConfig(selectedOutcome.momentum).desc}</p>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white pr-8 tracking-tight leading-tight">
                        {selectedOutcome.experimentTitle}
                      </h2>
                      <button onClick={() => setSelectedOutcome(null)} className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors absolute top-20 right-6 bg-white dark:bg-[#0B1120]">
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Result</p>
                        <div className={`inline-flex items-center gap-1.5 font-semibold text-sm ${getResultStyle(selectedOutcome.result).wrapper.replace('border', '').replace('bg-', 'text-')}`}>
                          {getResultStyle(selectedOutcome.result).icon} {getResultStyle(selectedOutcome.result).label}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Impact</p>
                        <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-900 dark:text-white">
                          {getImpactStyle(selectedOutcome.impactLevel).icon} {getImpactStyle(selectedOutcome.impactLevel).label}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 col-span-2 md:col-span-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Expected?</p>
                        <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-900 dark:text-white">
                          {selectedOutcome.wasExpected ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Eye className="w-4 h-4 text-amber-500" />}
                          {selectedOutcome.wasExpected ? "Yes, validated" : "No, surprising"}
                        </div>
                      </div>
                    </div>

                    {/* Notes Area */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-bold tracking-wide">Analyst Notes</span>
                      </div>
                      <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                          {selectedOutcome.notes?.trim() ? selectedOutcome.notes : <span className="italic text-slate-400">No notes were recorded for this outcome.</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/20">
                    <Button onClick={() => router.push(`/reflection/new?outcomeId=${selectedOutcome.id}`)} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.01]">
                      <PenTool className="w-4 h-4" /> Write Final Reflection
                    </Button>
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
