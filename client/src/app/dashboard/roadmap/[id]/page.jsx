"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { ArrowLeft, BookOpen, Briefcase, Download, Trophy, Loader2, FileText, Trash2, CheckCircle2, Circle } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function RoadmapDetailPage() {
    const { user } = useAuth()
    const router = useRouter()

    const { id } = useParams()
    const [roadmap, setRoadmap] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [userSkills, setUserSkills] = useState([])

    useEffect(() => {
        async function fetchRoadmap() {
            try {
                const { data } = await axios.get(`/api/roadmaps/${id}`);
                setRoadmap(data);
                setUserSkills(data.userSkills || []);
            } catch (error) {
                console.error("Error fetching roadmap", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (id && (user?._id || user?.id)) {
            fetchRoadmap();
        }
    }, [id, user?._id, user?.id]);

    const toggleSkill = async (skillName) => {
        const updatedSkills = userSkills.includes(skillName)
            ? userSkills.filter(s => s !== skillName)
            : [...userSkills, skillName]

        setUserSkills(updatedSkills)

        // Persist to backend database
        try {
            await axios.put(`/api/roadmaps/${id}`, {
                userSkills: updatedSkills
            });
        } catch (error) {
            console.error("Error saving updated skills:", error)
            // Rollback on failure
            setUserSkills(userSkills)
            alert("Failed to save progress. Please try again.")
        }
    }

    // ... (Export functions remain largely the same, but use the live data)

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this roadmap?")) return;
        setIsDeleting(true)
        try {
            await axios.delete(`/api/roadmaps/${id}`);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error deleting roadmap:", error);
            alert("Failed to delete roadmap. Please try again.");
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center p-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!roadmap) {
        return <div className="text-center p-10">Roadmap not found.</div>
    }

    const data = roadmap.roadmapData || roadmap

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="hidden md:flex">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-deep-purple drop-shadow-sm">
                            {roadmap.careerTitle}
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">{roadmap.careerSummary}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <Button
                        variant="destructive"
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border-red-500/20"
                        onClick={handleDelete}
                        disabled={isDeleting || isExporting}
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                        Delete
                    </Button>
                    <Button
                        variant="outline"
                        className="border-neon-cyan/30 hover:bg-neon-cyan/10 hover:text-neon-cyan font-bold transition-all duration-300"
                        onClick={handleExportDoc}
                        disabled={isExporting || isDeleting}
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        Export DOC
                    </Button>
                    <Button
                        variant="outline"
                        className="border-neon-cyan/30 hover:bg-neon-cyan/10 hover:text-neon-cyan font-bold shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all duration-300"
                        onClick={handleExportPDF}
                        disabled={isExporting || isDeleting}
                    >
                        {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                        {isExporting ? "Exporting..." : "Export PDF"}
                    </Button>
                </div>
            </div>

            <div id="roadmap-export-content" className="space-y-8 bg-background md:p-4 rounded-xl">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Compass className="h-6 w-6 text-neon-cyan mb-2" />
                            <p className="text-sm text-muted-foreground">Market Demand</p>
                            <p className="text-lg font-bold">{data.marketDemandScore}/100</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Trophy className="h-6 w-6 text-yellow-400 mb-2" />
                            <p className="text-sm text-muted-foreground">Salary Range</p>
                            <p className="text-lg font-bold">{data.salaryRange?.india}</p>
                            <p className="text-xs text-muted-foreground mt-1">{data.salaryRange?.global} (Global)</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <BookOpen className="h-6 w-6 text-green-400 mb-2" />
                            <p className="text-sm text-muted-foreground">Readiness</p>
                            <p className="text-lg font-bold">{data.careerReadinessScore}%</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Sparkles className="h-6 w-6 text-deep-purple mb-2" />
                            <p className="text-sm text-muted-foreground">Growth</p>
                            <p className="text-lg font-bold capitalize">{data.futureGrowthPrediction}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Skill Gap Analysis Section */}
                <Card className="border-indigo-500/20 bg-indigo-500/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-indigo-400" />
                            Dynamic Skill Gap Analysis
                        </CardTitle>
                        <CardDescription>
                            Track your progress by marking skills you've already mastered.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Progress Tracker */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Overall Progress</span>
                                <span className="text-indigo-400 font-bold">
                                    {Math.round((userSkills.length / (
                                        (data.coreTechnicalSkills?.length || 0) +
                                        (data.currentMarketDemandSkills2025?.length || 0) +
                                        (data.supportingTools?.length || 0)
                                    )) * 100) || 0}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${(userSkills.length / (
                                            (data.coreTechnicalSkills?.length || 0) +
                                            (data.currentMarketDemandSkills2025?.length || 0) +
                                            (data.supportingTools?.length || 0)
                                        )) * 100 || 0}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Interactive Skill Lists */}
                        <div className="grid md:grid-cols-3 gap-6 text-sm">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-indigo-300 border-b border-indigo-500/20 pb-1">Core Skills</h4>
                                <div className="space-y-2">
                                    {data.coreTechnicalSkills?.map((skill) => (
                                        <div
                                            key={skill}
                                            className="flex items-center gap-2 cursor-pointer group"
                                            onClick={() => toggleSkill(skill)}
                                        >
                                            {userSkills.includes(skill) ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                            ) : (
                                                <Circle className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 shrink-0" />
                                            )}
                                            <span className={userSkills.includes(skill) ? "text-foreground" : "text-muted-foreground"}>
                                                {skill}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-purple-300 border-b border-purple-500/20 pb-1">2025 Market Demand</h4>
                                <div className="space-y-2">
                                    {data.currentMarketDemandSkills2025?.map((skill) => (
                                        <div
                                            key={skill}
                                            className="flex items-center gap-2 cursor-pointer group"
                                            onClick={() => toggleSkill(skill)}
                                        >
                                            {userSkills.includes(skill) ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                                            ) : (
                                                <Circle className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 shrink-0" />
                                            )}
                                            <span className={userSkills.includes(skill) ? "text-foreground" : "text-muted-foreground"}>
                                                {skill}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-blue-300 border-b border-blue-500/20 pb-1">Supporting Tools</h4>
                                <div className="space-y-2">
                                    {data.supportingTools?.map((skill) => (
                                        <div
                                            key={skill}
                                            className="flex items-center gap-2 cursor-pointer group"
                                            onClick={() => toggleSkill(skill)}
                                        >
                                            {userSkills.includes(skill) ? (
                                                <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                                            ) : (
                                                <Circle className="h-4 w-4 text-muted-foreground group-hover:text-blue-400 shrink-0" />
                                            )}
                                            <span className={userSkills.includes(skill) ? "text-foreground" : "text-muted-foreground"}>
                                                {skill}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Learning Path */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">Structured Learning Path</h2>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                            {data.learningPath?.map((phase, index) => (
                                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 transition-transform duration-300 hover:scale-110 
                                        ${index === 0 ? 'bg-neon-cyan shadow-neon-cyan/50' : 'bg-deep-purple shadow-deep-purple/50'}`}>
                                        {index + 1}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-slate-900/60 backdrop-blur-md shadow-sm md:group-odd:text-right md:group-even:text-left">
                                        <h3 className={`text-lg font-bold ${index === 0 ? 'text-neon-cyan' : 'text-deep-purple'}`}>{phase.level}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                                        <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                                            {phase.skills.map((skill) => (
                                                <span key={skill} className="px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground border border-border">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Learning Plan */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">Estimated Timeline</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {data.learningTimeline?.map((plan, index) => (
                                <Card key={index} className="bg-accent/10 border-border/40">
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-sm font-bold text-neon-cyan">
                                            {plan.track} Milestone
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground">{plan.milestone}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {/* Skills & Resources Grid */}
                    <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Core Technical Skills</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {data.coreTechnicalSkills?.map((v) => <span className="p-2 bg-secondary rounded-md text-sm" key={v}>{v}</span>)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>2025 Market Demand Skills</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {data.currentMarketDemandSkills2025?.map((v) => <span className="p-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md text-sm" key={v}>{v}</span>)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Supporting Tools</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {data.supportingTools?.map((v) => <span className="p-2 bg-secondary rounded-md text-sm" key={v}>{v}</span>)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Role-Specific Projects</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {data.roleSpecificProjects?.map((proj, idx) => (
                                    <div key={idx} className="space-y-1 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                                        <h4 className="font-semibold text-sm">{proj.name}</h4>
                                        <p className="text-xs text-muted-foreground">{proj.description}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {proj.techStack?.map(tech => (
                                                <span key={tech} className="text-[10px] px-1.5 py-0.5 bg-muted rounded">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Interview Preparation</CardTitle></CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                    {data.interviewPreparation?.map((v) => <li key={v}>{v}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Portfolio Guidance</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{data.portfolioGuidance}</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    )
}
