// backend/src/routes/auth.routes.ts
import { Router, Request, Response } from "express";
import passport from "../config/passport";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../services/auth.service";

import { validateRequest } from "../middleware/validate.middleware";
import { authSchemas } from "../validation/request.schemas";
import { authenticate } from "../middleware/auth";

import { getUserById } from "../services/auth.service";

const router = Router();

/* =========================
   LOCAL AUTH ROUTES
========================= */

router.post(
  "/register",
  validateRequest(authSchemas.register),
  async (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body;

      const { user, tokens } = await registerUser(
        email,
        username,
        password
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            avatar: user.avatar || null,
          },
          tokens,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }
);

router.post(
  "/login",
  validateRequest(authSchemas.login),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const { user, tokens } = await loginUser(email, password);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            avatar: user.avatar || null,
          },
          tokens,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Invalid credentials",
      });
    }
  }
);

router.post(
  "/refresh",
  validateRequest(authSchemas.refresh),
  async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      const tokens = await refreshAccessToken(refreshToken);

      res.json({
        success: true,
        message: "Token refreshed successfully",
        data: tokens,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Invalid or expired refresh token",
      });
    }
  }
);

router.post(
  "/logout",
  validateRequest(authSchemas.logout),
  async (req: Request, res: Response) => {
    try {
      const refreshToken = req.body?.refreshToken;

      if (refreshToken) {
        await logoutUser(refreshToken);
      }

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  }
);

/* =========================
   GOOGLE OAUTH ROUTES
========================= */

// Step 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Step 2: Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response) => {
    const { tokens } = req.user as any;

    // Redirect to frontend with tokens
    res.redirect(
  `http://localhost:3000/login?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
);
  }
);

router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;

    const user = await getUserById(authUser.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});
export default router;