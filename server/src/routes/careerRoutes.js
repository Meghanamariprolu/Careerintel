import express from 'express';
import { behaviorAnalysis, skillGap, marketInsights, generateRoadmap, projectRecommendations, resumeEnhance, scenarioSimulation, aiCoach, generateReport, careerAnalytics, outcomeTracking, careerScore } from '../controllers/careerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/behavior-analysis', protect, behaviorAnalysis);
router.post('/skill-gap', protect, skillGap);
router.get('/market-insights', protect, marketInsights);

// Phase 3 Routes
router.post('/generate-roadmap', protect, generateRoadmap);
router.post('/project-recommendations', protect, projectRecommendations);
router.post('/resume-enhance', protect, resumeEnhance);

// Phase 4 Routes
router.post('/scenario-simulation', protect, scenarioSimulation);
router.post('/ai-coach', protect, aiCoach);

// Phase 5 Routes
router.get('/generate-report', protect, generateReport);
router.get('/career-analytics', protect, careerAnalytics);
router.get('/outcome-tracking', protect, outcomeTracking);
router.get('/career-score', protect, careerScore);

export default router;
