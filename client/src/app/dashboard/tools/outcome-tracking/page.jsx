"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, Sparkles, ArrowLeft,
    TrendingUp, Target, ChevronRight,
    Milestone, Calendar, DollarSign,
    ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { NextModulePrompter } from '@/components/NextModulePrompter';

import axios from 'axios';

export default function OutcomeTrackingPage() {
    const [outcomeData, setOutcomeData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchOutcomes = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/outcome-tracking', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setOutcomeData(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch outcomes", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOutcomes();
    }, []);

    const outcomes = React.useMemo(() => {
        if (!outcomeData) return [
            { title: 'Salary Projection', value: '...', trend: 'Calculating', color: 'bg-emerald-500' },
            { title: 'Skill Mastery', value: '...', trend: 'Analysing', color: 'bg-blue-500' },
            { title: 'Market Readiness', value: '...', trend: 'Ranking', color: 'bg-purple-500' },
        ];

        return [
            { title: 'Salary Projection', value: outcomeData.salaryProjection, trend: 'Upward', color: 'bg-emerald-500' },
            { title: 'Skill Mastery', value: outcomeData.skillMastery, trend: 'Steady', color: 'bg-blue-500' },
            { title: 'Market Readiness', value: outcomeData.marketReadiness, trend: 'Peak', color: 'bg-purple-500' },
        ];
    }, [outcomeData]);
    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
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
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-[10px] md:text-xs  uppercase tracking-[0.25em] text-emerald-300 shadow-xl"
                            >
                                <TrendingUp className="h-3 w-3" /> Performance Intelligence
                            </motion.div>
                            <h1 className="text-lg md:text-2xl  tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-emerald-400 uppercase">
                                Outcome & ROI Tracking<span className="text-emerald-500">.</span>
                            </h1>
                            <p className="text-sm md:text-lg text-white/70 max-w-2xl mt-4  leading-relaxed">
                                Quantifying your growth. Track your journey from skill acquisition to market dominance with AI-powered outcome forecasting.
                            </p>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {outcomes.map((metric, idx) => (
                                <motion.div
                                    key={metric.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-8 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <ArrowUpRight className="h-16 w-16 text-emerald-400" />
                                    </div>
                                    <h4 className="text-[10px] md:text-xs  uppercase tracking-widest text-white/30 mb-2">{metric.title}</h4>
                                    <div className="flex items-baseline gap-3 mb-4">
                                        <span className="text-lg md:text-4xl  text-white">{metric.value}</span>
                                        <span className="text-[10px] md:text-xs  text-emerald-400 uppercase">{metric.trend}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: idx === 0 ? "75%" : idx === 1 ? "82%" : "95%" }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                            className={`h-full rounded-full ${metric.color} shadow-[0_0_15px_rgba(16,185,129,0.4)]`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Roadmap Milestones */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h2 className="text-base md:text-xl  text-white uppercase tracking-widest flex items-center gap-3 mb-8">
                                    <Milestone className="h-6 w-6 text-emerald-500" /> Professional Milestones
                                </h2>
                                {(outcomeData?.milestones || []).map((item, idx) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-6 group hover:bg-white/[0.07] transition-all"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`p-3 rounded-xl ${item.progress === 100 ? 'bg-emerald-500/20' : 'bg-white/5'} border border-white/10`}>
                                                <Calendar className={`h-5 w-5 ${item.progress === 100 ? 'text-emerald-400' : 'text-white/70'}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm md:text-lg  text-white group-hover:text-emerald-400 transition-colors uppercase">{item.title}</h3>
                                                <p className="text-[10px] md:text-xs  text-white/30 uppercase tracking-widest">{item.date} • {item.status}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs md:text-base  text-white/60">{item.progress}%</span>
                                            <div className="h-10 w-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-full bg-emerald-500 transition-all" style={{ height: `${item.progress}%` }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-10 rounded-[3.5rem] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 backdrop-blur-3xl flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                            <Sparkles className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-base md:text-xl  text-white uppercase tracking-widest">ROI Insights</h2>
                                            <p className="text-[10px] md:text-xs text-emerald-400/60  uppercase tracking-widest">Future Valuation Outlook</p>
                                        </div>
                                    </div>
                                    <p className="text-sm md:text-lg text-white/70 leading-relaxed  mb-12">
                                        &ldquo;{outcomeData?.roiInsights}&rdquo;
                                    </p>
                                </div>

                                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                    <h4 className="text-[10px] md:text-xs  uppercase tracking-widest text-white/75 mb-4">Estimated Market Worth</h4>
                                    <div className="flex items-baseline gap-2">
                                        <DollarSign className="h-6 w-6 text-emerald-500" />
                                        <span className="text-lg md:text-4xl  text-white tracking-tighter">{outcomeData?.estimatedMarketWorth}</span>
                                        <span className="text-[10px] md:text-xs  text-white/75 uppercase">Lead Tier</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}

                <NextModulePrompter
                    nextModuleName="Career Intelligence Report"
                    nextModuleHref="/dashboard/report"
                    description="View your comprehensive, unified Strategic Career Report, aggregated from all modules in the Intelligence Pipeline."
                />
            </div>
        </div>
    );
}
