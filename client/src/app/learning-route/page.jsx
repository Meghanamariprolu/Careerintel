"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { NextModulePrompter } from '@/components/NextModulePrompter';
import LearningForm from '../../components/LearningForm';
import ProgressTracker from '../../components/ProgressTracker';
import RoadmapDisplay from '../../components/RoadmapDisplay';
import axios from 'axios';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../../utils/localStorageHelper';

const STORAGE_KEY = 'careerintel_learning_route';

export default function LearningRoutePage() {
    const [route, setRoute] = useState(null);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    useEffect(() => {
        const savedData = getLocalStorageItem(STORAGE_KEY, null);
        if (savedData) {
            setRoute(savedData.route);
            setCompletedSteps(savedData.completedSteps || []);
            setHasSaved(true);
        }
    }, []);

    const handleGenerate = async (formData) => {
        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/api/generate-roadmap',
                { targetRole: formData.goal, timeframe: formData.level },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                // Mock roadmapData returned from AI in our new endpoint format
                setRoute({ ...formData, roadmapData: data.data });
                setCompletedSteps([]);
                setHasSaved(false);
            }
        } catch (error) {
            console.error("Failed to generate roadmap", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleToggleStep = (index) => {
        setCompletedSteps(prev => {
            const updated = prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index];
            setHasSaved(false);
            return updated;
        });
    };

    const handleSave = () => {
        if (route) {
            setLocalStorageItem(STORAGE_KEY, { route, completedSteps });
            setHasSaved(true);
        }
    };

    const handleReset = () => {
        removeLocalStorageItem(STORAGE_KEY);
        setRoute(null);
        setCompletedSteps([]);
        setHasSaved(false);
    };

    const totalSteps = route?.roadmapData?.length || 5;
    const progress = route ? (completedSteps.length / totalSteps) * 100 : 0;

    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30 overflow-hidden relative">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 100, 0],
                        scale: [1.2, 1, 1.2],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full"
                />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 text-xs  uppercase tracking-[0.2em] text-purple-300 shadow-xl"
                    >
                        <Sparkles className="h-3 w-3" /> AI Driven Roadmaps
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-lg md:text-2xl  mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-purple-400 drop-shadow-2xl uppercase"
                    >
                        Mastery Hub <span className="text-purple-500">.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm md:text-lg text-white/70 max-w-2xl mx-auto  leading-relaxed"
                    >
                        Forge your professional destiny with high-fidelity learning pathways generated by artificial intelligence.
                    </motion.p>
                </header>

                {!route ? (
                    <div className="flex justify-center pb-20">
                        <LearningForm onGenerate={handleGenerate} isGenerating={isGenerating} />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-10 pb-20"
                    >
                        <ProgressTracker
                            progress={progress}
                            onSave={handleSave}
                            onReset={handleReset}
                            hasSaved={hasSaved}
                        />

                        <div className="bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-xl border border-white/10 shadow-3xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Sparkles className="h-40 w-40 text-purple-400" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl  text-white tracking-tight">
                                            {route.level} {route.goal}
                                        </h2>
                                        <p className="text-purple-300/40  uppercase tracking-widest text-sm mt-1">Specialization Curriculum</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-purple-500/10 text-purple-300 px-5 py-2 rounded-xl text-sm  border border-purple-500/20 shadow-lg">
                                        <div className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                                        {totalSteps} High Impact Modules
                                    </div>
                                </div>

                                <RoadmapDisplay
                                    route={route}
                                    completedSteps={completedSteps}
                                    onToggleStep={handleToggleStep}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ x: -5 }}
                                    className="flex items-center gap-2 text-white/30 hover:text-white  transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" /> Return to Dashboard
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>

            <NextModulePrompter
                nextModuleName="Skill Transfer"
                nextModuleHref="/dashboard/tools/skill-transfer"
                description="Leverage the skills from your generated learning route and map them to alternative high-value career trajectories."
            />
        </div>
    );
}
