import { Router } from "express";

import ideasRoutes from "./ideas.routes";
import experimentsRoutes from "./experiments.routes";
import outcomesRoutes from "./outcomes.routes";
import reflectionsRoutes from "./reflections.routes";
import likesRoutes from "./likes.routes";

const router = Router();

router.use("/ideas", ideasRoutes);
router.use("/experiments", experimentsRoutes);
router.use("/outcomes", outcomesRoutes);
router.use("/reflections", reflectionsRoutes);
router.use("/likes", likesRoutes);

export default router;
