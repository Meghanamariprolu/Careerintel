"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import {
    Compass, FileText, Loader2, ArrowRight, Trash2,
    TrendingUp, Route, Layout, FileUser, Gamepad2,
    UserRoundCog, Brain, Star, Combine, BarChart3, Bot,
    Sparkles, Target, Code, GraduationCap, BookOpen, 
    School, Linkedin, Github, MessageSquare, Users,
    Globe, ChevronRight, Zap, Trophy, Clock
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useUserProfile } from "@/context/UserProfileContext"
import { ResourceEcosystems } from "@/components/ResourceEcosystems"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

const careerTools = [
    { name: "Market Integration", slug: "market-integration", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Learning Routes", href: "/learning-route", icon: Route, color: "text-green-400", bg: "bg-green-400/10" },
    { name: "Portfolio Builder", slug: "portfolio-builder", icon: Layout, color: "text-purple-400", bg: "bg-purple-400/10" },
    { name: "Resume Enhancer", slug: "resume-enhancer", icon: FileUser, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { name: "Scenario Simulator", slug: "scenario-simulator", icon: Gamepad2, color: "text-red-400", bg: "bg-red-400/10" },
    { name: "AI Coaching", href: "/dashboard/tools/coaching", icon: UserRoundCog, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { name: "Behavioral Mapping", href: "/dashboard/tools/behavioral-mapping", icon: Brain, color: "text-pink-400", bg: "bg-pink-400/10" },
    { name: "Quality Scoring", href: "/dashboard/tools/quality-scoring", icon: Star, color: "text-orange-400", bg: "bg-orange-400/10" },
    { name: "Skill Gap Analyzer", href: "/dashboard/tools/skill-gap", icon: Combine, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { name: "Outcome Tracking", href: "/dashboard/tools/outcome-tracking", icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Mentor Personas", href: "/dashboard/tools/mentor-personas", icon: Bot, color: "text-violet-400", bg: "bg-violet-400/10" },
    { name: "Career Analytics", href: "/dashboard/analytics", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/10" },
]

export default function DashboardPage() {
    const { user } = useAuth()
    const { profile } = useUserProfile()

    const [roadmaps, setRoadmaps] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchRoadmaps() {
            try {
                const { data } = await axios.get('/api/roadmaps');
                setRoadmaps(data);
            } catch (error) {
                console.error("Error fetching roadmaps", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (user?._id || user?.id) {
            fetchRoadmaps();
        } else {
            setIsLoading(false);
        }
    }, [user?._id, user?.id]);

    const handleDelete = async (id, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!confirm("Are you sure you want to delete this roadmap?")) return;

        try {
            await axios.delete(`/api/roadmaps/${id}`);
            setRoadmaps((prevRoadmaps) => prevRoadmaps.filter((r) => r._id !== id));
        } catch (error) {
            console.error("Error deleting roadmap:", error);
            alert("Failed to delete roadmap. Please try again.");
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            
            {/* --- WELCOME HERO SECTION --- */}
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div className="space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] uppercase font-black tracking-widest"
                    >
                        <Zap className="h-3 w-3" /> Intel Node: {user?.name?.split(' ')[0] || 'User'}
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.name?.split(' ')[0] || 'Navigator'}</span>.
                    </h1>
                    <p className="text-white/40 text-sm md:text-lg font-medium max-w-xl">
                        Your career trajectory is currently being computed. {profile?.careerGoal ? `Optimizing for ${profile.careerGoal}.` : "Set your goal to begin precision guidance."}
                    </p>
                </div>
                <div className="hidden lg:flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">System Status</p>
                        <p className="text-sm font-bold text-emerald-400">All Nodes Active</p>
                    </div>
                </div>
            </div>

            {/* --- CORE TELEMETRY METRICS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: "Target Alpha", value: profile?.careerGoal || "Not Defined", icon: Target, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Skill Match-Rate", value: `${profile?.analytics?.skillMatch || 0}%`, icon: Combine, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                    { label: "Network Strength", value: "Verified", icon: Globe, color: "text-purple-400", bg: "bg-purple-500/10" },
                    { label: "Intelligence Sync", value: "Real-time", icon: Clock, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                ].map((metric, i) => (
                    <motion.div 
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all cursor-default">
                             <CardContent className="p-6 flex items-center gap-5">
                                <div className={`p-4 rounded-2xl ${metric.bg} border border-white/5 group-hover:scale-110 transition-transform`}>
                                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">{metric.label}</p>
                                    <p className="text-base font-extrabold text-white truncate max-w-[140px]">{metric.value}</p>
                                </div>
                             </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* --- GLOBAL CAREER READINESS --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="bg-[#0c0c1e] border border-white/[0.08] backdrop-blur-2xl shadow-2xl relative overflow-hidden group px-6 py-10 md:px-12 md:py-16 rounded-[2.5rem]">
                    <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-indigo-600/[0.04] blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
                    
                    <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
                        <div className="md:col-span-7 space-y-8">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <Trophy className="h-3.5 w-3.5 text-indigo-400" /> Strategic Readiness Level
                                </div>
                                <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                                    {profile?.analytics?.careerReadiness || 0}% <span className="text-white/20 font-light">Engine Sync</span>
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="h-4 w-full bg-white/[0.03] rounded-full overflow-hidden p-1 border border-white/[0.05]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${profile?.analytics?.careerReadiness || 0}%` }}
                                        transition={{ duration: 2, ease: "circOut" }}
                                        className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-black tracking-widest text-white/30 uppercase">
                                    <span>Deployment Alpha</span>
                                    <span>Market Ready Elite</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href="/dashboard/analytics">
                                    <Button className="bg-white text-slate-950 font-black uppercase tracking-[0.15em] text-[10px] py-6 px-10 rounded-2xl hover:bg-white/90 shadow-2xl shadow-white/5 transition-all active:scale-95">
                                        Open Full Diagnostics
                                    </Button>
                                </Link>
                                <button className="bg-white/[0.05] border border-white/[0.08] text-white/80 font-black uppercase tracking-[0.15em] text-[10px] py-6 px-10 rounded-2xl hover:bg-white/[0.1] transition-all">
                                    Sync Skill Telemetry
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-5 hidden md:block">
                            <div className="relative aspect-square flex items-center justify-center">
                                <div className="absolute inset-0 border-[40px] border-indigo-500/[0.03] rounded-full animate-[spin_20s_linear_infinite]" />
                                <div className="absolute inset-8 border-[2px] border-dashed border-indigo-500/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex flex-col items-center justify-center p-8 text-center border border-white/10 shadow-2xl ring-8 ring-indigo-500/[0.02]">
                                    <Star className="h-8 w-8 text-indigo-400 mb-2 animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Readiness Score</p>
                                    <p className="text-4xl font-black text-white">{profile?.analytics?.careerReadiness || 0}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* --- AI INTELLIGENCE HUB (TOOLS) --- */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-600/10 border border-indigo-600/20">
                            <Sparkles className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-white">AI Career Command</h2>
                            <p className="text-sm text-white/30 font-bold uppercase tracking-widest">Execute Tactical Intelligence Tools</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {careerTools.map((tool, i) => (
                        <motion.div 
                            key={tool.name} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                        >
                            <Link href={tool.href || `/dashboard/tools/${tool.slug}`}>
                                <button className="w-full aspect-square flex flex-col items-center justify-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-[2rem] hover:bg-white/[0.08] hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 group">
                                    <div className={`p-4 rounded-2xl ${tool.bg} ring-1 ring-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                                        <tool.icon className={`h-6 w-6 ${tool.color}`} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white px-2 text-center">{tool.name}</span>
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link href="/dashboard/generate">
                            <button className="w-full aspect-square flex flex-col items-center justify-center gap-4 bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] hover:bg-indigo-600/20 hover:border-indigo-500/40 transition-all duration-300 group">
                                <div className="p-4 rounded-2xl bg-indigo-500/20 transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110 shadow-xl">
                                    <Compass className="h-6 w-6 text-indigo-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Initiate Roadmap</span>
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* --- SAVED ROADMAPS TELEMETRY --- */}
            <div className="space-y-8 pt-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                     <div className="p-3 rounded-2xl bg-[#0c0c1e] border border-white/5">
                        <Route className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-white">Computed Strategies</h2>
                        <p className="text-sm text-white/30 font-bold uppercase tracking-widest">Active Roadmap Deployments</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        [1,2,3].map(i => <div key={i} className="h-64 rounded-[2rem] bg-white/[0.02] animate-pulse border border-white/5" />)
                    ) : roadmaps.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                             <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center">
                                <Compass className="h-10 w-10 text-white/10" />
                             </div>
                             <div className="space-y-2">
                                <p className="text-white/40 font-bold uppercase tracking-widest">No strategies deployed.</p>
                                <p className="text-sm text-white/20 max-w-xs">Initialize your first AI career roadmap using the generator tool above.</p>
                             </div>
                        </div>
                    ) : (
                        roadmaps.map((roadmap, idx) => (
                            <motion.div
                                key={roadmap._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.05 * idx }}
                            >
                                <Card className="group bg-[#0c0c1e]/80 border border-white/[0.06] hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-950/20 transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col">
                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">Deployed Roadmap</p>
                                                <h3 className="text-xl font-extrabold text-white truncate max-w-[200px]">{roadmap.careerTitle}</h3>
                                            </div>
                                            <button 
                                                onClick={(e) => handleDelete(roadmap._id, e)}
                                                className="p-3 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-white/40 line-clamp-2 leading-relaxed font-medium">
                                            {roadmap.careerSummary}
                                        </p>
                                        <Link href={`/dashboard/roadmap/${roadmap._id}`} className="block">
                                            <Button variant="outline" className="w-full py-7 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border-white/[0.08] group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                                Synchronize Roadmap
                                                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* --- STRATEGIC ECOSYSTEMS --- */}
            <div className="space-y-8 pt-8 border-t border-white/5 pb-20">
                <div className="flex items-center gap-4">
                     <div className="p-3 rounded-2xl bg-[#0c0c1e] border border-white/5">
                        <Users className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-white">Strategic Ecosystems</h2>
                        <p className="text-sm text-white/30 font-bold uppercase tracking-widest">Master Your Presence Across Platforms</p>
                    </div>
                </div>
                
                <ResourceEcosystems />
            </div>
        </div>
    )
}
