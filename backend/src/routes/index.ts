import { Router } from "express";

import ideasRoutes from "./ideas.routes";
import experimentsRoutes from "./experiments.routes";
import outcomesRoutes from "./outcomes.routes";
import reflectionsRoutes from "./reflections.routes";

const router = Router();

router.use("/ideas", ideasRoutes);
router.use("/experiments", experimentsRoutes);
router.use("/outcomes", outcomesRoutes);
router.use("/reflections", reflectionsRoutes);

export default router;
