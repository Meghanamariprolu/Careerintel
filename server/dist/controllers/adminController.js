"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getDashboardMetrics = void 0;
const User_1 = __importDefault(require("../models/User"));
const Roadmap_1 = __importDefault(require("../models/Roadmap"));
const Analytics_1 = __importDefault(require("../models/Analytics"));
const catchAsync_1 = require("../utils/catchAsync");
// @desc    Get dashboard metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
exports.getDashboardMetrics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const totalUsers = await User_1.default.countDocuments();
    const totalRoadmaps = await Roadmap_1.default.countDocuments();
    // Basic analytics for the past 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentRoadmaps = await Roadmap_1.default.countDocuments({ createdAt: { $gte: lastWeek } });
    const avgResponseTimeData = await Analytics_1.default.aggregate([
        { $match: { timestamp: { $gte: lastWeek } } },
        { $group: { _id: null, avgTime: { $avg: '$responseTime' } } }
    ]);
    res.status(200).json({
        totalUsers,
        totalRoadmaps,
        recentRoadmaps,
        avgResponseTime: avgResponseTimeData.length > 0 ? avgResponseTimeData[0].avgTime : 0,
    });
});
// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await User_1.default.find({}).select('-password').sort({ createdAt: -1 }).limit(100);
    res.status(200).json(users);
});
