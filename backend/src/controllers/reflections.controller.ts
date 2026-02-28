import { NextFunction, Request, Response } from "express";
import {
  createReflection,
  getAllReflections,
  getReflectionsByOutcomeId,
  getReflectionById,
} from "../services/reflections.service";
import puppeteer from "puppeteer";
import { getReflectionByIdForExport } from "../services/reflections.service";

export const postReflection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const {
        outcomeId,
        context,
        breakdown,
        growth,
        result,
        tags,
        evidenceLink,
        visibility,
      } = req.body;

      const reflection = await createReflection({
        outcomeId: String(outcomeId),
        context,
        breakdown,
        growth,
        result,
        tags,
        evidenceLink,
        visibility,
      });

      res.status(201).json({
        success: true,
        data: reflection,
      });
    } catch (error) {
      next(error);
    }
  })();
};

export const getReflections = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const reflections = await getAllReflections();

      res.json({
        success: true,
        count: reflections.length,
        data: reflections,
      });
    } catch (error) {
      next(error);
    }
  })();
};

export const getReflectionsByOutcome = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const { outcomeId } = req.params;
      const reflections = await getReflectionsByOutcomeId(outcomeId);

      res.json({
        success: true,
        data: reflections,
      });
    } catch (error) {
      next(error);
    }
  })();
};

export const getReflectionByIdController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const { id } = req.params;
      const reflection = await getReflectionById(id);

      if (!reflection) {
        res.status(404).json({
          success: false,
          message: "Reflection not found",
        });
        return;
      }

      res.json({
        success: true,
        data: reflection,
      });
    } catch (error) {
      next(error);
    }
  })();
};
export const exportReflectionPDFController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const reflection = await getReflectionByIdForExport(id);

    if (!reflection) {
      return res.status(404).json({
        success: false,
        message: "Reflection not found",
      });
    }

   
    const getEmotionEmoji = (value: number) => {
      switch (value) {
        case 1: return "😞";
        case 2: return "😕";
        case 3: return "😐";
        case 4: return "🙂";
        case 5: return "😄";
        default: return "😐";
      }
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    };

    const confBefore = reflection.context.confidenceBefore;
    const confAfter = reflection.result.confidenceAfter;
    const confidenceDelta = confAfter - confBefore;
    
    const deltaColor = confidenceDelta > 0 ? '#4ade80' : (confidenceDelta < 0 ? '#fb7185' : '#94a3b8'); // Emerald, Rose, Slate
    const deltaBg = confidenceDelta > 0 ? 'rgba(22, 101, 52, 0.3)' : (confidenceDelta < 0 ? 'rgba(159, 18, 57, 0.3)' : 'rgba(51, 65, 85, 0.5)');
    const deltaText = confidenceDelta > 0 ? `+${confidenceDelta}` : `${confidenceDelta}`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background: #09090b; /* Base zinc-950 */
      color: #e2e8f0;
      padding: 40px;
      margin: 0;
      -webkit-print-color-adjust: exact;
    }

    .container {
      background: #18181b; /* Card zinc-900 */
      padding: 50px;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }

    .brand img {
      height: 48px;
      margin-bottom: 8px;
    }

    .report-title {
      font-size: 32px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .date-badge {
      display: inline-flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      color: #94a3b8;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.05);
      margin-top: 12px;
    }

    /* Metrics Dashboard */
    .metrics-container {
      display: flex;
      gap: 20px;
      margin-bottom: 32px;
    }

    .metric-card {
      flex: 1;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
    }

    .metric-label {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .metric-value {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      font-size: 36px;
      font-weight: 900;
      color: #ffffff;
    }

    .arrow { color: #475569; font-size: 24px; font-weight: 400; }

    .delta-badge {
      font-size: 14px;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 700;
      background: ${deltaBg};
      color: ${deltaColor};
    }

    /* Content Layouts */
    .section-title {
      font-size: 18px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .content-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 28px;
      border-radius: 16px;
      margin-bottom: 24px;
      line-height: 1.7;
      color: #cbd5e1;
      font-size: 15px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    /* Specific Section Colors (Matched to your Tailwind code) */
    
    /* What Worked: Emerald */
    .box-success { background: rgba(2, 44, 34, 0.4); border-color: rgba(6, 78, 59, 0.5); color: #a7f3d0; }
    .box-success .section-title { color: #34d399; }
    
    /* What Didn't Work: Rose */
    .box-danger { background: rgba(76, 17, 48, 0.4); border-color: rgba(136, 19, 55, 0.5); color: #fecdd3; }
    .box-danger .section-title { color: #fb7185; }

    /* Core Lesson: Amber */
    .box-warning { background: rgba(69, 26, 3, 0.4); border-color: rgba(120, 53, 15, 0.5); }
    .box-warning .section-title { color: #fbbf24; }
    .box-warning p { font-style: italic; font-size: 16px; font-weight: 500; color: #fde68a; }

    /* Next Action: Blue */
    .box-info { background: rgba(23, 37, 84, 0.4); border-color: rgba(30, 58, 138, 0.5); }
    .box-info .section-title { color: #60a5fa; }
    .box-info p { font-weight: 500; font-size: 16px; color: #bfdbfe; }

    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      color: #64748b;
      font-size: 13px;
    }
    .footer strong { color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    
    <div class="header">
      <div>
        <h1 class="report-title">Reflection Report</h1>
        <div class="date-badge">📅 ${formatDate(reflection.createdAt)}</div>
      </div>
      <div class="brand">
        <img src="http://localhost:5000/public/echo.png" alt="EchoRoom" />
      </div>
    </div>

    <div class="metrics-container">
      <div class="metric-card">
        <div class="metric-label">Emotional Shift</div>
        <div class="metric-value">
          <span>${getEmotionEmoji(reflection.context.emotionBefore)}</span>
          <span class="arrow">→</span>
          <span>${getEmotionEmoji(reflection.result.emotionAfter)}</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-label">Confidence Growth</div>
        <div class="metric-value">
          <span style="color: #f8fafc;">${confBefore}<span style="font-size:18px; color:#64748b;">/10</span></span>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <span class="delta-badge">${deltaText}</span>
          </div>
          <span style="color:#60a5fa;">${confAfter}<span style="font-size:18px; color:#3b82f6; opacity: 0.5;">/10</span></span>
        </div>
      </div>
    </div>

    <div class="content-box">
      <h3 class="section-title">What Happened</h3>
      <p style="margin:0;">${reflection.breakdown.whatHappened}</p>
    </div>

    <div class="grid-2">
      <div class="content-box box-success" style="margin-bottom:0;">
        <h3 class="section-title">What Worked</h3>
        <p style="margin:0; font-size: 14px;">${reflection.breakdown.whatWorked}</p>
      </div>
      <div class="content-box box-danger" style="margin-bottom:0;">
        <h3 class="section-title">What Didn't Work</h3>
        <p style="margin:0; font-size: 14px;">${reflection.breakdown.whatDidntWork}</p>
      </div>
    </div>

    <div class="grid-2">
      <div class="content-box box-warning" style="margin-bottom:0;">
        <h3 class="section-title">Core Lesson Learned</h3>
        <p style="margin:0;">"${reflection.growth.lessonLearned}"</p>
      </div>
      <div class="content-box box-info" style="margin-bottom:0;">
        <h3 class="section-title">Next Action</h3>
        <p style="margin:0;">${reflection.growth.nextAction}</p>
      </div>
    </div>

    <div class="footer">
      Generated by <strong>EchoRoom</strong> • Community Ideas & Reflection Platform
    </div>

  </div>
</body>
</html>
`;

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, 
      margin: { top: '20px', bottom: '20px' } 
    });

    await browser.close();

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reflection-${id}.pdf`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer);

  } catch (error) {
    console.error("PDF export error:", error);
    next(error);
  }
};