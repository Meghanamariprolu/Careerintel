"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Layout, Briefcase, User, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import PortfolioForm from '../../components/PortfolioForm';
import PortfolioPreview from '../../components/PortfolioPreview';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../../utils/localStorageHelper';
import { useUserProfile } from '@/context/UserProfileContext';
import { NextModulePrompter } from '@/components/NextModulePrompter';

const STORAGE_KEY = 'careerintel_portfolio_data';

export default function PortfolioBuilderPage() {
    const [portfolioData, setPortfolioData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const { updateProfile } = useUserProfile();

    useEffect(() => {
        const savedData = getLocalStorageItem(STORAGE_KEY, null);
        if (savedData) {
            setPortfolioData(savedData);
            setShowPreview(true);
        }
    }, []);

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
                        className="text-sm md:text-lg text-white/40 max-w-3xl mx-auto  leading-relaxed tracking-tight"
                    >
                        Architect a world-class digital presence. Transform your achievements into a high-fidelity visual narrative.
                    </motion.p>
                </header>

                <AnimatePresence mode="wait">
                    {!showPreview ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex justify-center pb-24"
                        >
                            <PortfolioForm
                                initialData={portfolioData}
                                onGenerate={handleGenerate}
                                isGenerating={isGenerating}
                            />
                        </motion.div>
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
                                    className="flex items-center gap-2 text-white/40 hover:text-white  text-sm uppercase tracking-widest transition-colors"
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
