// backend/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

import ideasRoutes from "./routes/ideas.routes";
import experimentsRoutes from "./routes/experiments.routes";
import outcomesRoutes from "./routes/outcomes.routes";
import reflectionsRoutes from "./routes/reflections.routes";
import authRoutes from "./routes/auth.routes";

// import prisma from "./lib/prisma";
console.log("INDEX TS SERVER STARTED");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Backend is running" });
});

app.use("/auth", authRoutes);
app.use("/ideas", ideasRoutes);
app.use("/experiments", experimentsRoutes);
app.use("/outcomes", outcomesRoutes);
app.use("/reflections", reflectionsRoutes);

app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



process.on("SIGINT", async () => {
  try {
    if (prisma && typeof prisma.$disconnect === "function") {
      await prisma.$disconnect();
    }
  } catch (err) {
    console.error("Error during Prisma disconnect:", err);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  try {
    if (prisma && typeof prisma.$disconnect === "function") {
      await prisma.$disconnect();
    }
  } catch (err) {
    console.error("Error during Prisma disconnect:", err);
  }
  process.exit(0);
});
