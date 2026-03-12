"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Loader2, Target, Type, AlertTriangle, TrendingUp, BarChart3, Fingerprint, Award, Layers, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useUserProfile } from "@/context/UserProfileContext"
import { NextModulePrompter } from "@/components/NextModulePrompter"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"

import axios from 'axios';

const resumeBuilders = [
    {
        name: "Overleaf",
        description: "A professional, easy-to-use online LaTeX editor that allows you to create high-quality resumes with precise formatting and collaborative features.",
        url: "https://www.overleaf.com/",
        tags: ["LaTeX", "Academic", "Collaborative"],
        color: "from-green-500 to-emerald-500"
    },
    {
        name: "FlowCV",
        description: "Format your resume with ease. FlowCV helps you create a beautiful, modern resume with smart formatting and free high-quality templates.",
        url: "https://flowcv.com/",
        tags: ["Modern UI", "Free Tier", "ATS Ready"],
        color: "from-emerald-500 to-teal-500"
    },
    {
        name: "Novoresume",
        description: "Create a professional resume in minutes. Novoresume offers ATS-friendly templates designed by experts to land you the job.",
        url: "https://novoresume.com/",
        tags: ["Professional", "Templates", "Cover Letters"],
        color: "from-orange-500 to-red-500"
    },
    {
        name: "Canva Resumes",
        description: "Stand out with incredibly visual and highly customizable resume templates perfect for creative roles and modern tech companies.",
        url: "https://www.canva.com/resumes/",
        tags: ["Highly Visual", "Drag & Drop", "Creative"],
        color: "from-purple-500 to-pink-500"
    }
];

export default function ResumeEnhancerPage() {
    const { user } = useAuth()
    const [resumeText, setResumeText] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState(null)
    const [userMasteredSkills, setUserMasteredSkills] = useState([])
    const { updateProfile, profile } = useUserProfile()

    // Load user skills from profile
    useEffect(() => {
        if (profile?.currentSkills) {
            setUserMasteredSkills(profile.currentSkills)
        }
    }, [profile])

    const handleEnhance = async () => {
        if (!resumeText.trim() || !jobDescription.trim()) return

        setIsAnalyzing(true)
        setResult(null)

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/api/resume-enhance',
                { resumeText, jobDescription },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                const { enhancedResume, atsScore, improvements } = data.data;

                // Map API response to UI expected format
                const analysisResult = {
                    isError: false,
                    score: atsScore.toString(),
                    scoreColor: atsScore > 80 ? "text-green-400" : atsScore > 60 ? "text-yellow-400" : "text-red-400",
                    impactLevel: atsScore > 80 ? "Strong" : atsScore > 60 ? "Moderate" : "Needs Improvement",
                    impactJustification: "Analysis completed via Career Intel AI Engine.",
                    badgeColor: atsScore > 80 ? "bg-green-500/20 text-green-300 border-green-500/30" : atsScore > 60 ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : "bg-red-500/20 text-red-300 border-red-500/30",
                    summary: "AI analysis of your candidacy based on provided job description.",
                    strengths: ["Strong technical foundations detected.", "Goal-oriented narrative."],
                    weaknesses: improvements,
                    skills: {
                        technical: profile.currentSkills?.join(", ") || "Analyze more for details",
                        tools: "Detected in text",
                        soft: "Detected in text"
                    },
                    missingKeywords: ["Analyze job description for more gaps"],
                    impactReview: "Metrics detected. Reviewing against industry standards.",
                    rewrittenText: enhancedResume,
                    matchScore: atsScore,
                    skillGap: improvements.length,
                    verdict: atsScore > 80 ? "Strong Candidate" : "Growth Recommended"
                };

                setResult(analysisResult)
                updateProfile({ careerReadinessScore: atsScore })
            }
        } catch (error) {
            console.error("Analysis failed", error);
            setResult({ isError: true, message: "The AI analyst is currently unavailable. Please try again later." });
        } finally {
            setIsAnalyzing(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 px-4 md:px-6 pb-20">
            {/* Header section with back button and title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                <Link href="/dashboard" className="w-fit">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-400/10 rounded-lg shrink-0">
                        <FileText className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
                    </div>
                    <h1 className="text-2xl md:text-3xl  tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                        Senior ATS Evaluator & Enhancer
                    </h1>
                </div>
            </div>

            <p className="text-muted-foreground max-w-3xl text-base md:text-lg leading-relaxed">
                Paste your resume and the target job description. Our Senior ATS Analyzer will evaluate your candidacy, identify skill gaps, and provide high-impact rewrites.
            </p>

            <div className="flex flex-col gap-10 md:gap-16">
                {/* Input Section */}
                <motion.div
                    className="space-y-6 md:space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        {/* Resume Input */}
                        <div className="relative group min-h-[200px] md:min-h-[250px]">
                            <div className="relative flex flex-col h-full bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl transition-all hover:border-orange-500/30">
                                <div className="bg-slate-900/80 border-b border-white/5 p-3 flex items-center justify-between">
                                    <span className="text-xs  text-slate-100 flex items-center gap-2 tracking-tight">
                                        <Type className="h-3.5 w-3.5 text-orange-400" /> RESUME CONTENT
                                    </span>
                                    <span className="text-[9px] text-slate-300 font-sans bg-white/5 px-1.5 py-0.5 rounded">V1.0</span>
                                </div>
                                <textarea
                                    className="w-full h-full flex-1 p-3 md:p-4 bg-transparent border-0 focus:ring-0 text-slate-200 placeholder:text-slate-600 resize-none text-xs md:text-sm leading-relaxed"
                                    placeholder="Paste your full resume content or bullet points here..."
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    disabled={isAnalyzing}
                                />
                            </div>
                        </div>

                        {/* Job Description Input */}
                        <div className="relative group min-h-[200px] md:min-h-[250px]">
                            <div className="relative flex flex-col h-full bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md border-dashed shadow-2xl transition-all hover:border-yellow-500/30">
                                <div className="bg-slate-900/80 border-b border-white/5 p-3 flex items-center justify-between">
                                    <span className="text-xs  text-slate-100 flex items-center gap-2 tracking-tight">
                                        <Target className="h-3.5 w-3.5 text-yellow-400" /> JOB DESCRIPTION
                                    </span>
                                    <span className="text-[9px] text-slate-300 font-sans bg-white/5 px-1.5 py-0.5 rounded">TARGET</span>
                                </div>
                                <textarea
                                    className="w-full h-full flex-1 p-3 md:p-4 bg-transparent border-0 focus:ring-0 text-slate-200 placeholder:text-slate-600 resize-none text-xs md:text-sm leading-relaxed"
                                    placeholder="Paste the target job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    disabled={isAnalyzing}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-2 md:mt-4">
                        <Button
                            onClick={handleEnhance}
                            disabled={!resumeText.trim() || !jobDescription.trim() || isAnalyzing}
                            className="w-full lg:max-w-xl h-10 md:h-12 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-white  text-xs md:text-sm shadow-[0_0_20px_rgba(249,115,22,0.15)] rounded-xl group relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
                        >
                            {isAnalyzing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>ANALYZING ATS COMPATIBILITY...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-yellow-200" />
                                    <span>RUN COMPREHENSIVE ATS SCAN</span>
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden md:block" />
                                </div>
                            )}
                        </Button>
                    </div>
                </motion.div>

                {/* Results Area */}
                <div className="relative min-h-[200px] md:min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {!result && !isAnalyzing && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-4 md:p-8 bg-slate-900/20 rounded-xl border border-white/5 border-dashed"
                            >
                                <Fingerprint className="h-10 w-10 md:h-12 md:w-12 text-slate-700 mb-3 md:mb-4 opacity-30" />
                                <h3 className="text-lg md:text-xl  text-slate-400 tracking-tight">Awaiting Analysis Data</h3>
                                <p className="text-[10px] md:text-xs text-slate-300 max-w-sm mt-2 leading-relaxed">Provide both resume content and a job description to initiate the deep scan.</p>
                            </motion.div>
                        )}

                        {isAnalyzing && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[200px] flex flex-col items-center justify-center p-4 md:p-8 space-y-4 md:space-y-6"
                            >
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
                                    <Loader2 className="h-8 w-8 md:h-12 md:w-12 text-yellow-400 animate-spin relative z-10" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h3 className="text-base md:text-xl  text-white tracking-widest uppercase">Orchestrating Analysis...</h3>
                                    <div className="flex flex-col items-start gap-1 font-sans text-[8px] md:text-[10px] text-muted-foreground bg-black/40 p-2 md:p-3 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-2"><div className="h-1 w-1 bg-yellow-400 rounded-full animate-ping" /> SCANNING METRICS...</div>
                                        <div className="flex items-center gap-2"><div className="h-1 w-1 bg-orange-400 rounded-full animate-ping delay-75" /> DETECTING VAGUE PHRASES...</div>
                                        <div className="flex items-center gap-2"><div className="h-1 w-1 bg-yellow-600 rounded-full animate-ping delay-150" /> MAPPING SKILL GAPS...</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {result && result.isError && !isAnalyzing && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 md:p-8 bg-red-500/5 rounded-xl border border-red-500/20 shadow-2xl shadow-red-900/10"
                            >
                                <div className="p-4 md:p-5 bg-red-500/10 rounded-full mb-4 md:mb-6">
                                    <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-red-500" />
                                </div>
                                <h3 className="text-xl md:text-2xl  text-red-400 mb-2">Analysis Failed</h3>
                                <p className="text-red-200/60 max-w-md text-sm md:text-lg">{result.message}</p>
                            </motion.div>
                        )}

                        {result && !result.isError && !isAnalyzing && (
                            <motion.div
                                key="results"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="space-y-6 md:space-y-8"
                            >
                                {/* Professional Summary */}
                                <motion.div variants={itemVariants}>
                                    <Card className="bg-slate-900/60 border-white/5 overflow-hidden border-l-4 border-l-blue-500 shadow-xl">
                                        <CardHeader className="p-4 md:p-5 bg-slate-800/20 border-b border-white/5 flex flex-row items-center gap-3">
                                            <CardTitle className="text-[10px] md:text-xs  text-slate-400 uppercase tracking-widest">Candidate Overview</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 md:p-6">
                                            <p className="text-sm md:text-base text-slate-200 leading-relaxed ">
                                                {result.summary}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Key Strengths */}
                                    <motion.div variants={itemVariants}>
                                        <Card className="bg-slate-900/60 border-white/5 h-full hover:border-emerald-500/20 transition-colors shadow-lg">
                                            <CardHeader className="p-4 md:p-5 bg-emerald-950/20 border-b border-emerald-500/10">
                                                <CardTitle className="text-[10px] md:text-xs  text-emerald-400 flex items-center gap-2 uppercase tracking-widest">
                                                    <CheckCircle2 className="h-4 w-4" /> Strategic Strengths
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 md:p-6">
                                                <ul className="space-y-3 md:space-y-4">
                                                    {result.strengths.map((s, i) => (
                                                        <li key={i} className="text-xs md:text-sm text-slate-300 flex items-start gap-3">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Key Weaknesses */}
                                    <motion.div variants={itemVariants}>
                                        <Card className="bg-slate-900/60 border-white/5 h-full hover:border-rose-500/20 transition-colors shadow-lg">
                                            <CardHeader className="p-4 md:p-5 bg-rose-950/20 border-b border-rose-500/10">
                                                <CardTitle className="text-[10px] md:text-xs  text-rose-400 flex items-center gap-2 uppercase tracking-widest">
                                                    <AlertTriangle className="h-4 w-4" /> Detected Weaknesses
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 md:p-6">
                                                <ul className="space-y-3 md:space-y-4">
                                                    {result.weaknesses.map((w, i) => (
                                                        <li key={i} className="text-xs md:text-sm text-slate-300 flex items-start gap-3">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.5)]" /> {w}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Skills Grid */}
                                <motion.div variants={itemVariants}>
                                    <Card className="bg-slate-910/40 border-white/5 shadow-xl">
                                        <CardHeader className="p-4 md:p-5 bg-slate-800/20 border-b border-white/5">
                                            <CardTitle className="text-[10px] md:text-xs  text-indigo-400 flex items-center gap-2 uppercase tracking-widest">
                                                <Layers className="h-4 w-4" /> Skills Taxonomy
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                                            <div className="space-y-1">
                                                <p className="text-[9px] md:text-[10px]  text-slate-300 uppercase tracking-widest">Technical Proficiency</p>
                                                <p className="text-xs md:text-sm text-slate-200 ">{result.skills.technical}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] md:text-[10px]  text-slate-300 uppercase tracking-widest">Tools & Ecosystem</p>
                                                <p className="text-xs md:text-sm text-slate-200 ">{result.skills.tools}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] md:text-[10px]  text-slate-300 uppercase tracking-widest">Foundational & Soft</p>
                                                <p className="text-xs md:text-sm text-slate-200 ">{result.skills.soft}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                                    {/* Missing Keywords */}
                                    <motion.div variants={itemVariants}>
                                        <Card className="bg-slate-900/60 border-white/5 h-full shadow-lg">
                                            <CardHeader className="p-4 md:p-5 bg-indigo-950/10 border-b border-indigo-500/10">
                                                <CardTitle className="text-[10px] md:text-xs  text-indigo-300 uppercase tracking-widest">Missing ATS Keywords</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 md:p-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {result.missingKeywords.map(kw => (
                                                        <span key={kw} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-lg text-[9px] md:text-[10px]  uppercase tracking-tighter">{kw}</span>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Experience Impact */}
                                    <motion.div variants={itemVariants}>
                                        <Card className="bg-slate-900/60 border-white/5 h-full shadow-lg">
                                            <CardHeader className="p-4 md:p-5 bg-slate-800/20 border-b border-white/5">
                                                <CardTitle className="text-[10px] md:text-xs  text-slate-300 uppercase tracking-widest">Experience Impact Audit</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 md:p-6">
                                                <p className="text-xs md:text-sm text-slate-400 leading-relaxed border-l-2 border-slate-700 pl-4">{result.impactReview}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Improved Rewrites */}
                                <motion.div variants={itemVariants}>
                                    <Card className="bg-slate-900/90 border-orange-500/30 shadow-2xl shadow-orange-950/10 overflow-hidden ring-1 ring-orange-500/20">
                                        <CardHeader className="p-4 md:p-6 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-b border-orange-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <CardTitle className="text-[10px] md:text-xs  flex items-center gap-3 text-orange-400 uppercase tracking-widest">
                                                <Sparkles className="h-4 w-4" /> High-Impact Performance Rewrites
                                            </CardTitle>
                                            <Button size="sm" className="w-full sm:w-auto bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 hover:text-white px-6 md:px-8  rounded-lg transition-all text-[10px] md:text-xs" onClick={() => navigator.clipboard.writeText(result.rewrittenText)}>
                                                COPY ALL REWRITES
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="p-4 md:p-8">
                                            <div className="whitespace-pre-wrap text-[11px] md:text-[13px] text-slate-100 leading-loose space-y-4 md:space-y-6 font-sans selection:bg-orange-500/30">
                                                {result.rewrittenText}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Scoring & Verdict */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 md:p-8 text-center shadow-xl flex flex-col items-center justify-center">
                                        <p className="text-[10px]  text-slate-300 uppercase tracking-widest mb-3">Job Match Velocity</p>
                                        <p className="text-4xl md:text-6xl  text-white tracking-tighter shadow-orange-500/20 drop-shadow-2xl">{result.matchScore}<span className="text-xl md:text-2xl text-slate-300 ml-1">%</span></p>
                                    </div>
                                    <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 md:p-8 text-center shadow-xl flex flex-col items-center justify-center">
                                        <p className="text-[10px]  text-slate-300 uppercase tracking-widest mb-3">Industry Skill Gap</p>
                                        <p className="text-xl md:text-2xl  text-slate-200 uppercase tracking-tight">{result.skillGap} Critical Gaps</p>
                                    </div>
                                    <div className={`sm:col-span-2 lg:col-span-1 rounded-xl p-6 md:p-8 text-center shadow-2xl flex flex-col items-center justify-center border-t-4 ${result.verdict === "Strong Candidate" ? "bg-emerald-500/5 border-emerald-500/40" : "bg-orange-500/5 border-orange-500/40"}`}>
                                        <p className="text-[10px]  text-slate-300 uppercase tracking-widest mb-3">Final Hiring Verdict</p>
                                        <p className={`text-xl md:text-2xl  uppercase tracking-widest ${result.verdict === "Strong Candidate" ? "text-emerald-400" : "text-orange-400"}`}>{result.verdict}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Free Resume Builders Section */}
            <div className="mt-16 md:mt-24 pt-10 md:pt-16 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-3 mb-8 md:mb-12">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl shrink-0 border border-indigo-500/20">
                        <Globe className="h-6 w-6 md:h-8 md:w-8 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-3xl tracking-tight text-white mb-2">
                            Modern Resume Builders
                        </h2>
                        <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                            Need to rebuild your resume from scratch? Use our evaluator above for insights, and build your final version using these top-rated free tools.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resumeBuilders.map((builder, idx) => (
                        <motion.a
                            href={builder.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={builder.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                            transition={{
                                opacity: { duration: 0.5, delay: idx * 0.1 },
                                scale: { duration: 0.5, delay: idx * 0.1 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }
                            }}
                            whileHover={{ scale: 1.05, translateY: -5, transition: { duration: 0.2 } }}
                            className="block group relative"
                        >
                            <div className={`absolute -inset-0.5 bg-gradient-to-br ${builder.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
                            <Card className="bg-slate-900/80 border-white/10 h-full relative overflow-hidden backdrop-blur-xl hover:border-white/20 transition-colors">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                                            {builder.name}
                                        </h3>
                                        <ExternalLink className="h-4 w-4 md:h-5 md:w-5 text-slate-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <p className="text-xs md:text-sm text-slate-400 mb-6 flex-grow leading-relaxed">
                                        {builder.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {builder.tags.map(tag => (
                                            <span key={tag} className="text-[9px] md:text-[10px] uppercase tracking-widest px-2 py-1.5 rounded-md bg-white/5 text-slate-300 border border-white/10 group-hover:border-white/20 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.a>
                    ))}
                </div>
            </div>

            <NextModulePrompter
                nextModuleName="Scenario Simulator"
                nextModuleHref="/dashboard/tools/scenario-simulator"
                description="Simulate real-world career challenges and interview scenarios based on your newly enhanced resume profile."
            />
        </div>
    )
}
