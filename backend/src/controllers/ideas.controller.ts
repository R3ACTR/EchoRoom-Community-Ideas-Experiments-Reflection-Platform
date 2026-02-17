import { Request, Response } from "express";
import {
  createIdea,
  getAllIdeas,
  IdeaStatus,
  updateIdeaStatus,
  deleteIdea
} from "../services/ideas.service";



function isValidString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidStatus(status: unknown): status is IdeaStatus {
  return ["proposed", "experiment", "outcome", "reflection"].includes(
    String(status)
  );
}

export const getIdeas = (_req: Request, res: Response): void => {
  const ideas = getAllIdeas();
  res.json({
    success: true,
    ideas,
  });
};

export const postIdea = (req: Request, res: Response): void => {
  const { title, description } = req.body;

  if (!isValidString(title) || !isValidString(description)) {
    res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
    return;
  }

  const idea = createIdea(title, description);
  res.status(201).json({
    success: true,
    idea,
  });
};

export const patchIdeaStatus = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (Number.isNaN(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid idea ID",
    });
    return;
  }

  if (!isValidStatus(status)) {
    res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
    return;
  }

  try {
    const idea = updateIdeaStatus(id, status);

    if (!idea) {
      res.status(404).json({
        success: false,
        message: "Idea not found",
      });
      return;
    }

    res.json({
      success: true,
      idea,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const deleteIdeaById = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  console.log("DELETE request for ID:", id);
  

  if (Number.isNaN(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid idea ID",
    });
    return;
  }

  const deleted = deleteIdea(id);

  console.log("Deleted:", deleted);
  console.log("DELETE HIT:", id);

  if (!deleted) {
    res.status(404).json({
      success: false,
      message: "Idea not found",
    });
    return;
  }

  res.json({
    success: true,
    message: "Idea deleted",
  });
};
