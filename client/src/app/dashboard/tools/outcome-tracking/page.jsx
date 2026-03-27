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
        <div className="min-h-screen bg-[#050510] text-white px-4 md:px-6 pb-16 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
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
                                animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2.5 text-sm  font-semibold  text-emerald-400 shadow-xl"
                            >
                                <TrendingUp className="h-2.5 w-2.5" /> PERFORMANCE INTELLIGENCE ENGINE
                            </motion.div>
                            <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-emerald-400">
                                Outcome & ROI Node<span className="text-emerald-500">.</span>
                            </h1>
                            <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                                Quantifying growth trajectories and forecasting market dominance with AI outcome protocols.
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {outcomes.map((metric, idx) => (
                                    <motion.div
                                        key={metric.title}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }} className="p-3 rounded-lg bg-white/[0.01] border border-white/5 hover:border-emerald-500/10 transition-all group relative overflow-hidden shadow-xl"
                                    >
                                    <div className="absolute top-0 right-0 p-2.5 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <h4 className="text-sm  font-semibold  text-white/70 mb-1.5">{metric.title}</h4>
                                    <div className="flex items-baseline gap-2 mb-2.5">
                                        <span className="text-base md:text-lg font-semibold text-white  tabular-nums">{metric.value}</span>
                                        <span className="text-sm font-semibold text-emerald-400   italic">{metric.trend}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: idx === 0 ?"75%" : idx === 1 ?"82%" :"95%" }}
                                            transition={{ duration: 1.5, ease:"easeOut", delay: 0.5 }}
                                            className={`h-full rounded-full ${metric.color} opacity-30`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Roadmap Milestones */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h2 className="text-sm font-semibold text-white/70   flex items-center gap-1.5 mb-2">
                                    <Milestone className="h-2.5 w-2.5 text-emerald-500" /> STRATEGIC MILESTONES
                                </h2>
                                {(outcomeData?.milestones || []).map((item, idx) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }} className="p-2 rounded-lg bg-white/[0.01] border border-white/5 flex items-center justify-between gap-4 group hover:bg-white/5 transition-all shadow-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1 rounded-md ${item.progress === 100 ? 'bg-emerald-500/5' : 'bg-white/5'}`}>
                                                <Calendar className={`h-2.5 w-2.5 ${item.progress === 100 ? 'text-emerald-400' : 'text-white/70'}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-white/70 group-hover:text-emerald-400 transition-colors  ">{item.title}</h3>
                                                <p className="text-sm text-white/90  font-semibold">{item.date} • {item.status}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-white/90">{item.progress}%</span>
                                            <div className="h-4 w-0.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-full bg-emerald-500/20" style={{ height: `${item.progress}%` }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-lg bg-white/[0.01] border border-white/5 backdrop-blur-3xl flex flex-col justify-between shadow-2xl"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-1.5 bg-emerald-500/5 rounded border border-emerald-500/10">
                                            <Sparkles className="h-3 w-3 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-semibold text-white  ">ROI Intelligence</h2>
                                            <p className="text-sm text-emerald-400 font-semibold">Future Valuation Matrix</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-white/90 leading-relaxed font-medium mb-6 border-l border-emerald-500/5 pl-4 py-1 italic">
                                        &ldquo;{outcomeData?.roiInsights}&rdquo;
                                    </p>
                                </div>

                                <div className="p-3 rounded-lg bg-white/[0.01] border border-white/5">
                                    <h4 className="text-sm font-semibold   text-white/70 mb-1.5">Market Valuation Delta</h4>
                                    <div className="flex items-baseline gap-1.5">
                                        <DollarSign className="h-3 w-3 text-emerald-400" />
                                        <span className="text-lg font-semibold text-white  tabular-nums">{outcomeData?.estimatedMarketWorth}</span>
                                        <span className="text-sm font-semibold  text-white/70  italic ml-1">Elite Sync Protocol</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}

                <NextModulePrompter nextModuleName="Career Intelligence Report" nextModuleHref="/dashboard/report" description="View your comprehensive, unified Strategic Career Report, aggregated from all modules in the Intelligence Pipeline."
                />
            </div>
        </div>
    );
}
