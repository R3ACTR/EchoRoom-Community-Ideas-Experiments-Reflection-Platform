"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageLayout } from "../../community/PageLayout";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { apiFetch } from "../../lib/api";
import IdeaTimeline from "../../components/IdeaTimeline";


interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function IdeaDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="section max-w-3xl">

        <h1 className="text-3xl font-bold mb-4">
          {idea.title}
        </h1>

        <p className="text-gray-600 mb-6">
          {idea.description}
        </p>

        <div className="text-sm text-gray-400 mb-10">
          Status: {idea.status}
        </div>

        {/* TIMELINE WILL GO HERE */}
       <IdeaTimeline current={idea.status} />

      </div>
    </PageLayout>
  );
}
