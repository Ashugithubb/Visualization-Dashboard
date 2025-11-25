import { Router } from "express";
import Insight from "../models/Insight.js";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const insights = await Insight.find();

    const totalInsights = insights.length;

    const avgIntensity =
      insights.reduce((sum, i) => sum + (i.intensity || 0), 0) / totalInsights;

    const avgLikelihood =
      insights.reduce((sum, i) => sum + (i.likelihood || 0), 0) /
      totalInsights;

    const uniqueCountries = new Set(
      insights.map((i) => i.country).filter(Boolean)
    );

    res.json({
      totalInsights,
      avgIntensity: avgIntensity.toFixed(2),
      avgLikelihood: avgLikelihood.toFixed(2),
      totalCountries: uniqueCountries.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
