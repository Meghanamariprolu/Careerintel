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
        <div className="min-h-screen bg-[#050510] text-white p-5 md:p-8 font-sans selection:bg-pink-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />
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
                                animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-2.5 text-sm  font-semibold  text-pink-400 shadow-xl"
                            >
                                <Brain className="h-2.5 w-2.5" /> BEHAVIORAL INTELLIGENCE ENGINE
                            </motion.div>
                            <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-pink-400">
                                Career Match Nodes<span className="text-pink-500">.</span>
                            </h1>
                            <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                                AI-mapped career trajectories synchronized with your behavioral profile.
                            </p>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 text-pink-500 animate-spin mb-4" />
                        <p className="text-white/90">Analyzing your behavior and interests...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {recommendations.map((rec, idx) => (
                                    <motion.div
                                    key={rec.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }} className="p-3.5 rounded-lg bg-white/[0.01] border border-white/5 hover:border-pink-500/10 transition-all group flex flex-col h-full shadow-xl relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-1 rounded-md bg-pink-500/10 text-pink-400/60 border border-pink-500/20 shadow-xl">
                                            <Target className="h-3 w-3" />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-semibold text-white">{rec.matchScore}%</span>
                                            <span className="text-sm  font-semibold  text-pink-400">SYNC RATE</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xs font-semibold text-white mb-1  ">{rec.title}</h3>
                                    <p className="text-sm text-white/70 mb-4 flex-grow leading-relaxed font-medium  italic ">
                                        {rec.reason}
                                    </p>

                                    <Link href={`/dashboard/tools/market-integration?role=${encodeURIComponent(rec.title)}`}>
                                        <button className="w-full h-7 rounded-lg bg-pink-500/10 hover:bg-pink-500 text-white border border-pink-500/20 transition-all text-xs font-semibold   flex items-center justify-center gap-1.5 group/btn shadow-xl">
                                            Market Insights <ArrowRight className="h-2 w-2 group-hover/btn:translate-x-1 transition-transform" />
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
