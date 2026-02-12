import { PageLayout } from "../community/PageLayout";

export default function IdeasPage() {
  const ideas: any[] = []; // empty for now

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Ideas in EchoRoom
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl">
            Ideas are the starting point of learning. Communities can share ideas,
            explore them through experiments, and reflect on outcomes.
          </p>
        </div>

        {/* Content */}
        {ideas.length === 0 ? (

          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">

            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              No ideas yet
            </h2>

            <p className="text-gray-500 mb-6">
              Ideas shared by the community will appear here.
              Be the first to create one.
            </p>

            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Create Idea
            </button>

          </div>

        ) : (

          /* Ideas Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {ideas.map((idea, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Idea Title
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  Idea description will appear here.
                </p>

                <div className="text-sm text-gray-400">
                  Created by Community
                </div>
              </div>
            ))}

          </div>

        )}

      </div>
    </PageLayout>
  );
}
