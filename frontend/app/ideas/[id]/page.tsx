"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { PageLayout } from "../../community/PageLayout";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { apiFetch } from "../../lib/api";
import IdeaTimeline from "../../components/IdeaTimeline";
import ShareButton from "../../components/ShareButton";
import HeartIcon from "@/components/ui/heart-icon";
import Button from "@/app/components/ui/Button";

import { 
  Share2, 
  Link2, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Facebook, 
  Check,
  ArrowLeft, 
  SendIcon
} from "lucide-react";
import CopyIcon from "@/components/ui/copy-icon";

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  complexity?: "LOW" | "MEDIUM" | "HIGH"; // Added for consistency with your ideas list
}

interface LikeData {
  [ideaId: number]: {
    count: number;
    liked: boolean;
  };
}

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState<LikeData>({});
  const [liking, setLiking] = useState(false);

  // Load likes from localStorage
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

  // Save likes to localStorage
  const saveLikes = useCallback((newLikes: LikeData) => {
    setLikes(newLikes);
    localStorage.setItem("echoroom_likes", JSON.stringify(newLikes));
  }, []);

  // Handle like toggle
  const handleLike = () => {
    if (!idea || liking) return;
    setLiking(true);
    const ideaId = idea.id;
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
    setLiking(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Check out this idea on EchoRoom: ${idea?.title}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this idea on EchoRoom: ${idea?.title} - ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  useEffect(() => {
    if (!id) return;

    const fetchIdea = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiFetch<Idea>(`/ideas/${id}`);
        setIdea(data);

      } catch (err: any) {
        setError(err.message || "Failed to load idea");
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading idea..." />
      </PageLayout>
    );
  }

  if (error || !idea) {
    return (
      <PageLayout>
        <ErrorState message={error || "Idea not found"} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-0 py-8">
        
        {/* Back Button */}
        <Button 
          onClick={() => router.push('/ideas')}
          className="primary"
        >
         
         ← Back to Ideas
        </Button>

        {/* Main Idea Card */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-6 sm:p-10 mb-8 relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                {idea.status}
              </span>
              
              {idea.complexity && (
                <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border ${
                  idea.complexity === 'HIGH' 
                    ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-100 dark:border-rose-500/20' 
                    : idea.complexity === 'MEDIUM' 
                    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-100 dark:border-amber-500/20' 
                    : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20'
                }`}>
                  {idea.complexity} COMPLEXITY
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div className="flex justify-between items-start gap-4 mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {idea.title}
              </h1>
              <div className="hidden sm:block">
                <ShareButton title={idea.title} description={idea.description} type="idea" />
              </div>
            </div>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10">
              {idea.description}
            </p>

            {/* Actions: Like */}
            <div className="flex items-center pt-6 border-t border-gray-100 dark:border-white/10">
              <button
                onClick={handleLike}
                disabled={liking}
                className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                  (likes[idea.id]?.liked ?? false)
                    ? "bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-500/20"
                    : "bg-gray-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent"
                }`}
              >
                <HeartIcon 
                  filled={(likes[idea.id]?.liked ?? false)} 
                  className={`w-6 h-6 transition-transform group-hover:scale-110 ${(likes[idea.id]?.liked ?? false) ? "text-red-500" : ""}`} 
                />
                <span className="text-base font-semibold">
                  {(likes[idea.id]?.count ?? 0)} {(likes[idea.id]?.count === 1) ? 'Like' : 'Likes'}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 mb-12 shadow-sm group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-500/5 dark:to-purple-500/5 opacity-50 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Left side: Icon & Text */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
             <div className="p-5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-500/20 shadow-sm flex items-center justify-center">
              <SendIcon className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
            </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Spread the word
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Share this idea with your network
                </p>
              </div>
            </div>
            
            {/* Right side: Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              
              <button
                onClick={handleCopyLink}
                className={`
                  w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                  ${copied 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-95' 
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md hover:shadow-lg'
                  }
                `}
              >
                {copied ? <Check className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                {copied ? "Link Copied!" : "Copy Link"}
              </button>

              {/* Divider (visible only on desktop) */}
              <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-white/10"></div>

              {/* Social Icons with brand-color reveals on hover */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleShareTwitter} 
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm" 
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  onClick={handleShareLinkedIn} 
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm" 
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  onClick={handleShareWhatsApp} 
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-[#25D366] hover:border-[#25D366]/30 hover:bg-[#25D366]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm" 
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  onClick={handleShareFacebook} 
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-[#1877F2] hover:border-[#1877F2]/30 hover:bg-[#1877F2]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm" 
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

            </div>
          </div>
        </div>
        {/* TIMELINE */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-6 sm:p-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Idea Progress</h2>
          <IdeaTimeline current={idea.status} />
        </div>

      </div>
      
    </PageLayout>
  );
}