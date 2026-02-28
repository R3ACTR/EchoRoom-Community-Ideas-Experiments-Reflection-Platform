import { getAllIdeas } from "./ideas.service";
import { getAllExperiments } from "./experiments.service";
import { getAllOutcomes } from "./outcomes.service";
import { getAllReflections } from "./reflections.service";

export const getCommunityHighlights = async () => {
  const [
    ideas,
    experiments,
    outcomes,
    reflections,
  ] = await Promise.all([
    getAllIdeas(),
    getAllExperiments(),
    getAllOutcomes(),
    getAllReflections(),
  ]);

  return {
    latestIdea: ideas[0] ?? null,
    latestExperiment: experiments[0] ?? null,
    latestOutcome: outcomes[0] ?? null,
    latestReflection: reflections[0] ?? null,
  };
};