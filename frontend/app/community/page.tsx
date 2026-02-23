"use client";

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
          <div className="flex items-center gap-3 mb-6">
            <UserIcon className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              EchoRoom Community
            </h1>
          </div>

          <p className="text-lg text-muted-foreground mb-4">
            The EchoRoom community is where learners, builders, and thinkers
            come together to explore ideas, run experiments, and reflect on
            their learning journey.
          </p>

          <p className="text-lg text-muted-foreground mb-4">
            This space will enable collaboration, discussions, and shared
            learning experiences. Members will be able to contribute ideas,
            participate in experiments, and grow together as a community.
          </p>

          <p className="text-lg text-muted-foreground mb-10">
            Future updates will include community discussions, contributor
            profiles, and collaborative tools.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
        </div>
      </div>
    </PageLayout>
    </>
  );
};

export default CommunityPage;
