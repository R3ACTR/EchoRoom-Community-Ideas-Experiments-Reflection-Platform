"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { PageLayout } from "@/app/community/PageLayout";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { apiFetch } from "@/app/lib/api";
import { RetroGrid } from "@/components/ui/retro-grid";
import { ArrowLeft, CheckCircle, XCircle, MinusCircle, FileText, Zap, Target, SignalHigh, SignalLow, TrendingUp, TrendingDown, Activity } from "lucide-react";

type ResultType = "SUCCESS" | "MIXED" | "FAILED";
type ImpactType = "LOW" | "MODERATE" | "STRONG" | "BREAKTHROUGH";

export default function NewOutcomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const experimentId = searchParams.get("experimentId");

  const [result, setResult] = useState<ResultType>("SUCCESS");
  const [impactLevel, setImpactLevel] = useState<ImpactType>("MODERATE");
  const [wasExpected, setWasExpected] = useState<boolean>(true);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamically calculate momentum based on result + impact
  const momentum = useMemo(() => {
    if (result === "SUCCESS" && (impactLevel === "STRONG" || impactLevel === "BREAKTHROUGH")) return "RISING";
    if (result === "FAILED" && (impactLevel === "STRONG" || impactLevel === "BREAKTHROUGH")) return "DROPPING";
    if (result === "SUCCESS" && impactLevel === "MODERATE") return "RISING";
    return "STABLE";
  }, [result, impactLevel]);

  const handleSubmit = async () => {
    if (!experimentId) return;

    try {
      setIsSubmitting(true);
      await apiFetch("/outcomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: experimentId,
          result,
          impactLevel,
          wasExpected,
          momentum,
          notes,
        }),
      });
      router.push("/outcomes");
    } catch (err: any) {
      alert(err.message || "Failed to create outcome");
    } finally {
      setIsSubmitting(false);
    }
  };

  const RESULT_OPTIONS: { value: ResultType; label: string; icon: any; color: string; bg: string; border: string }[] = [
    { value: "SUCCESS", label: "Success", icon: <CheckCircle className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30 dark:border-emerald-500/30" },
    { value: "MIXED", label: "Mixed", icon: <MinusCircle className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30 dark:border-amber-500/30" },
    { value: "FAILED", label: "Failed", icon: <XCircle className="w-5 h-5" />, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/30 dark:border-rose-500/30" },
  ];

  const IMPACT_OPTIONS: { value: ImpactType; label: string; icon: any }[] = [
    { value: "LOW", label: "Low", icon: <SignalLow className="w-4 h-4" /> },
    { value: "MODERATE", label: "Moderate", icon: <Activity className="w-4 h-4" /> },
    { value: "STRONG", label: "Strong", icon: <SignalHigh className="w-4 h-4" /> },
    { value: "BREAKTHROUGH", label: "Breakthrough", icon: <Zap className="w-4 h-4" /> },
  ];

  const getMomentumDisplay = () => {
    if (momentum === "RISING") return { text: "This outcome suggests rising momentum 🚀", icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" };
    if (momentum === "DROPPING") return { text: "Momentum appears to be dropping 📉", icon: <TrendingDown className="w-5 h-5 text-rose-500" />, bg: "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400" };
    return { text: "Momentum appears stable ⚖️", icon: <MinusCircle className="w-5 h-5 text-blue-500" />, bg: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400" };
  };

  const momentumDisplay = getMomentumDisplay();

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RetroGrid />
      </div>

      <PageLayout>
        <div className="flex items-center justify-center min-h-[85vh] py-12 px-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MagicCard
            className="p-[1px] rounded-2xl w-full max-w-2xl shadow-2xl"
            gradientColor="rgba(59,130,246,0.3)"
          >
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 md:p-10 border border-white/20 dark:border-white/10 flex flex-col">

              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => router.back()}
                  className="p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Log Experiment Outcome
                </h1>
              </div>

              {/* Dynamic Momentum Banner */}
              <div className={`flex items-center gap-3 p-4 mb-8 rounded-xl border ${momentumDisplay.bg} transition-colors duration-500`}>
                {momentumDisplay.icon}
                <span className="font-medium text-sm md:text-base">{momentumDisplay.text}</span>
              </div>

              <div className="space-y-8">
                {/* Visual Status Selector */}
                <div>
                  <label className="block mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    What was the result?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {RESULT_OPTIONS.map((opt) => {
                      const isSelected = result === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setResult(opt.value)}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected 
                              ? `${opt.border} ${opt.bg} scale-[1.02] shadow-sm` 
                              : "border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className={isSelected ? opt.color : "text-slate-400"}>
                            {opt.icon}
                          </div>
                          <span className={`font-semibold text-sm ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Impact Level Selector */}
                  <div>
                    <label className="block mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Impact Level
                    </label>
                    <div className="flex flex-col gap-2">
                      {IMPACT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setImpactLevel(opt.value)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                            impactLevel === opt.value
                              ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-sm"
                              : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {opt.icon}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Was Expected Toggle */}
                  <div>
                    <label className="block mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Hypothesis Validation
                    </label>
                    <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">Was this expected?</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Did the outcome match your theory?</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWasExpected(!wasExpected)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${wasExpected ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${wasExpected ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes Textarea */}
                <div>
                  <label className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <FileText className="w-4 h-4" />
                    Outcome Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What did you learn? Document the key takeaways here..."
                    rows={4}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 resize-none shadow-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-8 mt-8 border-t border-slate-200 dark:border-slate-800">
                <Button onClick={() => router.back()} variant="secondary" className="flex-1 rounded-xl py-3">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 rounded-xl py-3 shadow-lg shadow-blue-500/20">
                  {isSubmitting ? "Saving..." : "Save Outcome"}
                </Button>
              </div>

            </div>
          </MagicCard>
        </div>
      </PageLayout>
    </>
  );
}