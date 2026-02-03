import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "EchoRoom backend running",
  });
});

const PORT = 5000;
app.get("/experiments", (req: Request, res: Response) => {
  res.json({
    success: true,
    experiments: [
      {
        id: 1,
        title: "Community Clean-up Drive",
        status: "completed",
        outcome: "Positive participation"
      },
      {
        id: 2,
        title: "Weekly Knowledge Sharing Session",
        status: "ongoing",
        outcome: "High engagement"
      }
    ]
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
