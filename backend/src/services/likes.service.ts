import prisma from "../lib/prisma";

export interface LikeWithCount {
  ideaId: string;
  count: number;
  likedByCurrentUser: boolean;
}

// Add a like to an idea
export const addLike = async (userId: string, ideaId: string) => {
  // Check if like already exists
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_ideaId: {
        userId,
        ideaId,
      },
    },
  });

  if (existingLike) {
    // Unlike if already liked
    await prisma.like.delete({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
    });
    return { liked: false };
  }

  // Create new like
  await prisma.like.create({
    data: {
      userId,
      ideaId,
    },
  });

  return { liked: true };
};

// Get likes for an idea with count
export const getLikesForIdea = async (ideaId: string, currentUserId?: string) => {
  const [count, userLike] = await Promise.all([
    prisma.like.count({
      where: { ideaId },
    }),
    currentUserId
      ? prisma.like.findUnique({
          where: {
            userId_ideaId: {
              userId: currentUserId,
              ideaId,
            },
          },
        })
      : Promise.resolve(null),
  ]);

  return {
    ideaId,
    count,
    likedByCurrentUser: !!userLike,
  };
};

// Get likes for multiple ideas
export const getLikesForIdeas = async (
  ideaIds: string[],
  currentUserId?: string
): Promise<LikeWithCount[]> => {
  if (ideaIds.length === 0) return [];

  const likeCounts = await prisma.like.groupBy({
    by: ["ideaId"],
    where: {
      ideaId: { in: ideaIds },
    },
    _count: {
      ideaId: true,
    },
  });

  const countMap = new Map(likeCounts.map((l) => [l.ideaId, l._count.ideaId]));

  // Get user's likes if logged in
  let userLikes: string[] = [];
  if (currentUserId) {
    const likes = await prisma.like.findMany({
      where: {
        userId: currentUserId,
        ideaId: { in: ideaIds },
      },
      select: { ideaId: true },
    });
    userLikes = likes.map((l) => l.ideaId);
  }

  const userLikeSet = new Set(userLikes);

  return ideaIds.map((ideaId) => ({
    ideaId,
    count: countMap.get(ideaId) || 0,
    likedByCurrentUser: userLikeSet.has(ideaId),
  }));
};
