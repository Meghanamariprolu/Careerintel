// Mock Database using localStorage

const USERS_KEY = "career_intel_users";
const ROADMAPS_KEY = "career_intel_roadmaps";

export const mockDb = {
    // --- USER METHODS ---
    getUsers: () => {
        if (typeof window === "undefined") return [];
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    },

    findUserByEmail: (email) => {
        const users = mockDb.getUsers();
        return users.find(u => u.email === email);
    },

    saveUser: (userData) => {
        if (typeof window === "undefined") return;
        const users = mockDb.getUsers();

        if (users.find(u => u.email === userData.email)) {
            throw new Error("User already exists");
        }

        const newUser = {
            ...userData,
            _id: Math.random().toString(36).substr(2, 9),
            role: "user",
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return newUser;
    },

    validateUser: (email, password) => {
        const user = mockDb.findUserByEmail(email);
        if (user && user.password === password) {
            const { password: _, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                token: "mock-jwt-token-" + user._id
            };
        }
        return null;
    },

    // --- ROADMAP METHODS ---
    getRoadmaps: (userId) => {
        if (typeof window === "undefined") return [];
        const roadmaps = localStorage.getItem(ROADMAPS_KEY);
        const allRoadmaps = roadmaps ? JSON.parse(roadmaps) : [];
        if (userId) {
            return allRoadmaps.filter(r => r.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return allRoadmaps;
    },

    getRoadmapById: (id) => {
        const roadmaps = mockDb.getRoadmaps();
        return roadmaps.find(r => r._id === id);
    },

    saveRoadmap: (roadmapData) => {
        if (typeof window === "undefined") return;
        const roadmaps = mockDb.getRoadmaps();
        const newRoadmap = {
            ...roadmapData,
            _id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString()
        };
        roadmaps.push(newRoadmap);
        localStorage.setItem(ROADMAPS_KEY, JSON.stringify(roadmaps));
        return newRoadmap;
    },

    deleteRoadmap: (id) => {
        if (typeof window === "undefined") return;
        const roadmaps = mockDb.getRoadmaps();
        const filtered = roadmaps.filter(r => r._id !== id);
        localStorage.setItem(ROADMAPS_KEY, JSON.stringify(filtered));
        return true;
    },

    // --- FAKE AI GENERATOR ---
    generateRoadmapMock: async (userId, data) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const { career, experienceLevel, goal } = data;

        // Structured fake data relevant to career/study
        const mockAIRoadmap = {
            careerTitle: career,
            careerSummary: `A comprehensive guide to becoming a successful ${career} starting from a ${experienceLevel} level, focused on achieving the goal of ${goal}.`,
            roadmapData: {
                marketDemandScore: 85 + Math.floor(Math.random() * 10),
                salaryRange: {
                    india: "₹8L - ₹25L",
                    global: "$70k - $150k"
                },
                careerReadinessScore: 40,
                futureGrowthPrediction: "High (Exponential growth expected in next 5 years)",
                learningPath: [
                    {
                        level: "Phase 1: Fundamentals",
                        description: `Master the core concepts of ${career}. Focus on theory and basic practical applications.`,
                        skills: ["Core Concepts", "Problem Solving", "Tools Setup"]
                    },
                    {
                        level: "Phase 2: Intermediate Implementation",
                        description: "Building more complex projects and understanding design patterns.",
                        skills: ["Advanced Techniques", "Best Practices", "Small Projects"]
                    },
                    {
                        level: "Phase 3: Professional Excellence",
                        description: "Deep dive into specialized topics and contributing to real-world ecosystems.",
                        skills: ["System Design", "Scalability", "Portfolio Building"]
                    }
                ],
                learningTimeline: [
                    { track: "Intensive", milestone: "3-4 Months" },
                    { track: "Standard", milestone: "6-8 Months" },
                    { track: "Flexible", milestone: "1 Year+" }
                ],
                coreTechnicalSkills: ["Communication", "Critical Thinking", "Technical Writing"],
                currentMarketDemandSkills2025: ["AI Collaboration", "Cloud Architecture", "Data Fluency"],
                supportingTools: ["Git", "VS Code", "Project Management AI"],
                roleSpecificProjects: [
                    {
                        name: "Personal Brand Ecosystem",
                        description: "Create a digital presence showcasing your mastery.",
                        techStack: ["React", "Node", "PostgreSQL"]
                    },
                    {
                        name: "Industry Case Study",
                        description: "A deep analysis of a successful market implementation.",
                        techStack: ["Python", "Pandas", "Tableau"]
                    }
                ],
                interviewPreparation: ["STAR Method", "Algorithm Mastery", "Behavioral Alignment"],
                portfolioGuidance: "Focus on showing 'how' you solved problems, not just the final result."
            }
        };

        return mockDb.saveRoadmap({
            userId,
            ...mockAIRoadmap
        });
    },

    // --- ADMIN METHODS ---
    getAllUsers: () => {
        return mockDb.getUsers();
    },

    getAdminMetrics: () => {
        const users = mockDb.getUsers();
        const roadmaps = mockDb.getRoadmaps();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const recentRoadmaps = roadmaps.filter(r => new Date(r.createdAt) > weekAgo).length;

        return {
            totalUsers: users.length,
            totalRoadmaps: roadmaps.length,
            recentRoadmaps,
            avgResponseTime: 15 + Math.random() * 10 // Mock latency
        };
    }
};
