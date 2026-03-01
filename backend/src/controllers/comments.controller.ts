// import { Request, Response } from "express";
// import { getAllCommentsForIdea, addComment } from "../services/comments.service";


// export const getCommentsHandler = (req: Request, res: Response): void => {
//     void (async () => {
//         try {
//             const { ideaId } = req.params;
//             const comments = await getAllCommentsForIdea(ideaId);
//             res.json({ success: true, comments });
//         } catch {
//             res.status(500).json({ success: false, message: "Failed to fetch comments" });
//         }
//     })();
// };

// export const postCommentHandler = (req: Request, res: Response): void => {
//     void (async () => {
//         try {
//             const { ideaId } = req.params;
//             const { content } = req.body;

//             // Fallback for demo/mock login where no token is provided
//             const userId = (req as any).auth?.userId || "anonymous";
//             const username = (req as any).auth?.username || "Community Member";

//             const comment = await addComment(
//                 ideaId,
//                 userId,
//                 username,
//                 content
//             );

//             res.status(201).json({ success: true, comment });
//         } catch {
//             res.status(500).json({ success: false, message: "Failed to create comment" });
//         }
//     })();
// };
