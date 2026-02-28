import { Request, Response } from 'express';
import User from '../models/User';
import Roadmap from '../models/Roadmap';
import Analytics from '../models/Analytics';
import { catchAsync } from '../utils/catchAsync';

// @desc    Get dashboard metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
export const getDashboardMetrics = catchAsync(async (req: Request, res: Response) => {
    const totalUsers = await User.countDocuments();
    const totalRoadmaps = await Roadmap.countDocuments();

    // Basic analytics for the past 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentRoadmaps = await Roadmap.countDocuments({ createdAt: { $gte: lastWeek } });

    const avgResponseTimeData = await Analytics.aggregate([
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
export const getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(100);
    res.status(200).json(users);
});
