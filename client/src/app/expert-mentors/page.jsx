"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, Target, Zap, Brain, Quote } from 'lucide-react';
import Link from 'next/link';

const mentors = [
    {
        name:"The Strategist",
        tagline:"Market Efficiency & ROI Maximizer",
        icon: Target,
        color:"text-indigo-400",
        bg:"bg-indigo-500/10",
        border:"border-indigo-500/20",
        glow:"shadow-[0_0_40px_rgba(99,102,241,0.15)]",
        expertise: ["Salary Negotiation","Skills Arbitrage","Market Positioning","ROI Optimization"],
        philosophy:"In a global market, your skills are your currency. Every learning decision should be an investment, not an expense.",
        sessions:"1,240",
        rating:"4.9",
        description:"The Strategist focuses on maximizing your return on every hour invested in learning. Expect data-driven recommendations, market trend analysis, and a relentless focus on what actually pays.",
    },
    {
        name:"The Visionary",
        tagline:"Future-Proofing & Emerging Tech Expert",
        icon: Zap,
        color:"text-purple-400",
        bg:"bg-purple-500/10",
        border:"border-purple-500/20",
        glow:"shadow-[0_0_40px_rgba(168,85,247,0.15)]",
        expertise: ["AI/LLM Engineering","Emerging Tech Trends","Long-term Planning","Innovation Strategy"],
        philosophy:"Don't follow the trend. Anticipate the shift before it becomes mainstream and position yourself as the expert before demand emerges.",
        sessions:"980",
        rating:"4.8",
        description:"The Visionary helps you navigate the rapidly shifting tech landscape. Perfect for those who want to stay at the bleeding edge and build a career around tomorrow's opportunities, not today's.",
    },
    {
        name:"The Commander",
        tagline:"Execution, Discipline & Accountability",
        icon: Brain,
        color:"text-rose-400",
        bg:"bg-rose-500/10",
        border:"border-rose-500/20",
        glow:"shadow-[0_0_40px_rgba(244,63,94,0.15)]",
        expertise: ["Goal Setting","Performance Tracking","Habit Architecture","Milestone Accountability"],
        philosophy:"Execution is the only differentiator. Strategy without action is hallucination. We will build a system that makes progress inevitable.",
        sessions:"1,560",
        rating:"4.95",
        description:"The Commander is for those who know what they need to do but struggle with consistent execution. This is zero-tolerance, high-accountability mentorship designed to make progress non-negotiable.",
    },
];

export default function ExpertMentorsPage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden">
            {/* Header */}
            <div className="relative py-20 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full" />
                </div>
                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs   transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-xs   text-yellow-300">
                    <Star className="h-3 w-3" /> AI Mentor Council
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-light  text-white mb-4">Expert Mentors</h1>
                <p className="text-white/70 max-w-xl mx-auto">Three distinct AI mentors. Each one engineered with a unique strategic engine designed to propel your career from a different angle.</p>
            </div>

            {/* Mentor Cards */}
            <div className="max-w-6xl mx-auto px-6 pb-24 space-y-8">
                {mentors.map((mentor, idx) => (
                    <motion.div key={mentor.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                        className={`p-8 md:p-12 rounded-2xl border ${mentor.border} bg-white/[0.02] ${mentor.glow} group hover:bg-white/[0.04] transition-all`}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Info */}
                            <div className="lg:col-span-2">
                                <div className="flex items-start gap-5 mb-6">
                                    <div className={`p-4 rounded-2xl ${mentor.bg} border ${mentor.border} shrink-0`}>
                                        <mentor.icon className={`h-8 w-8 ${mentor.color}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-light text-white">{mentor.name}</h2>
                                        <p className={`text-sm ${mentor.color} opacity-70  `}>{mentor.tagline}</p>
                                    </div>
                                </div>
                                <p className="text-white/75 leading-relaxed mb-6">{mentor.description}</p>
                                <div className="mb-6">
                                    <p className="text-xs   text-white/75 mb-3">Core Expertise</p>
                                    <div className="flex flex-wrap gap-2">
                                        {mentor.expertise.map(e => (
                                            <span key={e} className={`text-xs px-3 py-1 rounded-full ${mentor.bg} border ${mentor.border} ${mentor.color}`}>{e}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Stats + Quote */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-5 rounded-xl ${mentor.bg} border ${mentor.border} text-center`}>
                                        <Star className={`h-5 w-5 ${mentor.color} mx-auto mb-2`} />
                                        <p className="text-2xl font-light text-white">{mentor.rating}</p>
                                        <p className="text-xs text-white/60">Rating</p>
                                    </div>
                                    <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
                                        <p className="text-2xl font-light text-white">{mentor.sessions}</p>
                                        <p className="text-xs text-white/60">Sessions</p>
                                    </div>
                                </div>
                                <div className={`p-5 rounded-xl ${mentor.bg} border ${mentor.border}`}>
                                    <Quote className={`h-4 w-4 ${mentor.color} opacity-30 mb-3`} />
                                    <p className={`text-sm ${mentor.color} opacity-80 leading-relaxed italic`}>"{mentor.philosophy}"</p>
                                </div>
                                <Link href="/dashboard/tools/coaching"
                                    className={`block w-full text-center py-3 rounded-xl ${mentor.bg} border ${mentor.border} ${mentor.color} text-sm hover:opacity-80 transition-opacity`}>
                                    Start Session with {mentor.name.split(' ')[1]} →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
