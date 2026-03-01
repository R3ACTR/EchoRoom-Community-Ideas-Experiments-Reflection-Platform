import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/auth.service";
import { getUserById } from "../services/auth.service";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    (req as any).user = payload;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);

      if (payload) {
        (req as any).user = payload;
      }
    }

    next();
  } catch {
    next();
  }
};

export const loadUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authUser = (req as any).user;

    if (authUser?.userId) {
      const user = await getUserById(authUser.userId);

      if (user) {
        (req as any).user = {
          userId: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatar: user.avatar || null,
        };
      }
    }

    next();
  } catch {
    next();
  }
};