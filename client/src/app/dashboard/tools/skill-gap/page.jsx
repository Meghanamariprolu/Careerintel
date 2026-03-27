"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Combine, ArrowLeft, Loader2, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useUserProfile } from '@/context/UserProfileContext';
import { useRouter } from 'next/navigation';

export default function SkillGapAnalyzerPage() {
    const { profile } = useUserProfile();
    const router = useRouter();
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGapAnalysis = async () => {
            if (!profile.careerGoal) {
                // If they haven't set a goal, they should do onboarding
                router.push('/onboarding');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.post('/api/skill-gap',
                    { targetRole: profile.careerGoal, currentSkills: profile.currentSkills || [] },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data.success) {
                    setAnalysis(data.data);
                }
            } catch (error) {
                console.error("Error fetching skill gap:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGapAnalysis();
    }, [profile.careerGoal, profile.currentSkills, router]);

    return (
        <div className="min-h-screen bg-[#050510] text-white p-5 md:p-8 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
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
                                <Combine className="h-2.5 w-2.5" /> GAP ANALYSIS ENGINE
                            </motion.div>
                            <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-400">
                                Skill Gap Matrix<span className="text-cyan-500">.</span>
                            </h1>
                            <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                                Comparing your current arsenal against the market demands for {profile.careerGoal || 'target role'}.
                            </p>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-12 w-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-white/90">Computing target architecture vs current capabilities...</p>
                    </div>
                ) : analysis ? (
                    <div className="space-y-8">
                        {/* Summary Header */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3.5 rounded-lg bg-white/[0.01] border border-white/5 shadow-xl">
                                <h3 className="text-sm  font-semibold  text-white/90 mb-1">Target Protocol</h3>
                                <p className="text-sm font-semibold text-cyan-400 ">{analysis.targetRole}</p>
                            </div>
                            <div className="p-3.5 rounded-lg bg-white/[0.01] border border-white/5 flex justify-between items-center shadow-xl">
                                <div>
                                    <h3 className="text-sm  font-semibold  text-white/90 mb-1">Missing Nodes</h3>
                                    <p className="text-xl font-semibold text-white">{analysis.missingSkills.length}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full border border-cyan-500/10 flex items-center justify-center relative">
                                    <div className="absolute inset-0 rounded-full border border-cyan-500/30 border-t-transparent animate-pulse" />
                                    <span className="text-xs text-cyan-400 font-semibold">{Math.round((analysis.currentSkills.length / Math.max(1, analysis.requiredSkills.length)) * 100)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills Lists */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-white/[0.01] border border-emerald-500/10 shadow-xl">
                                <h2 className="text-xs font-semibold text-emerald-500/40 mb-3 flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3 w-3" /> Current Arsenal
                                </h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {analysis.currentSkills.length > 0 ? analysis.currentSkills.map(skill => (
                                        <span key={skill} className="px-2 py-0.5 rounded-md bg-emerald-500/5 border border-emerald-500/10 text-emerald-500/40 text-xs font-semibold">
                                            {skill}
                                        </span>
                                    )) : (
                                        <p className="text-white/70 text-xs  font-semibold">No nodes detected</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-white/[0.01] border border-rose-500/10 shadow-xl">
                                <h2 className="text-xs font-semibold text-rose-500/40 mb-3 flex items-center gap-1.5">
                                    <AlertTriangle className="h-3 w-3" /> Acquisition Targets
                                </h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {analysis.missingSkills.length > 0 ? analysis.missingSkills.map(skill => (
                                        <span key={skill} className="px-2 py-0.5 rounded-md bg-rose-500/5 border border-rose-500/10 text-rose-500/40 text-xs font-semibold">
                                            {skill}
                                        </span>
                                    )) : (
                                        <p className="text-emerald-400 text-xs  font-semibold">All nodes synced</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-lg bg-white/[0.01] border border-cyan-500/10 text-center shadow-xl backdrop-blur-3xl"
                        >
                            <h3 className="text-xs font-semibold mb-1  ">Sync Learning Protocol?</h3>
                            <p className="text-white/70 mb-4 max-w-xl mx-auto text-xs font-medium leading-relaxed">
                                Generate a structured roadmap tailored specifically to acquire missing critical nodes.
                            </p>
                            <Link href="/learning-route">
                                <button className="px-4 py-2 rounded-lg bg-cyan-600/80 hover:bg-cyan-600 text-white font-semibold   text-xs transition-all shadow-xl flex items-center gap-1.5 mx-auto">
                                    Initialize Route <ArrowRight className="h-3 w-3" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-white/80 text-center py-20">Unable to generate analysis. Please try updating your profile.</div>
                )}
            </div>
        </div>
    );
}
