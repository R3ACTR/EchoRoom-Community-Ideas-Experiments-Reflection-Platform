"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import BackButton from "../components/BackButton";
import BulbSvg from "@/components/ui/bulb-svg";
import { useRouter } from "next/navigation";
import TrashIcon from "@/components/ui/trash-icon";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { Search, Filter, Share2 } from "lucide-react";
import { PageLayout } from "../community/PageLayout";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "New":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "In Progress":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "Implemented":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Discarded":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteIdea, setDeleteIdea] = useState<Idea | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || idea.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
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

      await apiFetch(`/ideas/${deleteIdea.id}`, { method: "DELETE" });

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

            <div className="flex gap-3">
              <Button 
                onClick={() => router.push("/ideas/drafts")}
                className="rounded-full bg-gray-500 hover:bg-gray-600 text-white"
              >
                My Drafts
              </Button>
              <Button onClick={() => router.push("/ideas/create")}>
                + Create Idea
              </Button>
            </div>
          </div>

          <p className="text-lg max-w-2xl text-black dark:text-white mb-8">
            Ideas are the starting point of learning. Communities can share ideas,
            explore them through experiments, and reflect on outcomes.
          </p>

          {/* Search and Filter */}
          <MagicCard
  className="p-[1px] rounded-2xl mb-8"
  gradientColor="rgba(59,130,246,0.6)"
>
  <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10">
    
    {/* Search */}
    <div className="relative flex-1">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search ideas..."
        className="
          w-full pl-10 pr-4 py-2.5
          bg-transparent
          text-black dark:text-white
          border border-white/10
          rounded-xl
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    {/* Filter */}
    <div className="relative">
      <Filter
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <select
        className="
          pl-10 pr-8 py-2.5
          bg-transparent
          text-black dark:text-white
          border border-white/10
          rounded-xl
          appearance-none
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="New">New</option>
        <option value="In Progress">In Progress</option>
        <option value="Implemented">Implemented</option>
        <option value="Discarded">Discarded</option>
      </select>
    </div>

  </div>
</MagicCard>

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
        ) : filteredIdeas.length === 0 ? (
          /* Empty State - No matches */
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              No matching ideas found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
              }}
              className="mt-4 text-blue-600 hover:underline dark:text-blue-400"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <MagicCard
                key={idea.id}
                className="p-[1px] rounded-xl relative group"
                gradientColor="rgba(59,130,246,0.6)"
              >
                <div className="relative p-5 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 h-full flex flex-col">
                  <button
                    onClick={() => setDeleteIdea(idea)}
                    className="absolute top-5 right-5 p-2 text-red-400 hover:text-red-600 z-10"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>

                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2 pr-8">
                    {idea.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-100 text-sm mb-4 flex-grow">
                    {idea.description}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-400 mt-auto pt-4 border-t border-white/10">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(idea.status)}`}>
                      {idea.status}
                    </span>
                    <button
                      onClick={() => {
                        const shareText = `Check out this idea: ${idea.title}`;
                        const shareUrl = `${window.location.origin}/ideas`;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors cursor-pointer"
                      title="Share on Twitter"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline font-medium text-xs">Share</span>
                    </button>
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
