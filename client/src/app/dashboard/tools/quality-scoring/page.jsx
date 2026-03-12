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
import { Button } from "@/components/ui/Button";
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
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none"
                />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color} strokeWidth="10" fill="none"
                    strokeLinecap="round"
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
                    transition={{ delay: 0.5 }}
                    className="text-4xl font-bold text-white"
                >{score}</motion.span>
                <span className="text-xs text-white/40 uppercase tracking-widest">{label}</span>
            </div>
        </div>
    );
}

// Breakdown bar
function BreakdownBar({ label, value, max, color }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-xs text-white/60 uppercase tracking-widest">{label}</span>
                <span className="text-xs text-white/80 font-semibold">{value}<span className="text-white/30">/{max}</span></span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
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
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-orange-500/30 overflow-x-hidden relative">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="mb-16">
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ x: -10 }}
                            className="flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors mb-8"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Intelligence Hub
                        </motion.button>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-[10px] md:text-xs uppercase tracking-[0.25em] text-orange-300 shadow-xl"
                            >
                                <Star className="h-3 w-3" /> Career Readiness Engine
                            </motion.div>
                            <h1 className="text-lg md:text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-orange-400 uppercase">
                                Quality Scoring & Readiness<span className="text-orange-500">.</span>
                            </h1>
                            <p className="text-sm md:text-lg text-white/70 max-w-2xl mt-4 leading-relaxed">
                                A live audit of your career profile. Powered by real data from your skills, goals, and progress. The higher your score, the more market-ready you are.
                            </p>
                        </div>
                        <Button
                            onClick={fetchScore}
                            variant="outline"
                            className="rounded-xl border-white/10 hover:bg-white/5 gap-2 shrink-0"
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Score
                        </Button>
                    </div>
                </header>

                {/* Score Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Score Ring */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-1 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-8 flex flex-col items-center justify-center gap-6 text-center"
                    >
                        <h2 className="text-xs uppercase tracking-widest text-white/40">Career Readiness Score</h2>
                        {loading ? (
                            <div className="h-40 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-orange-400 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center gap-3 text-center">
                                <AlertCircle className="h-8 w-8 text-red-400" />
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        ) : scoreData ? (
                            <ScoreRing score={scoreData.score} label={scoreData.label} size={180} />
                        ) : null}
                        {scoreData && !loading && (
                            <div className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400 uppercase tracking-widest font-semibold">
                                {scoreData.label}
                            </div>
                        )}
                    </motion.div>

                    {/* Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-8 space-y-6"
                    >
                        <h2 className="text-sm uppercase tracking-widest text-white/40">Score Breakdown</h2>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="h-3 bg-white/5 rounded-full w-1/3 animate-pulse" />
                                        <div className="h-1.5 bg-white/5 rounded-full w-full animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : scoreData ? (
                            <div className="space-y-5">
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
                            <div className="pt-4 border-t border-white/5 space-y-3">
                                <h3 className="text-xs uppercase tracking-widest text-white/30">Boost Your Score</h3>
                                {scoreData.recommendations.map((rec, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Zap className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                                        <p className="text-sm text-white/60">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Personalized Learning Resources */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-base md:text-xl tracking-tight text-white">
                                Personalized High-ROI Resources
                            </h2>
                            <p className="text-sm text-white/40 mt-1">
                                Curated for your target: <span className="text-orange-400">{profile.careerGoal || 'your role'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {resources.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.07 }}
                                    className="group relative"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
                                    <div className="relative p-6 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl">
                                        <div className="flex items-start gap-5">
                                            <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors shrink-0">
                                                <BookOpen className="h-6 w-6 text-orange-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <span className="text-[10px] uppercase tracking-widest text-orange-400/60">{item.platform}</span>
                                                    <span className="h-1 w-1 bg-white/10 rounded-full" />
                                                    <span className="text-[10px] uppercase tracking-widest text-white/30">{item.category}</span>
                                                </div>
                                                <h3 className="text-base text-white group-hover:text-orange-400 transition-colors">{item.title}</h3>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
                                                    <span className="text-xs text-green-400/80">{item.badge}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/5 pt-5 md:pt-0 md:pl-6 shrink-0">
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 hover:border-orange-500/30 px-5 text-sm gap-2">
                                                    Explore <ExternalLink className="h-3.5 w-3.5" />
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
                    transition={{ delay: 0.8 }}
                    className="mt-8 p-6 rounded-xl bg-orange-500/5 border border-orange-500/10 text-center"
                >
                    <p className="text-xs md:text-sm text-white/50">
                        Score calculated from your <span className="text-orange-400/70">Skill Coverage</span>,{' '}
                        <span className="text-orange-400/70">Career Clarity</span>,{' '}
                        <span className="text-orange-400/70">Experience Level</span>, and{' '}
                        <span className="text-orange-400/70">Active Progress</span>. Update your profile to improve your score.
                    </p>
                </motion.div>

                <NextModulePrompter
                    nextModuleName="Outcome Tracking"
                    nextModuleHref="/dashboard/tools/outcome-tracking"
                    description="Monitor your strategic progression and quantify the ROI of your newly acquired skills."
                />
            </div>
        </div>
    );
}
