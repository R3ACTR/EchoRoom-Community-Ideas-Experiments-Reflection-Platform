import { PageLayout } from "../community/PageLayout";

export default function ExperimentsPage() {

  // Sample experiment data (replace later with backend data)
  const experiments = [
    {
      title: "Landing Page Improvement",
      description: "Test different hero section layouts to improve user engagement.",
      status: "In Progress",
      progress: 60,
    },
    {
      title: "Community Onboarding Flow",
      description: "Experiment with onboarding steps to increase retention.",
      status: "Planned",
      progress: 0,
    },
    {
      title: "Idea Validation Survey",
      description: "Collect structured feedback from early adopters.",
      status: "Completed",
      progress: 100,
    },
  ];


  // Helper function for status text color
  const getStatusTextColor = (status: string) => {
    if (status === "Completed") return "text-green-600";
    if (status === "In Progress") return "text-blue-600";
    return "text-gray-600";
  };

  // Helper function for progress bar color
  const getProgressColor = (status: string) => {
    if (status === "Completed") return "bg-green-500";
    if (status === "In Progress") return "bg-blue-500";
    return "bg-gray-400";
  };


  return (
    <PageLayout>

      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-3">
            Experiments
          </h1>

          <p className="text-gray-600 text-lg">
            Track and manage experiments to test ideas and learn quickly.
          </p>
        </header>


        {/* Empty State */}
        {experiments.length === 0 ? (

          <div className="text-center py-20 bg-white rounded-lg shadow">

            <h2 className="text-2xl font-semibold mb-2">
              No experiments yet
            </h2>

            <p className="text-gray-600 mb-4">
              Start your first experiment to test and validate ideas.
            </p>

            <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
              Create Experiment
            </button>

          </div>

        ) : (

          /* Experiments Grid */
          <div className="grid gap-6 md:grid-cols-2">

            {experiments.map((exp, index) => (

              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >

                {/* Title */}
                <h2 className="text-xl font-semibold mb-2">
                  {exp.title}
                </h2>


                {/* Description */}
                <p className="text-gray-600 mb-4">
                  {exp.description}
                </p>


                {/* Status and Progress */}
                <div className="flex justify-between items-center mb-2">

                  <span
                    className={`text-sm font-medium ${getStatusTextColor(exp.status)}`}
                  >
                    Status: {exp.status}
                  </span>

                  <span className="text-sm text-gray-500">
                    {exp.progress}%
                  </span>

                </div>


                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">

                  <div
                    className={`h-2 rounded-full ${getProgressColor(exp.status)}`}
                    style={{ width: `${exp.progress}%` }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </PageLayout>
  );
}
