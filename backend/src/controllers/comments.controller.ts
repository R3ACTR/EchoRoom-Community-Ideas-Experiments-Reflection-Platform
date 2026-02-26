import { Request, Response } from "express";
import { getAllCommentsForIdea, addComment } from "../services/comments.service";
import { AuthRequest } from "../middleware/auth";

export const getCommentsHandler = (req: Request, res: Response): void => {
    void (async () => {
        try {
            const { ideaId } = req.params;
            const comments = await getAllCommentsForIdea(ideaId);
            res.json({ success: true, comments });
        } catch {
            res.status(500).json({ success: false, message: "Failed to fetch comments" });
        }
    })();
};

export const postCommentHandler = (req: AuthRequest, res: Response): void => {
    void (async () => {
        try {
            const { ideaId } = req.params;
            const { content } = req.body;

            const userId = req.userId!;
            const username = req.user!.username;

            const comment = await addComment(
                ideaId,
                userId,
                username,
                content
            );

            res.status(201).json({ success: true, comment });
        } catch {
            res.status(500).json({ success: false, message: "Failed to create comment" });
        }
    })();
};
