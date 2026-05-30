import { Router } from "express";
import { getPlacementStats } from "../controllers/stats.controller";

const router = Router();

router.get("/", getPlacementStats);

export default router;
