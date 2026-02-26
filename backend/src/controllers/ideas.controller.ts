import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
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

export const getDrafts = async (req: AuthRequest, res: Response): Promise<void> => {
  const isAdmin = req.user?.role === "ADMIN" || req.user?.role === "MODERATOR";
  const drafts = await getDraftIdeas(isAdmin ? undefined : req.userId);
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

export const postDraft = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, complexity } = req.body;

  const draft = await createDraft(title, description, complexity, req.userId);
  res.status(201).json({ success: true, idea: draft });
};

export const putDraft = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, version } = req.body;

  const existing = await getIdeaById(id);
  if (!existing) {
    res.status(404).json({ success: false, message: "Draft not found" });
    return;
  }

  if (
    existing.authorId !== req.userId &&
    req.user?.role !== "ADMIN" &&
    req.user?.role !== "MODERATOR"
  ) {
    res.status(403).json({ success: false, message: "Permission denied" });
    return;
  }

  try {
    const draft = await updateDraft(id, title, description, version);
    res.json({ success: true, idea: draft });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(409).json({ success: false, message });
  }
};

export const publishDraftHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { version } = req.body;

  const existing = await getIdeaById(id);
  if (!existing) {
    res.status(404).json({ success: false, message: "Draft not found" });
    return;
  }

  if (
    existing.authorId !== req.userId &&
    req.user?.role !== "ADMIN" &&
    req.user?.role !== "MODERATOR"
  ) {
    res.status(403).json({ success: false, message: "Permission denied" });
    return;
  }

  try {
    const idea = await publishDraft(id, version);
    res.json({ success: true, idea });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(409).json({ success: false, message });
  }
};

export const postIdea = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, complexity } = req.body;

  const idea = await createIdea(title, description, complexity, req.userId);
  res.status(201).json({ success: true, idea });
};

export const patchIdeaStatus = async (
  req: AuthRequest,
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

  const existing = await getIdeaById(id);
  if (!existing) {
    res.status(404).json({ success: false, message: "Idea not found" });
    return;
  }

  if (
    existing.authorId !== req.userId &&
    req.user?.role !== "ADMIN" &&
    req.user?.role !== "MODERATOR"
  ) {
    res.status(403).json({ success: false, message: "Permission denied" });
    return;
  }

  try {
    const idea = await updateIdeaStatus(id, normalizedStatus, version);
    res.json({ success: true, idea });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(409).json({ success: false, message });
  }
};

export const deleteIdeaById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const existing = await getIdeaById(id);
  if (!existing) {
    res.status(404).json({ success: false, message: "Idea not found" });
    return;
  }

  if (
    existing.authorId !== req.userId &&
    req.user?.role !== "ADMIN" &&
    req.user?.role !== "MODERATOR"
  ) {
    res.status(403).json({ success: false, message: "Permission denied" });
    return;
  }

  const deleted = await deleteIdea(id);
  res.json({ success: true, message: "Idea deleted" });
};
