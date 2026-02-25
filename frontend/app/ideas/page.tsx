"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../lib/api";
import { normalizeIdeaStatus } from "../../lib/validation";
import BackButton from "../components/BackButton";
import BulbSvg from "@/components/ui/bulb-svg";
import { useRouter } from "next/navigation";
import TrashIcon from "@/components/ui/trash-icon";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import {
  Check,
  Facebook,
  Filter,
  Link2,
  Linkedin,
  MessageCircle,
  Twitter,
  Layers,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Heart,
  Copy,
} from "lucide-react";
import { PageLayout } from "../community/PageLayout";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import ActionSearchBar from "@/components/ui/action-search-bar";
import HeartIcon from "@/components/ui/heart-icon";
import CopyIcon from "@/components/ui/copy-icon";

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  complexity: "LOW" | "MEDIUM" | "HIGH";
}

interface LikeData {
  [ideaId: number]: {
    count: number;
    liked: boolean;
  };
}

const STATUS_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "New", label: "New" },
  { value: "In Progress", label: "In Progress" },
  { value: "Implemented", label: "Implemented" },
  { value: "Discarded", label: "Discarded" },
];
const getStatusIcon = (status: string, isActive: boolean) => {
  const colorClass = isActive ? "text-blue-500" : "text-gray-400";
  const size = 16;

  switch (status) {
    case "All":
      return <Layers size={size} className={colorClass} />;
    case "New":
      return (
        <Sparkles
          size={size}
          className={`text-amber-400 ${isActive ? "text-blue-500" : ""}`}
        />
      );
    case "In Progress":
      return <Clock size={size} className={colorClass} />;
    case "Implemented":
      return (
        <CheckCircle2
          size={size}
          className={`text-emerald-500 ${isActive ? "text-blue-500" : ""}`}
        />
      );
    case "Discarded":
      return (
        <XCircle
          size={size}
          className={`text-rose-500 ${isActive ? "text-blue-500" : ""}`}
        />
      );
    default:
      return <Layers size={size} className={colorClass} />;
  }
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteIdea, setDeleteIdea] = useState<Idea | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [likes, setLikes] = useState<LikeData>({});
  const [likingId, setLikingId] = useState<number | null>(null);

  // Load likes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("echoroom_likes");
    if (stored) {
      try {
        setLikes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse likes", e);
      }
    }
  }, []);

  // Save likes to localStorage when they change
  const saveLikes = useCallback((newLikes: LikeData) => {
    setLikes(newLikes);
    localStorage.setItem("echoroom_likes", JSON.stringify(newLikes));
  }, []);

  // Toggle like for an idea
  const handleLike = (ideaId: number) => {
    setLikingId(ideaId);
    const currentLike = likes[ideaId] || { count: 0, liked: false };
    const newLikeState = !currentLike.liked;
    const newCount = newLikeState ? currentLike.count + 1 : Math.max(0, currentLike.count - 1);
    
    const newLikes = {
      ...likes,
      [ideaId]: {
        count: newCount,
        liked: newLikeState,
      },
    };
    saveLikes(newLikes);
    setLikingId(null);
  };

  const handleCopyLink = (id: number) => {
    const url = `${window.location.origin}/ideas/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareTwitter = (idea: Idea) => {
    const text = encodeURIComponent(`Check out this idea on EchoRoom: ${idea.title}`);
    const url = encodeURIComponent(`${window.location.origin}/ideas/${idea.id}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleShareLinkedIn = (idea: Idea) => {
    const url = encodeURIComponent(`${window.location.origin}/ideas/${idea.id}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const handleShareWhatsApp = (idea: Idea) => {
    const text = encodeURIComponent(`Check out this idea on EchoRoom: ${idea.title} - ${window.location.origin}/ideas/${idea.id}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleShareFacebook = (idea: Idea) => {
    const url = encodeURIComponent(`${window.location.origin}/ideas/${idea.id}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const router = useRouter();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
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
    const normalizedStatus = normalizeIdeaStatus(idea.status);
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =

      statusFilter === "All" ||
      (statusFilter === "New" && normalizedStatus === "proposed") ||
      (statusFilter === "In Progress" &&
      (normalizedStatus === "experiment" || normalizedStatus === "outcome")) ||
      (statusFilter === "Implemented" && normalizedStatus === "reflection") ||
      (statusFilter === "Discarded" && normalizedStatus === "discarded");


    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deleteIdea || deleting) return;
    try {
      setDeleting(true);
      await apiFetch(`/ideas/${deleteIdea.id}`, { method: "DELETE" });
      setIdeas((prev) => prev.filter((i) => i.id !== deleteIdea.id));
      setDeleteIdea(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete idea");
    } finally {
      setDeleting(false);
    }
  };

  const searchActions = STATUS_OPTIONS.map((opt) => ({
    id: opt.value,
    label: `Filter: ${opt.label}`,
    icon: getStatusIcon(opt.value, statusFilter === opt.value),
    onClick: () => setStatusFilter(opt.value),
  }));

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
      <div className="section px-4 sm:px-0">
        <div className="mb-8">
          <div className="mb-4">
            <BackButton />
          </div>

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-3">
              <BulbSvg className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
                Ideas
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={() => router.push("/ideas/drafts")}
                className="rounded-full bg-gray-500 hover:bg-gray-600 text-white w-full sm:w-auto"
              >
                My Drafts
              </Button>
              <Button
                onClick={() => router.push("/ideas/create")}
                className="w-full sm:w-auto"
              >
                + Create Idea
              </Button>
            </div>
          </div>

          <p className="text-base sm:text-lg max-w-2xl text-black dark:text-white mb-6 sm:mb-8">
            Ideas are the starting point of learning.
          </p>

          {/* Search */}
          <MagicCard
            className="p-[1px] rounded-2xl mb-8 w-full relative z-50"
            gradientColor="rgba(59,130,246,0.6)"
          >
            <div className="w-full p-2 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10">
              <ActionSearchBar
                placeholder={`Search ideas... (Viewing: ${statusFilter})`}
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                actions={searchActions}
              />
            </div>
          </MagicCard>
        </div>

        {/* EMPTY STATE */}
        {ideas.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard
              className="p-[1px] rounded-xl w-full"
              gradientColor="rgba(59,130,246,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 px-6 sm:px-10 py-10 sm:py-12 text-center">
                <BulbSvg className="w-10 h-10 mx-auto mb-5 text-blue-400 opacity-80" />
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  No ideas yet
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-7">
                  Every great project starts with a single idea.
                </p>
                <Button onClick={() => router.push("/ideas/create")}>
                  + Create First Idea
                </Button>
              </div>
            </MagicCard>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              No matching ideas found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <MagicCard
                key={idea.id}
                className="p-[1px] rounded-xl relative group"
                gradientColor="rgba(59,130,246,0.6)"
              >
                <div className="relative p-5 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 h-full flex flex-col">

                  {/* Icons */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(idea.id);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-500"
                    >
                      {copiedId === idea.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteIdea(idea);
                      }}
                      className="p-2 text-red-400 hover:text-red-600"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white pr-10 mb-1">
                    {idea.title}
                  </h3>

                  {/* Add the Complexity Badge here */}
                  <div className="mb-3">
                    <span 
                      className={`inline-flex items-center text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold border ${
                        idea.complexity === 'HIGH' 
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                          : idea.complexity === 'MEDIUM' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}
                    >
                      {idea.complexity} COMPLEXITY
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-100 text-sm mb-4 flex-grow">
                    {idea.description}
                  </p>

                  <div className="text-sm text-gray-400 mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <span>Status: {idea.status}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLike(idea.id); }}
                      disabled={likingId === idea.id}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                        (likes[idea.id]?.liked ?? false)
                          ? "text-red-500 bg-red-500/10"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                      }`}
                      title={(likes[idea.id]?.liked ?? false) ? "Unlike" : "Like"}
                    >
                      <HeartIcon 
                        filled={(likes[idea.id]?.liked ?? false)} 
                        className="w-4 h-4" 
                      />
                      <span className="text-xs font-medium">
                        {(likes[idea.id]?.count ?? 0)}
                      </span>
                    </button>
                  </div>
                </div>
              </MagicCard>
            ))}
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteIdea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => !deleting && setDeleteIdea(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MagicCard className="p-[1px] rounded-2xl">
              <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl px-6 py-6 w-[90vw] sm:w-[380px]">
                <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                  Delete Idea
                </h2>

                <p className="text-slate-600 dark:text-slate-200 text-sm mb-6">
                  "{deleteIdea.title}" will be permanently removed.
                </p>

                <div className="flex gap-4">
                  <Button
                    className="w-full"
                    onClick={() => setDeleteIdea(null)}
                  >
                    Cancel
                  </Button>
                  <Button className="w-full" onClick={handleDelete}>
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
