"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Sparkles, ArrowLeft,
    Target, Zap, Rocket,
    CheckCircle, ShieldCheck, Trophy,
    ArrowRight, Lightbulb, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useUserProfile } from '@/context/UserProfileContext';
import { generateCareerStrategy } from '@/services/careerIntelligenceEngine';

export default function CareerIntelligenceReportPage() {
    const { profile } = useUserProfile();
    const strategy = useMemo(() => generateCareerStrategy(profile), [profile]);

    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
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
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 text-[10px] md:text-xs  uppercase tracking-[0.25em] text-indigo-300 shadow-xl"
                            >
                                <Sparkles className="h-3 w-3" /> Unified Strategic Output
                            </motion.div>
                            <h1 className="text-lg md:text-2xl  tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-indigo-400 uppercase">
                                Career Intelligence Report<span className="text-indigo-500">.</span>
                            </h1>
                            <p className="text-sm md:text-lg text-white/70 max-w-2xl mt-4  leading-relaxed">
                                The definitive strategic outlook for your professional journey. Synthesized by our AI Engine from every module in your ecosystem.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Score Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 p-10 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-white/10 backdrop-blur-3xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Rocket className="h-40 w-40 text-indigo-400" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-sm md:text-lg  text-white/70 uppercase tracking-widest mb-6">Current Target Path</h2>
                            <h3 className="text-lg md:text-4xl  text-white tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                {strategy.targetRole}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                                <div>
                                    <h4 className="text-[10px] md:text-xs  uppercase tracking-widest text-white/30 mb-4">Readiness Protocol</h4>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-lg md:text-5xl  text-indigo-400">{strategy.readinessScore}%</span>
                                        <span className="text-[10px] md:text-xs  text-white/20 uppercase tracking-widest">Score Alpha</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-3 p-0.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${strategy.readinessScore}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] md:text-xs  uppercase tracking-widest text-white/30 mb-4">Critical Skill Gaps</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {strategy.skillGaps.map(gap => (
                                            <span key={gap} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] md:text-xs  text-white/60">
                                                {gap}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Insight */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-10 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-between backdrop-blur-3xl"
                    >
                        <div>
                            <Lightbulb className="h-8 w-8 text-yellow-400 mb-6" />
                            <h3 className="text-base md:text-xl  text-white mb-4 uppercase">AI Strategy Note</h3>
                            <p className="text-xs md:text-base text-white/60 leading-relaxed ">
                                "Your profile indicates a strong 'Technical Foundation' with a significant 'Architectural Gap'. Prioritizing system design projects will increase your market valuation by an estimated <span className="text-indigo-400 ">18%</span> in the next quarter."
                            </p>
                        </div>
                        <div className="pt-8 mt-8 border-t border-white/5">
                            <span className="text-[10px]  uppercase tracking-widest text-white/20">Generated Alpha v1.0</span>
                        </div>
                    </motion.div>
                </div>

                {/* Tactical Roadmap */}
                <div className="grid grid-cols-1 gap-8">
                    <h2 className="text-base md:text-xl  text-white uppercase tracking-widest flex items-center gap-3">
                        <Target className="h-6 w-6 text-indigo-500" /> Tactical Roadmap Execution
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {strategy.recommendedNextSteps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between group"
                            >
                                <div className="mb-6">
                                    <h4 className="text-[10px]  uppercase tracking-widest text-white/30 mb-2">Phase {idx + 1}</h4>
                                    <p className="text-sm md:text-lg  text-white group-hover:text-indigo-400 transition-colors leading-snug">
                                        {step}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex -space-x-2">
                                        <div className="h-6 w-6 rounded-full bg-indigo-500 border-2 border-[#050510]" />
                                        <div className="h-6 w-6 rounded-full bg-purple-500 border-2 border-[#050510]" />
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-white transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
