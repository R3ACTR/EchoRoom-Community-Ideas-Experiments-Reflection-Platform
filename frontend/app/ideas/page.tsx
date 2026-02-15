"use client";

import { PageLayout } from "../community/PageLayout";
import { useEffect, useState } from "react";

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

      const res = await fetch("http://localhost:5000/ideas");
      const data = await res.json();

      if (!data.success) {
        throw new Error("Failed to fetch ideas");
      }

      setIdeas(data.ideas);

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
      <div className="section">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold">Loading ideas...</h2>
        </div>
      </div>
    </PageLayout>
  );
}

if (error) {
  return (
    <PageLayout>
      <div className="section">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">
            Error: {error}
          </h2>
        </div>
      </div>
    </PageLayout>
  );
}


  return (
    <PageLayout>
      <div className="section">

        {/* Header */}
        <div className="section">
          <h1 className="page-title">
            Ideas in EchoRoom
          </h1>

          <p className="page-description">
            Ideas are the starting point of learning. Communities can share ideas,
            explore them through experiments, and reflect on outcomes.
          </p>
        </div>

        {/* Content */}
        {ideas.length === 0 ? (

          /* Empty State */
          <div className="card text-center py-12">

            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              No ideas yet
            </h2>

            <p className="text-gray-500 mb-6">
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
