"use client";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { PageLayout } from "../community/PageLayout";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import BackButton from "../components/BackButton";
import BulbSvg from "@/components/ui/bulb-svg";



interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
}
export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

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
      {/* <div className="mb-4 -mt-2">
        <BackButton />
      </div> */}

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
              <BackButton />
            </div>
          <div className="flex items-center gap-3 mb-3">
          <BulbSvg className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Ideas in EchoRoom
          </h1>
        </div>


          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Ideas are the starting point of learning. Communities can share ideas,
            explore them through experiments, and reflect on outcomes.
          </p>
        </div>

        {/* Content */}
        {ideas.length === 0 ? (

          /* Empty State */
          <div className="card text-center py-12">

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              No ideas yet
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Ideas shared by the community will appear here.
              Be the first to create one.
            </p>

            <button className="btn-primary">
              Create Idea
            </button>

          </div>

        ) : (

          /* Ideas Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {ideas.map((idea) => (
  <div key={idea.id} className="card">

    <h3 className="text-xl font-semibold text-gray-900 mb-2">
  {idea.title}
</h3>

<p className="text-gray-600 text-sm mb-4">
  {idea.description}
</p>

<div className="text-sm text-gray-400">
  Status: {idea.status}
</div>


  </div>
))}

          </div>

        )}

      </div>
    </PageLayout>
  );
}
