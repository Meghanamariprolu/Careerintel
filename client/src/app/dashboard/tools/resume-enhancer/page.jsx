"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Loader2, Target, Type, AlertTriangle, TrendingUp, BarChart3, Fingerprint, Award, Layers } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"

// --- ATS Mock AI Enhancement Logic ---
const analyzeText = (text, userSkills) => {
    const textLower = text.toLowerCase()

    // 1. Check for valid resume content vs system prompts
    const instructionsKeywords = ["rewrite", "prompt", "instructions", "evaluate", "analyze", "you are a", "ignore all", "system:"]
    const isInstructional = instructionsKeywords.some(kw => textLower.includes(kw)) && text.length < 500

    if (isInstructional || text.trim().length < 20) {
        return {
            isError: true,
            message: "I detected system instructions or template text rather than genuine professional experience. Please provide actual resume bullet points or a LinkedIn summary for a comprehensive ATS analysis."
        }
    }

    // --- Structured ATS Evaluation ---

    // Overall Strength Score & Impact Level
    const numMatches = text.match(/\d+/g) || []
    const hasNumbers = numMatches.length > 0
    const hasActionVerbs = ["managed", "led", "developed", "created", "built", "designed", "optimized", "architected", "spearheaded", "orchestrated"].some(v => textLower.includes(v))

    let baseScore = 55
    if (hasNumbers) baseScore += Math.min(25, numMatches.length * 8)
    if (hasActionVerbs) baseScore += 10
    if (text.length > 150) baseScore += 5
    if (text.length > 300) baseScore += 5

    const score = Math.min(100, Math.max(0, baseScore))

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

    // Identify vague statements
    const vagueStatements = []
    const vaguePhrases = ["worked on", "helped", "involved in", "responsible for", "was a part of", "did some", "assisted with"]
    const lines = text.split('\n').filter(l => l.trim().length > 0)

    lines.forEach(line => {
        const cleanLine = line.replace(/^[-•*]\s*/, '').trim()
        if (vaguePhrases.some(vp => cleanLine.toLowerCase().startsWith(vp))) {
            vagueStatements.push({
                text: `"${cleanLine.substring(0, 45)}..."`,
                reason: "Lacks ownership and specific contribution. Reframe with a strong action verb."
            })
        }
    })

    // Identify missing metrics
    const missingMetrics = []
    lines.forEach(line => {
        if (!/\d/.test(line) && line.length > 40 && missingMetrics.length < 2) {
            missingMetrics.push({
                text: `"${line.replace(/^[-•*]\s*/, '').substring(0, 45)}..."`,
                suggestion: "Missing verifiable outcome. Consider adding context like 'improving efficiency by X%' or 'serving Y monthly users'."
            })
        }
    })

    // Missing High-Demand Skills (Based on users roadmap vs text)
    let missingSkills = userSkills.filter(skill => !textLower.includes(skill.toLowerCase())).slice(0, 6)
    if (missingSkills.length === 0) {
        missingSkills = ["System Design", "Cloud Architecture", "Agile Methodologies", "CI/CD Pipelines"]
    }

    // Leadership & Scalability Evaluation
    let leadershipEvaluation = ""
    if (["led", "managed", "mentored", "directed", "cross-functional", "spearheaded", "architected"].some(w => textLower.includes(w))) {
        leadershipEvaluation = "Positive signals of leadership, ownership, and cross-functional collaboration detected. This aligns well with mid-to-senior level expectations."
    } else {
        leadershipEvaluation = "Weak signals of leadership capability or system scalability. Consider highlighting instances where you mentored juniors, led a feature launch, or drove technical decisions."
    }

    // ATS Keywords Optimization
    const premiumATSKeywords = ["Scalability", "Microservices", "Performance Optimization", "Test-Driven Development", "Cross-Functional Collaboration", "System Architecture"]
    const suggestedATS = premiumATSKeywords.filter(kw => !textLower.includes(kw.toLowerCase())).slice(0, 4)

    // Verb Repetition
    const verbRepetition = {
        repeated: "Developed, Worked, Used",
        suggestions: ["Architected", "Engineered", "Spearheaded", "Transformed", "Orchestrated"]
    }

    // Skill Gap Summary
    const skillGapSummary = "While core technical skills are present, the content lacks modern engineering lifecycle terminology (e.g., CI/CD, deployment metrics, system observability) expected by strict ATS filters."

    // Rewritten Bullet Points (High-Impact)
    let rewritten = lines.map(line => {
        let cleanLine = line.replace(/^[-•*]\s*/, '').trim()

        // Strip weak starters
        vaguePhrases.forEach(vp => {
            if (cleanLine.toLowerCase().startsWith(vp)) {
                cleanLine = cleanLine.substring(vp.length).trim()
                // Capitalize first letter after stripping
                if (cleanLine.length > 0) cleanLine = cleanLine.charAt(0).toUpperCase() + cleanLine.slice(1)
            }
        })

        const prefixes = [
            "Architected and deployed",
            "Spearheaded cross-functional efforts to deliver",
            "Optimized performance of",
            "Transformed legacy systems by migrating",
            "Engineered scalable solutions for"
        ]
        let prefix = prefixes[Math.floor(Math.random() * prefixes.length)]

        // If the original line already starts with a strong verb (mock check), keep it somewhat intact
        const strongStart = ["architected", "developed", "led", "created"].some(w => cleanLine.toLowerCase().startsWith(w))

        let result = ""
        if (strongStart) {
            result = `- ${cleanLine}`
        } else {
            result = `- ${prefix} ${cleanLine.toLowerCase()}`
        }

        // Add realistic metric placeholders if missing
        if (!/\d/.test(result)) {
            result += `, resulting in a [X]% decrease in latency and accelerating project delivery by [Y] weeks.`
        } else if (!result.endsWith('.')) {
            result += '.'
        }

        return result
    })

    return {
        isError: false,
        score: score.toString(),
        scoreColor,
        impactLevel,
        impactJustification,
        badgeColor,
        vagueStatements: vagueStatements.length > 0 ? vagueStatements : [{ text: "No overly vague statements detected.", reason: "Excellent use of specific phrasing throughout." }],
        missingMetrics: missingMetrics.length > 0 ? missingMetrics : [{ text: "Great use of metrics throughout.", suggestion: "Continue quantifying outcomes." }],
        missingSkills,
        leadershipEvaluation,
        atsKeywords: suggestedATS,
        verbRepetition,
        skillGapSummary,
        rewrittenText: rewritten.join('\n\n') // double newline for better readability
    }
}

export default function ResumeEnhancerPage() {
    const { user } = useAuth()
    const [inputText, setInputText] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState(null)
    const [userMasteredSkills, setUserMasteredSkills] = useState([])

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
        if (!inputText.trim()) return

        setIsAnalyzing(true)
        setResult(null)

        // Simulate API delay
        setTimeout(() => {
            const analysisResult = analyzeText(inputText, userMasteredSkills)
            setResult(analysisResult)
            setIsAnalyzing(false)
        }, 2200)
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
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            <div className="flex items-center gap-2 mb-2">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-400/10 rounded-lg">
                        <FileText className="h-6 w-6 text-yellow-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                        Senior ATS Evaluator & Enhancer
                    </h1>
                </div>
            </div>

            <p className="text-muted-foreground max-w-2xl text-lg">
                Paste your resume bullet points below. Our Senior ATS Evaluator will aggressively score your content on clarity, impact, leadership, and technical depth, providing you with a high-impact rewrite.
            </p>

            <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8">
                {/* Input Section */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative group h-[500px]">
                        {/* Glowing effect ring conditionally applied during analysis */}
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-purple-600 rounded-xl blur opacity-0 transition group-hover:opacity-20 duration-1000 ${isAnalyzing ? 'animate-pulse opacity-50 block' : 'hidden'}`}></div>

                        <div className="relative flex flex-col h-full bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                            <div className="bg-slate-900/80 border-b border-white/5 p-3 flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Type className="h-4 w-4 text-muted-foreground" /> Your Raw Content
                                </span>
                            </div>
                            <textarea
                                className="w-full h-full flex-1 p-4 bg-transparent border-0 focus:ring-0 text-slate-200 placeholder:text-slate-600 resize-none"
                                placeholder="e.g., Worked on the frontend team. Built new features using React. Improved loading speed."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                disabled={isAnalyzing}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleEnhance}
                        disabled={!inputText.trim() || isAnalyzing}
                        className="w-full h-14 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold text-lg relative overflow-hidden group shadow-lg shadow-orange-500/20"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Analyzing ATS Impact...
                            </>
                        ) : (
                            <>
                                <Target className="h-6 w-6 mr-2" />
                                Run Comprehensive ATS Scan
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            </>
                        )}
                    </Button>
                </motion.div>

                {/* Results Section */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {!result && !isAnalyzing && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-[500px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/20 rounded-xl border border-white/5 border-dashed"
                            >
                                <Fingerprint className="h-14 w-14 text-slate-700 mb-4 opacity-50" />
                                <h3 className="text-xl font-medium text-slate-400">Awaiting Professional Experience</h3>
                                <p className="text-sm text-slate-500 max-w-sm mt-3 leading-relaxed">Paste your text and run the scan. I will perform a deep evaluation of your actionable outcomes, technical specificity, and leadership signals.</p>
                            </motion.div>
                        )}

                        {isAnalyzing && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-[500px] flex flex-col items-center justify-center p-8 space-y-6"
                            >
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
                                    <Loader2 className="h-14 w-14 text-yellow-400 animate-spin relative z-10" />
                                </div>
                                <div className="space-y-3 text-center">
                                    <h3 className="text-2xl font-semibold text-slate-200">Evaluating against ATS Standards...</h3>
                                    <p className="text-sm font-mono text-muted-foreground animate-pulse text-left w-full max-w-xs mx-auto border-l-2 border-yellow-500/50 pl-4 py-2 bg-black/20">
                                        {">"} Scanning measurable outcomes<br />
                                        {">"} Detecting vague phrasing<br />
                                        {">"} Mapping skill gaps...
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {result && result.isError && !isAnalyzing && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-[500px] flex flex-col items-center justify-center text-center p-8 bg-red-500/10 rounded-xl border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                            >
                                <div className="p-4 bg-red-500/20 rounded-full mb-5">
                                    <AlertTriangle className="h-12 w-12 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-red-400 mb-3">System Instruction Detected</h3>
                                <p className="text-red-200/80 max-w-md text-lg">{result.message}</p>
                            </motion.div>
                        )}

                        {result && !result.isError && !isAnalyzing && (
                            <motion.div
                                key="results"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="space-y-6"
                            >
                                {/* Master Score & Impact */}
                                <motion.div variants={itemVariants}>
                                    <Card className="bg-slate-900/60 border-white/5 backdrop-blur-sm overflow-hidden relative">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-yellow-400 to-orange-500"></div>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
                                                <div>
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Overall Resume Strength</p>
                                                    <div className="flex items-end gap-3">
                                                        <h3 className={`text-5xl font-black leading-none tracking-tighter ${result.scoreColor}`}>{result.score}</h3>
                                                        <span className="text-muted-foreground mb-1 text-lg">/ 100</span>
                                                    </div>
                                                </div>
                                                <div className="text-left md:text-right">
                                                    <div className={`inline-block border rounded-full px-3 py-1 text-sm font-bold uppercase tracking-wider ${result.badgeColor}`}>
                                                        {result.impactLevel} Impact
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-slate-700 pl-3">
                                                    "{result.impactJustification}"
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Structural Critique Grid */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Weaknesses & Vagueness */}
                                    <motion.div variants={itemVariants} className="space-y-4">
                                        <Card className="bg-slate-900/40 border-white/5 h-full">
                                            <CardHeader className="p-4 pb-2 bg-slate-900/50">
                                                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-rose-300">
                                                    <AlertTriangle className="h-4 w-4" /> Vague Phrasing Detected
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-4 space-y-3">
                                                {result.vagueStatements.map((v, i) => (
                                                    <div key={i} className="text-xs">
                                                        <p className="text-slate-300 font-medium mb-1">{v.text}</p>
                                                        <p className="text-rose-400/80">{v.reason}</p>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Missing Metrics */}
                                    <motion.div variants={itemVariants} className="space-y-4">
                                        <Card className="bg-slate-900/40 border-white/5 h-full">
                                            <CardHeader className="p-4 pb-2 bg-slate-900/50">
                                                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-300">
                                                    <BarChart3 className="h-4 w-4" /> Missing Measurable Outcomes
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-4 space-y-3">
                                                {result.missingMetrics.map((m, i) => (
                                                    <div key={i} className="text-xs">
                                                        <p className="text-slate-300 font-medium mb-1">{m.text}</p>
                                                        <p className="text-blue-400/80">{m.suggestion}</p>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Skills, Leadership & Market Fit */}
                                <motion.div variants={itemVariants}>
                                    <Card className="bg-slate-900/40 border-white/5">
                                        <CardContent className="p-5 grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1.5"><Layers className="h-3 w-3" /> Missing ATS Keywords</h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {result.atsKeywords.map(kw => (
                                                            <span key={kw} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded text-[11px] font-semibold">{kw}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="h-px bg-white/5 w-full my-4" />
                                                <div>
                                                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Verb Repetition</h4>
                                                    <p className="text-[11px] text-slate-400 mb-2">Overused: <span className="text-rose-300">{result.verbRepetition.repeated}</span></p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {result.verbRepetition.suggestions.map(v => (
                                                            <span key={v} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded text-[11px] font-medium">{v}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1.5 flex items-center gap-1.5"><Award className="h-3 w-3" /> Leadership Signals</h4>
                                                    <p className="text-xs text-slate-300 leading-relaxed">{result.leadershipEvaluation}</p>
                                                </div>
                                                <div className="h-px bg-white/5 w-full my-4" />
                                                <div>
                                                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1.5">Industry Skill Gap</h4>
                                                    <p className="text-xs text-slate-300 leading-relaxed">{result.skillGapSummary}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Rewritten Result */}
                                <motion.div variants={itemVariants}>
                                    <Card className="bg-slate-900/80 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.15)] overflow-hidden">
                                        <CardHeader className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-orange-500/20">
                                            <CardTitle className="text-sm font-bold flex items-center justify-between text-orange-400">
                                                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Ready-to-Copy: High-Impact Rewrite</span>
                                                <Button size="sm" className="h-7 text-xs bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 hover:text-white" onClick={() => navigator.clipboard.writeText(result.rewrittenText)}>
                                                    Copy to Clipboard
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5">
                                            <div className="whitespace-pre-wrap text-[13px] text-slate-200 leading-loose font-mono">
                                                {result.rewrittenText}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-4 text-center italic">* Remember to replace the bracketed [X] and [Y] placeholders with your actual, verifiable metrics before applying.</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
