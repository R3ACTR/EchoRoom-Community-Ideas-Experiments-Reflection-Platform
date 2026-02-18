"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Experiment {
    id: string;
    title: string;
    description: string;
    status: "Planned" | "In Progress" | "Completed";
    progress: number;
    startDate: string;
    endDate: string;
    linkedIdeaId?: string;
}

interface ExperimentsContextType {
    experiments: Experiment[];
    addExperiment: (experiment: Omit<Experiment, "id" | "status" | "progress">) => void;
}

const ExperimentsContext = createContext<ExperimentsContextType | undefined>(undefined);

export function ExperimentsProvider({ children }: { children: React.ReactNode }) {
    const [experiments, setExperiments] = useState<Experiment[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("experiments");
        if (saved) {
            try {
                setExperiments(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse experiments from local storage", e);
            }
        }
    }, []);

    // Save to local storage whenever experiments change
    useEffect(() => {
        localStorage.setItem("experiments", JSON.stringify(experiments));
    }, [experiments]);

    const addExperiment = (experimentData: Omit<Experiment, "id" | "status" | "progress">) => {
        const newExperiment: Experiment = {
            ...experimentData,
            id: crypto.randomUUID(),
            status: "Planned",
            progress: 0,
        };
        setExperiments((prev) => [newExperiment, ...prev]);
    };

    return (
        <ExperimentsContext.Provider value={{ experiments, addExperiment }}>
            {children}
        </ExperimentsContext.Provider>
    );
}

export function useExperiments() {
    const context = useContext(ExperimentsContext);
    if (context === undefined) {
        // Return fallback for build-time or missing provider scenario
        return { experiments: [], addExperiment: () => { } };
    }
    return context;
}
