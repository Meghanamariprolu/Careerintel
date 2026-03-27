"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, Sparkles, ArrowLeft,
    ArrowUpRight, Target, Brain,
    FileText, Briefcase, Compass,
    Activity, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useUserProfile } from '@/context/UserProfileContext';
import { calculateCareerAnalytics } from '@/services/analyticsService';

import axios from 'axios';

export default function AnalyticsDashboardPage() {
    const { profile } = useUserProfile();
    const [analyticsData, setAnalyticsData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/career-analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setAnalyticsData(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const metrics = useMemo(() => {
        if (!analyticsData) return {
            careerReadiness: profile?.careerReadinessScore || 0,
            skillMatch: 0,
            resumeScore: profile?.resumeScore || 0,
            portfolioStrength: 0,
            learningProgress: 0
        };

        return {
            careerReadiness: profile?.careerReadinessScore || 45,
            skillMatch: analyticsData.marketAlignment || 0,
            resumeScore: profile?.resumeScore || 0,
            portfolioStrength: 65,
            learningProgress: 80
        };
    }, [analyticsData, profile]);

    const chartData = [
        { label: 'Market Match', value: metrics.skillMatch, color: 'bg-emerald-500' },
        { label: 'Resume Power', value: metrics.resumeScore, color: 'bg-blue-500' },
        { label: 'Portfolio Heat', value: metrics.portfolioStrength, color: 'bg-purple-500' },
        { label: 'Learning Velocity', value: metrics.learningProgress, color: 'bg-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="mb-6">
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ x: -10 }} className="flex items-center gap-2 text-white/70 hover:text-white text-xs  font-semibold  transition-colors mb-4 md:mb-6"
                        >
                            <ArrowLeft className="h-3 w-3" /> Command Center
                        </motion.button>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2.5 text-sm  font-semibold  text-blue-400 shadow-xl"
                            >
                                <Activity className="h-2.5 w-2.5" /> GROWTH TELEMETRY STREAM
                            </motion.div>
                            <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-blue-400">
                                Analytics Registry Node<span className="text-blue-500">.</span>
                            </h1>
                            <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                                Advanced visualization of professional momentum. Measurement protocols across readiness, acquisition gradients, and market compatibility.
                            </p>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                            {/* Big Readiness Meter */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2 p-4 md:p-6 rounded-lg bg-white/[0.03] border border-white/5 backdrop-blur-3xl relative overflow-hidden flex items-center justify-between gap-8"
                            >
                                <div className="relative z-10 space-y-4">
                                    <div>
                                        <h4 className="text-sm  font-semibold  text-white/90 mb-1.5">Performance Matrix</h4>
                                        <h2 className="text-lg md:text-xl font-semibold text-white/90 ">Career Readiness Alpha</h2>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl md:text-4xl font-semibold text-blue-400/90 tabular-nums ">{metrics.careerReadiness}%</span>
                                        <div className="flex items-center gap-1 text-emerald-500/60 text-xs  font-semibold  italic">
                                            <ArrowUpRight className="h-2.5 w-2.5" /> +12% delta
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${metrics.careerReadiness}%` }}
                                                transition={{ duration: 2, ease:"easeOut" }} className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative h-32 w-32 hidden md:block">
                                    <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                                    <svg className="h-full w-full -rotate-90">
                                        <circle cx="64" cy="64" r="60" fill="transparent" stroke="currentColor" strokeWidth="6"
                                            strokeDasharray={2 * Math.PI * 60}
                                            strokeDashoffset={2 * Math.PI * 60 * (1 - metrics.careerReadiness / 100)} className="text-blue-500 transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Zap className="h-8 w-8 text-blue-400 blur-sm absolute" />
                                        <Zap className="h-8 w-8 text-blue-400" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Meta Stats */}
                            <div className="grid grid-cols-1 gap-3">
                                <motion.div
                                    whileHover={{ y: -2 }} className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-3xl shadow-xl"
                                >
                                    <h4 className="text-sm font-semibold   text-emerald-400/40 mb-1.5">Market Alignment</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg md:text-xl font-semibold text-white">{metrics.skillMatch}%</span>
                                        <Compass className="h-4 w-4 text-emerald-400/60" />
                                    </div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ y: -2 }} className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 backdrop-blur-3xl shadow-xl"
                                >
                                    <h4 className="text-sm font-semibold   text-purple-400/40 mb-1.5">Authority Level</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg md:text-xl font-semibold text-white">{metrics.resumeScore}%</span>
                                        <FileText className="h-4 w-4 text-purple-400/60" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Detailed Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }} className="p-6 rounded-lg bg-white/[0.02] border border-white/5 backdrop-blur-3xl"
                            >
                                <h3 className="text-xs font-semibold text-white/70 mb-8">Growth Delta Matrix</h3>
                                <div className="space-y-6">
                                    {chartData.map(item => (
                                        <div key={item.label}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs  font-semibold  text-white/90">{item.label}</span>
                                                <span className="text-xs font-semibold text-white/90">{item.value}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.value}%` }}
                                                    transition={{ duration: 1.5, ease:"easeOut" }}
                                                    className={`h-full ${item.color} shadow-[0_0_8px_rgba(59,130,246,0.3)]`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }} className="p-6 rounded-lg bg-slate-900/40 border border-blue-500/10 backdrop-blur-3xl flex flex-col justify-between shadow-2xl"
                            >
                                <div>
                                    <h3 className="text-xs font-semibold text-white/70 mb-6">Market Alignment Outlook</h3>
                                    <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-white/[0.01] border border-white/5 shadow-xl">
                                        <div className="h-10 w-10 rounded-md bg-blue-500/20 flex items-center justify-center border border-blue-500/20 shadow-xl">
                                            <Activity className="h-5 w-5 text-blue-400/60" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold   text-white/90">Velocity Protocol</p>
                                            <p className="text-sm font-semibold text-white  ">Accelerated Sync Path</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed font-medium italic border-l border-blue-500/20 pl-4 py-1">"Your technical acquisition rate is <span className="text-blue-400 font-semibold">2.1x faster</span> than the industry average for Senior roles. Maintaining this velocity will put you in the top percentile of 'Architect Ready' candidates within 6 months."
                                    </p>
                                </div>

                                <div className="pt-8">
                                    <div className="flex items-center justify-between text-xs font-semibold   text-white/90 italic">
                                        <span>PLATFORM BENCHMARK ELITE SYNC</span>
                                        <span>STATUS: PRECISION MATCH</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
