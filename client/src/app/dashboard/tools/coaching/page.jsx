"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, UserRoundCog, MessageSquare,
    Target, Zap, Brain, Rocket, ArrowLeft,
    CheckCircle, ShieldCheck, Send, Navigation
} from 'lucide-react';
import Link from 'next/link';
import { NextModulePrompter } from '@/components/NextModulePrompter';
import { Button } from "@/components/ui/Button";

const mentors = [
    {
        id: 'strategist',
        name: 'The Strategist',
        role: 'Market Expert',
        description: 'Focuses on ROI, market trends, and high-leverage skill acquisition.',
        icon: Target,
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        borderColor: 'border-blue-400/20'
    },
    {
        id: 'visionary',
        name: 'The Visionary',
        role: 'Future Analyst',
        description: 'Helps you navigate emerging tech and long-term industry shifts.',
        icon: Zap,
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
        borderColor: 'border-purple-400/20'
    },
    {
        id: 'commander',
        name: 'The Commander',
        role: 'Execution Lead',
        description: 'Zero-nonsense accountability and rigorous performance tracking.',
        icon: ShieldCheck,
        color: 'text-orange-400',
        bg: 'bg-orange-400/10',
        borderColor: 'border-orange-400/20'
    }
];

const nudges = [
    { text: "Your portfolio is 70% complete. Add one more case study to reach 'Top 5%' status.", icon: Rocket },
    { text: "Market demand for 'TypeScript' in your region just increased by 14%. Update your roadmap?", icon: TrendingUp },
];

export default function AICoachingPage() {
    const [selectedMentor, setSelectedMentor] = useState(mentors[0]);
    const [isThinking, setIsThinking] = useState(false);
    const [chatInput, setChatInput] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setIsThinking(true);
        setChatInput('');
        setTimeout(() => setIsThinking(false), 2000);
    };

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
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-indigo-300 shadow-xl"
                            >
                                <Sparkles className="h-3 w-3" /> Career Intelligence
                            </motion.div>
                            <h1 className="text-lg md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-indigo-400 uppercase">
                                AI Coaching & Accountability<span className="text-indigo-500">.</span>
                            </h1>
                            <p className="text-sm md:text-lg text-white/40 max-w-2xl mt-4 font-medium leading-relaxed">
                                Your personal career architect. Choose a mentor persona to get specialized guidance and real-time performance tracking.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Personas & Nudges */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Mentor Selection */}
                        <section className="space-y-4">
                            <h2 className="text-base md:text-xl font-black tracking-tight text-white/80">Select Mentor Persona</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {mentors.map((mentor) => (
                                    <motion.div
                                        key={mentor.id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setSelectedMentor(mentor)}
                                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden group ${selectedMentor.id === mentor.id
                                            ? `${mentor.borderColor} bg-white/10 shadow-[0_0_30px_rgba(99,102,241,0.1)]`
                                            : 'border-white/5 bg-white/5 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4 relative z-10">
                                            <div className={`p-3 rounded-2xl ${mentor.bg}`}>
                                                <mentor.icon className={`h-6 w-6 ${mentor.color}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-base md:text-xl font-black text-white">{mentor.name}</h3>
                                                <p className="text-[10px] md:text-xs font-bold text-indigo-400/60 uppercase tracking-widest">{mentor.role}</p>
                                                <p className="text-sm md:text-lg text-white/40 mt-2 leading-snug">{mentor.description}</p>
                                            </div>
                                        </div>
                                        {selectedMentor.id === mentor.id && (
                                            <motion.div
                                                layoutId="active-indicator"
                                                className="absolute right-6 top-6"
                                            >
                                                <CheckCircle className="h-5 w-5 text-indigo-400" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Daily Nudges */}
                        <section className="space-y-4">
                            <h2 className="text-base md:text-xl font-black tracking-tight text-white/80">Actionable Nudges</h2>
                            <div className="space-y-3">
                                {nudges.map((nudge, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-3">
                                        <nudge.icon className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-base text-white/60 font-medium">{nudge.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Chat Interface */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 h-full min-h-[600px] flex flex-col relative overflow-hidden">
                            {/* Chat Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${selectedMentor.bg}`}>
                                        <selectedMentor.icon className={`h-6 w-6 ${selectedMentor.color}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-base md:text-xl font-black text-white italic">Active Session: {selectedMentor.name}</h2>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] md:text-xs text-white/30 uppercase font-black tracking-widest">Neural Link Established</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:flex gap-2">
                                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                                        <Brain className="h-4 w-4 text-white/40" />
                                    </div>
                                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                                        <Trophy className="h-4 w-4 text-white/40" />
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[500px] scrollbar-visible">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-4 max-w-[80%]"
                                >
                                    <div className={`p-2 rounded-xl ${selectedMentor.bg} shrink-0`}>
                                        <selectedMentor.icon className={`h-4 w-4 ${selectedMentor.color}`} />
                                    </div>
                                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-5 border border-white/10">
                                        <p className="text-xs md:text-base text-white/80 leading-relaxed font-medium">
                                            Hello Architect. I've analyzed your recent progression. Your commitment to the 'Mastery Hub' is showing results, but your technical execution on projects could be more aggressive. What's blocking your next major deployment?
                                        </p>
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {isThinking && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-4 py-4"
                                        >
                                            <div className="flex gap-1.5">
                                                <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                                <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                            </div>
                                            <span className="text-[10px] md:text-xs text-white/20 font-black uppercase tracking-widest">Coating Insight...</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input Area */}
                            <div className="p-8 border-t border-white/5">
                                <form onSubmit={handleSendMessage} className="relative">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask your coach anything about your career journey..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm md:text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-white/10 font-medium"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
                                    >
                                        <MessageSquare className="h-5 w-5 text-white" />
                                    </button>
                                </form>
                                <div className="mt-4 flex justify-center gap-6">
                                    <span className="text-[8px] md:text-[10px] text-white/10 font-bold uppercase tracking-[0.3em]">AI-Driven Accountability</span>
                                    <span className="text-[8px] md:text-[10px] text-white/10 font-bold uppercase tracking-[0.3em]">•</span>
                                    <span className="text-[8px] md:text-[10px] text-white/10 font-bold uppercase tracking-[0.3em]">Precision Mentorship</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
