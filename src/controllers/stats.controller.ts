import { Request, Response } from "express";
import {
  DYNAMIC_STATS_FROM_BATCH_YEAR,
  HISTORICAL_PLACEMENT_STATS,
} from "../data/placementStatsHistorical";
import { buildAllDynamicStats } from "../utils/placementStats";

export const getPlacementStats = async (_req: Request, res: Response) => {
  try {
    const dynamicYears = (await buildAllDynamicStats()).map((y) => ({
      ...y,
      isLive: true,
    }));
    const historicalYears = HISTORICAL_PLACEMENT_STATS.map((y) => ({
      ...y,
      isLive: false,
    }));

    const years = [...dynamicYears, ...historicalYears].sort(
      (a, b) => b.batchYear - a.batchYear
    );

    res.json({ years, dynamicFromBatchYear: DYNAMIC_STATS_FROM_BATCH_YEAR });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch placement statistics" });
  }
};
