"use client";

import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../lib/api";
import BackButton from "../components/BackButton";
import BulbSvg from "@/components/ui/bulb-svg";
import { useRouter } from "next/navigation";
import TrashIcon from "@/components/ui/trash-icon";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { Check, ChevronDown, Facebook, Filter, Link2, Linkedin, MessageCircle, Search, Twitter } from "lucide-react";
import { PageLayout } from "../community/PageLayout";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
}

const STATUS_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "New", label: "New" },
  { value: "In Progress", label: "In Progress" },
  { value: "Implemented", label: "Implemented" },
  { value: "Discarded", label: "Discarded" },
];


function StatusDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = STATUS_OPTIONS.find((o) => o.value === value)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl border transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium
          ${open
            ? "bg-white dark:bg-slate-800 border-blue-500/60 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
            : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:border-blue-400/50"
          }
          text-gray-800 dark:text-white`}
      >
        <Filter size={15} className="text-gray-400 shrink-0" />
        <span className="whitespace-nowrap">{selected.label}</span>
        <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-48 overflow-hidden rounded-2xl
          border border-gray-200 dark:border-white/10
          bg-white dark:bg-slate-900/95 backdrop-blur-xl
          shadow-lg dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]
          animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-3 pt-3 pb-2 border-b border-gray-100 dark:border-white/5">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-slate-500">
              Filter by Status
            </p>
          </div>
          <div className="p-2 flex flex-col gap-0.5">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-sm transition-all duration-150
                    ${isActive
                      ? "bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-white font-semibold"
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  {isActive && <Check size={14} className="shrink-0 text-blue-500 dark:text-blue-400" />}
                  <span className={isActive ? "" : "ml-[22px]"}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteIdea, setDeleteIdea] = useState<Idea | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const router = useRouter();

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
      setIdeas((prev) => prev.filter((i) => i.id !== deleteIdea.id));
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

              {/* Custom Status Dropdown */}
              <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
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
                  Every great project starts with a single idea. Be the first to
                  share something and spark discussion.
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
                  <div className="absolute top-5 right-5 flex items-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopyLink(idea.id); }}
                      className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copy link"
                    >
                      {copiedId === idea.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Link2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShareTwitter(idea); }}
                      className="p-1.5 text-gray-400 hover:text-sky-400 transition-colors"
                      title="Share on Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShareLinkedIn(idea); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShareWhatsApp(idea); }}
                      className="p-1.5 text-gray-400 hover:text-emerald-500 transition-colors"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShareFacebook(idea); }}
                      className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteIdea(idea); }}
                      className="p-1.5 text-red-400 hover:text-red-600 ml-1 border-l border-white/10"
                      title="Delete idea"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2 pr-8">
                    {idea.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-100 text-sm mb-4 flex-grow">
                    {idea.description}
                  </p>

                  <div className="text-sm text-gray-400 mt-auto pt-4 border-t border-white/10">
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
