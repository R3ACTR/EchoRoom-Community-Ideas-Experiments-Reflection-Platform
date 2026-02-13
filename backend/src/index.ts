import express, { Request, Response } from "express";
import ideasRoutes from "./routes/ideas.routes";
import cors from "cors";
import experimentsRoutes from "./routes/experiments.routes";
import outcomesRoutes from "./routes/outcomes.routes";
import reflectionsRoutes from "./routes/reflections.routes";




const app = express();
app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());
app.use("/ideas", ideasRoutes);
app.use("/experiments", experimentsRoutes);
app.use("/outcomes", outcomesRoutes);
app.use("/reflections", reflectionsRoutes);


app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "EchoRoom backend running",
  });
});

const PORT = 5000;



app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
