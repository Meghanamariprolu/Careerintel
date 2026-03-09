/**
 * Adaptive Learning Engine
 * Dynamically updates learning roadmaps based on skill progress.
 */

export const analyzeSkillProgress = (learningProgress) => {
    const completedCount = Object.values(learningProgress).filter(v => v === true).length;
    const totalCount = Object.keys(learningProgress).length || 1;
    return (completedCount / totalCount) * 100;
};

export const generateNextSkills = (learningProgress) => {
    const recommendations = [];

    if (learningProgress.python && learningProgress.machineLearning && !learningProgress.deepLearning) {
        recommendations.push({
            skill: "Deep Learning",
            reason: "Logical sequence after Machine Learning",
            project: "Neural Network Constructor"
        });
    }

    if (learningProgress.javascript && !learningProgress.typescript) {
        recommendations.push({
            skill: "TypeScript",
            reason: "Essential for robust enterprise development",
            project: "Typed API Wrapper"
        });
    }

    if (learningProgress.react && !learningProgress.nextjs) {
        recommendations.push({
            skill: "Next.js",
            reason: "Current industry standard for React frameworks",
            project: "SEO-Optimized Portfolio"
        });
    }

    return recommendations;
};

export const updateLearningRoute = (currentRoute, learningProgress) => {
    // Logic to prune completed items and add new recommendations to the roadmap
    const nextSkills = generateNextSkills(learningProgress);

    return {
        ...currentRoute,
        recommendations: nextSkills,
        overallProgress: analyzeSkillProgress(learningProgress)
    };
};
