import { catchAsync } from '../utils/catchAsync.js';
import { getStore } from '../models/User.js';
import { getStore as getRoadmapStore } from '../models/Roadmap.js';
import { enhanceResumeAPI, generateScenarioResponse, generateCoachResponse, generateAIRoadmap } from '../services/aiService.js';

// @desc    Analyze user interests and map to careers
// @route   POST /api/behavior-analysis
// @access  Private
export const behaviorAnalysis = catchAsync(async (req, res) => {
    // In a real application, call an AI service (like OpenAI) here
    // For this implementation, we will mock the AI response based on interests
    const { interests } = req.body;

    if (!interests || interests.length === 0) {
        return res.status(400).json({ error: 'Interests are required' });
    }

    // Mock AI categorization
    const recommendations = [
        { title: 'Data Scientist', matchScore: 95, reason: 'High match with analytical interests.' },
        { title: 'Machine Learning Engineer', matchScore: 88, reason: 'Aligns with technical and algorithmic focus.' },
        { title: 'AI Research Scientist', matchScore: 82, reason: 'Good fit for theoretical and research interests.' }
    ];

    res.status(200).json({
        success: true,
        data: recommendations
    });
});

// @desc    Compare user skills vs required skills
// @route   POST /api/skill-gap
// @access  Private
export const skillGap = catchAsync(async (req, res) => {
    const { targetRole, currentSkills } = req.body;

    if (!targetRole) {
        return res.status(400).json({ error: 'Target role is required' });
    }

    // Mock AI comparison
    const requiredSkills = ['Machine Learning', 'SQL', 'Data Visualization', 'Statistics', 'Python'];
    const userSkillsLower = (currentSkills || []).map(s => s.toLowerCase());

    const missingSkills = requiredSkills.filter(skill => !userSkillsLower.includes(skill.toLowerCase()));

    res.status(200).json({
        success: true,
        data: {
            targetRole,
            currentSkills: currentSkills || [],
            requiredSkills,
            missingSkills
        }
    });
});

// @desc    Get market insights for a career
// @route   GET /api/market-insights
// @access  Private
export const marketInsights = catchAsync(async (req, res) => {
    const { role } = req.query;

    if (!role) {
        return res.status(400).json({ error: 'Role query parameter is required' });
    }

    // Mock external API data
    const insights = {
        role,
        averageSalary: '$120,000 - $160,000',
        topSkills: ['Python', 'SQL', 'Machine Learning', 'AWS'],
        hiringCompanies: ['Google', 'Amazon', 'Meta', 'Netflix', 'Startups'],
        demandTrend: 'High Growth (+22% YoY)'
    };

    res.status(200).json({
        success: true,
        data: insights
    });
});

// @desc    Generate a timeline roadmap (Legacy compatibility)
// @route   POST /api/generate-roadmap
// @access  Private
export const generateRoadmap = catchAsync(async (req, res) => {
    const { targetRole, timeframe } = req.body;

    if (!targetRole) {
        return res.status(400).json({ error: 'Target role is required' });
    }

    // Call the robust AI service to get a detailed roadmap
    // We map 'timeframe' to 'timeCommitment' and provide default goal
    const roadmapData = await generateAIRoadmap({
        career: targetRole,
        experienceLevel: timeframe || 'Beginner',
        timeCommitment: '15 hours/week',
        currentSkills: 'None',
        goal: 'Job Readiness'
    });

    // Save to Local/DB
    const RoadmapStore = getRoadmapStore();
    const roadmapDoc = await RoadmapStore.create({
        userId: req.user._id,
        careerTitle: targetRole,
        careerSummary: roadmapData.careerSummary || `Timeline Roadmap for ${targetRole}`,
        roadmapData: roadmapData, // Save the full AI structure
    });

    res.status(200).json({
        success: true,
        data: roadmapData, 
        roadmapId: roadmapDoc._id
    });
});

// @desc    Recommend portfolio projects
// @route   POST /api/project-recommendations
// @access  Private
export const projectRecommendations = catchAsync(async (req, res) => {
    const { targetRole } = req.body;

    if (!targetRole) {
        return res.status(400).json({ error: 'Target role is required' });
    }

    // Mock AI project recommendations
    const projects = [
        { title: 'House Price Prediction Model', difficulty: 'Beginner', skills: ['Python', 'Pandas', 'Scikit-learn'] },
        { title: 'Customer Churn Analysis', difficulty: 'Intermediate', skills: ['SQL', 'Data Visualization', 'XGBoost'] },
        { title: 'NLP Chatbot Assistant', difficulty: 'Advanced', skills: ['Transformers', 'PyTorch', 'FastAPI'] }
    ];

    res.status(200).json({
        success: true,
        data: projects
    });
});

// @desc    Simulate a career scenario
// @route   POST /api/scenario-simulation
// @access  Private
export const scenarioSimulation = catchAsync(async (req, res) => {
    const { scenarioType, targetRole } = req.body;

    // Mock AI scenario generation
    const scenarios = {
        'Technical Interview': {
            title: 'The System Design Challenge',
            context: `You are interviewing for a Senior ${targetRole} position at a global tech firm.`,
            challenge: 'Walk us through how you would architect a real-time notification system that handles 100k requests per second with <50ms latency.',
            options: [
                'Use WebSockets with a Redis Pub/Sub layer for horizontal scaling.',
                'Implement a polling mechanism using a standard relational database.',
                'Use server-sent events (SSE) with a distributed load balancer.'
            ]
        },
        'Salary Negotiation': {
            title: 'The Counter-Offer Strategy',
            context: 'You received an offer that is 10% below your expectations, but the equity package is strong.',
            challenge: 'How do you phrase your request for an increased base salary while acknowledging the equity benefits?',
            options: [
                'State your market value data and ask if there is flexibility in the base range.',
                'Accept immediately but ask for a performance review in 3 months.',
                'Reject the offer and wait for them to reach out with a better one.'
            ]
        },
        'Leadership in Crisis': {
            title: 'Critical Outage Response',
            context: 'A major production database is down, impacting thousands of users, and your team is panicking.',
            challenge: 'What is your immediate communication and stabilization strategy for the next 15 minutes?',
            options: [
                'Establish a command bridge, assign leads to investigating the root cause and communicating to stakeholders.',
                'Shut down all services to prevent data corruption and await a full backup restore.',
                'Delegate all communication to the PR department and start debugging the code directly.'
            ]
        },
        'Handling a Difficult Co-worker': {
            title: 'Interpersonal Conflict Resolution',
            context: 'A teammate consistently misses their deliverables, and it is starting to reflect on your performance.',
            challenge: 'How do you approach a 1-on-1 feedback session that is constructive yet firm about your boundaries?',
            options: [
                'Use "I" statements to express impact, ask if they need support, and agree on clear deadlines.',
                'Escalate immediately to the manager without talking to the coworker first.',
                'Do their work for them silently to ensure the project succeeds.'
            ]
        }
    };

    const selectedScenario = scenarios[scenarioType] || scenarios['Technical Interview'];

    res.status(200).json({
        success: true,
        data: selectedScenario
    });
});

// @desc    AI Coaching Chat / Mentor Personas
// @route   POST /api/ai-coach
// @access  Private
export const aiCoach = catchAsync(async (req, res) => {
    const { message, persona, chatHistory, userContext } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Use AI Engine for coaching responses, with user and career context
    const reply = await generateCoachResponse(
        message,
        persona,
        chatHistory || [],
        userContext || {}
    );

    res.status(200).json({
        success: true,
        data: {
            reply,
            persona
        }
    });
});

// @desc    Generate Career Intelligence Report
// @route   GET /api/generate-report
// @access  Private
export const generateReport = catchAsync(async (req, res) => {
    const UserStore = getStore();
    const userProfile = await UserStore.findById(req.user.id);

    // Mock Report Generation
    const report = {
        userName: userProfile.name,
        date: new Date().toLocaleDateString(),
        overallScore: userProfile.careerReadinessScore || 45,
        executiveSummary: `Based on your goal of becoming a ${userProfile.careerGoal || 'Professional'}, you have shown significant activity in ${userProfile.interests?.join(', ') || 'your chosen field'}.`,
        milestones: [
            { name: 'Onboarding Completed', status: 'Completed', date: userProfile.createdAt },
            { name: 'Initial Skill Assessment', status: 'Completed', score: 65 },
            { name: 'Roadmap Generation', status: 'Completed' }
        ],
        recommendations: [
            'Increase focus on high-demand technical skills highlighted in your skill gap analysis.',
            'Engage with "The Strategist" mentor persona more frequently to align with market shifts.'
        ]
    };

    res.status(200).json({
        success: true,
        data: report
    });
});

// @desc    Get Career Analytics
// @route   GET /api/career-analytics
// @access  Private
export const careerAnalytics = catchAsync(async (req, res) => {
    // Mock Analytics Data
    const analytics = {
        skillProgression: [
            { week: 'W1', score: 30 },
            { week: 'W2', score: 35 },
            { week: 'W3', score: 50 },
            { week: 'W4', score: 65 }
        ],
        marketAlignment: 82,
        interviewReadiness: 45,
        activityHeatmap: [0, 2, 5, 3, 8, 1, 4] // Sun-Sat activity
    };

    res.status(200).json({
        success: true,
        data: analytics
    });
});

// @desc    Get Outcome & ROI Tracking Data
// @route   GET /api/outcome-tracking
// @access  Private
export const outcomeTracking = catchAsync(async (req, res) => {
    // Mock Outcome Data
    const outcomes = {
        salaryProjection: '+35%',
        skillMastery: '82%',
        marketReadiness: 'Elite',
        milestones: [
            { title: 'Principal Architect Leap', date: 'Q4 2026', status: 'In Progress', progress: 65 },
            { title: 'System Design Mastery', date: 'Q2 2026', status: 'Nearly Done', progress: 92 },
            { title: 'Full-Stack Foundation', date: 'Completed', status: 'Achieved', progress: 100 },
        ],
        roiInsights: "Your current trajectory predicts a 2.4x increase in career leverage within 18 months.",
        estimatedMarketWorth: "$185k - $220k"
    };

    res.status(200).json({
        success: true,
        data: outcomes
    });
});

// @desc    Enhance resume and calculate ATS score
// @route   POST /api/resume-enhance
// @access  Private
export const resumeEnhance = catchAsync(async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
        return res.status(400).json({ error: 'Resume text is required' });
    }

    // Call the new AI Engine for Resume Enhancement
    const enhancedResume = await enhanceResumeAPI(resumeText, jobDescription || 'General Tech Role');

    const atsScore = 85; // This could be calculated dynamically in the future
    const improvements = [
        'Added missing ATS keywords',
        'Improved project descriptions',
        'Optimized resume structure for ATS parsing'
    ];

    res.status(200).json({
        success: true,
        data: {
            enhancedResume,
            atsScore,
            improvements
        }
    });
});
// @desc    Get Career Readiness Score (dynamic, based on user profile)
// @route   GET /api/career-score
// @access  Private
export const careerScore = catchAsync(async (req, res) => {
    const UserStore = getStore();
    const user = await UserStore.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { skills = [], careerGoal, experienceLevel, progressTracking = {} } = user;

    // --- Dynamic Scoring Engine ---

    // 1. Skill Coverage (0-35 pts): score based on number of skills in profile
    const skillScore = Math.min(skills.length * 5, 35);

    // 2. Career Clarity (0-20 pts): has the user set a goal?
    const clarityScore = careerGoal && careerGoal.length > 2 ? 20 : 0;

    // 3. Experience Level (0-20 pts)
    const expMap = { 'Beginner': 5, 'Intermediate': 10, 'Advanced': 15, 'Expert': 20 };
    const experienceScore = expMap[experienceLevel] || 5;

    // 4. Active Progress (0-25 pts): courses + projects + completed modules
    const coursesScore = Math.min((progressTracking.coursesCompleted || 0) * 5, 10);
    const projectsScore = Math.min((progressTracking.projectsBuilt || 0) * 5, 10);
    const modulesScore = Math.min((progressTracking.completedModules?.length || 0) * 1, 5);
    const progressScore = coursesScore + projectsScore + modulesScore;

    const total = Math.round(skillScore + clarityScore + experienceScore + progressScore);

    // Label
    let label = 'Getting Started';
    if (total >= 80) label = 'Elite';
    else if (total >= 65) label = 'Advanced';
    else if (total >= 45) label = 'Intermediate';

    // Milestone recommendations
    const recommendations = [];
    if (skills.length < 5) recommendations.push('Add more skills to your profile to increase your score.');
    if (!careerGoal) recommendations.push('Set a career goal to unlock a personalised roadmap.');
    if ((progressTracking.projectsBuilt || 0) < 2) recommendations.push('Build 2+ projects to show market execution.');
    if ((progressTracking.coursesCompleted || 0) < 3) recommendations.push('Complete 3 courses to demonstrate continuous learning.');

    res.status(200).json({
        success: true,
        data: {
            score: total,
            label,
            breakdown: {
                skills: skillScore,
                careerClarity: clarityScore,
                experience: experienceScore,
                progressActivity: progressScore
            },
            maxScores: { skills: 35, careerClarity: 20, experience: 20, progressActivity: 25 },
            recommendations
        }
    });
});

