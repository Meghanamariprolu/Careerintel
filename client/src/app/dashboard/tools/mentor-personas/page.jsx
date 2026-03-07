"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Bot, Sparkles, ArrowLeft,
    Target, Zap, Brain, Rocket,
    Shield, MessageCircle, Info,
    ChevronRight, Quote
} from 'lucide-react';
import Link from 'next/link';
import { NextModulePrompter } from '@/components/NextModulePrompter';

const mentors = [
    {
        name: 'The Strategist',
        role: 'Market Efficiency & ROI',
        specialization: 'Skills Arbitrage',
        icon: Target,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        description: 'Focuses on identifying high-ROI skill gaps and optimizing your market value. Ideal for those looking to maximize their professional leverage.',
        philosophy: "In a global market, your skills are your currency. Arbitrage the gap."
    },
    {
        name: 'The Visionary',
        role: 'Emerging Tech & Shifts',
        specialization: 'Future-Proofing',
        icon: Sparkles,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        description: 'Analyzes long-term industry shifts and emerging technologies. Perfect for creators looking to stay ahead of the disruption curve.',
        philosophy: "Don't follow the trend. Anticipate the shift before it becomes mainstream."
    },
    {
        name: 'The Commander',
        role: 'Execution & Discipline',
        specialization: 'Performance Tracking',
        icon: Rocket,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        description: 'Minimalist, strict, and focused on pure execution. He provides a structured roadmap and holds you accountable for every milestone.',
        philosophy: "Execution is the only differentiator. Strategy without action is hallucination."
    },
];

export default function MentorPersonasPage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="mb-16">
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ x: -10 }}
                            className="flex items-center gap-2 text-white/40 hover:text-white  text-xs uppercase tracking-widest transition-colors mb-8"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Intelligence Hub
                        </motion.button>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-[10px] md:text-xs  uppercase tracking-[0.25em] text-indigo-300 shadow-xl"
                            >
                                <Bot className="h-3 w-3" /> Mentor Architecture
                            </motion.div>
                            <h1 className="text-lg md:text-2xl  tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-indigo-400 uppercase">
                                Intelligence Personas Expo<span className="text-indigo-500">.</span>
                            </h1>
                            <p className="text-sm md:text-lg text-white/40 max-w-2xl mt-4  leading-relaxed">
                                Meet your elite AI council. Each mentor is built with a unique strategic engine designed to propel your career through different lenses.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mentors.map((mentor, idx) => (
                        <motion.div
                            key={mentor.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative h-full"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500`} />

                            <div className="relative h-full p-10 rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-white/20 transition-all flex flex-col backdrop-blur-3xl overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <mentor.icon className="h-32 w-32" />
                                </div>

                                <div className="mb-8">
                                    <div className={`h-16 w-16 rounded-xl ${mentor.bg} flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                        <mentor.icon className={`h-8 w-8 ${mentor.color}`} />
                                    </div>
                                    <h3 className="text-base md:text-xl  text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tighter">{mentor.name}</h3>
                                    <p className="text-[10px] md:text-xs  uppercase tracking-[0.2em] text-white/30 mt-1">{mentor.role}</p>
                                </div>

                                <div className="flex-grow">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6">
                                        <Shield className="h-3 w-3 text-white/40" />
                                        <span className="text-[10px] md:text-xs  text-white/60 tracking-tight">{mentor.specialization}</span>
                                    </div>
                                    <p className="text-xs md:text-base text-white/50 leading-relaxed  mb-8">
                                        {mentor.description}
                                    </p>
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <Quote className={`h-6 w-6 ${mentor.color} opacity-20 mb-4`} />
                                    <p className="text-xs md:text-base  text-white/80 tracking-tight leading-snug">
                                        "{mentor.philosophy}"
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <NextModulePrompter
                    nextModuleName="Outcome Tracking"
                    nextModuleHref="/dashboard/tools/outcome-tracking"
                    description="Monitor your strategic progression and quantify the ROI of your newly acquired skills."
                />
            </div>
        </div>
    );
}
