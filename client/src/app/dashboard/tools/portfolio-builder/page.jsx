"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Layout, Briefcase, User, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import PortfolioForm from '@/components/PortfolioForm';
import PortfolioPreview from '@/components/PortfolioPreview';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '@/utils/localStorageHelper';
import { NextModulePrompter } from '@/components/NextModulePrompter';
import { useUserProfile } from '@/context/UserProfileContext';
import axios from 'axios';
import { Button } from '@/components/ui/Button';

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
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-16 relative">
            {/* Header Section */}
            <header className="mb-6">
                <Link href="/dashboard">
                    <motion.button
                        whileHover={{ x: -10 }} className="flex items-center gap-2 text-white/70 hover:text-white text-sm  font-semibold  transition-colors mb-4 md:mb-6"
                    >
                        <ArrowLeft className="h-3 w-3" /> Dashboard
                    </motion.button>
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3 text-xs  font-semibold  text-purple-400 shadow-xl"
                        >
                            <Layout className="h-2.5 w-2.5" /> PORTFOLIO INTELLIGENCE ENGINE
                        </motion.div>
                        <h1 className="text-xl md:text-3xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-purple-400">
                            Portfolio Architect Node<span className="text-purple-500">.</span>
                        </h1>
                        <p className="text-sm md:text-xs text-white/70 max-w-xl mt-2.5 font-medium leading-relaxed">
                            Architect a high-fidelity visual narrative synchronized with your achievements.
                        </p>
                    </div>

                    {/* Stats Summary */}
                    <div className="flex gap-2">
                        <div className="bg-white/[0.01] border border-white/5 rounded-lg p-1.5 px-2.5 text-center shadow-xl backdrop-blur-3xl min-w-[70px]">
                            <p className="text-sm text-white/70 mb-0.5  font-semibold">Target Scope</p>
                            <p className="text-xs font-semibold text-purple-400/60  ">{profile.careerGoal || 'UNDEFINED'}</p>
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {!showPreview ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }} className="flex flex-col lg:flex-row gap-8"
                    >
                        {/* Left Column: Form */}
                        <div className="flex-1">
                            <PortfolioForm
                                initialData={portfolioData}
                                onGenerate={handleGenerate}
                                isGenerating={isGenerating}
                            />
                        </div>

                        {/* Right Column: Recommendations */}
                        <div className="lg:w-1/3 space-y-4">
                            <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg shadow-xl relative overflow-hidden h-fit">
                                <div className="absolute top-0 right-0 p-3 opacity-5">
                                    <Sparkles className="h-8 w-8 text-purple-400" />
                                </div>
                                <h3 className="text-xs font-semibold text-white/70 mb-4 flex items-center gap-2">
                                    <Briefcase className="h-2.5 w-2.5 text-purple-500" /> AI Suggestions
                                </h3>
                                
                                {isLoadingRecommendations ? (
                                    <div className="animate-pulse space-y-3">
                                        <div className="h-3 bg-white/5 rounded w-3/4"></div>
                                        <div className="h-16 bg-white/5 rounded"></div>
                                        <div className="h-16 bg-white/5 rounded"></div>
                                    </div>
                                ) : recommendedProjects.length > 0 ? (
                                    <div className="space-y-2 mt-2">
                                        {recommendedProjects.map((proj, idx) => (
                                            <div key={idx} className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/20 transition-all group shadow-xl">
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <h4 className="text-sm font-semibold text-white/70 group-hover:text-purple-400 transition-colors  ">{proj.title}</h4>
                                                    <span className="text-sm font-semibold   px-1.5 py-0.5 bg-white/5 rounded text-white/70">{proj.difficulty}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {proj.skills.map(skill => (
                                                        <span key={skill} className="text-sm  font-semibold  text-white/90 bg-white/5 px-2 py-0.5 rounded">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-white/70 font-semibold   mt-4 italic">Set career goal for telemetry recommendations.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="preview"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }} className="space-y-12"
                    >
                        <div className="flex justify-between items-center px-4">
                            <Button variant="ghost"
                                onClick={handleEdit} className="text-muted-foreground hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
                            </Button>

                            <Button variant="outline"
                                onClick={handleReset} className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                            >
                                Reset Design
                            </Button>
                        </div>

                        <div className="bg-slate-900/40 rounded-lg p-6 border border-white/5">
                            <PortfolioPreview data={portfolioData} />
                        </div>

                        <div className="flex justify-center pt-8">
                            <Link href="/dashboard">
                                <Button className="bg-purple-600 hover:bg-purple-700 h-11 px-8 rounded-lg shadow-lg shadow-purple-900/20 text-xs font-semibold">
                                    <Layout className="h-4 w-4 mr-2" /> Back to Intelligence Hub
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <NextModulePrompter nextModuleName="Resume Enhancer" nextModuleHref="/dashboard/tools/resume-enhancer" description="Upload your resume to have it cross-referenced against your new portfolio projects and targeted career goals."
            />
        </div>
    );
}
