"use client";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { PageLayout } from "../community/PageLayout";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import BackButton from "../components/BackButton";
import BulbSvg from "@/components/ui/bulb-svg";
import { useRouter } from "next/navigation";
import TrashIcon from "@/components/ui/trash-icon";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteIdea, setDeleteIdea] = useState<Idea | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        setError(null);
        const ideasData = await apiFetch<Idea[]>("/ideas");
        setIdeas(ideasData);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  /* close modal on ESC */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDeleteIdea(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleDelete = async () => {
    if (!deleteIdea || deleting) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `http://localhost:5000/ideas/${deleteIdea.id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      setIdeas(prev => prev.filter(i => i.id !== deleteIdea.id));
      setDeleteIdea(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete idea");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading ideas..." />
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
        <div className="mb-8">
          <div className="mb-4">
            <BackButton />
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <BulbSvg className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold text-black dark:text-white">
                Ideas in EchoRoom
              </h1>
            </div>

            <Button onClick={() => router.push("/ideas/create")}>
              + Create Idea
            </Button>
          </div>

          <p className="text-lg max-w-2xl text-black dark:text-white">
            Ideas are the starting point of learning. Communities can share ideas,
            explore them through experiments, and reflect on outcomes.
          </p>
        </div>

        {ideas.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard
              className="p-[1px] rounded-xl w-full"
              gradientColor="rgba(59,130,246,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 px-10 py-12 text-center">
                <BulbSvg className="w-10 h-10 mx-auto mb-5 text-blue-400 opacity-80" />

                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  No ideas yet
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-7">
                  Every great project starts with a single idea.
                  Be the first to share something and spark discussion.
                </p>

                <Button onClick={() => router.push("/ideas/create")}>
                  + Create First Idea
                </Button>
              </div>
            </MagicCard>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <MagicCard
                key={idea.id}
                className="p-[1px] rounded-xl relative group"
                gradientColor="rgba(59,130,246,0.6)"
              >
                <div className="relative p-5 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10">
                  
                  <button
                    onClick={() => setDeleteIdea(idea)}
                    className="absolute top-5 right-5 p-2 text-red-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>

                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                    {idea.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-100 text-sm mb-4">
                    {idea.description}
                  </p>

                  <div className="text-sm text-gray-400">
                    Status: {idea.status}
                  </div>
                </div>
              </MagicCard>
            ))}
          </div>
        )}
      </div>

      {deleteIdea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteIdea(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MagicCard
              className="p-[1px] rounded-2xl"
              gradientColor="rgba(59,130,246,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl px-7 py-7 w-[380px]">

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-black dark:text-white">
                    Delete Idea
                  </h2>

                  <p className="text-slate-600 dark:text-slate-200 text-sm mt-2 leading-relaxed">
                    "{deleteIdea.title}" will be permanently removed.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    className={`w-full ${deleting ? "opacity-50 pointer-events-none" : ""}`}
                    onClick={() => setDeleteIdea(null)}
                  >
                    Cancel
                  </Button>

                  <Button
                    className={`w-full ${deleting ? "opacity-50 pointer-events-none" : ""}`}
                    onClick={handleDelete}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </MagicCard>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
