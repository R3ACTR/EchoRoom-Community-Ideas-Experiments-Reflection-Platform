import prisma from "../lib/prisma";
import { Comment as PrismaComment } from "@prisma/client";

export interface Comment {
  id: string;
  ideaId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

const toComment = (comment: PrismaComment): Comment => ({
  id: comment.id,
  ideaId: comment.ideaId,
  userId: comment.userId,
  username: comment.username,
  content: comment.content,
  createdAt: comment.createdAt.toISOString(),
});

export const getAllCommentsForIdea = async (ideaId: string): Promise<Comment[]> => {
  const comments = await prisma.comment.findMany({
    where: { ideaId },
    orderBy: { createdAt: "asc" },
  });

  return comments.map(toComment);
};

export const addComment = async (
  ideaId: string,
  userId: string,
  username: string,
  content: string
): Promise<Comment> => {
  const comment = await prisma.comment.create({
    data: {
      ideaId,
      userId,
      username,
      content,
    },
  });

  return toComment(comment);
};
