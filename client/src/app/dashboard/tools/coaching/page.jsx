"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, UserRoundCog, MessageSquare, Target, Zap, Brain, Rocket, ArrowLeft, CheckCircle, ShieldCheck, Send, Navigation, TrendingUp, Trophy } from 'lucide-react';
import Link from 'next/link';
import { NextModulePrompter } from '@/components/NextModulePrompter';
import { Button } from"@/components/ui/Button";
import { useUserProfile } from '@/context/UserProfileContext';
import axios from 'axios';

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

export default function AICoachingPage() {
    const { profile } = useUserProfile();
    const [selectedMentor, setSelectedMentor] = useState(mentors[0]);
    const [isThinking, setIsThinking] = useState(false);
    const [chatInput, setChatInput] = useState('');
    
    // Generate dynamic nudges based on profile
    const dynamicNudges = [];
    if (profile.analytics?.portfolioStrength < 80) {
        dynamicNudges.push({ text: `Your portfolio strength is only ${profile.analytics.portfolioStrength || 0}%. Let's add more projects addressing ${profile.careerGoal || 'your goals'}.`, icon: Rocket });
    } else {
        dynamicNudges.push({ text:"Your portfolio is looking strong! Ready to tackle more advanced system challenges?", icon: Rocket });
    }
    if (profile.currentSkills?.length > 0) {
        dynamicNudges.push({ text: `Market demand for '${profile.currentSkills[0]}' is steady. Optimize your roadmap to push into senior territory.`, icon: TrendingUp });
    } else {
        dynamicNudges.push({ text:"Add your current skills to the roadmap to get precision tracking.", icon: TrendingUp });
    }

    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: `Hello Architect. I've analyzed your recent progression towards becoming a ${profile.careerGoal || 'Tech Leader'}. What's blocking your next major deployment or skill acquisition?`
        }
    ]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = { role: 'user', content: chatInput };
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsThinking(true);

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/api/ai-coach',
                {
                    message: userMsg.content,
                    persona: selectedMentor.name,
                    chatHistory: messages,
                    userContext: profile
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                setMessages(prev => [...prev, { role: 'ai', content: data.data.reply }]);
            }
        } catch (error) {
            console.error("Coaching API failed", error);
            setMessages(prev => [...prev, { role: 'ai', content:"I'm having a bit of trouble connecting to the intelligence grid. Please try again in a moment." }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white p-5 md:p-8 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
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
                                <Sparkles className="h-2.5 w-2.5" /> CAREER INTELLIGENCE ENGINE
                            </motion.div>
                            <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-indigo-400">
                                AI Coaching Matrix<span className="text-indigo-500">.</span>
                            </h1>
                            <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                                Specialized guidance and performance tracking synchronized with your goals.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Personas & Nudges */}
                    <div className="lg:col-span-1 space-y-5 text-white/70">
                        {/* Mentor Selection */}
                        <section className="space-y-3">
                            <h2 className="text-sm font-semibold   text-white/90 flex items-center gap-1.5 mb-2">
                                <Navigation className="h-2.5 w-2.5 text-indigo-500" /> Select Protocol Persona
                            </h2>
                            <div className="grid grid-cols-1 gap-2">
                                {mentors.map((mentor) => (
                                    <motion.div
                                        key={mentor.id}
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => setSelectedMentor(mentor)}
                                        className={`p-3 rounded-lg border transition-all cursor-pointer relative overflow-hidden group shadow-xl ${selectedMentor.id === mentor.id
                                            ? `${mentor.borderColor} bg-white/5 border-indigo-500/30`
                                            : 'border-white/5 bg-white/[0.01] opacity-60 hover:opacity-100 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3 relative z-10">
                                            <div className={`p-1 rounded-md ${mentor.bg} border ${mentor.borderColor} transition-transform group-hover:scale-105`}>
                                                <mentor.icon className={`h-3 w-3 ${mentor.color}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-semibold text-white  ">{mentor.name}</h3>
                                                <p className="text-sm text-white/90  font-semibold  mb-1">{mentor.role}</p>
                                                <p className="text-xs text-white/70 leading-snug font-medium   italic line-clamp-2">{mentor.description}</p>
                                            </div>
                                        </div>
                                        {selectedMentor.id === mentor.id && (
                                            <motion.div layoutId="active-indicator" className="absolute right-3 top-3"
                                            >
                                                <CheckCircle className="h-2.5 w-2.5 text-indigo-500/60" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Daily Nudges */}
                        <section className="space-y-3">
                            <h2 className="text-xs font-semibold   text-white/70">Actionable Telemetry</h2>
                            <div className="space-y-2.5">
                                {dynamicNudges.map((nudge, idx) => (
                                    <div key={idx} className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-3 shadow-xl">
                                        <nudge.icon className="h-3.5 w-3.5 text-indigo-400/50 shrink-0 mt-0.5" />
                                        <p className="text-sm text-white/70 font-medium leading-relaxed italic">{nudge.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Chat Interface */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-lg border border-white/5 h-full min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
                            {/* Chat Header */}
                            <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
                                <div className="flex items-center gap-2.5">
                                    <div className={`p-1 rounded-md ${selectedMentor.bg} border ${selectedMentor.borderColor}`}>
                                        <selectedMentor.icon className={`h-3 w-3 ${selectedMentor.color}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-semibold text-white  ">Active Protocol: {selectedMentor.name}</h2>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <div className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-sm text-emerald-400  font-semibold">Neural Link Synchronized</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:flex gap-1.5 text-white/70">
                                    <Brain className="h-3 w-3" />
                                    <Trophy className="h-3 w-3" />
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 p-3.5 space-y-4 overflow-y-auto max-h-[500px] scrollbar-visible">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse self-end ml-auto' : 'max-w-[95%]'}`}
                                    >
                                        <div className={`p-1.5 rounded-lg shrink-0 shadow-xl border ${msg.role === 'user' ? 'bg-indigo-600 border-indigo-400/20 text-white' : `${selectedMentor.bg} border-${selectedMentor.borderColor} ${selectedMentor.color}`}`}>
                                            {msg.role === 'user' ? <UserRoundCog className="h-2 w-2" /> : <selectedMentor.icon className="h-2 w-2" />}
                                        </div>
                                        <div className={`${msg.role === 'user' ? 'bg-indigo-600/5 border-indigo-500/10' : 'bg-white/[0.01] border-white/5'} rounded-lg px-2.5 py-1.5 border shadow-xl`}>
                                            <p className="text-xs text-white/60 leading-relaxed font-medium  ">
                                                {msg.content}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}

                                <AnimatePresence>
                                    {isThinking && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }} className="flex items-center gap-3 py-2 pl-2"
                                        >
                                            <div className="flex gap-1">
                                                <div className="h-1 w-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                                <div className="h-1 w-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                <div className="h-1 w-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                            </div>
                                            <span className="text-sm text-white/90  font-semibold  italic">Analyzing Telemetry...</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input Area */}
                            <div className="p-3 border-t border-white/5 bg-black/40">
                                <form onSubmit={handleSendMessage} className="relative group">
                                    <input type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)} placeholder="Command AI coach..." className="w-full bg-white/[0.02] border border-white/5 rounded-lg py-2 pl-3.5 pr-10 text-sm focus:border-indigo-500/30 focus:bg-white/[0.03] outline-none transition-all placeholder:text-white/70 font-semibold   shadow-xl"
                                    />
                                    <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600/80 hover:bg-indigo-600 rounded text-white transition-all shadow-xl active:scale-95"
                                    >
                                        <Send className="h-3 w-3" />
                                    </button>
                                </form>
                            </div>
                            <div className="mt-3 flex justify-center gap-4 opacity-50">
                                <span className="text-xs text-white/80 font-semibold  ">Neural Intelligence</span>
                                <span className="text-xs text-white/80 font-semibold  ">•</span>
                                <span className="text-xs text-white/80 font-semibold  ">Real-time ROI Sync</span>
                            </div>
                        </div>
                    </div>
                </div>

                <NextModulePrompter nextModuleName="Outcome Tracking" nextModuleHref="/dashboard/tools/outcome-tracking" description="Monitor your strategic progression and quantify the ROI of your newly acquired skills."
                />
            </div>
        </div>
    );
}
