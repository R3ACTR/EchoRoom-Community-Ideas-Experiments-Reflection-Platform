"use client";

import { useEffect, useState } from "react";
import { BookOpen, MessageSquare } from "lucide-react";
import { PageLayout } from "../community/PageLayout";
import { apiFetch } from "../lib/api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import BackButton from "../components/BackButton";
import RefreshIcon from "@/components/ui/refresh-icon";

interface Reflection {
  id: number;
  title: string;
  outcome: string;
  learning: string;
  author: string;
  date: string;
}

const outcomeColors: Record<string, string> = {
  Success: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  Mixed: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30",
  Failed: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
};

export default function ReflectionPage() {

  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchReflections = async () => {

      try {

        setLoading(true);
        setError(null);

        const reflectionsData = await apiFetch<Reflection[]>("/reflections");

        setReflections(reflectionsData);

      } catch (err: any) {

        setError(err.message || "Failed to fetch reflections");

      } finally {

        setLoading(false);

      }

    };

    fetchReflections();

  }, []);


  // Error state
  if (error) {
    return (
      <PageLayout>
        <ErrorState message={error} />
      </PageLayout>
    );
  }


  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Loading reflections..." />
      </PageLayout>
    );
  }


  return (

    <PageLayout>

      <main>

        <div className="section">

            {/* Header */}
            <div className="mb-4">
                          <BackButton />
                        </div>
            <div className="flex items-center gap-3 mb-6">
              

             <RefreshIcon className="h-8 w-8 text-blue-600 dark:text-white" />


              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Reflection
              </h1>

            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
              Reflection is where learning becomes meaningful.
            </p>


            {/* Empty state */}
            {reflections.length === 0 ? (

              <div className="card text-center py-12">

                <h2 className="text-xl font-semibold">
                  No reflections yet
                </h2>

                <p className="text-gray-500 mt-2">
                  Reflections will appear here once added.
                </p>

              </div>

            ) : (

              <div className="space-y-6">

                {reflections.map((ref) => (

                  <div
                    key={ref.id}
                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6"
                  >

                    {/* Title + outcome */}
                    <div className="flex items-start justify-between mb-3">

                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {ref.title}
                      </h3>

                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          outcomeColors[ref.outcome] || ""
                        }`}
                      >
                        {ref.outcome}
                      </span>

                    </div>


                    {/* Learning */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg p-4 mb-4">

                      <div className="flex items-start gap-2">

                        <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />

                        <p className="text-sm italic">
                          "{ref.learning}"
                        </p>

                      </div>

                    </div>


                    {/* Author + date */}
                    <div className="flex justify-between text-xs text-gray-500">

                      <span>
                        By {ref.author}
                      </span>

                      <span>
                        {ref.date}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        

      </main>

    </PageLayout>

  );

}
