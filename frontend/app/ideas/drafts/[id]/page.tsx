"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageLayout } from "../../../community/PageLayout";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { RetroGrid } from "@/components/ui/retro-grid";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:5000";

const TITLE_LIMIT = 80;
const DESC_LIMIT = 500;

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function DraftDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        setFetching(true);
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

        setTitle(draft.title);
        setDescription(draft.description);
      } catch (err: any) {
        setError(err.message || "Failed to load draft");
      } finally {
        setFetching(false);
      }
    };

    if (!isNaN(id)) {
      fetchDraft();
    }
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/ideas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save draft");
      }

      router.push("/ideas/drafts");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await fetch(`${API_BASE_URL}/ideas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
      });

      const res = await fetch(`${API_BASE_URL}/ideas/${id}/publish`, {
        method: "PATCH"
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to publish draft");
      }

      router.push("/ideas");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RetroGrid />
      </div>

      <div className="section max-w-2xl mx-auto relative">

        <div className="mb-6">
          <Button
            onClick={() => router.push("/ideas/drafts")}
            className="
              rounded-full
              px-6 py-2
              text-sm font-medium
              bg-gradient-to-br from-[#3A9AFF] via-[#2F7CF6] to-[#0992C2]
              text-white
              shadow-[0_8px_20px_rgba(0,0,0,0.25)]
              hover:-translate-y-0.5 hover:scale-[1.03]
              transition-all
            "
          >
            ← Back to Drafts
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Edit Draft
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Refine your idea and publish when ready.
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

          <form onSubmit={handleSave} className="space-y-6">

            {error && title && description && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

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

              <div className="text-xs text-right mt-1 text-gray-500">
                {title.length}/{TITLE_LIMIT}
              </div>
            </div>

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

              <div className="text-xs text-right mt-1 text-gray-500">
                {description.length}/{DESC_LIMIT}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="
                  flex-1
                  rounded-full
                  text-sm font-medium
                  bg-gray-500 hover:bg-gray-600
                  text-white
                  shadow-[0_8px_20px_rgba(0,0,0,0.25)]
                  hover:-translate-y-0.5 hover:scale-[1.03]
                  transition-all
                "
              >
                {loading ? "Saving..." : "Save Draft"}
              </Button>

              <Button
                type="button"
                disabled={loading}
                onClick={handlePublish}
                className="
                  flex-1
                  rounded-full
                  text-sm font-medium
                  bg-gradient-to-br from-[#3A9AFF] via-[#2F7CF6] to-[#0992C2]
                  text-white
                  shadow-[0_8px_20px_rgba(0,0,0,0.25)]
                  hover:-translate-y-0.5 hover:scale-[1.03]
                  transition-all
                "
              >
                {loading ? "Publishing..." : "Publish Now"}
              </Button>
            </div>

          </form>
        </MagicCard>
      </div>
    </PageLayout>
  );
}
