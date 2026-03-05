"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Star, Sparkles, ArrowLeft,
    BookOpen, GraduationCap, School,
    CheckCircle, ShieldCheck, Trophy,
    TrendingUp, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { NextModulePrompter } from '@/components/NextModulePrompter';

const resources = [
    {
        title: "Full Stack Advanced Patterns",
        platform: "Frontend Masters",
        score: 98,
        category: "Hard Skills",
        badge: "Industry Standard"
    },
    {
        title: "Systems Design Interview Guide",
        platform: "Educative.io",
        score: 95,
        category: "Architecture",
        badge: "Expert Level"
    },
    {
        title: "Behavioral Leadership in Tech",
        platform: "Coursera",
        score: 92,
        category: "Soft Skills",
        badge: "High Growth"
    },
];

export default function QualityScoringPage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-orange-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="mb-16">
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ x: -10 }}
                            className="flex items-center gap-2 text-white/40 hover:text-white font-black text-xs uppercase tracking-widest transition-colors mb-8"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Intelligence Hub
                        </motion.button>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-orange-300 shadow-xl"
                            >
                                <Star className="h-3 w-3" /> Resource Valuation
                            </motion.div>
                            <h1 className="text-lg md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-orange-400 uppercase">
                                Learning Source Quality Scoring<span className="text-orange-500">.</span>
                            </h1>
                            <p className="text-sm md:text-lg text-white/40 max-w-2xl mt-4 font-medium leading-relaxed">
                                Don't just learn—learn from the best. Our AI audits thousands of courses, books, and certifications to show you the highest ROI resources.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="space-y-6">
                    {resources.map((item, idx) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition duration-500" />
                            <div className="relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 backdrop-blur-xl">
                                <div className="flex items-start gap-6">
                                    <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                                        <BookOpen className="h-8 w-8 text-orange-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-orange-400/60">{item.platform}</span>
                                            <span className="h-1 w-1 bg-white/10 rounded-full" />
                                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/30">{item.category}</span>
                                        </div>
                                        <h3 className="text-base md:text-xl font-black text-white italic group-hover:text-orange-400 transition-colors">{item.title}</h3>
                                        <div className="flex items-center gap-2 mt-4">
                                            <ShieldCheck className="h-4 w-4 text-green-400" />
                                            <span className="text-xs md:text-base font-bold text-green-400/80">{item.badge}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                                    <div className="text-center">
                                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/20 mb-2">Intelligence Score</h4>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg md:text-3xl font-black text-orange-400">{item.score}</span>
                                            <span className="text-[10px] md:text-xs font-bold text-white/20">/100</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 px-6">
                                        Explore <ExternalLink className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Methodology Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 p-8 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 text-center"
                >
                    <p className="text-xs md:text-base text-white/40 font-medium">
                        Scores are calculated based on <span className="text-orange-400/60 font-black italic">Market Relevance</span>, <span className="text-orange-400/60 font-black italic">Depth of Content</span>, and <span className="text-orange-400/60 font-black italic">Successful Alumni Outcomes</span>.
                    </p>
                </motion.div>

                <NextModulePrompter
                    nextModuleName="Learning Routes"
                    nextModuleHref="/learning-route"
                    description="Generate a personalized, step-by-step roadmap to bridge your skill gaps and reach your target role."
                />
            </div>
        </div>
    );
}
