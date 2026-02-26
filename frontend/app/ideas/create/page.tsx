"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "../../community/PageLayout";
import Button from "@/app/components/ui/Button";
import { RetroGrid } from "@/components/ui/retro-grid";
import { MagicCard } from "@/components/ui/magic-card";

const API_BASE_URL = "http://localhost:5000";

const TITLE_LIMIT = 80;
const DESC_LIMIT = 500;

export default function CreateIdeaPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complexity, setComplexity] = useState("MEDIUM");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent, publish: boolean = true) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endpoint = publish ? "/ideas" : "/ideas/drafts";

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, complexity })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create idea");
      }

      if (publish) {
        router.push("/ideas");
      } else {
        router.push("/ideas/drafts");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    handleSubmit(e, false);
  };

  const handlePublish = (e: React.FormEvent) => {
    handleSubmit(e, true);
  };

  return (
    <PageLayout>
      {/* Retro background — no heavy overlay so it stays visible */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RetroGrid />
      </div>

      <div className="section max-w-2xl mx-auto relative">

        {/* Back button — lift-off blue style like your home button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push("/ideas")}
            className="primary"
          >
            ← Back to Ideas
          </Button>

        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Create a New Idea
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Share something the community can explore and experiment with.
        </p>

        <MagicCard
          gradientColor="rgba(99,102,241,0.8)"
          className="
    p-8
    rounded-3xl
    bg-white/75 dark:bg-zinc-900/70
    backdrop-blur-xl
    border border-gray-200 dark:border-white/10
    shadow-xl
  "
        >


          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                Title
              </label>

              <input
                type="text"
                maxLength={TITLE_LIMIT}
                className="
                  w-full p-3 rounded-xl
                  bg-white dark:bg-zinc-950
                  text-gray-900 dark:text-white
                  border border-gray-300 dark:border-zinc-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                placeholder="Enter idea title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>{title.trim() === "" ? 0 : title.trim().split(/\s+/).length} words</span>
                <span>{title.length}/{TITLE_LIMIT} chars</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                Description
              </label>

              <textarea
                rows={5}
                maxLength={DESC_LIMIT}
                className="
                  w-full p-3 rounded-xl
                  bg-white dark:bg-zinc-950
                  text-gray-900 dark:text-white
                  border border-gray-300 dark:border-zinc-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                placeholder="Describe your idea in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>{description.trim() === "" ? 0 : description.trim().split(/\s+/).length} words</span>
                <span>{description.length}/{DESC_LIMIT} chars</span>
              </div>
            </div>

            {/* Complexity */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-800 dark:text-gray-200">
                Complexity
              </label>
              <div className="flex gap-4">
                {["LOW", "MEDIUM", "HIGH"].map((level) => (
                  <label key={level} className="flex-1 cursor-pointer group">
                    <input
                      type="radio"
                      name="complexity"
                      value={level}
                      checked={complexity === level}
                      onChange={(e) => setComplexity(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`
                      p-3 rounded-xl text-center border transition-all duration-200
                      ${complexity === level
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-105"
                        : "bg-white dark:bg-zinc-950 border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-blue-500"}
                    `}>
                      <span className="text-xs font-bold">{level}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit — same lift-off style */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex-1 rounded-full px-6 py-3 text-base font-normal tracking-tight"
              >
                {loading ? "Saving..." : "Save as Draft"}
              </Button>


              <Button
                type="button"
                variant="primary"
                onClick={handlePublish}
                disabled={loading}
                className="flex-1 rounded-full px-6 py-3 text-base font-normal tracking-tight"
              >
                {loading ? "Publishing..." : "+ Publish Idea"}
              </Button>

            </div>


          </form>
        </MagicCard>
      </div>
    </PageLayout>
  );
}
