"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Sparkles, ArrowLeft,
    Target, Zap, Rocket,
    CheckCircle, ShieldCheck, Trophy,
    ArrowRight, Lightbulb, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useUserProfile } from '@/context/UserProfileContext';
import { generateCareerStrategy } from '@/services/careerIntelligenceEngine';
import { Button } from '@/components/ui/Button';

import axios from 'axios';

export default function CareerIntelligenceReportPage() {
    const { profile } = useUserProfile();
    const [reportData, setReportData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/generate-report', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setReportData(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch report", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, []);

    const handleDownload = () => {
        const reportContent = JSON.stringify(reportData, null, 2);
        const blob = new Blob([reportContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CareerIntel_Report_${profile.name || 'User'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="mb-8">
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
                                animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-2.5 text-sm  font-semibold  text-indigo-300 shadow-xl"
                            >
                                <Sparkles className="h-2.5 w-2.5" /> Unified Strategic Output
                            </motion.div>
                            <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-indigo-400">
                                Career Intelligence Report<span className="text-indigo-500">.</span>
                            </h1>
                            <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                                The definitive strategic outlook for your professional journey. Synthesized from every module in your ecosystem.
                            </p>
                        </div>
                        <Button
                            onClick={handleDownload}
                            disabled={isLoading || !reportData} className="bg-indigo-600 hover:bg-slate-700 text-white rounded-lg px-4 h-8 shadow-xl text-xs font-semibold"
                        >
                            <FileText className="h-3 w-3 mr-2" /> Download Report
                        </Button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : !reportData ? (
                    <div className="text-center py-24 text-white/80">Failed to generate report. Please ensure your profile is complete.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Main Score Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 p-6 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-white/10 backdrop-blur-3xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Rocket className="h-32 w-32 text-indigo-400" />
                                </div>

                                <div className="relative z-10">
                                    <h2 className="text-sm font-semibold  text-white/60   mb-4">Current Target Path</h2>
                                    <h3 className="text-base md:text-xl  text-white font-semibold  mb-6  bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                        {profile.careerGoal || 'Analyzing Path...'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                        <div>
                                            <h4 className="text-sm    text-white/70 mb-3">Readiness Protocol</h4>
                                            <div className="flex items-baseline gap-2 mb-3">
                                                <span className="text-2xl md:text-3xl font-semibold text-indigo-400">{reportData.overallScore}%</span>
                                                <span className="text-sm  text-white/90  font-semibold">Score Alpha</span>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-1.5 p-0 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${reportData.overallScore}%` }}
                                                    transition={{ duration: 1.5, ease:"easeOut" }} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm    text-white/70 mb-3">Recent Milestones</h4>
                                            <ul className="space-y-1.5">
                                                {reportData.milestones.map((m, i) => (
                                                    <li key={i} className="flex items-center gap-1.5 text-xs text-white/70  font-semibold">
                                                        <CheckCircle className="h-2.5 w-2.5 text-green-400/60" /> {m.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Quick Insight */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }} className="p-6 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-between backdrop-blur-3xl"
                            >
                                <div>
                                    <Lightbulb className="h-6 w-6 text-yellow-400 mb-4" />
                                    <h3 className="text-sm md:text-base font-semibold text-white mb-3  ">AI Strategy Note</h3>
                                    <p className="text-sm text-white/70 leading-relaxed font-medium italic">"Your profile indicates a strong 'Technical Foundation' with a significant 'Architectural Gap'. Prioritizing system design projects will increase your market valuation by an estimated <span className="text-indigo-400 font-semibold">18%</span> in the next quarter."
                                    </p>
                                </div>
                                <div className="pt-4 mt-6 border-t border-white/5">
                                    <span className="text-sm font-semibold   text-white/90">Generated Alpha v1.0</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Tactical Roadmap */}
                        <div className="grid grid-cols-1 gap-6">
                            <h2 className="text-sm font-semibold text-white   flex items-center gap-2.5">
                                <Target className="h-4 w-4 text-indigo-500" /> Executive Recommendations
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                {reportData.recommendations.map((rec, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }} className="p-5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between group shadow-xl"
                                    >
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold   text-white/90 mb-2">Insight {idx + 1}</h4>
                                            <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors leading-relaxed  ">
                                                {rec}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <ArrowRight className="h-3.5 w-3.5 text-white/70 group-hover:text-white transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
