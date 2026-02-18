"use client";

import { PageLayout } from "../community/PageLayout";
import BulbSvg from "@/components/ui/bulb-svg";
import ChartLineIcon from "@/components/ui/chart-line-icon";
import LocateIcon from "@/components/ui/locate-icon";
import  UserGroupIcon  from "@/components/ui/users-group-icon";
import Link from "next/link";
import HomeIcon from "@/components/ui/arrow-narrow-left-icon";
import { HyperText } from "@/components/ui/hyper-text";
import { MagicCard } from "@/components/ui/magic-card";



export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      
      



      <div className="relative z-10">
        <PageLayout>
          <div className="relative">
            <Link
    href="/"
    className="absolute top-6 left-6 z-20 flex items-center justify-center
               w-10 h-10 rounded-full
               bg-white/70 dark:bg-slate-900/70 backdrop-blur
              
               text-slate-600 hover:text-slate-900
               dark:text-slate-300 dark:hover:text-white
               hover:bg-slate-100 dark:hover:bg-slate-800
               transition"
    aria-label="Go to Home"
  >
    <HomeIcon className="w-5 h-5" />
  </Link>
            
            {/* Hero Section */}
            <section className="text-center max-w-4xl mx-auto mb-20">
              
              <div className="inline-flex items-center gap-2 bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur">
                About EchoRoom
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
                A Platform for{" "}
                <HyperText className="text-5xl md:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
    Collaborative Learning
  </HyperText>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                EchoRoom is designed to help individuals and communities explore ideas,
                conduct experiments, reflect on their learning, and share insights.
                It provides a structured environment where thoughts grow into meaningful knowledge.
              </p>
            </section>

            {/* Mission */}
<section className="mb-20">
  <MagicCard
    className="p-[1px] rounded-3xl"
    gradientColor="rgba(99,102,241,0.6)"
  >
    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-3xl p-8 md:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
          Our Mission
        </h2>

        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          We believe in{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            curiosity-driven learning
          </span>.
          EchoRoom empowers users to document their ideas, test hypotheses through experiments,
          and reflect on outcomes. It serves as both a personal workspace and collaborative hub
          for{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            continuous improvement
          </span>.
        </p>
      </div>
    </div>
  </MagicCard>
</section>


            {/* Core Values */}
            <section className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
                Core Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValueCard
  icon={<BulbSvg className="w-6 h-6" />}
  title="Innovation"
  description="We encourage creative thinking and experimentation. Every idea has the potential to spark meaningful change."
/>

<ValueCard
  icon={<UserGroupIcon className="w-6 h-6" />}
  title="Collaboration"
  description="Learning is better together. We foster a community where knowledge is shared openly and feedback is valued."
/>

<ValueCard
  icon={<ChartLineIcon className="w-6 h-6" />}
  title="Growth"
  description="Continuous improvement through reflection. We learn from both successes and failures to evolve constantly."
/>

<ValueCard
  icon={<LocateIcon className="w-6 h-6" />}
  title="Transparency"
  description="Open documentation of experiments and outcomes. We believe in making the learning process visible and accessible."
/>

              </div>
            </section>

            {/* Roadmap */}
            <section className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
                Product Roadmap
              </h2>
              <div className="max-w-3xl mx-auto space-y-6">
                <RoadmapItem
                  status="completed"
                  title="Core Platform"
                  description="Basic idea, experiment, outcome, and reflection management system."
                />
                <RoadmapItem
                  status="in-progress"
                  title="Enhanced UI/UX"
                  description="Improved page layouts, premium styling, and dark mode support across all pages."
                />
                <RoadmapItem
                  status="planned"
                  title="User Authentication"
                  description="User profiles, authentication system, and personalized dashboards."
                />
                <RoadmapItem
                  status="planned"
                  title="Advanced Features"
                  description="Version history, advanced search, community discussions, and collaborative tools."
                />
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join the Journey
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                This project is part of an open learning initiative and continues to evolve
                with new features, improved tools, and enhanced community interaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/ideas"
                  className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 shadow-lg transition inline-block"
                >
                  Start Exploring
                </a>
                <a
                  href="https://github.com/R3ACTR/EchoRoom-Community-Ideas-Experiments-Reflection-Platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition inline-block"
                >
                  View on GitHub
                </a>
              </div>
            </section>

          </div>
        </PageLayout>
      </div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <MagicCard
      className="p-[1px] rounded-2xl"
      gradientColor="rgba(59,130,246,0.6)"
    >
      <div className="group bg-white/80 dark:bg-slate-800/70 backdrop-blur p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">  
        <div className="flex items-center gap-2 mb-4">  
        </div>
        {/* Icon */}
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition">
          {icon}
        </div>
        {/* Title */}
        <h3 className="font-semibold text-xl text-slate-800 dark:text-white mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </MagicCard>
  );
}

function RoadmapItem({
  status,
  title,
  description,
}: {
  status: "completed" | "in-progress" | "planned";
  title: string;
  description: string;
}) {
  const statusColors = {
    completed: "bg-green-500 dark:bg-green-600",
    "in-progress": "bg-blue-500 dark:bg-blue-600",
    planned: "bg-slate-300 dark:bg-slate-600",
  };

  const statusLabels = {
    completed: "Completed",
    "in-progress": "In Progress",
    planned: "Planned",
  };

  return (
    <div className="relative pl-8 pb-6 border-l-2 border-slate-200 dark:border-slate-700 last:border-l-0 last:pb-0">
      <div
        className={`absolute left-0 top-0 -ml-2 w-4 h-4 rounded-full ${statusColors[status]} ring-4 ring-slate-50 dark:ring-slate-900`}
      />
      <MagicCard
  className="p-[1px] rounded-xl"
  gradientColor={
    status === "in-progress"
      ? "rgba(59,130,246,0.8)"
      : "rgba(99,102,241,0.4)"
  }
>
      <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
            {title}
          </h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      </MagicCard>
    </div>
  );
}
