import express from "express";
const router = express.Router();
import Insight from "../models/Insight.js";

// GET all insights
router.get("/", async (req, res) => {
  try {
    const insights = await Insight.find();
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router; 
