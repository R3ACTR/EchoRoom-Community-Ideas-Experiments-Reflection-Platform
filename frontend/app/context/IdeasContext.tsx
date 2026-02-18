"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Idea {
    id: string;
    title: string;
    description: string;
    status: "New" | "In Progress" | "Implemented" | "Discarded";
}

interface IdeasContextType {
    ideas: Idea[];
    addIdea: (idea: Omit<Idea, "id" | "status">) => void;
}

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export function IdeasProvider({ children }: { children: React.ReactNode }) {
    const [ideas, setIdeas] = useState<Idea[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("ideas");
        if (saved) {
            try {
                setIdeas(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse ideas from local storage", e);
            }
        }
    }, []);

    // Save to local storage whenever ideas change
    useEffect(() => {
        localStorage.setItem("ideas", JSON.stringify(ideas));
    }, [ideas]);

    const addIdea = (ideaData: Omit<Idea, "id" | "status">) => {
        const newIdea: Idea = {
            ...ideaData,
            id: crypto.randomUUID(),
            status: "New",
        };
        setIdeas((prev) => [newIdea, ...prev]);
    };

    return (
        <IdeasContext.Provider value={{ ideas, addIdea }}>
            {children}
        </IdeasContext.Provider>
    );
}

export function useIdeas() {
    const context = useContext(IdeasContext);
    if (context === undefined) {
        // Return fallback for build-time or missing provider scenario
        return { ideas: [], addIdea: () => { } };
    }
    return context;
}
