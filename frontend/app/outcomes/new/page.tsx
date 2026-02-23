"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PageLayout } from "@/app/community/PageLayout";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { apiFetch } from "@/app/lib/api";
import { RetroGrid } from "@/components/ui/retro-grid";
import { ArrowLeft } from "lucide-react";

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

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RetroGrid />
      </div>

      <PageLayout>
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <MagicCard
            className="p-[1px] rounded-2xl w-full max-w-xl"
            gradientColor="rgba(59,130,246,0.6)"
          >
            <div className="relative bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-10 border border-white/10 space-y-8">

              {/* Back Arrow */}
              <button
                onClick={() => router.back()}
                className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition"
              >
                <ArrowLeft size={20} />
              </button>

              <h1 className="text-2xl font-bold text-center">
                Create Outcome
              </h1>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium">
                    Result
                  </label>

                  <select
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none"
                  >
                    <option>Success</option>
                    <option>Mixed</option>
                    <option>Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Notes (optional)
                  </label>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none"
                  />
                </div>
              </div>

              {/* Equal Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Creating..." : "Create Outcome"}
                </Button>
              </div>

            </div>
          </MagicCard>
        </div>
      </PageLayout>
    </>
  );
}