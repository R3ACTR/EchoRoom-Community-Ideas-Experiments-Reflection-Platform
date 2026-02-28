import { Request, Response } from "express";
import { getCommunityHighlights } from "../services/community.service";

export const fetchCommunityHighlights = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await getCommunityHighlights();

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("Community highlights error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch community highlights",
    });
  }
};