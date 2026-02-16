interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

export default function IdeaTimeline({ current }: { current: string }) {
  const steps: Step[] = [
    { label: "Idea", status: "completed" },
    { label: "Experiment", status: "upcoming" },
    { label: "Outcome", status: "upcoming" },
    { label: "Reflection", status: "upcoming" },
  ];

  const updatedSteps = steps.map((step) => {
    if (step.label.toLowerCase() === current.toLowerCase()) {
      return { ...step, status: "current" };
    }
    if (steps.findIndex(s => s.label === step.label) <
        steps.findIndex(s => s.label.toLowerCase() === current.toLowerCase())) {
      return { ...step, status: "completed" };
    }
    return step;
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {updatedSteps.map((step, i) => (
          <div key={i} className="flex-1 flex flex-col items-center relative">

            {/* line */}
            {i !== 0 && (
              <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-300 dark:bg-gray-700 -z-10" />
            )}

            {/* circle */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${
                  step.status === "completed"
                    ? "bg-green-500 text-white"
                    : step.status === "current"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }
              `}
            >
              {i + 1}
            </div>

            {/* label */}
            <p className="mt-2 text-sm text-center">{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
