"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from"@/components/ui/Button";
import { NextModulePrompter } from '@/components/NextModulePrompter';
import LearningForm from '../../components/LearningForm';
import ProgressTracker from '../../components/ProgressTracker';
import RoadmapDisplay from '../../components/RoadmapDisplay';
import PlatformRecommendation from '../../components/PlatformRecommendation';

import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../../utils/localStorageHelper';
import { buildCurriculum } from '../../utils/curriculumBuilder';

const STORAGE_KEY = 'careerintel_learning_route';

export default function LearningRoutePage() {
    const [route, setRoute] = useState(null);
    const [completedModules, setCompletedModules] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    useEffect(() => {
        const savedData = getLocalStorageItem(STORAGE_KEY, null);
        if (savedData) {
            setRoute(savedData.route);
            setCompletedModules(savedData.completedModules || []);
            setHasSaved(true);
        }
    }, []);

    const handleGenerate = async (formData) => {
        setIsGenerating(true);
        try {
            // Simulate slight loading delay for UI smoothness
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Generate curriculum locally based on the selected role
            const roadmapData = buildCurriculum(formData.goal, formData.level);
            
            setRoute({ ...formData, roadmapData });
            setCompletedModules([]);
            setHasSaved(false);
        } catch (error) {
            console.error("Failed to compile local curriculum", error);
            toast.error("Failed to build roadmap.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCompleteModule = (moduleId) => {
        setCompletedModules(prev => {
            const updated = prev.includes(moduleId)
                ? prev.filter(i => i !== moduleId)
                : [...prev, moduleId];
            setHasSaved(false);
            return updated;
        });
    };



    const handleSave = () => {
        if (route) {
            setLocalStorageItem(STORAGE_KEY, { route, completedModules });
            setHasSaved(true);
        }
    };

    const handleReset = () => {
        removeLocalStorageItem(STORAGE_KEY);
        setRoute(null);
        setCompletedModules([]);
        setHasSaved(false);
    };

    const currentModules = route?.roadmapData?.learning_route || 
                          (Array.isArray(route?.roadmapData) ? route.roadmapData : []) ||
                          route?.roadmapData?.learningPath || [];
    const totalSteps = currentModules.length || 5;
    const progress = route ? (completedModules.length / totalSteps) * 100 : 0;

    return (
        <div className="min-h-screen bg-[#050510] text-white p-4 md:p-8 font-sans selection:bg-violet-500/30 relative">
            {/* Premium Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 pt-4">
                <header className="mb-6">
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ x: -10 }} className="flex items-center gap-2 text-white/70 hover:text-white text-xs  font-semibold  transition-colors mb-4 md:mb-6"
                        >
                            <ArrowLeft className="h-3 w-3" /> Command Center
                        </motion.button>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-2.5 text-sm  font-semibold  text-violet-400 shadow-xl"
                            >
                                <Sparkles className="h-2.5 w-2.5" /> INTEL NODE: {route?.goal || 'CAREER'} SYNTHESIS
                            </motion.div>

                            <h1 className="text-lg md:text-xl font-semibold  text-white">
                                {route?.goal ? (
                                    <>
                                        {route.goal.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-violet-400">Synthesis Hub</span><span className="text-violet-500">.</span>
                                    </>
                                ) : (
                                    <>
                                        Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-violet-400">Mastery Node</span><span className="text-violet-500">.</span>
                                    </>
                                )}
                            </h1>

                            <p className="text-white/70 max-w-xl mt-1 text-xs md:text-sm leading-relaxed font-medium">
                                {route ? `Customized intelligence pathways and elite platform access for ${route.goal} specializations.` : 'Forge your professional destiny with high-fidelity neural pathways designed for production-grade engineering.'}
                            </p>
                        </div>
                    </div>
                </header>

                {!route ? (
                    <div className="flex justify-center pb-20">
                        <LearningForm onGenerate={handleGenerate} isGenerating={isGenerating} />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease:"easeOut" }} className="space-y-6 pb-20"
                    >
                        <ProgressTracker
                            progress={progress}
                            onSave={handleSave}
                            onReset={handleReset}
                            hasSaved={hasSaved}
                        />

                        <PlatformRecommendation goal={route.goal} />

                        {/* Job Ready Skills Section */}
                        {route.roadmapData?.job_ready_skills && (
                            <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-2.5 rounded-lg shadow-xl">
                                <h3 className="text-sm font-semibold   text-violet-400 mb-2 flex items-center gap-1.5">
                                    <Sparkles className="h-2.5 w-2.5" /> Market-Validated Expertise
                                </h3>
                                <div className="flex flex-wrap gap-1">
                                    {route.roadmapData.job_ready_skills.map(skill => (
                                        <span key={skill} className="px-2 py-0.5 rounded-md bg-white/[0.01] border border-white/5 text-sm font-semibold text-white/90">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Main Roadmap */}
                        <div className="bg-slate-900/40 backdrop-blur-3xl p-4 md:p-5 rounded-lg border border-white/5 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
                                <Sparkles className="h-24 w-24 text-violet-400" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                                    <div>
                                        <h2 className="text-base md:text-base font-semibold text-white   tabular-nums">
                                            {route.level} {route.goal}
                                        </h2>
                                        <p className="text-violet-400  font-semibold  text-sm">Specialization Curriculum</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-violet-500/5 text-violet-400 px-2 py-0.5 rounded-md text-sm  font-semibold  border border-violet-500/10 shadow-xl">
                                        <div className="h-1 w-1 rounded-full bg-violet-400/40 shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
                                        {totalSteps} Synthesis Modules
                                    </div>
                                </div>

                                <RoadmapDisplay
                                    route={route}
                                    completedModules={completedModules}
                                    onCompleteModule={handleCompleteModule}
                                    isProcessing={isProcessing}
                                />
                            </div>
                        </div>

                        {/* Portfolio Projects Section */}
                        {route.roadmapData?.portfolio_projects && (
                            <div className="space-y-3">
                                <div className="text-center">
                                    <h3 className="text-sm font-semibold text-white ">Portfolio <span className="text-violet-400">Blueprint</span></h3>
                                    <p className="text-xs text-white/70  font-semibold  mt-1">High-impact execution targets</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                    {route.roadmapData.portfolio_projects.map((project, idx) => (
                                        <div key={idx} className="p-3.5 rounded-lg bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-all shadow-xl">
                                            <h4 className="text-sm font-semibold text-violet-300/40   mb-1">{project.name}</h4>
                                            <p className="text-xs text-white/70 leading-relaxed mb-2.5 italic   font-medium">{project.description}</p>
                                            <div className="flex flex-wrap gap-1 opacity-20">
                                                {project.techStack?.map(tech => (
                                                    <span key={tech} className="px-1.5 py-0.5 rounded-md bg-white/5 text-sm font-semibold text-white/80">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ x: -10 }} className="flex items-center gap-2 text-white/70 hover:text-white text-sm  font-semibold  transition-colors"
                                >
                                    <ArrowLeft className="h-3 w-3" /> Dashboard
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>

            <NextModulePrompter nextModuleName="Skill Transfer" nextModuleHref="/dashboard/tools/skill-transfer" description="Leverage the skills from your generated learning route and map them to alternative high-value career trajectories."
            />
        </div>
    );
}
