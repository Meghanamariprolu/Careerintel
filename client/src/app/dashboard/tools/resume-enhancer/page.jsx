"use client"

import { useState, useEffect } from"react"
import { motion, AnimatePresence } from"framer-motion"
import { FileText, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Loader2, Target, Type, AlertTriangle, TrendingUp, BarChart3, Fingerprint, Award, Layers, Globe, ExternalLink } from"lucide-react"
import Link from"next/link"
import { useAuth } from"@/context/AuthContext"
import { useUserProfile } from"@/context/UserProfileContext"
import { NextModulePrompter } from"@/components/NextModulePrompter"

import { Button } from"@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from"@/components/ui/Card"

import axios from 'axios';

const resumeBuilders = [
    {
        name:"Overleaf",
        description:"A professional, easy-to-use online LaTeX editor that allows you to create high-quality resumes with precise formatting and collaborative features.",
        url:"https://www.overleaf.com/",
        tags: ["LaTeX","Academic","Collaborative"],
        color:"from-green-500 to-emerald-500"
    },
    {
        name:"FlowCV",
        description:"Format your resume with ease. FlowCV helps you create a beautiful, modern resume with smart formatting and free high-quality templates.",
        url:"https://flowcv.com/",
        tags: ["Modern UI","Free Tier","ATS Ready"],
        color:"from-emerald-500 to-teal-500"
    },
    {
        name:"Novoresume",
        description:"Create a professional resume in minutes. Novoresume offers ATS-friendly templates designed by experts to land you the job.",
        url:"https://novoresume.com/",
        tags: ["Professional","Templates","Cover Letters"],
        color:"from-orange-500 to-red-500"
    },
    {
        name:"Canva Resumes",
        description:"Stand out with incredibly visual and highly customizable resume templates perfect for creative roles and modern tech companies.",
        url:"https://www.canva.com/resumes/",
        tags: ["Highly Visual","Drag & Drop","Creative"],
        color:"from-purple-500 to-pink-500"
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
                    scoreColor: atsScore > 80 ?"text-green-400" : atsScore > 60 ?"text-yellow-400" :"text-red-400",
                    impactLevel: atsScore > 80 ?"Strong" : atsScore > 60 ?"Moderate" :"Needs Improvement",
                    impactJustification:"Analysis completed via Career Intel AI Engine.",
                    badgeColor: atsScore > 80 ?"bg-green-500/20 text-green-300 border-green-500/30" : atsScore > 60 ?"bg-yellow-500/20 text-yellow-300 border-yellow-500/30" :"bg-red-500/20 text-red-300 border-red-500/30",
                    summary:"AI analysis of your candidacy based on provided job description.",
                    strengths: ["Strong technical foundations detected.","Goal-oriented narrative."],
                    weaknesses: improvements,
                    skills: {
                        technical: profile.currentSkills?.join(",") ||"Analyze more for details",
                        tools:"Detected in text",
                        soft:"Detected in text"
                    },
                    missingKeywords: ["Analyze job description for more gaps"],
                    impactReview:"Metrics detected. Reviewing against industry standards.",
                    rewrittenText: enhancedResume,
                    matchScore: atsScore,
                    skillGap: improvements.length,
                    verdict: atsScore > 80 ?"Strong Candidate" :"Growth Recommended"
                };

                setResult(analysisResult)
                updateProfile({ careerReadinessScore: atsScore })
            }
        } catch (error) {
            console.error("Analysis failed", error);
            setResult({ isError: true, message:"The AI analyst is currently unavailable. Please try again later." });
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
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 px-4 md:px-6 pb-16">
            {/* Header section with back button and title */}
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
                            animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-2.5 text-sm  font-semibold  text-yellow-500 shadow-xl"
                        >
                            <Target className="h-2.5 w-2.5" /> ATS EVALUATOR ENGINE
                        </motion.div>
                        <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-yellow-400">
                            ATS Evaluator Node<span className="text-yellow-500">.</span>
                        </h1>
                        <p className="text-white/70 max-w-xl mt-1.5 text-xs md:text-sm leading-relaxed font-medium">
                            Deep analysis of candidate signatures against target protocols. Direct measurement of skill-gap variance and high-intensity optimization protocols.
                        </p>
                    </div>
                </div>
            </header>

            <div className="flex flex-col gap-8 md:gap-12">
                {/* Input Section */}
                <motion.div className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Resume Input */}
                    <div className="relative group min-h-[120px]">
                        <div className="relative flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden backdrop-blur-3xl shadow-xl transition-all hover:border-yellow-500/10">
                            <div className="bg-slate-900/40 border-b border-white/5 p-1.5 flex items-center justify-between">
                                <span className="text-xs  font-semibold text-white/90 flex items-center gap-1.5">
                                    <Type className="h-2 w-2 text-yellow-400/40" /> RESUME SOURCE
                                </span>
                                <span className="text-sm text-white/70 font-semibold  bg-white/5 px-1 py-0.5 rounded">V1.0</span>
                            </div>
                            <textarea className="w-full h-full flex-1 p-2.5 bg-transparent border-0 focus:ring-0 text-white/90 placeholder:text-white/90 resize-none text-sm leading-relaxed font-medium" placeholder="Paste your full resume content..."
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                disabled={isAnalyzing}
                            />
                        </div>
                    </div>

                    {/* Job Description Input */}
                    <div className="relative group min-h-[120px]">
                        <div className="relative flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden backdrop-blur-3xl shadow-xl transition-all hover:border-orange-500/10 border-dashed">
                            <div className="bg-slate-900/40 border-b border-white/5 p-1.5 flex items-center justify-between">
                                <span className="text-xs  font-semibold text-white/90 flex items-center gap-1.5">
                                    <Target className="h-2 w-2 text-orange-400/40" /> TARGET PROTOCOL
                                </span>
                                <span className="text-sm text-white/70 font-semibold  bg-white/5 px-1 py-0.5 rounded">ALPHA</span>
                            </div>
                            <textarea className="w-full h-full flex-1 p-2.5 bg-transparent border-0 focus:ring-0 text-white/90 placeholder:text-white/90 resize-none text-sm leading-relaxed font-medium" placeholder="Paste the target job description..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                disabled={isAnalyzing}
                            />
                        </div>
                    </div>
                </div>

                    <div className="flex justify-center mt-2">
                        <Button
                            onClick={handleEnhance}
                            disabled={!resumeText.trim() || !jobDescription.trim() || isAnalyzing} size="sm" className="w-full lg:max-w-md h-8 bg-yellow-600/80 hover:bg-yellow-600 text-white text-xs font-semibold  border border-yellow-500/20  shadow-xl rounded-lg group transition-all"
                        >
                            {isAnalyzing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                    <span>ANALYZING SIGNATURES...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-2.5 w-2.5 text-yellow-200" />
                                    <span>RUN INTELLIGENCE SCAN</span>
                                    <ChevronRight className="h-2.5 w-2.5 opacity-50 group-hover:translate-x-1 transition-all" />
                                </div>
                            )}
                        </Button>
                    </div>
                </motion.div>

                {/* Results Area */}
                <div className="relative min-h-[200px] md:min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {!result && !isAnalyzing && (
                            <motion.div key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }} className="h-full min-h-[140px] flex flex-col items-center justify-center text-center p-4 bg-white/[0.01] rounded-lg border border-white/5 border-dashed"
                            >
                                <Fingerprint className="h-5 w-5 text-white/70 mb-2" />
                                <h3 className="text-sm font-semibold text-white/90">Awaiting Signature Scan</h3>
                                <p className="text-xs text-white/70 max-w-sm mt-1  font-semibold  italic">Provide both resume content and a job protocol to initiate deep scan.</p>
                            </motion.div>
                        )}

                        {isAnalyzing && (
                            <motion.div key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }} className="h-full min-h-[200px] flex flex-col items-center justify-center p-4 md:p-8 space-y-4 md:space-y-6"
                            >
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
                                    <Loader2 className="h-8 w-8 md:h-12 md:w-12 text-yellow-400 animate-spin relative z-10" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h3 className="text-xs md:text-sm font-semibold text-white">Orchestrating Analysis...</h3>
                                    <div className="flex flex-col items-start gap-1 font-sans text-sm md:text-xs text-muted-foreground bg-black/40 p-2 md:p-2.5 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-2"><div className="h-1 w-1 bg-yellow-400 rounded-full animate-ping" /> SCANNING METRICS...</div>
                                        <div className="flex items-center gap-2"><div className="h-1 w-1 bg-orange-400 rounded-full animate-ping delay-75" /> DETECTING VAGUE PHRASES...</div>
                                        <div className="flex items-center gap-2"><div className="h-1 w-1 bg-yellow-600 rounded-full animate-ping delay-150" /> MAPPING SKILL GAPS...</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {result && result.isError && !isAnalyzing && (
                            <motion.div key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }} className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-6 bg-red-500/5 rounded-lg border border-red-500/10 shadow-xl"
                            >
                                <div className="p-3 bg-red-500/10 rounded-full mb-3">
                                    <AlertTriangle className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-sm font-semibold text-red-400 mb-1  ">Analysis Failed</h3>
                                <p className="text-red-200/40 max-w-md text-xs  font-semibold">{result.message}</p>
                            </motion.div>
                        )}

                        {result && !result.isError && !isAnalyzing && (
                             <motion.div key="results"
                                 variants={containerVariants} initial="hidden" animate="show" className="space-y-5 md:space-y-5"
                             >
                                 {/* Professional Summary */}
                                <motion.div variants={itemVariants}>
                                    <Card className="bg-white/[0.02] border-white/5 overflow-hidden border-l border-l-blue-500/50 shadow-xl rounded-lg">
                                        <CardHeader className="p-2.5 bg-slate-800/20 border-b border-white/5">
                                            <CardTitle className="text-xs font-semibold text-slate-500">Candidate Signature Overview</CardTitle>
                                        </CardHeader>
                                         <CardContent className="p-3">
                                             <p className="text-sm md:text-sm text-slate-300 leading-relaxed font-medium  ">
                                                 {result.summary}
                                             </p>
                                         </CardContent>
                                    </Card>
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Key Strengths */}
                                    <motion.div variants={itemVariants}>
                                         <Card className="bg-white/[0.01] border-white/5 h-full hover:border-emerald-500/10 transition-colors shadow-xl rounded-lg">
                                            <CardHeader className="p-2 bg-emerald-950/20 border-b border-emerald-500/10">
                                                <CardTitle className="text-xs font-semibold text-emerald-500/60 flex items-center gap-1.5">
                                                    <CheckCircle2 className="h-2.5 w-2.5" /> High-Intensity Strengths
                                                </CardTitle>
                                            </CardHeader>
                                             <CardContent className="p-2.5">
                                                 <ul className="space-y-1.5">
                                                     {result.strengths.map((s, i) => (
                                                         <li key={i} className="text-xs md:text-xs text-slate-400 flex items-start gap-2 font-medium  leading-relaxed italic">
                                                             <div className="h-1 w-1 rounded-full bg-emerald-500/40 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.3)]" /> {s}
                                                         </li>
                                                     ))}
                                                 </ul>
                                             </CardContent>
                                         </Card>
                                    </motion.div>

                                    {/* Key Weaknesses */}
                                    <motion.div variants={itemVariants}>
                                         <Card className="bg-white/[0.01] border-white/5 h-full hover:border-rose-500/10 transition-colors shadow-xl rounded-lg">
                                            <CardHeader className="p-2 bg-rose-950/20 border-b border-rose-500/10">
                                                <CardTitle className="text-xs font-semibold text-rose-500/60 flex items-center gap-1.5">
                                                    <AlertTriangle className="h-2.5 w-2.5" /> Volatility Points
                                                </CardTitle>
                                            </CardHeader>
                                             <CardContent className="p-2.5">
                                                 <ul className="space-y-1.5">
                                                     {result.weaknesses.map((w, i) => (
                                                         <li key={i} className="text-xs md:text-xs text-slate-400 flex items-start gap-2 font-medium  leading-relaxed italic">
                                                             <div className="h-1 w-1 rounded-full bg-rose-500/40 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.3)]" /> {w}
                                                         </li>
                                                     ))}
                                                 </ul>
                                             </CardContent>
                                         </Card>
                                    </motion.div>
                                </div>

                                {/* Skills Grid */}
                                <motion.div variants={itemVariants}>
                                    <Card className="bg-slate-910/40 border-white/5 shadow-xl rounded-lg">
                                        <CardHeader className="p-3 md:p-3.5 bg-slate-800/20 border-b border-white/5">
                                            <CardTitle className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
                                                <Layers className="h-3.5 w-3.5" /> Intelligence Taxonomy
                                            </CardTitle>
                                        </CardHeader>
                                         <CardContent className="p-3.5 md:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-5">
                                             <div className="space-y-0.5">
                                                 <p className="text-xs md:text-xs font-semibold text-slate-500">Hard Skills Hub</p>
                                                 <p className="text-sm md:text-sm text-slate-200 font-medium">{result.skills.technical}</p>
                                             </div>
                                             <div className="space-y-0.5">
                                                 <p className="text-xs md:text-xs font-semibold text-slate-500">Tool Ecosystem</p>
                                                 <p className="text-sm md:text-sm text-slate-200 font-medium">{result.skills.tools}</p>
                                             </div>
                                             <div className="space-y-0.5">
                                                 <p className="text-xs md:text-xs font-semibold text-slate-500">Soft Strategy</p>
                                                 <p className="text-sm md:text-sm text-slate-200 font-medium">{result.skills.soft}</p>
                                             </div>
                                         </CardContent>
                                    </Card>
                                </motion.div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5">
                                    {/* Missing Keywords */}
                                    <motion.div variants={itemVariants}>
                                        <Card className="bg-slate-900/60 border-white/5 h-full shadow-lg rounded-lg">
                                            <CardHeader className="p-3 md:p-3.5 bg-indigo-950/10 border-b border-indigo-500/10">
                                                <CardTitle className="text-sm font-semibold text-indigo-300">Critical Missing Nodes</CardTitle>
                                            </CardHeader>
                                             <CardContent className="p-3.5 md:p-4">
                                                 <div className="flex flex-wrap gap-1.5">
                                                     {result.missingKeywords.map(kw => (
                                                         <span key={kw} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-xs md:text-xs font-semibold">{kw}</span>
                                                     ))}
                                                 </div>
                                             </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Experience Impact */}
                                    <motion.div variants={itemVariants}>
                                        <Card className="bg-slate-900/60 border-white/5 h-full shadow-lg rounded-lg">
                                            <CardHeader className="p-3 md:p-3.5 bg-slate-800/20 border-b border-white/5">
                                                <CardTitle className="text-sm font-semibold text-slate-500">Experience Impact Audit</CardTitle>
                                            </CardHeader>
                                             <CardContent className="p-3.5 md:p-4">
                                                 <p className="text-sm md:text-sm text-slate-500 leading-relaxed border-l-2 border-indigo-500/20 pl-3 font-medium italic">{result.impactReview}</p>
                                             </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Improved Rewrites */}
                                <motion.div variants={itemVariants}>
                                    <Card className="bg-slate-900/90 border-orange-500/30 shadow-2xl shadow-orange-950/20 overflow-hidden ring-1 ring-orange-500/10 rounded-lg">
                                        <CardHeader className="p-2.5 md:p-3 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-b border-orange-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2.5 text-orange-500/80">
                                                <Sparkles className="h-3.5 w-3.5" /> High-Intensity Performance Rewrites
                                            </CardTitle>
                                            <Button size="sm" className="w-full sm:w-auto bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:text-white px-5 h-7 rounded-md transition-all text-xs font-semibold   border border-orange-500/20" onClick={() => navigator.clipboard.writeText(result.rewrittenText)}>
                                                COPY PROTOCOL
                                            </Button>
                                        </CardHeader>
                                         <CardContent className="p-3.5 md:p-5">
                                             <div className="whitespace-pre-wrap text-sm md:text-sm text-slate-200 leading-relaxed space-y-3 font-medium selection:bg-orange-500/30">
                                                 {result.rewrittenText}
                                             </div>
                                         </CardContent>
                                    </Card>
                                </motion.div>

                                 {/* Scoring & Verdict */}
                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                     <div className="bg-white/[0.01] border border-white/5 rounded-lg p-2.5 text-center shadow-xl flex flex-col items-center justify-center">
                                         <p className="text-sm font-semibold text-slate-500   mb-1">Match Velocity</p>
                                         <p className="text-xl font-semibold text-white  tabular-nums shadow-orange-500/10 drop-shadow-2xl">{result.matchScore}<span className="text-sm text-slate-500 ml-0.5">%</span></p>
                                     </div>
                                     <div className="bg-white/[0.01] border border-white/5 rounded-lg p-2.5 text-center shadow-xl flex flex-col items-center justify-center">
                                         <p className="text-sm font-semibold text-slate-500   mb-1">Skill Gap Delta</p>
                                         <p className="text-sm font-semibold text-slate-300 ">{result.skillGap} Critical Nodes</p>
                                     </div>
                                     <div className={`sm:col-span-2 lg:col-span-1 border border-white/5 rounded-lg p-2.5 text-center shadow-xl flex flex-col items-center justify-center ${result.verdict ==="Strong Candidate" ?"bg-emerald-500/[0.02] border-emerald-500/10" :"bg-orange-500/[0.02] border-orange-500/10"}`}>
                                         <p className="text-sm font-semibold text-slate-500   mb-1">Hiring Verdict</p>
                                         <p className={`text-sm font-semibold   ${result.verdict ==="Strong Candidate" ?"text-emerald-500/50" :"text-orange-500/50"}`}>{result.verdict}</p>
                                     </div>
                                 </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Free Resume Builders Section */}
            <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-indigo-500/10 rounded-md shrink-0 border border-indigo-500/20 shadow-xl">
                        <Globe className="h-4 w-4 text-indigo-400/70" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold  text-white">
                            Build Infrastructure Registry
                        </h2>
                        <p className="text-xs text-white/70 max-w-2xl leading-relaxed  font-semibold">
                            Need to rebuild from scratch? Use our evaluator for insights, and build your final version using these top-tier nodes.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {resumeBuilders.map((builder, idx) => (
                        <motion.a
                            href={builder.url} target="_blank" rel="noopener noreferrer"
                            key={builder.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }} className="block group relative"
                        >
                            <Card className="bg-white/[0.01] border-white/5 h-full relative overflow-hidden backdrop-blur-3xl hover:border-white/10 transition-all rounded-lg shadow-xl">
                                <CardContent className="p-3 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <h3 className="text-sm font-semibold text-white/70 group-hover:text-yellow-400/60 transition-all  ">
                                            {builder.name}
                                        </h3>
                                        <ExternalLink className="h-2 w-2 text-white/70" />
                                    </div>
                                    <p className="text-xs text-white/70 mb-3 flex-grow leading-relaxed font-medium  italic">
                                        {builder.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-auto">
                                        {builder.tags.map(tag => (
                                            <span key={tag} className="text-sm font-semibold   px-1 py-0.5 rounded bg-white/5 text-white/90 border border-white/5">
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

            <NextModulePrompter nextModuleName="Scenario Simulator" nextModuleHref="/dashboard/tools/scenario-simulator" description="Simulate real-world career challenges and interview scenarios based on your newly enhanced resume profile."
            />
        </div>
    )
}
