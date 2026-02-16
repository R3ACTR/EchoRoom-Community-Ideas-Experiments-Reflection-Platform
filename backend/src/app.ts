import express, { Request, Response } from "express";
import cors from "cors";

import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";
import routes from "./routes";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

app.use("/", routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
