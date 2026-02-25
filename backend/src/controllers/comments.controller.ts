import { Request, Response } from "express";
import { getAllCommentsForIdea, addComment } from "../services/comments.service";
import { AuthRequest } from "../middleware/auth";

export const getCommentsHandler = (req: Request, res: Response): void => {
    const ideaId = Number(req.params.ideaId);

    const comments = getAllCommentsForIdea(ideaId);
    res.json({ success: true, comments });
};

export const postCommentHandler = (req: AuthRequest, res: Response): void => {
    const ideaId = Number(req.params.ideaId);
    const { content } = req.body;

    // Fallback for demo/mock login where no token is provided
    const userId = req.user?.userId || "anonymous";
    const username = req.user?.username || "Community Member";

    const comment = addComment(
        ideaId,
        userId,
        username,
        content
    );

    res.status(201).json({ success: true, comment });
};
