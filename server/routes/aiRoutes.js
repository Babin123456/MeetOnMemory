// server/routes/aiRoutes.js
import express from "express";
import { searchVectorStore } from "../utils/embeddingUtils.js";

const router = express.Router();

// POST /api/ai-search
router.post("/", async (req, res) => {
  try {
    const { query, filters } = req.body;

    // ✅ Validate input
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: "Query text is required",
        results: [],
      });
    }

    console.log("🔍 Received search query:", query, "with filters:", filters);

    // ✅ Call vector search with filters
    const results = await searchVectorStore(query, filters || {});

    // ✅ Debug log
    console.log(`📤 Returning ${results.length} results to frontend`);

    // ✅ Send response
    res.json({
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error("❌ AI Search Error:", error);
    res.status(500).json({
      error: error.message || "Search failed",
      results: [],
    });
  }
});

export default router;
