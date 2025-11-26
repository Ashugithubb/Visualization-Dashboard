// import express from "express";
// const router = express.Router();
// import Insight from "../models/Insight.js";


// router.get("/", async (req, res) => {
//   try {
//     const insights = await Insight.find();
//     res.json(insights);
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// });

// export default router; 
import express from "express";
const router = express.Router();
import Insight from "../models/Insight.js";

router.get("/", async (req, res) => {
  try {
    // Extract all possible filters from query params
    const {
      end_year,
      topic,
      sector,
      region,
      pestle,
      source,
      swot,
      country,
      city,
      start_year,   // optional if you want year range
      likelihood_min, // optional numeric filter
      intensity_min,
      relevance_min,
    } = req.query;

    // Build dynamic MongoDB filters object
    const filters = {};

    if (end_year) filters.end_year = end_year;
    if (start_year) filters.start_year = start_year;
    if (topic) filters.topic = topic;
    if (sector) filters.sector = sector;
    if (region) filters.region = region;
    if (pestle) filters.pestle = pestle;
    if (source) filters.source = source;
    if (swot) filters.swot = swot;
    if (country) filters.country = country;
    if (city) filters.city = city;

    // Numeric filters (optional)
    if (likelihood_min) filters.likelihood = { $gte: Number(likelihood_min) };
    if (intensity_min) filters.intensity = { $gte: Number(intensity_min) };
    if (relevance_min) filters.relevance = { $gte: Number(relevance_min) };

    // Fetch filtered data
    const insights = await Insight.find(filters);

    res.json(insights);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/filters", async (req, res) => {
  try {
    const data = await Insight.find();

    const unique = (key) =>
      [...new Set(data.map((item) => item[key]).filter(Boolean))];

    res.json({
      end_years: unique("end_year"),
      topics: unique("topic"),
      sectors: unique("sector"),
      regions: unique("region"),
      pestles: unique("pestle"),
      sources: unique("source"),
      swots: unique("swot"),
      countries: unique("country"),
      cities: unique("city"),
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


export default router;
