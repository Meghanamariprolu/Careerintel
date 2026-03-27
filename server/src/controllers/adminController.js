import mongoose from 'mongoose';
import { getStore } from '../models/User.js';
import { getStore as getRoadmapStore } from '../models/Roadmap.js';
import Analytics from '../models/Analytics.js';
import { catchAsync } from '../utils/catchAsync.js';

// @desc    Get dashboard metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
export const getDashboardMetrics = catchAsync(async (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    const UserStore = getStore();
    const RoadmapStore = getRoadmapStore();

    if (!isConnected) {
        return res.status(200).json({
            totalUsers: (await UserStore.find({})).length,
            totalRoadmaps: (await RoadmapStore.find({})).length,
            recentRoadmaps: 0,
            avgResponseTime: 0,
            note: 'Running in Local Mode'
        });
    }

    const totalUsers = await UserStore.countDocuments();
    const totalRoadmaps = await RoadmapStore.countDocuments();

    // Basic analytics for the past 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentRoadmaps = await RoadmapStore.countDocuments({ createdAt: { $gte: lastWeek } });

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
export const getUsers = catchAsync(async (req, res) => {
    const UserStore = getStore();
    let users;
    if (mongoose.connection.readyState === 1) {
        users = await UserStore.find({}).select('-password').sort({ createdAt: -1 }).limit(100);
    } else {
        users = await UserStore.find({}); // Local store find
    }
    res.status(200).json(users);
});
