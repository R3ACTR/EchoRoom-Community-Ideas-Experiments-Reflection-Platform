"use client";

import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { PageLayout } from "../../community/PageLayout";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import BackButton from "../../components/BackButton";
import BulbSvg from "@/components/ui/bulb-svg";
import { useRouter } from "next/navigation";
import TrashIcon from "@/components/ui/trash-icon";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import FileDescriptionIcon from "@/components/ui/file-description-icon";

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
}

const API_BASE_URL = "http://localhost:5000";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDraft, setDeleteDraft] = useState<Idea | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        setError(null);
        const draftsData = await apiFetch<Idea[]>("/ideas/drafts");
        setDrafts(draftsData);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDeleteDraft(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleDelete = async () => {
    if (!deleteDraft || deleting) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `${API_BASE_URL}/ideas/${deleteDraft.id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      setDrafts(prev => prev.filter(i => i.id !== deleteDraft.id));
      setDeleteDraft(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete draft");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading drafts..." />
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
              <FileDescriptionIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              <h1 className="text-4xl font-bold text-black dark:text-white">
                My Drafts
              </h1>
            </div>

            <Button onClick={() => router.push("/ideas/create")}>
              + New Draft
            </Button>
          </div>

          <p className="text-lg max-w-2xl text-black dark:text-white">
            Drafts are private ideas that you can refine and publish later.
          </p>
        </div>

        {drafts.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard
              className="p-[1px] rounded-xl w-full"
              gradientColor="rgba(107,114,128,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 px-10 py-12 text-center">
                <FileDescriptionIcon className="w-10 h-10 mx-auto mb-5 text-gray-400 opacity-80" />

                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  No drafts yet
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-7">
                  Save your ideas as drafts to refine them before publishing.
                </p>

                <Button onClick={() => router.push("/ideas/create")}>
                  + Create Draft
                </Button>
              </div>
            </MagicCard>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="cursor-pointer"
                onClick={() => router.push(`/ideas/drafts/${draft.id}`)}
              >
              <MagicCard
                className="p-[1px] rounded-xl relative group"
                gradientColor="rgba(107,114,128,0.6)"
              >
                <div className="relative p-5 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10">
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteDraft(draft);
                    }}
                    className="absolute top-5 right-5 p-2 text-red-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>

                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                    {draft.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-100 text-sm mb-4 line-clamp-3">
                    {draft.description}
                  </p>

                  <div className="text-sm text-gray-400">
                    Status: {draft.status}
                  </div>
                </div>
              </MagicCard>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteDraft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteDraft(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MagicCard
              className="p-[1px] rounded-2xl"
              gradientColor="rgba(107,114,128,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl px-7 py-7 w-[380px]">

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-black dark:text-white">
                    Delete Draft
                  </h2>

                  <p className="text-slate-600 dark:text-slate-200 text-sm mt-2 leading-relaxed">
                    "{deleteDraft.title}" will be permanently removed.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    className={`w-full ${deleting ? "opacity-50 pointer-events-none" : ""}`}
                    onClick={() => setDeleteDraft(null)}
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
