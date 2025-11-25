// routes/aggregateRoutes.js
import express from "express";
import Insight from "../models/Insight.js";

const router = express.Router();

/**
 * GET /api/insights/stats
 * Returns KPI summary used by KPI cards
 */
router.get("/stats", async (req, res) => {
  try {
    const totalInsights = await Insight.countDocuments();
    const avgIntensityAgg = await Insight.aggregate([
      { $match: { intensity: { $exists: true } } },
      { $group: { _id: null, avgIntensity: { $avg: "$intensity" } } }
    ]);
    const avgLikelihoodAgg = await Insight.aggregate([
      { $match: { likelihood: { $exists: true } } },
      { $group: { _id: null, avgLikelihood: { $avg: "$likelihood" } } }
    ]);
    const uniqueCountries = await Insight.distinct("country");

    res.json({
      totalInsights,
      avgIntensity: avgIntensityAgg[0] ? Number(avgIntensityAgg[0].avgIntensity.toFixed(2)) : 0,
      avgLikelihood: avgLikelihoodAgg[0] ? Number(avgLikelihoodAgg[0].avgLikelihood.toFixed(2)) : 0,
      totalCountries: uniqueCountries.filter(Boolean).length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/insights/agg/intensity-by-sector
 * Returns average intensity grouped by sector
 */
router.get("/agg/intensity-by-sector", async (req, res) => {
  try {
    const data = await Insight.aggregate([
      { $match: { sector: { $exists: true, $ne: "" }, intensity: { $exists: true } } },
      { $group: { _id: "$sector", avgIntensity: { $avg: "$intensity" }, count: { $sum: 1 } } },
      { $sort: { avgIntensity: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/insights/agg/likelihood-by-topic
 */
router.get("/agg/likelihood-by-topic", async (req, res) => {
  try {
    const data = await Insight.aggregate([
      { 
        $match: { 
          topic: { $exists: true, $ne: "" },
          likelihood: { $exists: true }
        } 
      },

      { 
        $group: { 
          _id: "$topic",
          avgLikelihood: { $avg: "$likelihood" },
          count: { $sum: 1 }
        } 
      },

     
      {
        $match: { 
          avgLikelihood: { $gt: 3.5 }   
        }
      },

      { $sort: { avgLikelihood: -1 } }
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * GET /api/insights/agg/relevance-by-region
 */
router.get("/agg/relevance-by-region", async (req, res) => {
  try {
    const data = await Insight.aggregate([
      { $match: { region: { $exists: true, $ne: "" }, relevance: { $exists: true } } },
      { $group: { _id: "$region", totalRelevance: { $sum: "$relevance" }, count: { $sum: 1 } } },
      { $sort: { totalRelevance: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/insights/agg/ints-vs-liklihood
 * returns raw points for scatter plot
 */
router.get("/agg/intensity-vs-likelihood", async (req, res) => {
  try {
    // optionally accept ?region=... ?sector=...
    const match = {};
    if (req.query.region) match.region = req.query.region;
    if (req.query.sector) match.sector = req.query.sector;

    const data = await Insight.find(match, { intensity: 1, likelihood: 1, region: 1, topic: 1 }).lean();
    // Filter out missing values
    const points = data
      .filter(d => typeof d.intensity === "number" && typeof d.likelihood === "number")
      .map(d => ({ x: d.intensity, y: d.likelihood, region: d.region || "Unknown", topic: d.topic || "" }));
    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/insights/agg/insights-by-year
 */
router.get("/agg/insights-by-year", async (req, res) => {
  try {
    // We'll parse published/added dates and group by year
    const data = await Insight.aggregate([
      {
        $project: {
          year: {
            $cond: [
              { $ne: [{ $type: "$published" }, "missing"] },
              { $substr: ["$published", -4, 4] },
              { $substr: ["$added", -4, 4] }
            ]
          }
        }
      },
      { $match: { year: { $ne: "", $exists: true } } },
      { $group: { _id: "$year", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/insights/agg/sector-region-heatmap
 * returns counts grouped by sector & region for heatmap
 */
router.get("/agg/sector-region-heatmap", async (req, res) => {
  try {
    const data = await Insight.aggregate([
      { $match: { sector: { $exists: true }, region: { $exists: true } } },
      { $group: { _id: { sector: "$sector", region: "$region" }, count: { $sum: 1 } } },
      { $project: { sector: "$_id.sector", region: "$_id.region", count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/insights/agg/top-topics
 */
router.get("/agg/top-topics", async (req, res) => {
  try {
    const data = await Insight.aggregate([
      { $match: { topic: { $exists: true, $ne: "" } } },
      { $group: { _id: "$topic", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
