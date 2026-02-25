import { Request, Response } from "express";
import {
  createIdea,
  createDraft,
  updateDraft,
  publishDraft,
  getAllIdeas,
  getPublishedIdeas,
  getDraftIdeas,
  getIdeaById,
  normalizeIdeaStatus,
  updateIdeaStatus,
  deleteIdea,
} from "../services/ideas.service";

function isValidString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidComplexity(
  complexity: unknown
): complexity is "LOW" | "MEDIUM" | "HIGH" {
  return ["LOW", "MEDIUM", "HIGH"].includes(String(complexity));
}

export const getIdeas = (_req: Request, res: Response): void => {
  const ideas = getPublishedIdeas();
  res.json({ success: true, ideas });
};

export const getAllIdeasHandler = (_req: Request, res: Response): void => {
  const ideas = getAllIdeas();
  res.json({ success: true, ideas });
};

export const getDrafts = (_req: Request, res: Response): void => {
  const drafts = getDraftIdeas();
  res.json({ success: true, ideas: drafts });
};

export const getIdeaByIdHandler = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  const idea = getIdeaById(id);

  if (!idea) {
    res.status(404).json({ success: false, message: "Idea not found" });
    return;
  }

  res.json({ success: true, idea });
};

export const postDraft = (req: Request, res: Response): void => {
  const { title, description, complexity } = req.body;

  const draft = createDraft(title, description, complexity);
  res.status(201).json({ success: true, idea: draft });
};

export const putDraft = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const { title, description, version } = req.body;

  try {
    const draft = updateDraft(id, title, description, version);

    if (!draft) {
      res.status(404).json({ success: false, message: "Draft not found" });
      return;
    }

    res.json({ success: true, idea: draft });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(409).json({ success: false, message });
  }
};

export const publishDraftHandler = (
  req: Request,
  res: Response
): void => {
  const id = Number(req.params.id);
  const { version } = req.body;

  try {
    const idea = publishDraft(id, version);

    if (!idea) {
      res.status(404).json({ success: false, message: "Draft not found" });
      return;
    }

    res.json({ success: true, idea });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(409).json({ success: false, message });
  }
};

export const postIdea = (req: Request, res: Response): void => {
  const { title, description, complexity } = req.body;

  const idea = createIdea(title, description, complexity);
  res.status(201).json({ success: true, idea });
};

export const patchIdeaStatus = (
  req: Request,
  res: Response
): void => {
  const id = Number(req.params.id);
  const { status, version } = req.body;
  const normalizedStatus = normalizeIdeaStatus(status);

  if (Number.isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid idea ID" });
    return;
  }

  if (!normalizedStatus) {
    res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
    return;
  }

  if (typeof version !== "number") {
    res.status(400).json({
      success: false,
      message: "Version is required",
    });
    return;
  }

  try {
    const idea = updateIdeaStatus(id, normalizedStatus, version);

    if (!idea) {
      res.status(404).json({ success: false, message: "Idea not found" });
      return;
    }

    res.json({ success: true, idea });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(409).json({ success: false, message });
  }
};

export const deleteIdeaById = (
  req: Request,
  res: Response
): void => {
  const id = Number(req.params.id);

  const deleted = deleteIdea(id);

  if (!deleted) {
    res.status(404).json({ success: false, message: "Idea not found" });
    return;
  }

  res.json({ success: true, message: "Idea deleted" });
};
