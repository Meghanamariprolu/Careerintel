"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Brain, Sparkles, ArrowLeft,
    MessageSquare, Users, Zap,
    Lightbulb, CheckCircle2, ChevronRight, Activity
} from 'lucide-react';
import Link from 'next/link';
import { NextModulePrompter } from '@/components/NextModulePrompter';

const traits = [
    { name: 'Strategic Communication', value: 85, color: 'bg-pink-500' },
    { name: 'Emotional Intelligence', value: 92, color: 'bg-purple-500' },
    { name: 'Leadership Resonance', value: 78, color: 'bg-indigo-500' },
    { name: 'Adaptive Problem Solving', value: 88, color: 'bg-blue-500' },
];

export default function BehavioralMappingPage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-pink-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="mb-16 text-center md:text-left">
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ x: -10 }}
                            className="flex items-center gap-2 text-white/40 hover:text-white font-black text-xs uppercase tracking-widest transition-colors mb-8 mx-auto md:mx-0"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Intelligence Hub
                        </motion.button>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-pink-300 shadow-xl"
                            >
                                <Brain className="h-3 w-3" /> Soft Skills Intelligence
                            </motion.div>
                            <h1 className="text-lg md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-pink-400 uppercase">
                                Behavioral Skill Mapping<span className="text-pink-500">.</span>
                            </h1>
                            <p className="text-sm md:text-lg text-white/40 max-w-2xl mt-4 font-medium leading-relaxed mx-auto md:mx-0">
                                Decode your professional DNA. Our AI maps your communication style, leadership potential, and emotional resonance for high-impact roles.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Trait Analysis */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            {traits.map((trait, idx) => (
                                <motion.div
                                    key={trait.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-pink-500/30 transition-all group"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-base md:text-xl font-black text-white group-hover:text-pink-400 transition-colors uppercase tracking-tight">{trait.name}</h3>
                                        <span className="text-lg md:text-2xl font-black text-pink-400">{trait.value}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-3 p-0.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${trait.value}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                            className={`h-full rounded-full ${trait.color} shadow-[0_0_15px_rgba(236,72,153,0.5)]`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Insight Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 rounded-[3rem] bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent border border-pink-500/20 backdrop-blur-3xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="h-32 w-32 text-pink-400" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-base md:text-xl font-black text-white mb-6 uppercase tracking-widest italic">AI Behavioral Insight</h2>
                            <p className="text-sm md:text-lg text-white/70 leading-relaxed font-medium mb-8">
                                "Your profile shows a rare combination of <span className="text-pink-400 font-black italic">Strategic Precision</span> and <span className="text-purple-400 font-black italic">High Empathy</span>. This makes you an ideal candidate for 'Product Leadership' and 'Client-Facing Strategy' roles where trust and ROI are interdependent."
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <Zap className="h-5 w-5 text-yellow-400 mb-2" />
                                    <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40">Core Strength</h4>
                                    <p className="text-xs md:text-base font-bold text-white">Adaptive Leading</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <Target className="h-5 w-5 text-blue-400 mb-2" />
                                    <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40">Target Role</h4>
                                    <p className="text-xs md:text-base font-bold text-white">Chief of Staff</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <NextModulePrompter
                    nextModuleName="Quality Scoring"
                    nextModuleHref="/dashboard/tools/quality-scoring"
                    description="Evaluate your current learning resources and certifications to determine their actual market impact."
                />
            </div>
        </div>
    );
}
