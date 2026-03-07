import { Request, Response } from 'express';
import { z } from 'zod';
import Roadmap from '../models/Roadmap';
import { generateAIRoadmap } from '../services/aiService';
import { catchAsync } from '../utils/catchAsync';

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
export const generateRoadmap = catchAsync(async (req: any, res: Response) => {
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
    const roadmap = await Roadmap.create({
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
export const getMyRoadmaps = catchAsync(async (req: any, res: Response) => {
    const roadmaps = await Roadmap.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(roadmaps);
});

// @desc    Get a specific roadmap by ID
// @route   GET /api/roadmaps/:id
// @access  Private
// @ts-ignore
export const getRoadmapById = catchAsync(async (req: any, res: Response) => {
    const roadmap = await Roadmap.findById(req.params.id);

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
// @ts-ignore
export const deleteRoadmap = catchAsync(async (req: any, res: Response) => {
    const roadmap = await Roadmap.findById(req.params.id);

    if (roadmap && (roadmap.userId.toString() === req.user._id.toString() || roadmap.userId.equals(req.user._id))) {
        await roadmap.deleteOne();
        res.status(200).json({ message: 'Roadmap removed' });
    } else {
        res.status(404);
        throw new Error('Roadmap not found or access denied');
    }
});
