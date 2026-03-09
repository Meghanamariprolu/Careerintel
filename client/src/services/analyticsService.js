/**
 * Analytics Service
 * Calculates platform-wide metrics for visualization.
 */

export const calculateCareerAnalytics = (profile) => {
    const {
        learningProgress = {},
        resumeScore = 0,
        currentSkills = [],
        marketInsights = {}
    } = profile;

    const trendingSkills = marketInsights.trendingSkills || ["React", "Node.js", "AI"];

    // Skill Match calculation
    const matchedSkills = currentSkills.filter(s => trendingSkills.includes(s));
    const skillMatch = Math.round((matchedSkills.length / Math.max(1, trendingSkills.length)) * 100);

    // Learning Progress
    const completed = Object.values(learningProgress).filter(v => v === true).length;
    const total = Object.keys(learningProgress).length || 1;
    const learningProgressPct = Math.round((completed / total) * 100);

    // Mock Portfolio Strength (based on count for this demo)
    const portfolioStrength = Math.min(100, (profile.portfolioProjects?.length || 0) * 20);

    return {
        careerReadiness: Math.round((skillMatch + resumeScore + portfolioStrength + learningProgressPct) / 4),
        skillMatch,
        resumeScore,
        portfolioStrength,
        learningProgress: learningProgressPct,
        timeline: [
            { month: 'Jan', progress: 20 },
            { month: 'Feb', progress: 35 },
            { month: 'Mar', progress: learningProgressPct }
        ]
    };
};
