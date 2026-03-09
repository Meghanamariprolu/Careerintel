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
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-12">
                    <Link href="/dashboard">
                        <button className="flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors mb-8">
                            <ArrowLeft className="h-4 w-4" /> Back to Intelligence Hub
                        </button>
                    </Link>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 text-xs uppercase tracking-widest text-cyan-300">
                        <Combine className="h-4 w-4" /> Step 4: Skill Gap Analyzer
                    </div>
                    <h1 className="text-3xl md:text-5xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">
                        Bridge Your Skill Gap.
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
                        Comparing your current arsenal against the market demands for {profile.careerGoal || 'your target role'}.
                    </p>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-12 w-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-white/60">Computing target architecture vs current capabilities...</p>
                    </div>
                ) : analysis ? (
                    <div className="space-y-8">
                        {/* Summary Header */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-sm uppercase tracking-widest text-white/60 mb-2">Target Role</h3>
                                <p className="text-2xl font-light text-cyan-400">{analysis.targetRole}</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm uppercase tracking-widest text-white/60 mb-2">Missing Skills</h3>
                                    <p className="text-4xl font-light text-white">{analysis.missingSkills.length}</p>
                                </div>
                                <div className="h-16 w-16 rounded-full border-4 border-cyan-500/30 flex items-center justify-center">
                                    <span className="text-cyan-400 font-bold">{Math.round((analysis.currentSkills.length / Math.max(1, analysis.requiredSkills.length)) * 100)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills Lists */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="p-8 rounded-2xl bg-green-500/5 border border-green-500/20">
                                <h2 className="text-xl text-green-400 mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5" /> Current Arsenal
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {analysis.currentSkills.length > 0 ? analysis.currentSkills.map(skill => (
                                        <span key={skill} className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
                                            {skill}
                                        </span>
                                    )) : (
                                        <p className="text-white/40 text-sm">No skills listed yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                                <h2 className="text-xl text-rose-400 mb-6 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" /> Acquisition Targets
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {analysis.missingSkills.length > 0 ? analysis.missingSkills.map(skill => (
                                        <span key={skill} className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                                            {skill}
                                        </span>
                                    )) : (
                                        <p className="text-green-400 text-sm">You have all the required baseline skills!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 text-center"
                        >
                            <h3 className="text-2xl font-light mb-4">Ready to close the gap?</h3>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                We can automatically generate a structured, month-by-month learning roadmap tailored specifically to acquire these missing skills.
                            </p>
                            <Link href="/learning-route">
                                <button className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 mx-auto">
                                    Generate Learning Route <ArrowRight className="h-5 w-5" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-white/50 text-center py-20">Unable to generate analysis. Please try updating your profile.</div>
                )}
            </div>
        </div>
    );
}
