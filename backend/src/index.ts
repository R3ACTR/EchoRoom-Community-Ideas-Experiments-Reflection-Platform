// backend/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

import ideasRoutes from "./routes/ideas.routes";
import experimentsRoutes from "./routes/experiments.routes";
import outcomesRoutes from "./routes/outcomes.routes";
import reflectionsRoutes from "./routes/reflections.routes";
import authRoutes from "./routes/auth.routes";
import commentsRoutes from "./routes/comments.routes";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";
import likesRoutes from "./routes/likes.routes";
import insightsRoutes from "./routes/insights.routes";

// import prisma from "./lib/prisma";
console.log("INDEX TS SERVER STARTED");

const app = express();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Backend is running" });
});

app.use("/auth", authRoutes);
app.use("/ideas", ideasRoutes);
app.use("/experiments", experimentsRoutes);
app.use("/outcomes", outcomesRoutes);
app.use("/reflections", reflectionsRoutes);
app.use("/insights", insightsRoutes);
app.use("/ideas/:ideaId/comments", commentsRoutes);
app.use("/likes", likesRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
