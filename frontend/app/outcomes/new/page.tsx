"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PageLayout } from "@/app/community/PageLayout";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { apiFetch } from "@/app/lib/api";
import { RetroGrid } from "@/components/ui/retro-grid";
import { ArrowLeft, CheckCircle, XCircle, MinusCircle, FileText } from "lucide-react";

export default function NewOutcomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const experimentId = searchParams.get("experimentId");

  const [result, setResult] = useState("Success");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!experimentId) return;

    try {
      setIsSubmitting(true);

      await apiFetch("/outcomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: Number(experimentId),
          result,
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

  const RESULT_OPTIONS = [
    { value: "Success", icon: <CheckCircle className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    { value: "Mixed", icon: <MinusCircle className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    { value: "Failed", icon: <XCircle className="w-5 h-5" />, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/30" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RetroGrid />
      </div>

      <PageLayout>
        <div className="flex items-center justify-center min-h-[80vh] py-10 px-4 relative z-10">
          <MagicCard
            className="p-[1px] rounded-2xl w-full max-w-2xl shadow-2xl"
            gradientColor="rgba(59,130,246,0.6)"
          >
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/20 dark:border-white/10 flex flex-col">

              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => router.back()}
                  className="p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Log Experiment Outcome
                </h1>
              </div>

              <div className="space-y-8">
                {/* Visual Status Selector */}
                <div>
                  <label className="block mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    What was the result?
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {RESULT_OPTIONS.map((opt) => {
                      const isSelected = result === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setResult(opt.value)}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected 
                              ? `${opt.border} ${opt.bg}` 
                              : "border-slate-200 dark:border-slate-700 bg-transparent hover:border-slate-300 dark:hover:border-slate-600 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className={isSelected ? opt.color : "text-slate-400"}>
                            {opt.icon}
                          </div>
                          <span className={`font-semibold ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                            {opt.value}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes Textarea */}
                <div>
                  <label className="flex items-center gap-2 mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <FileText className="w-4 h-4" />
                    Outcome Notes (Optional)
                  </label>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What did you learn? Did it validate your hypothesis?"
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-10 mt-auto border-t border-slate-200 dark:border-slate-800">
                <Button
                  onClick={() => router.back()}
                  variant="secondary"
                  className="flex-1 rounded-xl py-3"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl py-3"
                >
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