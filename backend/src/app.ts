// backend/src/app.ts

import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
//pdf path
import path from "path";
// Route modules
import ideasRoutes from "./routes/ideas.routes";
import experimentsRoutes from "./routes/experiments.routes";
import outcomesRoutes from "./routes/outcomes.routes";
import reflectionsRoutes from "./routes/reflections.routes";
import authRoutes from "./routes/auth.routes";
import commentsRoutes from "./routes/comments.routes";
import likesRoutes from "./routes/likes.routes";
import insightsRoutes from "./routes/insights.routes";

// Global error handlers
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";

const app = express();

/* =========================
   Global Middleware
========================= */

// Allow frontend origins
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));

// Parse JSON request bodies
app.use(express.json());

/* =========================
   Health Check Endpoint
========================= */

app.get("/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Backend is running" });
});
app.use(
  "/public",
  express.static(path.join(__dirname, "../public"))
);

/* =========================
   Route Registration
========================= */

app.use("/auth", authRoutes);
app.use("/ideas", ideasRoutes);
app.use("/experiments", experimentsRoutes);
app.use("/outcomes", outcomesRoutes);
app.use("/reflections", reflectionsRoutes);
app.use("/insights", insightsRoutes);
app.use("/ideas/:ideaId/comments", commentsRoutes);
app.use("/likes", likesRoutes);

/* =========================
   Fallback & Error Handling
========================= */

// Handles unknown routes (404)
app.use(notFoundMiddleware);

// Handles all uncaught errors
app.use(errorMiddleware);

export default app;