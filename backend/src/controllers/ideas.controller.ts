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

export const getIdeas = async (_req: Request, res: Response): Promise<void> => {
  const ideas = await getPublishedIdeas();
  res.json({ success: true, ideas });
};

export const getAllIdeasHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const ideas = await getAllIdeas();
  res.json({ success: true, ideas });
};

export const getDrafts = async (_req: Request, res: Response): Promise<void> => {
  const drafts = await getDraftIdeas();
  res.json({ success: true, ideas: drafts });
};

export const getIdeaByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const idea = await getIdeaById(id);

  if (!idea) {
    res.status(404).json({ success: false, message: "Idea not found" });
    return;
  }

  res.json({ success: true, idea });
};

export const postDraft = async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    description,
    complexity,
    goal,
    category,
    expectedImpact,
    effort,
    timeHorizon,
  } = req.body;

  const draft = await createDraft(
    title,
    description,
    complexity,
    goal,
    category,
    expectedImpact,
    effort,
    timeHorizon
  );

  res.status(201).json({ success: true, idea: draft });
};

export const putDraft = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, version } = req.body;

  try {
    const draft = await updateDraft(id, title, description, version);

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

export const publishDraftHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { version } = req.body;

  try {
    const idea = await publishDraft(id, version);

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

export const postIdea = async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    description,
    complexity,
    goal,
    category,
    expectedImpact,
    effort,
    timeHorizon,
  } = req.body;

  const idea = await createIdea(
    title,
    description,
    complexity,
    goal,
    category,
    expectedImpact,
    effort,
    timeHorizon
  );

  res.status(201).json({ success: true, idea });
};

export const patchIdeaStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { status, version } = req.body;
  const normalizedStatus = normalizeIdeaStatus(status);

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
    const idea = await updateIdeaStatus(id, normalizedStatus, version);

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

export const deleteIdeaById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const deleted = await deleteIdea(id);

  if (!deleted) {
    res.status(404).json({ success: false, message: "Idea not found" });
    return;
  }

  res.json({ success: true, message: "Idea deleted" });
};