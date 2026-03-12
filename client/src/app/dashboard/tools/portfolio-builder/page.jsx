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
        <div className="w-full max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4 mr-1" /> Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                            Portfolio Architect
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Architect a world-class digital presence. Transform your achievements into a high-fidelity visual narrative.
                    </p>
                </div>

                <div className="flex gap-4">
                     <div className="bg-slate-900/50 border border-white/5 rounded-lg p-3 px-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Targeting</p>
                        <p className="text-sm font-medium text-purple-400">{profile.careerGoal || 'Not Set'}</p>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!showPreview ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col lg:flex-row gap-8"
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
                        <div className="lg:w-1/3 space-y-6">
                            <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden h-fit">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Sparkles className="h-24 w-24 text-purple-400" />
                                </div>
                                <h3 className="text-xl text-white mb-2 flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-purple-400" /> AI Suggestions
                                </h3>
                                
                                {isLoadingRecommendations ? (
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-4 bg-white/5 rounded w-3/4"></div>
                                        <div className="h-20 bg-white/5 rounded"></div>
                                        <div className="h-20 bg-white/5 rounded"></div>
                                    </div>
                                ) : recommendedProjects.length > 0 ? (
                                    <div className="space-y-4 mt-6">
                                        {recommendedProjects.map((proj, idx) => (
                                            <div key={idx} className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-sm font-semibold text-purple-100 group-hover:text-purple-400 transition-colors">{proj.title}</h4>
                                                    <span className="text-[10px] px-2 py-1 bg-white/5 rounded-full text-white/50">{proj.difficulty}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {proj.skills.map(skill => (
                                                        <span key={skill} className="text-[9px] uppercase tracking-wider text-purple-300/60 bg-white/5 px-2 py-1 rounded">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground mt-4">Please set a career goal in onboarding to see tailored project recommendations.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-12"
                    >
                        <div className="flex justify-between items-center px-4">
                            <Button
                                variant="ghost"
                                onClick={handleEdit}
                                className="text-muted-foreground hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                            >
                                Reset Design
                            </Button>
                        </div>

                        <div className="bg-slate-900/40 rounded-3xl p-8 border border-white/5">
                            <PortfolioPreview data={portfolioData} />
                        </div>

                        <div className="flex justify-center pt-8">
                            <Link href="/dashboard">
                                <Button className="bg-purple-600 hover:bg-purple-700 h-12 px-8 rounded-xl shadow-lg shadow-purple-900/20">
                                    <Layout className="h-4 w-4 mr-2" /> Back to Intelligence Hub
                                </Button>
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
    );
}
