"use client";

import { useEffect, useState } from "react";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export default function ContributorAvatars() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const maxAvatars = 8;

  useEffect(() => {
    fetch("/api/contributors")
      .then((res) => res.json())
      .then((data) => {
        setContributors(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch contributors:", error);
        setIsLoading(false);
      });
  }, []);

  const displayedContributors = contributors.slice(0, maxAvatars);
  const remainingCount = contributors.length - maxAvatars;

  return (
    <section className="py-20 px-6 flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
      <div className="text-center max-w-2xl mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-3">
          Powered by the Community
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          This project is made possible by these incredible open-source contributors.
        </p>
      </div>

      {isLoading ? (
        /* Loading Skeleton */
        <div className="flex items-center -space-x-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-full border-4 border-white dark:border-zinc-950 bg-gray-200 dark:bg-zinc-800 animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      ) : (
        /* Avatars Stack */
        <div className="flex items-center justify-center -space-x-5">
          {displayedContributors.map((c) => (
            <a
              key={c.id}
              href={c.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group z-0 hover:z-10 transition-all duration-300 ease-out"
            >
              <img
                src={c.avatar_url}
                alt={`${c.login}'s avatar`}
                className="w-16 h-16 rounded-full border-4 border-white dark:border-zinc-950 bg-white object-cover shadow-sm 
                           transition-transform duration-300 ease-out 
                           group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-xl"
              />

              {/* Floating Tooltip */}
              <span
                className="absolute -top-12 left-1/2 -translate-x-1/2 
                           bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
                           text-xs font-medium px-3 py-1.5 rounded-full shadow-lg
                           opacity-0 group-hover:opacity-100 
                           transition-all duration-300 ease-out 
                           pointer-events-none whitespace-nowrap
                           translate-y-2 group-hover:-translate-y-1"
              >
                {c.login}
              </span>
            </a>
          ))}

          {/* Remaining Contributors Circle */}
          {remainingCount > 0 && (
            <a
              href="https://github.com/R3ACTR/EchoRoom-Community-Ideas-Experiments-Reflection-Platform/graphs/contributors" // Update this link!
              target="_blank"
              rel="noopener noreferrer"
              className="relative group z-0 hover:z-10 transition-all duration-300 ease-out flex items-center justify-center w-16 h-16 rounded-full border-4 border-white dark:border-zinc-950 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-semibold text-sm shadow-sm hover:-translate-y-2 hover:scale-110 hover:shadow-xl hover:bg-gray-200 dark:hover:bg-zinc-700"
            >
              +{remainingCount}
              
              <span
                className="absolute -top-12 left-1/2 -translate-x-1/2 
                           bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
                           text-xs font-medium px-3 py-1.5 rounded-full shadow-lg
                           opacity-0 group-hover:opacity-100 
                           transition-all duration-300 ease-out 
                           pointer-events-none whitespace-nowrap
                           translate-y-2 group-hover:-translate-y-1"
              >
                View all
              </span>
            </a>
          )}
        </div>
      )}
    </section>
  );
}