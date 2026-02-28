"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { PageLayout } from "@/app/community/PageLayout";
import LoadingState from "@/app/components/LoadingState";
import ErrorState from "@/app/components/ErrorState";
import Button from "@/app/components/ui/Button";
import { MagicCard } from "@/components/ui/magic-card";
import { 
  ArrowRight, 
  Calendar, 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  Info, 
  ExternalLink,
  Globe,
  Lock,
  TargetIcon
} from "lucide-react";
import BulbSvg from "@/components/ui/bulb-svg";

interface Reflection {
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

// Helper for Emotion Emojis
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

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Date unknown";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "Date unknown";
  return parsed.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ReflectionDetailPage() {
  const { id } = useParams();
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReflection = async () => {
      try {
        const data = await apiFetch(`/reflections/id/${id}`);
        setReflection(data);
      } catch (err: any) {
        setError(err.message || "Failed to load reflection");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReflection();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading reflection insights..." />
      </PageLayout>
    );
  }

  if (error || !reflection) {
    return (
      <PageLayout>
        <ErrorState message={error || "Reflection not found"} />
      </PageLayout>
    );
  }

  const confidenceDelta = reflection.result.confidenceAfter - reflection.context.confidenceBefore;

  return (
    <PageLayout>
      <div className="section max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/reflection")}
            variant="primary"
            className="rounded-full px-6 py-2 mb-6 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            ← Back to Reflections
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                Reflection Report
              </h1>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(reflection.createdAt)}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                  {reflection.visibility === 'public' ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span className="capitalize">{reflection.visibility}</span>
                </span>
              </div>
            </div>
            
            {reflection.evidenceLink && (
              <a
                href={reflection.evidenceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold rounded-xl transition-colors border border-blue-200 dark:border-blue-500/20 w-fit"
              >
                View Demo/Evidence <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <Button
  onClick={() =>
    window.open(
      `http://localhost:5000/reflections/export/${reflection.id}`,
      "_blank"
    )
  }
>
  Export as PDF
</Button>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 1. The Journey (Metrics Dashboard) */}
          <MagicCard
            className="p-[1px] rounded-3xl"
            gradientColor="rgba(59,130,246,0.5)"
          >
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-8 border border-white/20 dark:border-white/5">
              
              <div className="text-center w-full md:w-auto">
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Emotional Shift</p>
                <div className="flex items-center justify-center gap-4 bg-gray-50 dark:bg-zinc-800/50 py-3 px-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                  <div className="text-center">
                    <span className="text-4xl block mb-1">{getEmotionEmoji(reflection.context.emotionBefore)}</span>
                    <span className="text-xs text-gray-500 font-medium">Before</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  <div className="text-center">
                    <span className="text-4xl block mb-1">{getEmotionEmoji(reflection.result.emotionAfter)}</span>
                    <span className="text-xs text-gray-500 font-medium">After</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-px h-24 bg-gray-200 dark:bg-zinc-800"></div>

              <div className="text-center w-full md:w-auto">
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Confidence Growth</p>
                <div className="flex items-center justify-center gap-4 bg-gray-50 dark:bg-zinc-800/50 py-3 px-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                  <div className="text-center">
                    <span className="text-3xl font-black text-gray-700 dark:text-gray-200 block mb-1">{reflection.context.confidenceBefore}<span className="text-lg text-gray-400 font-medium">/10</span></span>
                    <span className="text-xs text-gray-500 font-medium">Before</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${
                      confidenceDelta > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      confidenceDelta < 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300'
                    }`}>
                      {confidenceDelta > 0 ? '+' : ''}{confidenceDelta}
                    </span>
                    <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400 block mb-1">{reflection.result.confidenceAfter}<span className="text-lg text-blue-300 dark:text-blue-500/50 font-medium">/10</span></span>
                    <span className="text-xs text-gray-500 font-medium">After</span>
                  </div>
                </div>
              </div>

            </div>
          </MagicCard>

          {/* 2. Breakdown Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3 bg-white/60 dark:bg-zinc-900/40 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">What Happened</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {reflection.breakdown.whatHappened}
              </p>
            </div>

            <div className="md:col-span-1 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">What Worked</h3>
              </div>
              <p className="text-emerald-800 dark:text-emerald-200/80 leading-relaxed text-sm">
                {reflection.breakdown.whatWorked}
              </p>
            </div>

            <div className="md:col-span-2 bg-rose-50/50 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/30">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-lg font-bold text-rose-900 dark:text-rose-300">What Didn't Work</h3>
              </div>
              <p className="text-rose-800 dark:text-rose-200/80 leading-relaxed text-sm">
                {reflection.breakdown.whatDidntWork}
              </p>
            </div>
          </div>

          {/* 3. Growth & Takeaways */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MagicCard className="p-[1px] rounded-3xl h-full" gradientColor="rgba(234,179,8,0.3)">
              <div className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-zinc-900 p-8 rounded-3xl h-full border border-amber-100/50 dark:border-amber-900/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <BulbSvg className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Core Lesson Learned</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic font-medium">
                  "{reflection.growth.lessonLearned}"
                </p>
              </div>
            </MagicCard>

            <MagicCard className="p-[1px] rounded-3xl h-full" gradientColor="rgba(59,130,246,0.3)">
              <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-zinc-900 p-8 rounded-3xl h-full border border-blue-100/50 dark:border-blue-900/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <TargetIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Next Action</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium">
                  {reflection.growth.nextAction}
                </p>
              </div>
            </MagicCard>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
