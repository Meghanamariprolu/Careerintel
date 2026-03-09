"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Sparkles, ArrowLeft, Target, Loader2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useUserProfile } from '@/context/UserProfileContext';

export default function BehavioralMappingPage() {
    const { profile } = useUserProfile();
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.post('/api/behavior-analysis',
                    { interests: profile.interests || [] },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data.success) {
                    setRecommendations(data.data);
                }
            } catch (error) {
                console.error("Error fetching behavior analysis:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [profile.interests]);

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
                            className="flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors mb-8 mx-auto md:mx-0"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Intelligence Hub
                        </motion.button>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-[10px] md:text-xs uppercase tracking-[0.25em] text-pink-300 shadow-xl"
                            >
                                <Brain className="h-3 w-3" /> Step 2: Behavioral Intelligence
                            </motion.div>
                            <h1 className="text-lg md:text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-pink-400 uppercase">
                                AI Career Matches<span className="text-pink-500">.</span>
                            </h1>
                            <p className="text-sm md:text-lg text-white/70 max-w-2xl mt-4 leading-relaxed mx-auto md:mx-0">
                                Based on your interests and behavioral profile, our AI has mapped out the highest-probability career matches for you.
                            </p>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 text-pink-500 animate-spin mb-4" />
                        <p className="text-white/60">Analyzing your behavior and interests...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {recommendations.map((rec, idx) => (
                                <motion.div
                                    key={rec.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all group flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
                                            <Target className="h-6 w-6" />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-2xl text-white">{rec.matchScore}%</span>
                                            <span className="text-[10px] uppercase tracking-widest text-pink-400">Match Score</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl text-white mb-3 font-light">{rec.title}</h3>
                                    <p className="text-sm text-white/60 mb-8 flex-grow">
                                        {rec.reason}
                                    </p>

                                    <Link href={`/dashboard/tools/market-integration?role=${encodeURIComponent(rec.title)}`}>
                                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-pink-500 hover:text-white border border-white/10 hover:border-pink-500 transition-all text-sm uppercase tracking-widest text-white/70 flex items-center justify-center gap-2 group/btn">
                                            View Market Insights <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
