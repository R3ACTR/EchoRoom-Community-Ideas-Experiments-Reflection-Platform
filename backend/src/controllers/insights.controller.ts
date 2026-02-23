// backend/src/controllers/insights.controller.ts
import { NextFunction, Request, Response } from "express";
import { getLearningGraph, findRelevantPatterns } from "../services/insights.service";
import { getAllIdeas } from "../services/ideas.service";
import { getAllExperiments } from "../services/experiments.service";

export const getGraph = (
    _req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const ideas = getAllIdeas();
        const experiments = getAllExperiments();

        const graph = getLearningGraph(ideas, experiments);

        res.json({
            success: true,
            data: graph,
        });
    } catch (error) {
        next(error);
    }
};

export const getSuggestions = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const { title, description } = req.body;
        const suggestions = findRelevantPatterns({ title, description });

        res.json({
            success: true,
            data: suggestions,
        });
    } catch (error) {
        next(error);
    }
};
