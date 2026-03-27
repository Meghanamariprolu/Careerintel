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
        <div className="min-h-screen bg-[#050510] text-white p-5 md:p-8 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />
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
                                animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-2.5 text-sm  font-semibold  text-cyan-400 shadow-xl"
                            >
                                <Globe className="h-2.5 w-2.5" /> PIVOT INTELLIGENCE ENGINE
                            </motion.div>
                            <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-400">
                                Skill Transfer Matrix<span className="text-cyan-500">.</span>
                            </h1>
                            <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                                Bridging established inventory with high-growth target roles.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Bridge Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold   text-white/90 flex items-center gap-1.5 mb-2">
                            <Repeat className="h-2.5 w-2.5 text-cyan-500" /> Transfer Potential Nodes
                        </h2>
                        {transferMap.map((path, idx) => (
                            <motion.div
                                key={path.skill}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }} className="p-3 rounded-lg bg-white/[0.01] border border-white/5 hover:border-cyan-500/20 transition-all group overflow-hidden relative shadow-xl"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                                    <ArrowRight className="h-8 w-8 text-cyan-400 -rotate-45" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="px-1 py-0.5 bg-cyan-500/5 rounded border border-cyan-500/10">
                                            <span className="text-sm font-semibold   text-cyan-500/50">{path.strength} SYNC</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <h4 className="text-sm font-semibold   text-white/70 mb-0.5">Source Node</h4>
                                            <p className="text-sm font-semibold text-white  ">{path.skill}</p>
                                        </div>
                                        <div className="flex-1 flex justify-center">
                                            <ArrowRight className="h-2.5 w-2.5 text-cyan-400" />
                                        </div>
                                        <div className="text-right">
                                            <h4 className="text-sm font-semibold   text-white/70 mb-0.5">Application</h4>
                                            <p className="text-sm font-semibold text-cyan-500/60  ">{path.application}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* AI Outlook Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-lg bg-white/[0.01] border border-cyan-500/10 backdrop-blur-3xl flex flex-col justify-between shadow-xl"
                    >
                        <div>
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="p-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 shadow-xl">
                                    <Zap className="h-3 w-3 text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-white  ">Pivot Strategy Matrix</h2>
                                    <p className="text-sm text-cyan-400 font-semibold">Bridge Your Excellence</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed font-medium italic border-l border-cyan-500/10 pl-3.5 py-0.5  ">"Pivot into <span className="text-cyan-400/50 font-semibold">AI Solutions Engineering</span> offers a 45% shorter learning curve. Background in Data Analysis provides the 'Logical Foundation'."
                            </p>
                        </div>

                        <div className="pt-3">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-semibold   text-white/70">Path Synergy Protocol</span>
                                <span className="text-xs font-semibold text-cyan-400/50 tabular-nums">88%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1 p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width:"88%" }}
                                    transition={{ duration: 2, ease:"easeOut" }} className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-blue-500 shadow-xl"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <NextModulePrompter nextModuleName="Portfolio Builder" nextModuleHref="/dashboard/tools/portfolio-builder" description="Transform your mapped skills into tangible proof of experience with AI-suggested portfolio projects."
                />
            </div>
        </div>
    );
}
