import { Comment } from "../services/comments.service";

export const comments: Comment[] = [];

let nextCommentId = 1;

export const getNextCommentId = (): number => {
  return nextCommentId++;
};
