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
                <header className="mb-16">
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ x: -10 }}
                            className="flex items-center gap-2 text-white/70 hover:text-white  text-xs uppercase tracking-widest transition-colors mb-8"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Intelligence Hub
                        </motion.button>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 text-[10px] md:text-xs  uppercase tracking-[0.25em] text-blue-300 shadow-xl"
                            >
                                <Activity className="h-3 w-3" /> Real-time Growth Telemetry
                            </motion.div>
                            <h1 className="text-base md:text-xl tracking-[0.1em] text-white/90 uppercase">
                                Career Analytics Engine<span className="text-blue-500">.</span>
                            </h1>
                            <p className="text-sm md:text-lg text-white/70 max-w-2xl mt-4  leading-relaxed">
                                Advanced data visualization of your professional momentum. Track readiness, skill acquisition gradients, and market compatibility.
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
                                animate={{ opacity: 1, scale: 1 }}
                                className="lg:col-span-2 p-12 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl relative overflow-hidden flex items-center justify-between gap-12"
                            >
                                <div className="relative z-10 space-y-8">
                                    <div>
                                        <h4 className="text-[10px] md:text-xs  uppercase tracking-widest text-white/30 mb-2">Composite Performance Index</h4>
                                        <h2 className="text-base md:text-3xl text-white/90 tracking-[0.05em]">Career Readiness</h2>
                                    </div>
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-lg md:text-5xl text-blue-400/90 tabular-nums tracking-tighter">{metrics.careerReadiness}%</span>
                                        <div className="flex items-center gap-1 text-emerald-400  text-xs md:text-base">
                                            <ArrowUpRight className="h-5 w-5" /> +12% vs last month
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${metrics.careerReadiness}%` }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-blue-600 to-emerald-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative h-48 w-48 hidden md:block">
                                    <div className="absolute inset-0 rounded-full border-8 border-white/5" />
                                    <svg className="h-full w-full -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            strokeDasharray={2 * Math.PI * 88}
                                            strokeDashoffset={2 * Math.PI * 88 * (1 - metrics.careerReadiness / 100)}
                                            className="text-blue-500 transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Zap className="h-12 w-12 text-blue-400 blur-sm absolute" />
                                        <Zap className="h-12 w-12 text-blue-400" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Meta Stats */}
                            <div className="grid grid-cols-1 gap-6">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-3xl"
                                >
                                    <h4 className="text-[10px]  uppercase tracking-widest text-emerald-400/60 mb-2">Skills Foundational</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base md:text-2xl  text-white">{metrics.skillMatch}%</span>
                                        <Compass className="h-6 w-6 text-emerald-400" />
                                    </div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-3xl"
                                >
                                    <h4 className="text-[10px]  uppercase tracking-widest text-purple-400/60 mb-2">Resume Authority</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base md:text-2xl  text-white">{metrics.resumeScore}%</span>
                                        <FileText className="h-6 w-6 text-purple-400" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Detailed Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-10 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl"
                            >
                                <h3 className="text-base md:text-xl  text-white mb-10 uppercase tracking-widest">Growth Projections</h3>
                                <div className="space-y-10">
                                    {chartData.map(item => (
                                        <div key={item.label}>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] md:text-xs  uppercase tracking-widest text-white/70">{item.label}</span>
                                                <span className="text-sm md:text-lg  text-white">{item.value}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.value}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className={`h-full ${item.color} shadow-[0_0_10px_rgba(59,130,246,0.3)]`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-10 rounded-xl bg-gradient-to-br from-blue-500/10 via-transparent to-transparent border border-white/10 backdrop-blur-3xl flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-base md:text-xl  text-white mb-8 uppercase tracking-widest">Market Alignment</h3>
                                    <div className="flex items-center gap-6 mb-8 p-6 rounded-xl bg-white/5 border border-white/5">
                                        <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                            <Activity className="h-6 w-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px]  uppercase tracking-widest text-white/30">Velocity Check</p>
                                            <p className="text-sm md:text-lg  text-white">Accelerated Growth Path</p>
                                        </div>
                                    </div>
                                    <p className="text-sm md:text-lg text-white/75 leading-relaxed ">
                                        "Your technical acquisition rate is <span className="text-blue-400 ">2.1x faster</span> than the industry average for Senior roles. Maintaining this velocity will put you in the top percentile of 'Architect Ready' candidates within 6 months."
                                    </p>
                                </div>

                                <div className="pt-8">
                                    <div className="flex items-center justify-between text-[10px]  uppercase tracking-widest text-white/20">
                                        <span>Platform Benchmark</span>
                                        <span>Elite Status</span>
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
