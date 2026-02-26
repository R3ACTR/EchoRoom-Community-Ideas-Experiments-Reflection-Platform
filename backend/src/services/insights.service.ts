// backend/src/services/insights.service.ts

export interface InsightNode {
    id: string;
    type: "idea" | "experiment" | "insight";
    label: string;
    data: any;
}

export interface InsightEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
}

export interface LearningGraph {
    nodes: InsightNode[];
    edges: InsightEdge[];
}

// In-memory storage for synthesized insights
let synthesizedInsights: InsightNode[] = [
    {
        id: "insight-default-1",
        type: "insight",
        label: "Pattern: Navigation Clarity",
        data: {
            description: "Simplifying the main menu increases user conversion by 12%.",
            confidence: 0.92,
            sources: []
        }
    },
    {
        id: "insight-default-2",
        type: "insight",
        label: "Pitfall: Oversized Images",
        data: {
            description: "Hero images larger than 2MB significantly increase bounce rate on mobile.",
            confidence: 0.88,
            sources: []
        }
    }
];
let nextInsightId = 3;

/**
 * Simulates AI synthesis of knowledge from reflections and outcomes.
 */
export const synthesizeInsights = async (reflections: any[], experiments: any[]): Promise<void> => {
    console.log("Synthesizing insights from", reflections.length, "reflections and", experiments.length, "experiments");

    if (reflections.length >= 2) {
        const newInsight: InsightNode = {
            id: `insight-${nextInsightId++}`,
            type: "insight",
            label: "Synthesized Pattern: Navigation Friction",
            data: {
                description: "Multiple experiments suggest users struggle with the top-level navigation bar.",
                confidence: 0.85,
                sources: reflections.map(r => r.id)
            }
        };
        synthesizedInsights.push(newInsight);
    }
};

/**
 * Constructs the Learning Graph for visualization.
 */
export const getLearningGraph = (ideas: any[], experiments: any[]): LearningGraph => {
    const nodes: InsightNode[] = [];
    const edges: InsightEdge[] = [];

    ideas.forEach(idea => {
        nodes.push({
            id: `idea-${idea.id}`,
            type: "idea",
            label: idea.title,
            data: idea
        });
    });

    experiments.forEach(exp => {
        nodes.push({
            id: `exp-${exp.id}`,
            type: "experiment",
            label: exp.title,
            data: exp
        });

        if (exp.ideaId) {
            edges.push({
                id: `edge-idea-exp-${exp.id}`,
                source: `idea-${exp.ideaId}`,
                target: `exp-${exp.id}`,
                label: "tests"
            });
        }
    });

    synthesizedInsights.forEach(insight => {
        nodes.push(insight);

        insight.data.sources.forEach((sourceId: string) => {
            edges.push({
                id: `edge-exp-insight-${insight.id}-${sourceId}`,
                source: `exp-${sourceId}`,
                target: insight.id,
                label: "yields"
            });
        });
    });

    return { nodes, edges };
};

/**
 * Scans synthesized insights and existing data to find patterns 
 * relevant to a new experiment draft.
 */
export const findRelevantPatterns = (draft: { title: string; description: string }): InsightNode[] => {
    const keywords = (draft.title + " " + draft.description).toLowerCase().split(/\W+/);

    return synthesizedInsights.filter(insight => {
        const labelWords = insight.label.toLowerCase().split(/\W+/);
        const descWords = (insight.data.description || "").toLowerCase().split(/\W+/);

        return keywords.some(word =>
            word.length > 3 && (labelWords.includes(word) || descWords.includes(word))
        );
    });
};
