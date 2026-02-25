"use client";

import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { PageLayout } from "../../community/PageLayout";
import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../../lib/api";
import BackButton from "../../components/BackButton";
import { useRouter } from "next/navigation";
import BookmarkIcon from "@/components/ui/bookmark-icon";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import BulbSvg from "@/components/ui/bulb-svg";

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  complexity: "LOW" | "MEDIUM" | "HIGH";
}

interface BookmarkData {
  [ideaId: number]: boolean;
}

export default function BookmarksPage() {
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkData>({});
  const router = useRouter();

  // Load bookmarks from localStorage
  useEffect(() => {
    const storedBookmarks = localStorage.getItem("echoroom_bookmarks");
    if (storedBookmarks) {
      try {
        setBookmarks(JSON.parse(storedBookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);

  // Fetch all ideas to find bookmarked ones
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const ideasData = await apiFetch<Idea[]>("/ideas/all");
        setAllIdeas(ideasData);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  // Filter to only bookmarked ideas
  useEffect(() => {
    const bookmarked = allIdeas.filter((idea) => bookmarks[idea.id]);
    setBookmarkedIdeas(bookmarked);
  }, [allIdeas, bookmarks]);

  // Toggle bookmark (remove from bookmarks)
  const handleRemoveBookmark = useCallback((ideaId: number) => {
    const newBookmarks = { ...bookmarks };
    delete newBookmarks[ideaId];
    setBookmarks(newBookmarks);
    localStorage.setItem("echoroom_bookmarks", JSON.stringify(newBookmarks));
    setBookmarkedIdeas((prev) => prev.filter((i) => i.id !== ideaId));
  }, [bookmarks]);

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading bookmarks..." />
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
              <BookmarkIcon className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" filled />
              <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
                My Bookmarks
              </h1>
            </div>

            <Button
              onClick={() => router.push("/ideas")}
              className="w-full sm:w-auto"
            >
              Browse Ideas
            </Button>
          </div>

          <p className="text-base sm:text-lg max-w-2xl text-black dark:text-white mb-6 sm:mb-8">
            Ideas you've saved for later. Bookmark ideas you want to revisit or experiment with.
          </p>
        </div>

        {/* EMPTY STATE */}
        {bookmarkedIdeas.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard
              className="p-[1px] rounded-xl w-full"
              gradientColor="rgba(245,158,11,0.6)"
            >
              <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 px-6 sm:px-10 py-10 sm:py-12 text-center">
                <BookmarkIcon className="w-10 h-10 mx-auto mb-5 text-amber-400 opacity-80" filled />
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-7">
                  Save ideas you want to revisit later by clicking the bookmark icon.
                </p>
                <Button onClick={() => router.push("/ideas")}>
                  Browse Ideas
                </Button>
              </div>
            </MagicCard>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarkedIdeas.map((idea) => (
              <div
                key={idea.id}
                onClick={() => router.push(`/ideas/${idea.id}`)}
                className="cursor-pointer"
              >
                <MagicCard
                  className="p-[1px] rounded-xl relative group"
                  gradientColor="rgba(245,158,11,0.6)"
                >
                  <div className="relative p-5 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 h-full flex flex-col">
                    {/* Bookmark button */}
                    <div className="absolute top-4 right-4 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBookmark(idea.id);
                        }}
                        className="p-2 text-amber-500 hover:text-amber-600"
                        title="Remove bookmark"
                      >
                        <BookmarkIcon className="w-5 h-5" filled />
                      </button>
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white pr-10 mb-1">
                      {idea.title}
                    </h3>

                    {/* Complexity Badge */}
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

                    <div className="text-sm text-gray-400 mt-auto pt-4 border-t border-white/10">
                      <span>Status: {idea.status}</span>
                    </div>
                  </div>
                </MagicCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
