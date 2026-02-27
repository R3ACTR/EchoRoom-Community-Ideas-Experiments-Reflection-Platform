"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageLayout } from "../../../community/PageLayout";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import Button from "@/app/components/ui/Button";
import { RetroGrid } from "@/components/ui/retro-grid";
import { MagicCard } from "@/components/ui/magic-card";

const API_BASE_URL = "http://localhost:5000";

const TITLE_LIMIT = 80;
const DESC_LIMIT = 500;

interface Idea {
  id: string;
  title: string;
  description: string;
  status: string;
  version: number;
  complexity?: string;
  goal?: string;
  category?: string;
  expectedImpact?: string;
  effort?: string;
  timeHorizon?: string;
}

const FormLabel = ({ text, required = false }: { text: string; required?: boolean }) => (
  <div className="flex justify-between items-end mb-2">
    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
      {text} {required && <span className="text-blue-500 ml-1">*</span>}
    </label>
    {!required && (
      <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Optional
      </span>
    )}
  </div>
);

export default function DraftDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complexity, setComplexity] = useState("MEDIUM");
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState("");
  const [expectedImpact, setExpectedImpact] = useState("");
  const [effort, setEffort] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [version, setVersion] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/ideas/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Draft not found");
        }

        const draft: Idea = data.idea;

        if (draft.status !== "draft") {
          router.push(`/ideas/${id}`);
          return;
        }

        setTitle(draft.title || "");
        setDescription(draft.description || "");
        setComplexity(draft.complexity || "MEDIUM");
        setGoal(draft.goal || "");
        setCategory(draft.category || "");
        setExpectedImpact(draft.expectedImpact || "");
        setEffort(draft.effort || "");
        setTimeHorizon(draft.timeHorizon || "");
        setVersion(draft.version);
      } catch (err: any) {
        setError(err.message || "Failed to load draft");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchDraft();
  }, [id, router]);

  const buildPayload = () => ({
    title,
    description,
    complexity,
    goal,
    category,
    expectedImpact,
    effort,
    timeHorizon,
    version,
  });

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || version === null) {
      setError("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/ideas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save draft");
      }

      setVersion(data.idea.version);
      router.push("/ideas/drafts");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !description.trim() || version === null) {
      setError("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const saveRes = await fetch(`${API_BASE_URL}/ideas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.message || "Failed to save draft");
      }

      const publishRes = await fetch(`${API_BASE_URL}/ideas/${id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: saveData.idea.version }),
      });

      const publishData = await publishRes.json();

      if (!publishRes.ok || !publishData.success) {
        throw new Error(publishData.message || "Failed to publish draft");
      }

      router.push("/ideas");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const baseInputStyle = `
    w-full p-3.5 rounded-xl transition-all duration-200
    bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md
    text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600
    border border-gray-300/80 dark:border-white/10
    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
    shadow-sm hover:border-gray-400 dark:hover:border-white/20
  `;

  const selectStyle = `
    ${baseInputStyle}
    appearance-none cursor-pointer
    pr-10
  `;

  if (fetching) {
    return (
      <PageLayout>
        <LoadingState message="Loading draft..." />
      </PageLayout>
    );
  }

  if (error && !title && !description) {
    return (
      <PageLayout>
        <ErrorState message={error} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
        <RetroGrid />
      </div>

      <div className="section max-w-3xl mx-auto relative z-10 pb-20">
        <div className="mb-8 mt-4">
          <Button onClick={() => router.push("/ideas/drafts")} className="primary mb-6">
            ← Back to Drafts
          </Button>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-gray-900 dark:text-white">
            Edit Draft
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Refine your idea and publish when ready.
          </p>
        </div>

        <MagicCard
          gradientColor="rgba(99,102,241,0.15)"
          className="p-8 sm:p-10 rounded-[2rem] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl shadow-blue-900/5"
        >
          <form className="space-y-8">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <FormLabel text="Title" required />
                <input
                  type="text"
                  maxLength={TITLE_LIMIT}
                  className={baseInputStyle}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="flex justify-between text-[11px] font-medium mt-2 text-gray-500">
                  <span>{title.trim() === "" ? 0 : title.trim().split(/\s+/).length} words</span>
                  <span>{title.length}/{TITLE_LIMIT} chars</span>
                </div>
              </div>

              <div>
                <FormLabel text="Description" required />
                <textarea
                  rows={5}
                  maxLength={DESC_LIMIT}
                  className={`${baseInputStyle} resize-none`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex justify-between text-[11px] font-medium mt-2 text-gray-500">
                  <span>{description.trim() === "" ? 0 : description.trim().split(/\s+/).length} words</span>
                  <span>{description.length}/{DESC_LIMIT} chars</span>
                </div>
              </div>

              <div>
                <FormLabel text="Complexity" required />
                <div className="flex gap-4">
                  {["LOW", "MEDIUM", "HIGH"].map((level) => (
                    <label key={level} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        value={level}
                        checked={complexity === level}
                        onChange={(e) => setComplexity(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-xl border-2 text-center ${
                          complexity === level
                            ? "bg-blue-600/10 border-blue-600 text-blue-700 dark:text-blue-400"
                            : "bg-white/50 dark:bg-zinc-950/50 border-transparent"
                        }`}
                      >
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200 dark:border-white/10 space-y-6">
              <div>
                <FormLabel text="Goal / Purpose" />
                <input className={baseInputStyle} value={goal} onChange={(e) => setGoal(e.target.value)} />
              </div>

              <div>
                <FormLabel text="Category / Domain" />
                <input className={baseInputStyle} value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <FormLabel text="Expected Impact" />
                  <select className={selectStyle} value={expectedImpact} onChange={(e) => setExpectedImpact(e.target.value)}>
                    <option value="">Select impact...</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Game-Changing">Game-Changing</option>
                  </select>
                </div>

                <div>
                  <FormLabel text="Effort Estimate" />
                  <select className={selectStyle} value={effort} onChange={(e) => setEffort(e.target.value)}>
                    <option value="">Select effort...</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <FormLabel text="Time Horizon" />
                  <select className={selectStyle} value={timeHorizon} onChange={(e) => setTimeHorizon(e.target.value)}>
                    <option value="">Select timeframe...</option>
                    <option value="Short-term">Short-term</option>
                    <option value="Mid-term">Mid-term</option>
                    <option value="Long-term">Long-term</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-8 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSave} disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save Draft"}
              </Button>

              <Button onClick={handlePublish} disabled={loading} className="flex-[2]">
                {loading ? "Publishing..." : "Publish Now "}
              </Button>
            </div>
          </form>
        </MagicCard>
      </div>
    </PageLayout>
  );
}