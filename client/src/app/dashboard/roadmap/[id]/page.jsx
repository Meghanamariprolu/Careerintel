"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { 
    ArrowLeft, BookOpen, Briefcase, Download, Trophy, 
    Loader2, FileText, Trash2, CheckCircle2, Circle, 
    Sparkles, Compass, Target, Clock, AlertCircle, Share2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
    const [activeTab, setActiveTab] = useState('path') // 'path', 'analysis', 'projects'

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

        if (id && user) {
            fetchRoadmap();
        }
    }, [id, user]);

    const toggleSkill = async (skillName) => {
        const updatedSkills = userSkills.includes(skillName)
            ? userSkills.filter(s => s !== skillName)
            : [...userSkills, skillName]

        setUserSkills(updatedSkills)

        try {
            await axios.put(`/api/roadmaps/${id}`, {
                userSkills: updatedSkills
            });
        } catch (error) {
            console.error("Error saving updated skills:", error)
            setUserSkills(userSkills)
        }
    }

    const handleExportPDF = async () => {
        const element = document.getElementById("roadmap-export-content");
        if (!element) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#020617" });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${roadmap.careerTitle.replace(/\s+/g, "_")}_Roadmap.pdf`);
        } catch (error) {
            console.error("PDF Export failed", error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this intelligence roadmap? This action cannot be undone.")) return;
        setIsDeleting(true)
        try {
            await axios.delete(`/api/roadmaps/${id}`);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error deleting roadmap:", error);
            alert("Failed to delete. Access denied or server error.");
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-6">
                <div className="relative">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-16 w-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full"
                    />
                    <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-purple-400 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-xl font-bold tracking-tight text-white">Accessing Intelligence Vault</p>
                    <p className="text-white/40 text-sm font-medium animate-pulse">Decrypting career telemetry...</p>
                </div>
            </div>
        )
    }

    if (!roadmap) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <h2 className="text-2xl font-bold text-white">Roadmap Not Found</h2>
                <p className="text-white/40">The intelligence file you are looking for has been moved or deleted.</p>
                <Button onClick={() => router.push("/dashboard")} variant="outline" className="mt-4 border-white/10 rounded-xl">
                    Return to Command Center
                </Button>
            </div>
        )
    }

    const data = roadmap.roadmapData || roadmap

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
            {/* Navigation & Actions Top Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.05] pb-10">
                <div className="space-y-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="text-white/40 hover:text-white px-0 hover:bg-transparent group">
                        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
                    </Button>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                            {roadmap.careerTitle}
                        </h1>
                        <p className="text-white/40 text-lg font-medium max-w-2xl">
                            {roadmap.careerSummary}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <Button
                        variant="ghost"
                        className="bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/10 h-12 rounded-xl"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                        variant="secondary"
                        className="bg-white/5 border border-white/10 text-white hover:bg-white/10 h-12 rounded-xl px-6 font-bold"
                        onClick={handleExportPDF}
                        disabled={isExporting}
                    >
                        {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                        {isExporting ? "Exporting..." : "PDF"}
                    </Button>
                    
                    <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-xl px-8 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-purple-900/20"
                        onClick={() => alert("Roadmap sharing coming soon!")}
                    >
                        <Share2 className="h-4 w-4 mr-2" /> Share Path
                    </Button>
                </div>
            </div>

            <div id="roadmap-export-content" className="space-y-10">
                {/* Tactical Metrics Dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard 
                        icon={<Compass className="h-5 w-5 text-purple-400" />} 
                        label="Market Demand" 
                        value={data.marketDemandLevel || "High"} 
                        subValue="Trend Analysis 2025"
                    />
                    <MetricCard 
                        icon={<Trophy className="h-5 w-5 text-yellow-400" />} 
                        label="Salary Band" 
                        value={data.salaryRange?.india?.split('-')[0].trim() || "Competitive"} 
                        subValue={data.salaryRange?.global || "Market Rate"}
                    />
                    <MetricCard 
                        icon={<Target className="h-5 w-5 text-green-400" />} 
                        label="Readiness" 
                        value={`${data.careerReadinessScore || 65}%`} 
                        subValue="Current Progress"
                        progress={data.careerReadinessScore || 65}
                    />
                    <MetricCard 
                        icon={<Clock className="h-5 w-5 text-blue-400" />} 
                        label="Growth Forecast" 
                        value={data.futureGrowthPrediction || "Stable"} 
                        subValue="Industry Outlook"
                    />
                </div>

                {/* Progress Hub Section */}
                <Card className="bg-[#0c0c1e]/40 border-white/[0.08] backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black text-white flex items-center gap-3">
                                    <Sparkles className="h-5 w-5 text-purple-400" /> Mastery Progress
                                </CardTitle>
                                <CardDescription className="text-white/40 font-medium">Tracking {userSkills.length} acquired competencies</CardDescription>
                            </div>
                            
                            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                                <TabButton active={activeTab === 'path'} onClick={() => setActiveTab('path')} label="Path" icon={<Target className="h-3.5 w-3.5" />} />
                                <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} label="Gap Analysis" icon={<Zap className="h-3.5 w-3.5" />} />
                                <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} label="Labs" icon={<Briefcase className="h-3.5 w-3.5" />} />
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-8 md:p-10 pt-0">
                        <AnimatePresence mode="wait">
                            {activeTab === 'path' && (
                                <motion.div 
                                    key="path"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12 py-10"
                                >
                                    <div className="relative space-y-12 before:absolute before:inset-0 before:left-[19px] before:w-[2px] before:bg-gradient-to-b before:from-purple-500/50 before:via-indigo-500/30 before:to-transparent">
                                        {data.learningPath?.map((phase, index) => (
                                            <div key={index} className="relative pl-14 group">
                                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#0c0c1e] bg-purple-600 shadow-xl shadow-purple-900/40 z-10 transition-transform group-hover:scale-110">
                                                    <span className="text-[10px] font-black text-white">{index + 1}</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <h3 className="text-xl font-black text-white tracking-tight">{phase.level}</h3>
                                                        <p className="text-white/40 text-sm font-medium leading-relaxed">{phase.description}</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {phase.skills.map((skill) => (
                                                            <SkillTag key={skill} skill={skill} active={userSkills.includes(skill)} onClick={() => toggleSkill(skill)} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'analysis' && (
                                <motion.div 
                                    key="analysis"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid md:grid-cols-3 gap-10 py-10"
                                >
                                    <SkillInventory 
                                        title="Core Engine" 
                                        icon={<Brain className="h-4 w-4 text-purple-400" />}
                                        skills={data.coreTechnicalSkills} 
                                        userSkills={userSkills} 
                                        onToggle={toggleSkill} 
                                    />
                                    <SkillInventory 
                                        title="2025 Market Spec" 
                                        icon={<Compass className="h-4 w-4 text-indigo-400" />}
                                        skills={data.currentMarketDemandSkills2025} 
                                        userSkills={userSkills} 
                                        onToggle={toggleSkill} 
                                    />
                                    <SkillInventory 
                                        title="Tactical Stack" 
                                        icon={<Zap className="h-4 w-4 text-cyan-400" />}
                                        skills={data.supportingTools} 
                                        userSkills={userSkills} 
                                        onToggle={toggleSkill} 
                                    />
                                </motion.div>
                            )}

                            {activeTab === 'projects' && (
                                <motion.div 
                                    key="projects"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid md:grid-cols-2 gap-6 py-10"
                                >
                                    {data.roleSpecificProjects?.map((proj, idx) => (
                                        <Card key={idx} className="bg-white/5 border-white/5 rounded-3xl p-6 hover:bg-white/10 transition-all border hover:border-white/10 group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 group-hover:scale-110 transition-transform">
                                                    <Briefcase className="h-5 w-5" />
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest">Lab 0{idx+1}</div>
                                            </div>
                                            <h4 className="text-lg font-black text-white mb-2">{proj.name}</h4>
                                            <p className="text-sm text-white/40 font-medium mb-6 leading-relaxed">{proj.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {proj.techStack?.map(tech => (
                                                    <span key={tech} className="px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-[10px] font-bold text-white/60">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </Card>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* Interview Prep Section */}
                <div className="grid md:grid-cols-12 gap-10">
                    <div className="md:col-span-8">
                        <Card className="bg-indigo-500/5 border-indigo-500/10 rounded-[2.5rem] p-10">
                            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                <AlertCircle className="h-6 w-6 text-indigo-400" /> Tactical Interview Intel
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {data.interviewPreparation?.map((item, i) => (
                                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors">
                                        <div className="h-6 w-6 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                        </div>
                                        <p className="text-sm font-medium text-white/80 leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    
                    <div className="md:col-span-4">
                        <Card className="h-full bg-purple-500/5 border-purple-500/10 rounded-[2.5rem] p-10 flex flex-col justify-center text-center">
                            <div className="mb-6 mx-auto p-5 rounded-3xl bg-purple-600/20 text-purple-400 w-fit">
                                <Trophy className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-4">Portfolio Strategy</h3>
                            <p className="text-white/40 text-sm font-medium leading-relaxed">
                                {data.portfolioGuidance || "Focus on building end-to-end applications that solve real-world problems. Document your architectural decisions clearly."}
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Subcomponents ──

function MetricCard({ icon, label, value, subValue, progress }) {
    return (
        <Card className="bg-[#0c0c1e]/40 border-white/[0.08] backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" style={{ width: progress ? `${progress}%` : '0%' }} />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/60">
                        {icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{label}</span>
                </div>
                <div>
                    <div className="text-2xl font-black text-white truncate">{value}</div>
                    <div className="text-[10px] font-bold text-white/40 uppercase mt-1 tracking-wider">{subValue}</div>
                </div>
            </div>
        </Card>
    )
}

function TabButton({ active, onClick, label, icon }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                active ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
        >
            {icon}
            {label}
        </button>
    )
}

function SkillTag({ skill, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                active 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white'
            }`}
        >
            {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            {skill}
        </button>
    )
}

function SkillInventory({ title, icon, skills, userSkills, onToggle }) {
    return (
        <div className="space-y-6">
            <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5 pb-4">
                {icon} {title}
            </h4>
            <div className="space-y-3">
                {skills?.map((skill) => (
                    <div
                        key={skill}
                        onClick={() => onToggle(skill)}
                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                            userSkills.includes(skill)
                                ? 'bg-green-500/5 border-green-500/20'
                                : 'bg-white/5 border-white/5 hover:border-white/20'
                        }`}
                    >
                        <span className={`text-sm font-bold ${userSkills.includes(skill) ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                            {skill}
                        </span>
                        {userSkills.includes(skill) ? (
                            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle2 className="h-3 w-3 text-black" />
                            </div>
                        ) : (
                            <Circle className="h-5 w-5 text-white/10 group-hover:text-white/30" />
                        )}
                    </div>
                ))}
                {(!skills || skills.length === 0) && <p className="text-xs text-white/20 italic">No intelligence data available.</p>}
            </div>
        </div>
    )
}
