import { Request, Response } from "express";
import { addLike, getLikesForIdea } from "../services/likes.service";

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { id: ideaId } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await addLike(userId, ideaId);
    const likes = await getLikesForIdea(ideaId, userId);

    res.json({
      ...result,
      likes,
    });
  } catch (error: any) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

export const getIdeaLikes = async (req: Request, res: Response) => {
  try {
    const { id: ideaId } = req.params;
    const userId = (req as any).userId;

    const likes = await getLikesForIdea(ideaId, userId);
    res.json(likes);
  } catch (error: any) {
    console.error("Error getting likes:", error);
    res.status(500).json({ message: "Failed to get likes" });
  }
};
