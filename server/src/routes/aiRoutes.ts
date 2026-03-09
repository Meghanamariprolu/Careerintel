import { Router } from "express";
import { IntelligenceEngine } from "../services/intelligenceEngine";

const router = Router();

// Endpoint to generate uniform strategic report from global profile
router.post("/generate-report", (req, res) => {
    try {
        const userProfile = req.body.profile;
        if (!userProfile) {
            return res.status(400).json({ error: "Profile data is required for strategy generation." });
        }

        const strategyReport = IntelligenceEngine.generateCareerStrategy(userProfile);

        return res.json({
            success: true,
            data: strategyReport
        });
    } catch (error) {
        console.error("AI Engine Error:", error);
        return res.status(500).json({ error: "Failed to generate career strategy report." });
    }
});

// Endpoint to fetch real-time analytics
router.post("/analytics", (req, res) => {
    try {
        const userProfile = req.body.profile;
        // In a real system, we'd offload to an analytics service

        return res.json({
            success: true,
            message: "Analytics processed successfully on the backend."
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        return res.status(500).json({ error: "Failed to process analytics." });
    }
});

export default router;
