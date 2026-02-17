"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "../../community/PageLayout";
import BackButton from "../../components/BackButton";

const API_BASE_URL = "http://localhost:5000";

export default function CreateIdeaPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create idea");
      }

      // redirect back to ideas page
      router.push("/ideas");

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="section max-w-2xl mx-auto">

        <div className="mb-6">
  <button
    onClick={() => router.push("/ideas")}
    className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
  >
    ← Back to Ideas
  </button>
</div>



        <h1 className="text-3xl font-bold mb-2">Create a New Idea</h1>
        <p className="text-gray-500 mb-6">
          Share something the community can explore and experiment with.
        </p>

        <form onSubmit={handleSubmit} className="card space-y-6 p-6">

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full p-3 rounded bg-gray-900 border border-gray-700"
              placeholder="Enter idea title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full p-3 rounded bg-gray-900 border border-gray-700"
              rows={5}
              placeholder="Describe your idea in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Creating..." : "Create Idea"}
          </button>

        </form>
      </div>
    </PageLayout>
  );
}
