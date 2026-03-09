"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Layout, Briefcase, User, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import PortfolioForm from '../../components/PortfolioForm';
import PortfolioPreview from '../../components/PortfolioPreview';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../../utils/localStorageHelper';
import { NextModulePrompter } from '@/components/NextModulePrompter';
import axios from 'axios';

const STORAGE_KEY = 'careerintel_portfolio_data';

export default function PortfolioBuilderPage() {
    const [portfolioData, setPortfolioData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [recommendedProjects, setRecommendedProjects] = useState([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
    const { profile, updateProfile } = useUserProfile();

    useEffect(() => {
        const savedData = getLocalStorageItem(STORAGE_KEY, null);
        if (savedData) {
            setPortfolioData(savedData);
            setShowPreview(true);
        }

        const fetchRecommendations = async () => {
            if (!profile.careerGoal) {
                setIsLoadingRecommendations(false);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.post('/api/project-recommendations',
                    { targetRole: profile.careerGoal },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data.success) {
                    setRecommendedProjects(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch project recommendations", error);
            } finally {
                setIsLoadingRecommendations(false);
            }
        };

        fetchRecommendations();
    }, [profile.careerGoal]);

    const handleGenerate = (data) => {
        setIsGenerating(true);
        setTimeout(() => {
            setPortfolioData(data);
            setLocalStorageItem(STORAGE_KEY, data);
            setShowPreview(true);
            setIsGenerating(false);
            updateProfile({ portfolioProjects: data.projects || [] });
        }, 1500);
    };

    const handleEdit = () => {
        setShowPreview(false);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset your portfolio data?")) {
            removeLocalStorageItem(STORAGE_KEY);
            setPortfolioData(null);
            setShowPreview(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
            {/* Premium Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        x: [0, 120, 0],
                        y: [0, 70, 0],
                        scale: [1, 1.3, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[15%] -left-[10%] w-[50%] h-[50%] bg-purple-600/15 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 120, 0],
                        scale: [1.1, 0.9, 1.1],
                        rotate: [0, -45, 0]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[15%] -right-[10%] w-[60%] h-[60%] bg-indigo-600/15 blur-[160px] rounded-full"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#050510_70%)] opacity-60" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 text-xs  uppercase tracking-[0.25em] text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                    >
                        <Sparkles className="h-4 w-4" /> AI Portfolio Engine
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-lg md:text-2xl  mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-purple-500/50 drop-shadow-2xl uppercase"
                    >
                        Portfolio Builder<span className="text-purple-600">.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm md:text-lg text-white/70 max-w-3xl mx-auto  leading-relaxed tracking-tight"
                    >
                        Architect a world-class digital presence. Transform your achievements into a high-fidelity visual narrative.
                    </motion.p>
                </header>

                <AnimatePresence mode="wait">
                    {!showPreview ? (
                        <div className="flex flex-col lg:flex-row gap-8 pb-24">
                            {/* Left Column: Form */}
                            <div className="flex-1">
                                <PortfolioForm
                                    initialData={portfolioData}
                                    onGenerate={handleGenerate}
                                    isGenerating={isGenerating}
                                />
                            </div>

                            {/* Right Column: Recommendations */}
                            <div className="lg:w-1/3 space-y-6">
                                <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Sparkles className="h-24 w-24 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl text-white mb-2 flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-purple-400" /> AI Recommendations
                                    </h3>
                                    <p className="text-sm text-white/50 mb-6">Targeting: {profile.careerGoal || 'Your Next Role'}</p>

                                    {isLoadingRecommendations ? (
                                        <div className="animate-pulse flex space-x-4">
                                            <div className="flex-1 space-y-4 py-1">
                                                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                                <div className="space-y-2">
                                                    <div className="h-3 bg-white/10 rounded"></div>
                                                    <div className="h-3 bg-white/10 rounded w-5/6"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : recommendedProjects.length > 0 ? (
                                        <div className="space-y-4">
                                            {recommendedProjects.map((proj, idx) => (
                                                <div key={idx} className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/50 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-sm font-semibold text-purple-100">{proj.title}</h4>
                                                        <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/70">{proj.difficulty}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {proj.skills.map(skill => (
                                                            <span key={skill} className="text-[10px] uppercase tracking-wider text-purple-300 bg-purple-500/20 px-2 py-1 rounded-md">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-white/50">Please set a career goal in onboarding to see tailored project recommendations.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-12 pb-24"
                        >
                            <div className="flex justify-between items-center mb-12 px-4">
                                <motion.button
                                    whileHover={{ x: -10 }}
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 text-white/70 hover:text-white  text-sm uppercase tracking-widest transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5" /> Back to Architect
                                </motion.button>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20  text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all"
                                    >
                                        Delete Data
                                    </button>
                                </div>
                            </div>

                            <PortfolioPreview data={portfolioData} />

                            <div className="flex justify-center pt-8">
                                <Link href="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-xl text-sm  uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-purple-500/50 transition-all shadow-2xl"
                                    >
                                        <Layout className="h-5 w-5" /> Dashboard
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <NextModulePrompter
                    nextModuleName="Resume Enhancer"
                    nextModuleHref="/dashboard/tools/resume-enhancer"
                    description="Upload your resume to have it cross-referenced against your new portfolio projects and targeted career goals."
                />
            </div>
        </div>
    );
}
