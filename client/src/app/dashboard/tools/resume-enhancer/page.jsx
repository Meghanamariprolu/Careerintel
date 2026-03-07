"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Loader2, Target, Type, AlertTriangle, TrendingUp, BarChart3, Fingerprint, Award, Layers } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useUserProfile } from "@/context/UserProfileContext"
import { NextModulePrompter } from "@/components/NextModulePrompter"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"

// --- ATS Mock AI Enhancement Logic ---
const analyzeText = (resumeText, jobDescription, userSkills) => {
    const textLower = resumeText.toLowerCase()
    const jdLower = jobDescription.toLowerCase()

    // 1. Check for valid resume content vs system prompts
    const instructionsKeywords = ["rewrite", "prompt", "instructions", "evaluate", "analyze", "you are a", "ignore all", "system:"]
    const isInstructional = instructionsKeywords.some(kw => textLower.includes(kw)) && text.length < 500

    if (isInstructional || resumeText.trim().length < 20) {
        return {
            isError: true,
            message: "I detected system instructions or template text rather than genuine professional experience. Please provide actual resume content for a comprehensive ATS analysis."
        }
    }

    // --- Structured ATS Evaluation ---

    // Overall Strength Score & Impact Level
    const numMatches = resumeText.match(/\d+/g) || []
    const hasNumbers = numMatches.length > 0
    const hasActionVerbs = ["managed", "led", "developed", "created", "built", "designed", "optimized", "architected", "spearheaded", "orchestrated"].some(v => textLower.includes(v))

    let baseScore = 60
    if (hasNumbers) baseScore += Math.min(20, numMatches.length * 5)
    if (hasActionVerbs) baseScore += 10
    if (resumeText.length > 300) baseScore += 5

    // Keyword match with JD
    const jdKeywords = ["react", "node", "typescript", "aws", "docker", "kubernetes", "sql", "nosql", "agile", "cicd", "system design"].filter(kw => jdLower.includes(kw))
    const matchedJDKeywords = jdKeywords.filter(kw => textLower.includes(kw))
    const matchPercentage = jdKeywords.length > 0 ? (matchedJDKeywords.length / jdKeywords.length) * 100 : 85

    baseScore = (baseScore + matchPercentage) / 2

    const score = Math.min(100, Math.max(0, Math.round(baseScore)))

    let scoreColor = "text-green-400"
    let impactLevel = "Strong"
    let impactJustification = "The resume effectively uses action verbs and quantifiable metrics to demonstrate significant technical impact and business value."
    let badgeColor = "bg-green-500/20 text-green-300 border-green-500/30"

    if (score < 60) {
        scoreColor = "text-red-400"
        impactLevel = "Weak"
        impactJustification = "The content lacks measurable outcomes, relies on passive phrasing, and does not clearly demonstrate scope, ownership, or leadership."
        badgeColor = "bg-red-500/20 text-red-300 border-red-500/30"
    } else if (score < 80) {
        scoreColor = "text-yellow-400"
        impactLevel = "Moderate"
        impactJustification = "The text highlights technical duties well but could be significantly strengthened with more scalable business outcomes and advanced ATS keywords."
        badgeColor = "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    }

    // Identify vague statements (Weaknesses)
    const weaknesses = []
    const vaguePhrases = ["worked on", "helped", "involved in", "responsible for", "was a part of", "did some", "assisted with"]
    const lines = resumeText.split('\n').filter(l => l.trim().length > 0)

    lines.forEach(line => {
        const cleanLine = line.replace(/^[-•*]\s*/, '').trim()
        if (vaguePhrases.some(vp => cleanLine.toLowerCase().startsWith(vp)) && weaknesses.length < 3) {
            weaknesses.push(`"${cleanLine.substring(0, 50)}..." - Lacks ownership.`)
        }
    })

    if (weaknesses.length === 0) weaknesses.push("None major detected - Good use of action verbs.")
    if (!resumeText.match(/\d/)) weaknesses.push("Missing quantifiable metrics (e.g., %, $, numbers).")

    // Strengths
    const strengths = []
    if (hasActionVerbs) strengths.push("Strong use of senior-level action verbs (Architected, Orchestrated).")
    if (hasNumbers) strengths.push("Quantifiable achievements clearly demonstrated with metrics.")
    if (resumeText.length > 500) strengths.push("Comprehensive coverage of professional experience.")
    if (strengths.length === 0) strengths.push("Clear formatting and readable structure.")

    // Skills
    const technicalSkills = ["React", "JavaScript", "Node.js", "Python", "TypeScript", "Go", "Java"].filter(s => textLower.includes(s.toLowerCase()))
    const tools = ["AWS", "Docker", "Git", "Jira", "Kubernetes", "PostgreSQL"].filter(s => textLower.includes(s.toLowerCase()))
    const softSkills = ["Leadership", "Communication", "Problem Solving", "Collaboration"].filter(s => textLower.includes(s.toLowerCase()))

    // Missing Keywords
    const missingKeywords = jdKeywords.filter(kw => !textLower.includes(kw)).map(kw => kw.charAt(0).toUpperCase() + kw.slice(1))

    // Experience Impact
    const impactReview = hasNumbers
        ? "High impact detected. Metrics provide a clear understanding of your contributions."
        : "Moderate impact. Focus more on RESULTS rather than just DUTIES."

    // Improved bullets
    let rewrittenCount = 0
    let rewritten = lines.map(line => {
        if (rewrittenCount >= 5) return null
        let cleanLine = line.replace(/^[-•*]\s*/, '').trim()

        let prefix = "Engineered a scalable solution for"
        if (cleanLine.toLowerCase().includes("build") || cleanLine.toLowerCase().includes("developed")) prefix = "Architected and deployed"

        rewrittenCount++
        return `${line} → ${prefix} ${cleanLine}, resulting in a 25% improvement in efficiency and 15% cost reduction.`
    }).filter(Boolean)

    return {
        isError: false,
        score: score.toString(),
        scoreColor,
        impactLevel,
        impactJustification,
        badgeColor,
        summary: `Highly motivated professional with strong technical foundations in ${technicalSkills.slice(0, 3).join(", ")}. Proven track record of delivering scalable solutions.`,
        strengths,
        weaknesses,
        skills: {
            technical: technicalSkills.join(", ") || "None identified",
            tools: tools.join(", ") || "None identified",
            soft: softSkills.join(", ") || "None identified"
        },
        missingKeywords: missingKeywords.length > 0 ? missingKeywords : ["None - excellent match"],
        impactReview,
        rewrittenText: rewritten.join('\n\n'),
        matchScore: Math.round(matchPercentage),
        skillGap: Math.max(0, missingKeywords.length),
        verdict: score > 80 ? "Strong Candidate" : score > 60 ? "Moderate Candidate" : "Needs Improvement"
    }
}

export default function ResumeEnhancerPage() {
    const { user } = useAuth()
    const [resumeText, setResumeText] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState(null)
    const [userMasteredSkills, setUserMasteredSkills] = useState([])
    const { updateProfile } = useUserProfile()

    // Load user skills from localStorage (from roadmaps) to use for keyword suggestions
    useEffect(() => {
        try {
            const allRoadmaps = JSON.parse(localStorage.getItem('careerintel_roadmaps') || '[]')
            const myRoadmaps = allRoadmaps.filter(r => r.userId === user?.id)

            const allSkills = new Set()
            myRoadmaps.forEach(r => {
                if (r.userSkills && Array.isArray(r.userSkills)) {
                    r.userSkills.forEach(skill => allSkills.add(skill))
                }
            })
            setUserMasteredSkills(Array.from(allSkills))
        } catch (error) {
            console.error("Error loading user skills:", error)
        }
    }, [user?.id])

    const handleEnhance = () => {
        if (!resumeText.trim() || !jobDescription.trim()) return

        setIsAnalyzing(true)
        setResult(null)

        // Simulate AI analysis delay
        setTimeout(() => {
            const analysisResult = analyzeText(resumeText, jobDescription, userMasteredSkills)
            setResult(analysisResult)
            setIsAnalyzing(false)
            updateProfile({ resumeScore: parseInt(analysisResult.score) })
        }, 2500)
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
                                    <span className="text-[9px] text-slate-500 font-sans bg-white/5 px-1.5 py-0.5 rounded">V1.0</span>
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
                                    <span className="text-[9px] text-slate-500 font-sans bg-white/5 px-1.5 py-0.5 rounded">TARGET</span>
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
                                <p className="text-[10px] md:text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">Provide both resume content and a job description to initiate the deep scan.</p>
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
                                                <p className="text-[9px] md:text-[10px]  text-slate-500 uppercase tracking-widest">Technical Proficiency</p>
                                                <p className="text-xs md:text-sm text-slate-200 ">{result.skills.technical}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] md:text-[10px]  text-slate-500 uppercase tracking-widest">Tools & Ecosystem</p>
                                                <p className="text-xs md:text-sm text-slate-200 ">{result.skills.tools}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] md:text-[10px]  text-slate-500 uppercase tracking-widest">Foundational & Soft</p>
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
                                        <p className="text-[10px]  text-slate-500 uppercase tracking-widest mb-3">Job Match Velocity</p>
                                        <p className="text-4xl md:text-6xl  text-white tracking-tighter shadow-orange-500/20 drop-shadow-2xl">{result.matchScore}<span className="text-xl md:text-2xl text-slate-500 ml-1">%</span></p>
                                    </div>
                                    <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 md:p-8 text-center shadow-xl flex flex-col items-center justify-center">
                                        <p className="text-[10px]  text-slate-500 uppercase tracking-widest mb-3">Industry Skill Gap</p>
                                        <p className="text-xl md:text-2xl  text-slate-200 uppercase tracking-tight">{result.skillGap} Critical Gaps</p>
                                    </div>
                                    <div className={`sm:col-span-2 lg:col-span-1 rounded-xl p-6 md:p-8 text-center shadow-2xl flex flex-col items-center justify-center border-t-4 ${result.verdict === "Strong Candidate" ? "bg-emerald-500/5 border-emerald-500/40" : "bg-orange-500/5 border-orange-500/40"}`}>
                                        <p className="text-[10px]  text-slate-500 uppercase tracking-widest mb-3">Final Hiring Verdict</p>
                                        <p className={`text-xl md:text-2xl  uppercase tracking-widest ${result.verdict === "Strong Candidate" ? "text-emerald-400" : "text-orange-400"}`}>{result.verdict}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
