import { z } from 'zod';
import Roadmap, { getStore } from '../models/Roadmap.js';
import { generateAIRoadmap } from '../services/aiService.js';
import { catchAsync } from '../utils/catchAsync.js';

const generateRoadmapSchema = z.object({
    career: z.string().min(2, 'Career title is required'),
    experienceLevel: z.string().min(2, 'Experience level is required'),
    timeCommitment: z.string().min(2, 'Time commitment is required'),
    currentSkills: z.string().optional().default('None'),
    goal: z.string().min(2, 'Goal is required'),
});

// @desc    Generate a new AI Roadmap
// @route   POST /api/roadmaps/generate
// @access  Private
export const generateRoadmap = catchAsync(async (req, res) => {
    const parsed = generateRoadmapSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400);
        throw new Error(parsed.error.issues[0].message);
    }

    const { career, experienceLevel, timeCommitment, currentSkills, goal } = parsed.data;

    // 1. Generate the roadmap data from HuggingFace
    const roadmapData = await generateAIRoadmap({
        career,
        experienceLevel,
        timeCommitment,
        currentSkills,
        goal,
    });

    // 2. Save it to the database linked to the user
    const Store = getStore();
    const roadmap = await Store.create({
        userId: req.user._id,
        careerTitle: roadmapData.careerTitle || career,
        careerSummary: roadmapData.careerSummary || `Career path for ${career}`,
        roadmapData,
    });

    res.status(201).json(roadmap);
});

// @desc    Get all roadmaps for the logged-in user
// @route   GET /api/roadmaps
// @access  Private
export const getMyRoadmaps = catchAsync(async (req, res) => {
    const Store = getStore();
    const roadmaps = await Store.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(roadmaps);
});

// @desc    Get a specific roadmap by ID
// @route   GET /api/roadmaps/:id
// @access  Private
export const getRoadmapById = catchAsync(async (req, res) => {
    const Store = getStore();
    const roadmap = await Store.findById(req.params.id);

    if (roadmap && roadmap.userId.toString() === req.user._id.toString()) {
        res.status(200).json(roadmap);
    } else {
        res.status(404);
        throw new Error('Roadmap not found or access denied');
    }
});

// @desc    Delete a roadmap
// @route   DELETE /api/roadmaps/:id
// @access  Private
export const deleteRoadmap = catchAsync(async (req, res) => {
    const Store = getStore();
    const roadmap = await Store.findById(req.params.id);

    if (roadmap && (roadmap.userId.toString() === req.user._id.toString() || roadmap.userId.equals(req.user._id))) {
        await roadmap.deleteOne();
        res.status(200).json({ message: 'Roadmap removed' });
    } else {
        res.status(404);
        throw new Error('Roadmap not found or access denied');
    }
});
// @desc    Mark a module as completed and update progress
// @route   POST /api/roadmaps/:id/complete
// @access  Private
export const completeModule = catchAsync(async (req, res) => {
    const { moduleId, skills } = req.body;
    const Store = getStore();
    const UserStore = (await import('../models/User.js')).getStore();

    const roadmap = await Store.findById(req.params.id);
    const user = await UserStore.findById(req.user._id);

    if (!roadmap || roadmap.userId.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Roadmap not found or access denied');
    }

    // Update Completed Modules in Roadmap state if needed, but mainly update the user tracking
    if (!user.progressTracking.completedModules.includes(moduleId)) {
        user.progressTracking.completedModules.push(moduleId);
        user.progressTracking.skillsLearned += 1;
    }

    // Update Skill Progress (0-100)
    if (skills && typeof skills === 'object') {
        const currentSkillsProgress = user.skillsProgress || {};
        Object.keys(skills).forEach(skill => {
            currentSkillsProgress[skill] = skills[skill];
        });
        user.skillsProgress = currentSkillsProgress;
    }

    // Calculate Job Readiness Score (Basic Logic)
    const modulesCount = roadmap.roadmapData?.learning_route?.length || 1;
    const completedCount = user.progressTracking.completedModules.length;
    user.careerReadinessScore = Math.floor((completedCount / modulesCount) * 100);

    await user.save();
    res.status(200).json({
        success: true,
        score: user.careerReadinessScore,
        completedModules: user.progressTracking.completedModules
    });
});

// @desc    Update a roadmap (e.g., userSkills)
// @route   PUT /api/roadmaps/:id
// @access  Private
export const updateRoadmap = catchAsync(async (req, res) => {
    const Store = getStore();
    const roadmap = await Store.findById(req.params.id);

    if (roadmap && (roadmap.userId.toString() === req.user._id.toString() || roadmap.userId.equals(req.user._id))) {
        roadmap.userSkills = req.body.userSkills !== undefined ? req.body.userSkills : roadmap.userSkills;
        
        const updatedRoadmap = await roadmap.save();
        res.status(200).json(updatedRoadmap);
    } else {
        res.status(404);
        throw new Error('Roadmap not found or access denied');
    }
});
