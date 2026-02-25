import { comments, getNextCommentId } from "../data/comments.data";

export interface Comment {
    id: number;
    ideaId: number;
    userId: string;
    username: string;
    content: string;
    createdAt: string;
}

/**
 * Get all comments for a specific idea
 */
export const getAllCommentsForIdea = (ideaId: number): Comment[] => {
    return comments.filter((c) => c.ideaId === ideaId);
};

/**
 * Add a new comment to an idea
 */
export const addComment = (
    ideaId: number,
    userId: string,
    username: string,
    content: string
): Comment => {
    const newComment: Comment = {
        id: getNextCommentId(),
        ideaId,
        userId,
        username,
        content,
        createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    return newComment;
};
