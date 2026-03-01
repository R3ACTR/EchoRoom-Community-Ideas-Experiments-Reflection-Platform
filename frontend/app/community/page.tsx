"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { LearningGraph } from "../components/LearningGraph";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { PageLayout } from "./PageLayout";
import Link from "next/link";
import HomeIcon from "@/components/ui/arrow-narrow-left-icon";

import BulbSvg from "@/components/ui/bulb-svg";
import UserGroupIcon from "@/components/ui/users-group-icon";
import UserIcon from "@/components/ui/users-icon";
import ChartHistogramIcon from "@/components/ui/chart-histogram-icon";

import { MagicCard } from "@/components/ui/magic-card";
import { Users } from "lucide-react";
import { Meteors } from "@/components/ui/meteors";

const CommunityPage = () => {
  const [graphData, setGraphData] = useState<any>(null);
  const [highlights, setHighlights] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [graph, community] = await Promise.all([
          apiFetch<any>("/insights/graph"),
          apiFetch<any>("/community/highlights"),
        ]);

        setGraphData(graph);
        setHighlights(community);
      } catch (err: any) {
        setError(err.message || "Failed to fetch community data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: "Members",
      value: "120+",
      icon: <UserGroupIcon className="w-6 h-6" />,
      gradient: "rgba(59,130,246,0.6)",
    },
    {
      label: "Ideas Shared",
      value: "45",
      icon: <BulbSvg className="w-6 h-6" />,
      gradient: "rgba(99,102,241,0.6)",
    },
    {
      label: "Experiments Run",
      value: "12",
      icon: <ChartHistogramIcon className="w-6 h-6" />,
      gradient: "rgba(16,185,129,0.6)",
    },
  ];

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading collective intelligence..." />
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
    <>
      <Meteors />
      <PageLayout>
        <div className="relative container py-16">
          {/* Back Button */}
          <Link
            href="/"
            className="absolute top-6 left-6 z-20 flex items-center justify-center
              w-10 h-10 rounded-full
              bg-white/70 dark:bg-slate-900/70 backdrop-blur
              text-slate-600 hover:text-slate-900
              dark:text-slate-300 dark:hover:text-white
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition"
            aria-label="Go Back"
          >
            <HomeIcon className="w-5 h-5" />
          </Link>

          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <UserIcon className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                EchoRoom Community
              </h1>
            </div>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
  EchoRoom is a collaborative experimentation ecosystem where communities
  don’t just share ideas — they validate them. Every idea moves through a
  structured lifecycle: from proposal, to experiment, to measurable outcome,
  and finally to reflection.
</p>

<p className="text-base text-muted-foreground/90 mb-10 leading-relaxed">
  This community dashboard gives you a living map of collective learning —
  showing how concepts evolve, what experiments were conducted, what worked,
  what failed, and the insights that emerged. It’s not just discussion.
  It’s documented progress and shared intelligence.
</p>

            {/* Learning Graph */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ChartHistogramIcon className="w-6 h-6 text-blue-500" />
                Community Learning Map
              </h2>
              <LearningGraph data={graphData} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
              {stats.map((stat) => (
                <MagicCard
                  key={stat.label}
                  className="p-[1px] rounded-2xl"
                  gradientColor={stat.gradient}
                >
                  <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur rounded-2xl p-6 text-center border border-white/10">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </MagicCard>
              ))}
            </div>

            {/* Community Highlights */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-500" />
                Community Highlights
              </h2>

              {highlights ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {highlights.latestIdea && (
                    <HighlightCard
                      type="Idea"
                      title={highlights.latestIdea.title}
                      description={highlights.latestIdea.description}
                    />
                  )}

                  {highlights.latestExperiment && (
                    <HighlightCard
                      type="Experiment"
                      title={highlights.latestExperiment.title}
                      description={highlights.latestExperiment.description}
                    />
                  )}

                  {highlights.latestOutcome && (
                    <HighlightCard
                      type="Outcome"
                      title={highlights.latestOutcome.result}
                      description={highlights.latestOutcome.notes}
                    />
                  )}

                  {highlights.latestReflection && (
                    <HighlightCard
                      type="Reflection"
                      title={
                        highlights.latestReflection.growth?.lessonLearned ||
                        "Reflection"
                      }
                      description={
                        highlights.latestReflection.breakdown?.whatWorked
                      }
                    />
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No highlights yet.</p>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

/* =========================
   Highlight Card Component
========================= */

const HighlightCard = ({
  type,
  title,
  description,
}: {
  type: string;
  title: string;
  description?: string;
}) => {
  const typeColors: Record<string, string> = {
    Idea: "text-blue-500",
    Experiment: "text-purple-500",
    Outcome: "text-green-500",
    Reflection: "text-orange-500",
  };

  return (
    <div className="p-6 rounded-2xl border bg-white/70 dark:bg-slate-900/60 backdrop-blur hover:shadow-md transition">
      <div className={`text-xs font-semibold uppercase mb-2 ${typeColors[type]}`}>
        {type}
      </div>

      <h3 className="font-semibold text-lg text-foreground line-clamp-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
};

export default CommunityPage;