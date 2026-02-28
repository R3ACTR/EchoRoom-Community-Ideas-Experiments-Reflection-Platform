"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";
import { PageLayout } from "../community/PageLayout";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import BackButton from "../components/BackButton";
import Button from "@/app/components/ui/Button";
import RefreshIcon from "@/components/ui/refresh-icon";
import LibraryIcon from "@/components/ui/library-icon";
import { MagicCard } from "@/components/ui/magic-card";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowRight, 
  CalendarDays,
  Target,
  Sparkles
} from "lucide-react";

interface ReflectionApiResponse {
  id: string;
  outcomeId: string;
  context: {
    emotionBefore: number;
    confidenceBefore: number;
  };
  breakdown: {
    whatHappened: string;
    whatWorked: string;
    whatDidntWork: string;
  };
  growth: {
    lessonLearned: string;
    nextAction: string;
  };
  result: {
    emotionAfter: number;
    confidenceAfter: number;
  };
  evidenceLink?: string;
  visibility: "private" | "public";
  createdAt: string;
}

interface OutcomeApiResponse {
  id: string;
  experimentId: string;
  experimentTitle: string;
  result: string;
}

interface ReflectionViewModel {
  id: string;
  title: string;
  outcome: string;
  lesson: string;
  confidenceDelta: number;
  emotionBefore: number;
  emotionAfter: number;
  date: string;
  createdAt: string;
}

// Sleek aesthetic badge colors
const outcomeColors: Record<string, string> = {
  Success: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
  Mixed: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
  Failed: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
};

// Helper to convert emotion scores (1-5) back to emojis for quick visual scanning
const getEmotionEmoji = (value: number) => {
  switch (value) {
    case 1: return "😞";
    case 2: return "😕";
    case 3: return "😐";
    case 4: return "🙂";
    case 5: return "😄";
    default: return "😐";
  }
};

const formatDate = (createdAt?: string): string => {
  if (!createdAt) return "Unknown date";
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const mapReflection = (
  reflection: ReflectionApiResponse,
  outcomeMap: Map<string, OutcomeApiResponse>
): ReflectionViewModel => {
  const outcome = outcomeMap.get(reflection.outcomeId);
  
  if (!outcome) console.warn(`No outcome found for ID: ${reflection.outcomeId}`);

  return {
    id: reflection.id,
    title: outcome?.experimentTitle || "Unknown Experiment",
    outcome: outcome?.result || "Unknown", 
    lesson: reflection.growth.lessonLearned,
    confidenceDelta:
      reflection.result.confidenceAfter - reflection.context.confidenceBefore,
    emotionBefore: reflection.context.emotionBefore,
    emotionAfter: reflection.result.emotionAfter,
    date: formatDate(reflection.createdAt),
    createdAt: reflection.createdAt,
  };
};

export default function ReflectionPage() {
  const [reflections, setReflections] = useState<ReflectionViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [reflectionsData, outcomesData] = await Promise.all([
          apiFetch<ReflectionApiResponse[]>("/reflections"),
          apiFetch<OutcomeApiResponse[]>("/outcomes"),
        ]);

        const outcomeMap = new Map(outcomesData.map((o) => [o.id, o]));
        const mapped = reflectionsData.map((r) => mapReflection(r, outcomeMap));

        setReflections(
          mapped.sort((a, b) => {
            const dateDiff =
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return dateDiff !== 0 ? dateDiff : b.id.localeCompare(a.id);
          })
        );
      } catch (err: any) {
        setError(err.message || "Failed to fetch reflections");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const totalReflections = reflections.length;
  const successRate = totalReflections > 0 
  ? Math.round(
      (reflections.filter(r => 
        r.outcome?.trim().toLowerCase() === 'success'
      ).length / totalReflections) * 100
    ) 
  : 0;
  
  const totalConfidenceShift = reflections.reduce((sum, r) => sum + r.confidenceDelta, 0);
  const avgConfidence = totalReflections > 0
    ? (totalConfidenceShift / totalReflections).toFixed(1)
    : "0.0";
    
  const moodImprovedCount = reflections.filter(r => r.emotionAfter > r.emotionBefore).length;

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading reflections..." />
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
      <div className="section max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LibraryIcon className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-in spin-in duration-700" />
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Reflections
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                Where learning becomes measurable growth. Review your past experiments and insights.
              </p>
            </div>

            <Button 
              onClick={() => router.push("/reflection/new")}
              className="rounded-full px-6 py-2.5 shadow-lg shadow-blue-500/20 whitespace-nowrap"
            >
              + New Reflection
            </Button>
          </div>
        </div>

        {/* Overview Stats Panel */}
        {reflections.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MagicCard 
              className="p-[1px] rounded-2xl w-full" 
              gradientColor="rgba(59,130,246,0.25)"
            >
              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-white/10">
                  
                  {/* Stat 1: Total Insights */}
                  <div className="flex flex-col items-center justify-center px-4 pt-4 md:pt-0 border-t-0">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <LibraryIcon className="w-4 h-4 text-blue-500" /> Total Insights
                    </span>
                    <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      {totalReflections}
                    </span>
                  </div>

                  {/* Stat 2: Success Rate */}
                  <div className="flex flex-col items-center justify-center px-4 pt-4 md:pt-0 border-t-0">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-500" /> Success Rate
                    </span>
                    <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      {successRate}%
                    </span>
                  </div>

                  {/* Stat 3: Avg Confidence */}
                  <div className="flex flex-col items-center justify-center px-4 pt-8 md:pt-0">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                      {parseFloat(avgConfidence) > 0 ? (
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-rose-500" />
                      )}
                      Avg Confidence
                    </span>
                    <span className={`text-3xl md:text-4xl font-bold ${
                      parseFloat(avgConfidence) > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {parseFloat(avgConfidence) > 0 ? `+${avgConfidence}` : avgConfidence}
                    </span>
                  </div>

                  {/* Stat 4: Mood Boosts */}
                  <div className="flex flex-col items-center justify-center px-4 pt-8 md:pt-0">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Mood Boosts
                    </span>
                    <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      {moodImprovedCount}
                    </span>
                  </div>

                </div>
              </div>
            </MagicCard>
          </div>
        )}

        {/* Empty State */}
        {reflections.length === 0 ? (
          <div className="flex justify-center mt-14">
            <MagicCard className="p-[1px] rounded-2xl w-full" gradientColor="rgba(59,130,246,0.3)">
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl px-10 py-16 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LibraryIcon className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Your growth journal is empty
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Start recording structured learning from your outcomes. Tracking your confidence and emotional shifts helps build long-term resilience.
                </p>
                <Button onClick={() => router.push("/reflection/new")} className="rounded-full px-8 py-3">
                  + Add Your First Reflection
                </Button>
              </div>
            </MagicCard>
          </div>
        ) : (
          /* Responsive Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reflections.map((ref) => (
              <div
                key={ref.id}
                onClick={() => router.push(`/reflection/${ref.id}`)}
                className="group cursor-pointer h-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
              >
                <MagicCard
                  className="p-[1px] rounded-2xl h-full transition-transform duration-300 group-hover:-translate-y-1"
                  gradientColor="rgba(59,130,246,0.4)"
                >
                  <div className="flex flex-col h-full p-6 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl transition-colors group-hover:bg-white dark:group-hover:bg-zinc-900 border border-transparent dark:border-white/5">
                    
                    {/* Card Header: Date & Outcome Badge */}
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                        <CalendarDays className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                        {ref.date}
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${
                          outcomeColors[ref.outcome] || "text-gray-600 bg-gray-100 border-gray-200"
                        }`}
                      >
                        {ref.outcome}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ref.title}
                    </h3>

                    {/* Lesson Snippet (Takes up available space) */}
                    <div className="flex-grow mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-300/90 leading-relaxed italic line-clamp-3 relative pl-4">
                        <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-blue-500/40 rounded-full"></span>
                        "{ref.lesson}"
                      </p>
                    </div>

                    {/* Card Footer: Metrics & Stats */}
                    <div className="pt-4 mt-auto border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                      
                      {/* Emotion Shift Display */}
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800/80 px-3 py-1.5 rounded-full border border-gray-100 dark:border-white/5">
                        <span className="text-lg" title={`Emotion before: ${ref.emotionBefore}`}>
                          {getEmotionEmoji(ref.emotionBefore)}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-lg" title={`Emotion after: ${ref.emotionAfter}`}>
                          {getEmotionEmoji(ref.emotionAfter)}
                        </span>
                      </div>

                      {/* Confidence Delta Display */}
                      <div 
                        className={`flex items-center gap-1.5 font-semibold text-sm px-3 py-1.5 rounded-full ${
                          ref.confidenceDelta > 0 
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" 
                            : ref.confidenceDelta < 0 
                            ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10" 
                            : "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800"
                        }`}
                        title="Confidence Shift"
                      >
                        {ref.confidenceDelta > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : ref.confidenceDelta < 0 ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                        <span>
                          {ref.confidenceDelta > 0 ? "+" : ""}{ref.confidenceDelta}
                        </span>
                      </div>

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