"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligenceEngine = void 0;
class IntelligenceEngine {
    static generateCareerStrategy(profile) {
        // Robust backend aggregation simulation
        const targetRole = profile.marketInsights?.targetRole || "AI Engineer";
        const trendingSkills = profile.marketInsights?.trendingSkills || ["Deep Learning", "MLOps", "Python"];
        // Compute skill gaps securely on backend
        const skillGaps = trendingSkills.filter((skill) => !profile.currentSkills.includes(skill));
        // Calculate Backend Readiness Score
        let score = (profile.currentSkills.length / Math.max(1, trendingSkills.length)) * 40;
        score += (profile.resumeScore || 0) * 0.2;
        score += (profile.qualityScore || 0) * 0.2;
        score += (profile.portfolioProjects?.length || 0) * 5;
        // Generate tailored NEXT steps
        const recommendedNextSteps = [
            ...skillGaps.map((gap) => `Master ${gap}`),
            ...(profile.portfolioProjects?.length === 0 ? ["Build ML Deployment Project"] : []),
            ...(profile.resumeScore < 75 ? ["Improve resume keywords"] : [])
        ];
        if (recommendedNextSteps.length === 0) {
            recommendedNextSteps.push("Prepare for top-tier interviews");
        }
        return {
            targetRole,
            readinessScore: Math.min(100, Math.round(score)),
            skillGaps,
            recommendedNextSteps
        };
    }
}
exports.IntelligenceEngine = IntelligenceEngine;
