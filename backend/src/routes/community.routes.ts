import express from "express";
import { fetchCommunityHighlights } from "../controllers/community.controller";

const router = express.Router();

router.get("/highlights", fetchCommunityHighlights);

export default router;