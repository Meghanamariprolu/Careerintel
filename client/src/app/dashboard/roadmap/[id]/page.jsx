"use client"

import { useEffect, useState, useRef } from"react"
import { useParams, useRouter } from"next/navigation"
import axios from"axios"
import { 
    ArrowLeft, BookOpen, Briefcase, Download, Trophy, 
    Loader2, FileText, Trash2, CheckCircle2, Circle, 
    Sparkles, Compass, Target, Clock, AlertCircle, Share2,
    Brain, Wrench, PlayCircle, ExternalLink, Terminal, FileCode, Rocket, ShieldCheck
} from"lucide-react"
import { motion, AnimatePresence } from"framer-motion"
import { useAuth } from"@/context/AuthContext"
import { toast } from"sonner"
import { Button } from"@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from"@/components/ui/Card"
import html2canvas from"html2canvas"
import jsPDF from"jspdf"
import RoadmapDisplay from"@/components/RoadmapDisplay";

export default function RoadmapDetailPage() {
    const { user } = useAuth()
    const router = useRouter()
    const { id } = useParams()
    
    const [roadmap, setRoadmap] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [userSkills, setUserSkills] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [completedModules, setCompletedModules] = useState([])

    useEffect(() => {
        async function fetchRoadmap() {
            try {
                const { data } = await axios.get(`/api/roadmaps/${id}`);
                setRoadmap(data);
                setUserSkills(data.userSkills || []);
                // If user data is available, set completed modules from profile or user object
                // For now, let's assume the user object in AuthContext or a separate fetch
                const userRes = await axios.get('/api/auth/profile');
                setCompletedModules(userRes.data.progressTracking?.completedModules || []);
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

    const handleCompleteModule = async (moduleId) => {
        setIsProcessing(true);
        try {
            const { data } = await axios.post(`/api/roadmaps/${id}/complete`, {
                moduleId
            });
            setCompletedModules(data.completedModules);
            // Optionally update the readiness score in the local UI
            if (roadmap) {
                setRoadmap({ ...roadmap, careerReadinessScore: data.score });
            }
        } catch (error) {
            console.error("Error completing module:", error);
        } finally {
            setIsProcessing(false);
        }
    }

    const handleExportPDF = async () => {
        const element = document.getElementById("roadmap-export-content");
        if (!element) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor:"#0F172A" });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p","mm","a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData,"PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${roadmap.careerTitle.replace(/\s+/g,"_")}_Roadmap.pdf`);
        } catch (error) {
            console.error("PDF Export failed", error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this intelligence roadmap? This action cannot be undone.")) return;
        setIsDeleting(true)
        toast.promise(
            axios.delete(`/api/roadmaps/${id}`),
            {
                loading: 'Deleting roadmap...',
                success: () => {
                    router.push("/dashboard");
                    return 'Roadmap deleted successfully';
                },
                error: (err) => {
                    console.error("Error deleting roadmap:", err);
                    return"Failed to delete. Access denied or server error.";
                }
            }
        ).finally(() => setIsDeleting(false));
    }

    if (isLoading) {
        return (
            <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-6">
                <div className="relative">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease:"linear" }} className="h-16 w-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full"
                    />
                    <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-violet-400 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-xl font-bold  text-white">Accessing Intelligence Vault</p>
                    <p className="text-white/70 text-sm font-medium animate-pulse">Decrypting career telemetry...</p>
                </div>
            </div>
        )
    }

    if (!roadmap) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <h2 className="text-2xl font-bold text-white">Roadmap Not Found</h2>
                <p className="text-white/70">The intelligence file you are looking for has been moved or deleted.</p>
                <Button onClick={() => router.push("/dashboard")} variant="outline" className="mt-4 border-white/10 rounded-xl">
                    Return to Command Center
                </Button>
            </div>
        )
    }

    const data = roadmap.roadmapData || roadmap

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-16 text-white pt-4">
            {/* Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.05] pb-4">
                <div className="space-y-3">
                    <button onClick={() => router.push("/dashboard")} className="flex items-center text-white/70 hover:text-white transition-colors group">
                        <ArrowLeft className="h-3 w-3 mr-1.5 group-hover:-translate-x-1 transition-transform" /> 
                        <span className="text-xs font-semibold   leading-none">Command Center</span>
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-lg md:text-xl font-semibold   text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-violet-400">
                            {roadmap.careerTitle}
                        </h1>
                        <div className="flex items-center gap-2.5">
                            <span className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-semibold text-violet-400   shadow-xl">Active Deployment</span>
                            <span className="text-white/70 text-xs font-semibold   leading-none">{data.total_learning_duration} Courseware</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="bg-red-500/5 text-red-400 hover:bg-red-500/10 h-8 w-8 rounded-lg border border-red-500/10 flex items-center justify-center transition-all shadow-xl"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    </Button>
                    
                    <Button className="bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.08] h-8 rounded-lg px-4 font-semibold   text-xs shadow-xl"
                        onClick={handleExportPDF}
                        disabled={isExporting}
                    >
                        {isExporting ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <Download className="h-3 w-3 mr-1.5 text-violet-400" />}
                        {isExporting ?"Exporting..." :"Intel Export"}
                    </Button>
                </div>
            </div>

            <div id="roadmap-export-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Weekly focus summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {data.weekly_timeline?.map((w, i) => (
                            <div key={i} className="p-3 rounded-lg bg-white/[0.01] border border-white/5 space-y-1 transition-all hover:border-violet-500/10 shadow-xl">
                                <p className="text-sm font-semibold text-violet-500/40">Weeks {w.weeks}</p>
                                <p className="text-xs font-semibold text-white/90  ">{w.focus}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                         <h2 className="text-sm font-semibold text-white flex items-center gap-2  ">
                            <Target className="h-3.5 w-3.5 text-violet-400" /> Learning Route
                        </h2>
                        <div className="text-sm font-semibold   text-white/90">
                            {completedModules.length} / {data.learning_route?.length || 0} Modules Synced
                        </div>
                    </div>

                    <RoadmapDisplay 
                        route={roadmap} 
                        completedModules={completedModules} 
                        onCompleteModule={handleCompleteModule} 
                        isProcessing={isProcessing}
                    />
                </div>

                {/* Sidebar Intelligence */}
                <div className="lg:col-span-4 space-y-6">
                     {/* Readiness Score */}
                     <Card className="bg-slate-900/40 backdrop-blur-3xl rounded-lg p-5 text-white shadow-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 space-y-2.5">
                            <div className="space-y-0.5">
                                <p className="text-sm font-semibold   text-white/90">Job Readiness Score</p>
                                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-violet-400"> {roadmap.careerReadinessScore || 0}%</h3>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${roadmap.careerReadinessScore || 0}%` }} className="h-full bg-violet-500/40"
                                />
                            </div>
                            <p className="text-xs font-semibold leading-relaxed text-white/90   italic">
                                Sync all modules to reach peak deployment readiness.
                            </p>
                        </div>
                    </Card>

                    {/* Job Ready Skills */}
                    <div className="space-y-2.5">
                        <h3 className="text-xs font-semibold   text-white/90 flex items-center gap-2">
                            <ShieldCheck className="h-3 w-3 text-cyan-500/40" /> Industry Skills
                        </h3>
                        <div className="space-y-1">
                            {data.job_ready_skills?.map(skill => (
                                <div key={skill} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-white/5 group hover:border-violet-500/10 transition-all shadow-xl">
                                    <span className="text-xs font-semibold text-white/60 group-hover:text-white transition-colors  ">{skill}</span>
                                    <div className="h-1 w-1 rounded-full bg-cyan-400/20 shadow-[0_0_8px_rgba(34,211,238,0.2)]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Portfolio Preview */}
                    <div className="space-y-2.5">
                        <h3 className="text-xs font-semibold   text-white/90 flex items-center gap-2">
                            <Briefcase className="h-3 w-3 text-emerald-500/40" /> Labs Architecture
                        </h3>
                        <div className="space-y-2">
                            {data.portfolio_projects?.map((proj, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-white/[0.01] border border-white/5 space-y-1 transition-all hover:border-violet-500/10 shadow-xl">
                                    <h4 className="text-xs font-semibold text-white/90  ">{proj.name}</h4>
                                    <p className="text-xs text-white/70 font-medium leading-relaxed   italic">{proj.description}</p>
                                    <div className="flex flex-wrap gap-1 pt-1 opacity-20">
                                        {proj.techStack?.slice(0, 3).map(t => (
                                            <span key={t} className="text-sm font-semibold text-violet-400  ">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
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
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/90">
                        {icon}
                    </div>
                    <span className="text-sm font-semibold   text-white/70">{label}</span>
                </div>
                <div>
                    <div className="text-2xl font-semibold text-white truncate">{value}</div>
                    <div className="text-sm font-bold text-white/70  mt-1 r">{subValue}</div>
                </div>
            </div>
        </Card>
    )
}

function TabButton({ active, onClick, label, icon }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold   transition-all ${
                active ? 'bg-white text-black shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'
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
                    : 'bg-white/5 border-white/5 text-white/70 hover:border-white/20 hover:text-white'
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
            <h4 className="flex items-center gap-3 text-xs font-semibold   text-white/60 border-b border-white/5 pb-4">
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
                        <span className={`text-sm font-bold ${userSkills.includes(skill) ? 'text-white' : 'text-white/70 group-hover:text-white/90'}`}>
                            {skill}
                        </span>
                        {userSkills.includes(skill) ? (
                            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle2 className="h-3 w-3 text-black" />
                            </div>
                        ) : (
                            <Circle className="h-5 w-5 text-white/90 group-hover:text-white/60" />
                        )}
                    </div>
                ))}
                {(!skills || skills.length === 0) && <p className="text-xs text-white/70 italic">No intelligence data available.</p>}
            </div>
        </div>
    )
}
