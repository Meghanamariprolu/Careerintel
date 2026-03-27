"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, Sparkles, ArrowLeft,
    BookOpen, GraduationCap, Shield,
    CheckCircle, ShieldCheck, Trophy,
    TrendingUp, ExternalLink, RefreshCw,
    Target, Zap, BarChart2, Loader2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from"@/components/ui/Button";
import { NextModulePrompter } from '@/components/NextModulePrompter';
import { useUserProfile } from '@/context/UserProfileContext';
import axios from 'axios';

// --- Resource database keyed by skill/career keywords ---
const RESOURCE_DATABASE = {
    'python': [
        { title: 'Python for Data Science & ML Bootcamp', platform: 'Udemy', category: 'Core Language', badge: 'Bestseller', url: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/' },
        { title: 'Fluent Python', platform: 'O\'Reilly Books', category: 'Advanced Python', badge: 'Expert Level', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/' },
    ],
    'machine learning': [
        { title: 'Machine Learning Specialization', platform: 'Coursera (Andrew Ng)', category: 'ML Foundations', badge: 'Industry Standard', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
        { title: 'Hands-On ML with Scikit-Learn & TensorFlow', platform: 'O\'Reilly Books', category: 'Applied ML', badge: 'Expert Level', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/' },
    ],
    'react': [
        { title: 'React - The Complete Guide 2024', platform: 'Udemy', category: 'Frontend', badge: 'Bestseller', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/' },
        { title: 'Epic React by Kent C. Dodds', platform: 'EpicReact.dev', category: 'Advanced React', badge: 'Expert Level', url: 'https://epicreact.dev/' },
    ],
    'node': [
        { title: 'Node.js, Express, MongoDB & More', platform: 'Udemy', category: 'Backend', badge: 'Bestseller', url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/' },
        { title: 'Node.js Design Patterns', platform: 'Packt Books', category: 'Architecture', badge: 'Expert Level', url: 'https://www.packtpub.com/product/nodejs-design-patterns-third-edition/9781839214110' },
    ],
    'system design': [
        { title: 'System Design Interview', platform: 'Educative.io', category: 'Architecture', badge: 'FAANG Prep', url: 'https://www.educative.io/courses/grokking-the-system-design-interview' },
        { title: 'Designing Data-Intensive Applications', platform: 'O\'Reilly Books', category: 'Distributed Systems', badge: 'Essential Read', url: 'https://dataintensive.net/' },
    ],
    'aws': [
        { title: 'AWS Certified Solutions Architect', platform: 'A Cloud Guru', category: 'Cloud Architecture', badge: 'Certification', url: 'https://acloudguru.com/learning-paths/aws-certifications' },
    ],
    'typescript': [
        { title: 'Understanding TypeScript (2024)', platform: 'Udemy', category: 'Type Safety', badge: 'High Demand', url: 'https://www.udemy.com/course/understanding-typescript/' },
    ],
    'sql': [
        { title: 'The Complete SQL Bootcamp', platform: 'Udemy', category: 'Data', badge: 'Bestseller', url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/' },
    ],
    'default': [
        { title: 'Full Stack Advanced Patterns', platform: 'Frontend Masters', category: 'Hard Skills', badge: 'Industry Standard', url: 'https://frontendmasters.com/' },
        { title: 'Systems Design Interview Guide', platform: 'Educative.io', category: 'Architecture', badge: 'Expert Level', url: 'https://educative.io' },
        { title: 'Behavioral Leadership in Tech', platform: 'Coursera', category: 'Soft Skills', badge: 'High Growth', url: 'https://coursera.org' },
    ]
};

function getResourcesForProfile(skills, careerGoal) {
    const allSkills = [...(skills || []).map(s => s.toLowerCase()), (careerGoal || '').toLowerCase()];
    const found = new Set();
    const resources = [];

    for (const keyword of allSkills) {
        for (const [key, items] of Object.entries(RESOURCE_DATABASE)) {
            if (key === 'default') continue;
            if (keyword.includes(key) || key.includes(keyword)) {
                for (const item of items) {
                    if (!found.has(item.title)) {
                        found.add(item.title);
                        resources.push(item);
                    }
                }
            }
        }
    }

    // Fallback to defaults if nothing matched
    if (resources.length === 0) return RESOURCE_DATABASE.default;
    // Always cap at 6
    return resources.slice(0, 6);
}

// Score ring component
function ScoreRing({ score, label, size = 160 }) {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const dash = (score / 100) * circumference;

    const color = score >= 80 ? '#f59e0b' : score >= 65 ? '#6366f1' : score >= 45 ? '#3b82f6' : '#64748b';

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none"
                />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color} strokeWidth="10" fill="none" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - dash }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }} className="text-4xl font-bold text-white"
                >{score}</motion.span>
                <span className="text-xs text-white/70">{label}</span>
            </div>
        </div>
    );
}

// Breakdown bar
function BreakdownBar({ label, value, max, color }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-xs text-white/90">{label}</span>
                <span className="text-xs text-white/80 font-semibold">{value}<span className="text-white/60">/{max}</span></span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / max) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
            </div>
        </div>
    );
}

export default function QualityScoringPage() {
    const { profile } = useUserProfile();
    const [scoreData, setScoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchScore = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/career-score', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setScoreData(data.data);
        } catch (err) {
            console.error('Failed to fetch career score:', err);
            setError('Could not fetch your career score. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchScore();
    }, [fetchScore]);

    const resources = getResourcesForProfile(profile.currentSkills, profile.careerGoal);

    const breakdownColors = {
        skills: '#6366f1',
        careerClarity: '#a855f7',
        experience: '#3b82f6',
        progressActivity: '#f59e0b',
    };

    const breakdownLabels = {
        skills: 'Skill Coverage',
        careerClarity: 'Career Clarity',
        experience: 'Experience Level',
        progressActivity: 'Active Progress',
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white p-5 md:p-8 font-sans selection:bg-orange-500/30 overflow-x-hidden relative">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-6 pb-16">
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
                                animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-2.5 text-sm  font-semibold  text-orange-400 shadow-xl"
                            >
                                <Star className="h-2.5 w-2.5" /> READINESS AUDIT ENGINE
                            </motion.div>
                            <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-orange-400">
                                Quality Readiness Node<span className="text-orange-500">.</span>
                            </h1>
                            <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                                Profile synchronization powered by real-time data from your skills and progress.
                            </p>
                        </div>
                        <Button
                            onClick={fetchScore} size="sm" className="rounded-lg border-white/5 hover:bg-white/5 gap-2 shrink-0 h-7 bg-black/40 text-xs font-semibold   px-3 shadow-xl"
                            disabled={loading}
                        >
                            <RefreshCw className={`h-2.5 w-2.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Node
                        </Button>
                    </div>
                </header>

                {/* Score Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Score Ring */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }} className="lg:col-span-1 bg-white/[0.01] backdrop-blur-3xl rounded-lg border border-white/5 p-4 flex flex-col items-center justify-center gap-3 text-center shadow-xl"
                    >
                        <h2 className="text-sm  font-semibold  text-white/70">Readiness Score</h2>
                        {loading ? (
                            <div className="h-24 flex items-center justify-center">
                                <Loader2 className="h-3 w-3 text-orange-500 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center gap-2 text-center">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <p className="text-xs text-red-400 font-semibold">{error}</p>
                            </div>
                        ) : scoreData ? (
                            <ScoreRing score={scoreData.score} label={scoreData.label} size={100} />
                        ) : null}
                        {scoreData && !loading && (
                            <div className="px-2 py-0.5 rounded-md bg-orange-500/5 border border-orange-500/10 text-sm text-orange-500/40   font-semibold">
                                {scoreData.label}
                            </div>
                        )}
                    </motion.div>

                    {/* Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white/[0.01] backdrop-blur-3xl rounded-lg border border-white/5 p-4 space-y-4 shadow-xl"
                    >
                        <h2 className="text-sm  font-semibold  text-white/70">Readiness Breakdown</h2>
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="h-2 bg-white/5 rounded-full w-1/3 animate-pulse" />
                                        <div className="h-1 bg-white/5 rounded-full w-full animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : scoreData ? (
                            <div className="space-y-3">
                                {Object.entries(scoreData.breakdown).map(([key, val]) => (
                                    <BreakdownBar
                                        key={key}
                                        label={breakdownLabels[key] || key}
                                        value={val}
                                        max={scoreData.maxScores?.[key] || 25}
                                        color={breakdownColors[key] || '#6366f1'}
                                    />
                                ))}
                            </div>
                        ) : null}

                        {/* Recommendations */}
                        {scoreData?.recommendations?.length > 0 && (
                            <div className="pt-3 border-t border-white/5 space-y-2">
                                <h3 className="text-sm  font-semibold  text-white/70">Tactical Node Enhancements</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
                                    {scoreData.recommendations.map((rec, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <Zap className="h-2 w-2 text-orange-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-white/90 font-medium leading-relaxed italic">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Personalized Learning Resources */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm md:text-base font-semibold  text-white">
                                High-ROI Talent Clusters
                            </h2>
                            <p className="text-xs text-white/70 mt-0.5  font-semibold  leading-none">
                                Target Scope: <span className="text-orange-500">{profile.careerGoal || 'GENERALIST'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence>
                            {resources.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.07 }} className="group relative"
                                >
                                    <div className="relative p-2.5 rounded-lg bg-white/[0.01] border border-white/[0.03] hover:border-orange-500/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-3xl shadow-xl">
                                        <div className="flex items-start gap-3">
                                            <div className="p-1.5 bg-orange-500/5 rounded-md border border-orange-500/10 group-hover:bg-orange-500/10 transition-colors shrink-0">
                                                <BookOpen className="h-3.5 w-3.5 text-orange-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold   text-orange-400">{item.platform}</span>
                                                    <span className="h-0.5 w-0.5 bg-white/5 rounded-full" />
                                                    <span className="text-sm font-semibold   text-white/90">{item.category}</span>
                                                </div>
                                                <h3 className="text-[12px] font-semibold text-white/90 group-hover:text-orange-400 transition-colors ">{item.title}</h3>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
                                                    <span className="text-sm font-semibold   text-emerald-400">{item.badge}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-2 md:pt-0 md:pl-4 shrink-0">
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                <Button size="sm" variant="outline" className="rounded-lg border-white/5 hover:bg-orange-500 hover:text-white hover:border-orange-500 px-3 h-6 text-xs font-semibold   gap-2 transition-all shadow-xl">
                                                    Sync <ExternalLink className="h-2 w-2" />
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Methodology Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }} className="mt-6 p-3 rounded-lg bg-orange-500/5 border border-white/5 text-center"
                >
                    <p className="text-xs md:text-sm font-medium text-white/70  ">
                        Intelligence metrics derived from: <span className="text-orange-400">Skill Delta</span> • 
                        <span className="text-orange-400"> Career Precision</span> • 
                        <span className="text-orange-400"> Velocity</span> • 
                        <span className="text-orange-400"> Consistency</span>.
                    </p>
                </motion.div>

                <NextModulePrompter nextModuleName="Outcome Tracking" nextModuleHref="/dashboard/tools/outcome-tracking" description="Monitor your strategic progression and quantify the ROI of your newly acquired skills."
                />
            </div>
        </div>
    );
}
