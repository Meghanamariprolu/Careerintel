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
        philosophy:"In a global market, your skills are your currency. Arbitrage the gap."
    },
    {
        name: 'The Visionary',
        role: 'Emerging Tech & Shifts',
        specialization: 'Future-Proofing',
        icon: Sparkles,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        description: 'Analyzes long-term industry shifts and emerging technologies. Perfect for creators looking to stay ahead of the disruption curve.',
        philosophy:"Don't follow the trend. Anticipate the shift before it becomes mainstream."
    },
    {
        name: 'The Commander',
        role: 'Execution & Discipline',
        specialization: 'Performance Tracking',
        icon: Rocket,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        description: 'Minimalist, strict, and focused on pure execution. He provides a structured roadmap and holds you accountable for every milestone.',
        philosophy:"Execution is the only differentiator. Strategy without action is hallucination."
    },
];

export default function MentorPersonasPage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white p-5 md:p-8 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
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
                                animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-2.5 text-sm  font-semibold  text-indigo-400 shadow-xl"
                            >
                                <Bot className="h-2.5 w-2.5" /> MENTOR ARCHITECTURE ENGINE
                            </motion.div>
                            <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-indigo-400">
                                Intelligence Personas Node<span className="text-indigo-500">.</span>
                            </h1>
                            <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                                Elite AI council built with unique strategic engines designed to propel your career through different lenses.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {mentors.map((mentor, idx) => (
                        <motion.div
                            key={mentor.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }} className="group relative h-full"
                        >
                            <div className="relative h-full p-4 rounded-lg bg-white/[0.01] border border-white/5 group-hover:border-indigo-500/20 transition-all flex flex-col backdrop-blur-3xl overflow-hidden shadow-xl">
                                <div className="absolute top-0 right-0 p-3 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                                    <mentor.icon className="h-12 w-12" />
                                </div>

                                <div className="mb-3.5">
                                    <div className={`h-8 w-8 rounded-md ${mentor.bg} flex items-center justify-center border border-white/5 mb-3 group-hover:scale-105 transition-transform duration-500`}>
                                        <mentor.icon className={`h-3.5 w-3.5 ${mentor.color}`} />
                                    </div>
                                    <h3 className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors  ">{mentor.name}</h3>
                                    <p className="text-xs  font-semibold  text-white/90 mt-1">{mentor.role}</p>
                                </div>

                                <div className="flex-grow">
                                    <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 mb-3">
                                        <Shield className="h-2.5 w-2.5 text-white/90" />
                                        <span className="text-sm font-semibold   text-white/70">{mentor.specialization}</span>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed font-medium mb-4 italic  ">
                                        {mentor.description}
                                    </p>
                                </div>

                                    <p className="text-xs italic text-white/70 font-medium  leading-snug border-t border-white/5 pt-3.5 mt-auto">
                                        &ldquo;{mentor.philosophy}&rdquo;
                                    </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <NextModulePrompter nextModuleName="Outcome Tracking" nextModuleHref="/dashboard/tools/outcome-tracking" description="Monitor your strategic progression and quantify the ROI of your newly acquired skills."
                />
            </div>
        </div>
    );
}
