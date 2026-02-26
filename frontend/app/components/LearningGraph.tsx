"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Network, Lightbulb, FlaskConical, Sparkles } from "lucide-react";

interface Node {
  id: string;
  type: "idea" | "experiment" | "insight";
  label: string;
}

interface Edge {
  source: string;
  target: string;
  label?: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

// Initialize with a cleaner, modern base theme
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    fontFamily: "inherit",
    primaryColor: "#eff6ff",
    primaryTextColor: "#0f172a",
    primaryBorderColor: "#3b82f6",
    lineColor: "#94a3b8",
    secondaryColor: "#ecfdf5",
    tertiaryColor: "#fffbeb",
  },
});

export const LearningGraph: React.FC<{ data: GraphData }> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    if (!data || data.nodes.length === 0) return;

    const generateGraph = async () => {
      // Use Left-to-Right (LR) or Top-to-Down (TD). TD usually works well for hierarchies.
      let definition = "graph TD\n";

      // 1. Add nodes using the rounded rectangle syntax ("...")
      data.nodes.forEach((node) => {
        let style = "";
        if (node.type === "idea") style = ":::ideaStyle";
        if (node.type === "experiment") style = ":::expStyle";
        if (node.type === "insight") style = ":::insightStyle";

        // id("Label") creates a rounded shape natively in mermaid
        definition += `  ${node.id}("${node.label}")${style}\n`;
      });

      // 2. Add edges
      data.edges.forEach((edge) => {
        const labelText = edge.label ? `|${edge.label}|` : "";
        definition += `  ${edge.source} -->${labelText} ${edge.target}\n`;
      });

      // 3. Define beautiful pastel styles with high-contrast text and rounded corners (rx, ry)
      definition +=
        "  classDef ideaStyle fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,rx:12,ry:12;\n";
      definition +=
        "  classDef expStyle fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#064e3b,rx:12,ry:12;\n";
      definition +=
        "  classDef insightStyle fill:#fffbeb,stroke:#f59e0b,stroke-width:2px,color:#92400e,stroke-dasharray: 6 6,rx:12,ry:12;\n";
      
      // 4. Soften the link lines
      definition += "  linkStyle default stroke:#cbd5e1,stroke-width:2px,fill:none;\n";

      try {
        const uniqueId = `learning-graph-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, definition);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    };

    generateGraph();
  }, [data]);

  return (
    <div className="w-full bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col">
      
      {/* Header & Legend */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-2 text-slate-800 dark:text-white font-semibold">
          <Network className="w-5 h-5 text-blue-500" />
          <h2>Knowledge Map</h2>
        </div>

        {/* Visual Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-50 border border-blue-400 text-blue-600">
              <Lightbulb className="w-3.5 h-3.5" />
            </span>
            Idea
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-50 border border-emerald-400 text-emerald-600">
              <FlaskConical className="w-3.5 h-3.5" />
            </span>
            Experiment
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-50 border border-amber-400 border-dashed text-amber-600">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            Insight
          </div>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="relative w-full overflow-x-auto min-h-[400px] flex items-center justify-center p-8">
        
        {/* Subtle dot pattern background for a "canvas" feel */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '24px 24px' }}>
        </div>

        <div className="relative z-10 w-full flex justify-center">
          {data.nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 max-w-sm">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Network className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No data mapped yet</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Start contributing ideas and reflections to see your learning network grow.
              </p>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="mermaid-wrapper transition-opacity duration-500"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </div>
      </div>
    </div>
  );
};