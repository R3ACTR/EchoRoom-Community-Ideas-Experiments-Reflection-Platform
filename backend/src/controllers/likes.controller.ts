import { Request, Response } from "express";
import { addLike, getLikesForIdea } from "../services/likes.service";
import { AuthRequest } from "../middleware/auth";

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { id: ideaId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await addLike(userId, ideaId);
    const likes = await getLikesForIdea(ideaId, userId);

    res.json({
      success: true,
      ...result,
      likes,
    });
  } catch (error: any) {
    console.error("Error toggling like:", error);
    res.status(500).json({ success: false, message: "Failed to toggle like" });
  }
};

export const getIdeaLikes = async (req: AuthRequest, res: Response) => {
  try {
    const { id: ideaId } = req.params;
    const userId = req.userId;

    const likes = await getLikesForIdea(ideaId, userId);
    res.json({ success: true, ...likes });
  } catch (error: any) {
    console.error("Error getting likes:", error);
    res.status(500).json({ success: false, message: "Failed to get likes" });
  }
};
