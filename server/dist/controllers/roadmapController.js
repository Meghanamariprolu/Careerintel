"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoadmap = exports.deleteRoadmap = exports.getRoadmapById = exports.getMyRoadmaps = exports.generateRoadmap = void 0;
const zod_1 = require("zod");
const Roadmap_1 = __importDefault(require("../models/Roadmap"));
const aiService_1 = require("../services/aiService");
const catchAsync_1 = require("../utils/catchAsync");
const generateRoadmapSchema = zod_1.z.object({
    career: zod_1.z.string().min(2, 'Career title is required'),
    experienceLevel: zod_1.z.string().min(2, 'Experience level is required'),
    timeCommitment: zod_1.z.string().min(2, 'Time commitment is required'),
    currentSkills: zod_1.z.string().optional().default('None'),
    goal: zod_1.z.string().min(2, 'Goal is required'),
});
// @desc    Generate a new AI Roadmap
// @route   POST /api/roadmaps/generate
// @access  Private
exports.generateRoadmap = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const parsed = generateRoadmapSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400);
        throw new Error(parsed.error.issues[0].message);
    }
    const { career, experienceLevel, timeCommitment, currentSkills, goal } = parsed.data;
    // 1. Generate the roadmap data from HuggingFace
    const roadmapData = await (0, aiService_1.generateAIRoadmap)({
        career,
        experienceLevel,
        timeCommitment,
        currentSkills,
        goal,
    });
    // 2. Save it to the database linked to the user
    const roadmap = await Roadmap_1.default.create({
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
exports.getMyRoadmaps = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const roadmaps = await Roadmap_1.default.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(roadmaps);
});
// @desc    Get a specific roadmap by ID
// @route   GET /api/roadmaps/:id
// @access  Private
// @ts-ignore
exports.getRoadmapById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const roadmap = await Roadmap_1.default.findById(req.params.id);
    if (roadmap && roadmap.userId.toString() === req.user._id.toString()) {
        res.status(200).json(roadmap);
    }
    else {
        res.status(404);
        throw new Error('Roadmap not found or access denied');
    }
});
// @desc    Delete a roadmap
// @route   DELETE /api/roadmaps/:id
// @access  Private
// @ts-ignore
exports.deleteRoadmap = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const roadmap = await Roadmap_1.default.findById(req.params.id);
    if (roadmap && (roadmap.userId.toString() === req.user._id.toString() || roadmap.userId.equals(req.user._id))) {
        await roadmap.deleteOne();
        res.status(200).json({ message: 'Roadmap removed' });
    }
    else {
        res.status(404);
        throw new Error('Roadmap not found or access denied');
    }
});
// @desc    Update a roadmap (e.g., userSkills)
// @route   PUT /api/roadmaps/:id
// @access  Private
// @ts-ignore
exports.updateRoadmap = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const roadmap = await Roadmap_1.default.findById(req.params.id);
    if (roadmap && (roadmap.userId.toString() === req.user._id.toString() || roadmap.userId.equals(req.user._id))) {
        roadmap.userSkills = req.body.userSkills !== undefined ? req.body.userSkills : roadmap.userSkills;
        const updatedRoadmap = await roadmap.save();
        res.status(200).json(updatedRoadmap);
    }
    else {
        res.status(404);
        throw new Error('Roadmap not found or access denied');
    }
});
