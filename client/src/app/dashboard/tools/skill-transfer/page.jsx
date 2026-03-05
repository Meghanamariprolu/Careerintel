"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Combine, Sparkles, ArrowLeft,
    ArrowRight, Globe, Zap,
    Target, LineChart, Briefcase,
    Repeat, Layers
} from 'lucide-react';
import Link from 'next/link';
import { NextModulePrompter } from '@/components/NextModulePrompter';

const transferMap = [
    { skill: 'Data Analysis', strength: 'Strong', application: 'Financial Strategy' },
    { skill: 'UI/UX Principles', strength: 'Expert', application: 'Product Management' },
    { skill: 'Python/React', strength: 'Strong', application: 'AI Engineering' },
];

export default function SkillTransferPage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
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
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-cyan-300 shadow-xl"
                            >
                                <Globe className="h-3 w-3" /> Career Pivot Intelligence
                            </motion.div>
                            <h1 className="text-lg md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-400 uppercase">
                                Skill Transfer Mapping<span className="text-cyan-500">.</span>
                            </h1>
                            <p className="text-sm md:text-lg text-white/40 max-w-2xl mt-4 font-medium leading-relaxed">
                                Bridging the gap between what you know and where you're going. See how your existing inventory translates to high-growth roles in different industries.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Bridge Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <div className="space-y-4">
                        <h2 className="text-base md:text-xl font-black text-white/80 flex items-center gap-3 mb-6">
                            <Repeat className="h-6 w-6 text-cyan-500" /> Transfer Potential
                        </h2>
                        {transferMap.map((path, idx) => (
                            <motion.div
                                key={path.skill}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <ArrowRight className="h-20 w-20 text-cyan-400 -rotate-45" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-cyan-400">{path.strength} Match</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/20 mb-1">From Current Skill</h4>
                                            <p className="text-base md:text-xl font-black text-white italic">{path.skill}</p>
                                        </div>
                                        <div className="hidden md:block">
                                            <ArrowRight className="h-6 w-6 text-cyan-500" />
                                        </div>
                                        <div className="text-right md:text-left">
                                            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/20 mb-1">To Target Application</h4>
                                            <p className="text-base md:text-xl font-black text-cyan-400 italic">{path.application}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* AI Outlook Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-10 rounded-[3rem] bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 backdrop-blur-3xl flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-cyan-500/20 rounded-2xl border border-cyan-500/30">
                                    <Zap className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-base md:text-xl font-black text-white uppercase italic tracking-widest">Pivot Strategy</h2>
                                    <p className="text-[10px] md:text-xs text-cyan-400/60 font-black uppercase tracking-widest">Bridge Your Excellence</p>
                                </div>
                            </div>
                            <p className="text-sm md:text-lg text-white/60 leading-relaxed font-medium mb-12 italic">
                                "Based on your technical proficiency and behavioral profile, a pivot into <span className="text-cyan-400 font-black">AI Solutions Engineering</span> offers a 45% shorter learning curve than typical candidates. Your background in Data Analysis provides the 'Logical Foundation' required for complex LLM orchestrations."
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 mb-2">Confidence Benchmark</h4>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text- base md:text-xl font-black text-white">Path Synergy</span>
                                <span className="text-lg md:text-3xl font-black text-cyan-400">88%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-4 p-1">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "88%" }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <NextModulePrompter
                    nextModuleName="Portfolio Builder"
                    nextModuleHref="/portfolio-builder"
                    description="Transform your mapped skills into tangible proof of experience with AI-suggested portfolio projects."
                />
            </div>
        </div>
    );
}
