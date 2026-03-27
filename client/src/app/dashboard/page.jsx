"use client"

import { useEffect, useState } from"react"
import Link from"next/link"
import axios from"axios"
import {
    Compass, FileText, Loader2, ArrowRight, Trash2,
    TrendingUp, Route, Layout, FileUser, Gamepad2,
    UserRoundCog, Brain, Star, Combine, BarChart3, Bot,
    Sparkles, Target, Code, GraduationCap, BookOpen, 
    School, Linkedin, Github, MessageSquare, Users,
    Globe, ChevronRight, Zap, Trophy, Clock
} from"lucide-react"
import { motion, AnimatePresence } from"framer-motion"
import { useAuth } from"@/context/AuthContext"
import { useUserProfile } from"@/context/UserProfileContext"
import { MarqueeCards } from"@/components/MarqueeCards"
import { toast } from"sonner"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from"@/components/ui/Card"
import { Button } from"@/components/ui/Button"
import { DashboardSkeleton } from"@/components/ui/Skeleton"

const careerTools = [
    { name:"Market Integration", slug:"market-integration", icon: TrendingUp, color:"text-blue-400", bg:"bg-blue-400/10" },
    { name:"Learning Routes", href:"/learning-route", icon: Route, color:"text-green-400", bg:"bg-green-400/10" },
    { name:"Portfolio Builder", slug:"portfolio-builder", icon: Layout, color:"text-purple-400", bg:"bg-purple-400/10" },
    { name:"Resume Enhancer", slug:"resume-enhancer", icon: FileUser, color:"text-yellow-400", bg:"bg-yellow-400/10" },
    { name:"Scenario Simulator", slug:"scenario-simulator", icon: Gamepad2, color:"text-red-400", bg:"bg-red-400/10" },
    { name:"AI Coaching", href:"/dashboard/tools/coaching", icon: UserRoundCog, color:"text-indigo-400", bg:"bg-indigo-400/10" },
    { name:"Behavioral Mapping", href:"/dashboard/tools/behavioral-mapping", icon: Brain, color:"text-pink-400", bg:"bg-pink-400/10" },
    { name:"Quality Scoring", href:"/dashboard/tools/quality-scoring", icon: Star, color:"text-orange-400", bg:"bg-orange-400/10" },
    { name:"Skill Gap Analyzer", href:"/dashboard/tools/skill-gap", icon: Combine, color:"text-cyan-400", bg:"bg-cyan-400/10" },
    { name:"Outcome Tracking", href:"/dashboard/tools/outcome-tracking", icon: BarChart3, color:"text-emerald-400", bg:"bg-emerald-400/10" },
    { name:"Mentor Personas", href:"/dashboard/tools/mentor-personas", icon: Bot, color:"text-violet-400", bg:"bg-violet-400/10" },
    { name:"Career Analytics", href:"/dashboard/analytics", icon: BarChart3, color:"text-blue-400", bg:"bg-blue-400/10" },
]

export default function DashboardPage() {
    const { user } = useAuth()
    const { profile } = useUserProfile()

    const [roadmaps, setRoadmaps] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchRoadmaps = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.get('/api/roadmaps');
            setRoadmaps(data);
        } catch (err) {
            console.error("Error fetching roadmaps", err);
            setError(err.message ||"Connection failure");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
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

        toast.promise(
            axios.delete(`/api/roadmaps/${id}`),
            {
                loading: 'Purging from registry vault...',
                success: () => {
                    setRoadmaps((prevRoadmaps) => prevRoadmaps.filter((r) => r._id !== id));
                    return 'Strategy deleted successfully';
                },
                error: (err) => `Failed to delete: ${err.message}`,
            }
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            
            {/* --- WELCOME HERO SECTION --- */}
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-3 pb-1 border-b border-white/5">
                <div className="space-y-1">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold   mb-2"
                    >
                        <Zap className="h-3 w-3" /> Intel Node: {user?.name?.split(' ')[0] || 'User'}
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold  text-white leading-tight">
                        Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.name?.split(' ')[0] || 'Navigator'}</span>.
                    </h1>
                    <p className="text-white/80 text-sm md:text-base font-medium max-w-xl leading-relaxed">
                        Your career trajectory is currently being computed. {profile?.careerGoal ? `Optimizing for ${profile.careerGoal}.` :"Set your goal to begin precision guidance."}
                    </p>
                </div>
                <div className="hidden lg:flex items-center gap-4">
                    <div className="text-right">
                        <p className={`text-sm font-semibold   ${error ? 'text-red-500/50' : 'text-white/70'}`}>
                            {error ? 'System Alert' : 'System Status'}
                        </p>
                        <p className={`text-xs font-semibold   ${error ? 'text-red-500' : 'text-emerald-400'}`}>
                            {error ? 'Offline Mode' : 'Nodes Synced'}
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} className="p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-500/20">
                            <Clock className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-100">Connectivity Alert</p>
                            <p className="text-xs text-red-200/60">Limited access: {error}. Running in local-only fallback mode.</p>
                        </div>
                    </div>
                    <button 
                        onClick={fetchRoadmaps} className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-red-500/20"
                    >
                        Retry Connection
                    </button>
                </motion.div>
            )}

            {/* --- CORE TELEMETRY METRICS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                    { label:"Target Alpha", value: profile?.careerGoal ||"Not Defined", icon: Target, color:"text-blue-400", bg:"bg-blue-400/10" },
                    { label:"Skill Match-Rate", value: `${profile?.analytics?.skillMatch || 0}%`, icon: Combine, color:"text-cyan-400", bg:"bg-cyan-500/10" },
                    { label:"Network Strength", value:"Verified", icon: Globe, color:"text-purple-400", bg:"bg-purple-500/10" },
                    { label:"Intelligence Sync", value:"Real-time", icon: Clock, color:"text-emerald-400", bg:"bg-emerald-400/10" },
                ].map((metric, i) => (
                    <motion.div 
                        key={metric.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-white/[0.01] border border-white/5 backdrop-blur-3xl relative overflow-hidden group hover:border-indigo-500/10 transition-all cursor-default rounded-lg shadow-xl">
                             <CardContent className="p-2 flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${metric.bg} border border-white/5 group-hover:scale-105 transition-transform shadow-xl`}>
                                    <metric.icon className={`h-3 w-3 ${metric.color}`} />
                                </div>
                                <div className="space-y-0 min-w-0">
                                    <p className="text-sm text-white/70 font-semibold">{metric.label}</p>
                                    <p className="text-base font-bold text-white truncate">{metric.value}</p>
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
                <Card className="bg-slate-900/40 border border-indigo-500/10 backdrop-blur-3xl shadow-xl relative overflow-hidden group p-3.5 md:p-4 rounded-lg">
                    <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
                    
                    <div className="relative z-10 grid md:grid-cols-12 gap-5 items-center">
                        <div className="md:col-span-8 space-y-3.5">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold  r">
                                    <Trophy className="h-3 w-3" /> Strategic Readiness Level
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white ">
                                    {profile?.analytics?.careerReadiness || 0}% <span className="text-white/70 font-semibold text-sm">Engine Sync</span>
                                </h3>
                            </div>
 
                            <div className="space-y-1.5">
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${profile?.analytics?.careerReadiness || 0}%` }}
                                        transition={{ duration: 2, ease:"circOut" }} className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 rounded-full opacity-60"
                                    />
                                </div>
                                <div className="flex justify-between text-sm font-semibold  text-white/70">
                                    <span>Deployment Pipeline</span>
                                    <span>Market Dominance Elite</span>
                                </div>
                            </div>
 
                            <div className="flex flex-wrap gap-2 pt-0.5">
                                <div className="flex flex-wrap gap-2.5 pt-1.5">
                                    <Button size="sm" className="h-9 px-5 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-xl transition-all shadow-xl shadow-white/5">
                                        Diagnostics Registry
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-9 px-5 border-white/10 text-white/90 hover:text-white hover:bg-white/5 font-bold rounded-xl transition-all">
                                        Sync Skill Matrix
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-4 hidden md:block border-l border-white/5 pl-6">
                            <div className="relative flex flex-col items-center justify-center py-1">
                                <div className="w-20 h-20 rounded-lg bg-indigo-500/10 flex flex-col items-center justify-center p-3 text-center border border-indigo-500/20 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent animate-pulse" />
                                    <Star className="h-4 w-4 text-indigo-400 mb-1.5 relative z-10" />
                                    <p className="text-sm font-semibold   text-indigo-300 relative z-10">Sync Level</p>
                                    <p className="text-xl font-semibold text-white relative z-10">{profile?.analytics?.careerReadiness || 0}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* --- AI INTELLIGENCE HUB (TOOLS) --- */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shadow-xl">
                            <Sparkles className="h-3 w-3 text-indigo-400/60" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold  text-white">AI Intelligence Hub</h2>
                            <p className="text-sm text-white/70 font-medium">Execute tactical protocols to advance your roadmap</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                    {careerTools.map((tool, i) => (
                        <motion.div 
                            key={tool.name} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * i }}
                        >
                            <Link href={tool.href || `/dashboard/tools/${tool.slug}`}>
                                <button className="w-full aspect-square flex flex-col items-center justify-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.06] hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group p-3 shadow-lg">
                                    <div className={`p-3 rounded-xl ${tool.bg} border border-white/10 transition-transform duration-500 group-hover:scale-110 shadow-xl`}>
                                        <tool.icon className={`h-5 w-5 ${tool.color}`} />
                                    </div>
                                    <span className="text-sm font-semibold   text-white/90 group-hover:text-indigo-400 text-center leading-tight w-full break-words px-1">{tool.name}</span>
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link href="/dashboard/generate">
                            <button className="w-full aspect-square flex flex-col items-center justify-center gap-2.5 bg-indigo-500/[0.05] border border-indigo-500/20 rounded-xl hover:bg-indigo-500/[0.1] hover:border-indigo-400/30 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group p-3">
                                <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 transition-transform duration-500 group-hover:scale-110 shadow-xl">
                                    <Compass className="h-5 w-5 text-indigo-400" />
                                </div>
                                <span className="text-sm font-semibold   text-indigo-400/50 text-center leading-tight px-1">GENERATE NODE</span>
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* --- ACTIVE INTELLIGENCE STREAM (CONTINUE LEARNING) --- */}
            {roadmaps.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 shadow-xl">
                            <Zap className="h-3.5 w-3.5 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold  text-white">Active Intelligence Stream</h2>
                            <p className="text-xs text-white/70 font-semibold">Resume Trajectory Optimization</p>
                        </div>
                    </div>
                    <Card className="relative overflow-hidden bg-slate-900/40 border border-violet-500/10 rounded-lg p-3.5 group shadow-xl backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none transition-transform group-hover:scale-110" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold   shadow-xl">
                                    <Sparkles className="h-2 w-2" /> PRIORITY DEPLOYMENT
                                </div>
                                <h3 className="text-base font-semibold text-white leading-tight ">
                                    {roadmaps[0].careerTitle}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="space-y-0">
                                        <p className="text-sm font-semibold text-white/70">Ready Status</p>
                                        <p className="text-sm font-semibold text-white/70 tabular-nums">{roadmaps[0].careerReadinessScore || 0}%</p>
                                    </div>
                                    <div className="h-5 w-px bg-white/5" />
                                    <div className="space-y-0">
                                        <p className="text-sm font-semibold text-white/70">Protocol Sync</p>
                                        <p className="text-sm font-semibold text-white/70 tabular-nums">{profile?.progressTracking?.completedModules?.length || 0} / {roadmaps[0].roadmapData?.learning_route?.length || 8}</p>
                                    </div>
                                </div>
                            </div>
 
                            <Link href={`/dashboard/roadmap/${roadmaps[0]._id}`} className="shrink-0 w-full md:w-auto">
                                <button className="h-8 px-4 rounded-lg bg-violet-600/80 text-white hover:bg-violet-600 shadow-xl font-semibold   text-sm group w-full transition-all">
                                    CONTINUE SYNC
                                    <ArrowRight className="inline ml-1.5 h-2 w-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- COMPUTED STRATEGIES (ROADMAPS) --- */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                     <div className="p-1.5 rounded-lg bg-slate-900/60 border border-white/5 shadow-xl">
                        <Route className="h-3 w-3 text-emerald-400/60" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold  text-white">Registry Vault</h2>
                        <p className="text-xs text-white/70 font-semibold">Historical Deployment Archives</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        <DashboardSkeleton />
                    ) : roadmaps.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-6 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                             <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center">
                                <Compass className="h-10 w-10 text-white/90" />
                             </div>
                             <div className="space-y-2">
                                <p className="text-white/90 font-bold">No strategies deployed.</p>
                                <p className="text-sm text-white/70 max-w-xs">Initialize your first AI career roadmap using the generator tool above.</p>
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
                                <Card className="group bg-white/[0.01] border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/[0.02] transition-all duration-500 rounded-lg overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl">
                                    <div className="p-4 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold  text-indigo-400/50">Active Node</p>
                                                <h3 className="text-sm font-semibold text-white   truncate max-w-[180px]">{roadmap.careerTitle}</h3>
                                            </div>
                                            <button 
                                                onClick={(e) => handleDelete(roadmap._id, e)} className="p-2 text-white/70 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all shadow-xl"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-white/70 line-clamp-2 leading-relaxed font-medium italic">
                                            &ldquo;{roadmap.careerSummary}&rdquo;
                                        </p>
                                        <Link href={`/dashboard/roadmap/${roadmap._id}`} className="block">
                                            <Button variant="outline" className="w-full h-8 font-semibold   text-xs rounded-md border-white/5 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-xl">
                                                SYNC NODE
                                                <ChevronRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* --- TACTICAL NETWORKING --- */}
            <MarqueeCards title="Tactical Networking" subtitle="Master Your Professional Presence"
                icon={Users} iconColor="text-blue-400"
                items={[
                    { name: 'LinkedIn', description: 'The professional gold standard. Network with recruiters and showcase your career growth.', icon: Linkedin, label: 'Network', href: 'https://linkedin.com', gradient: 'from-blue-600 to-blue-800' },
                    { name: 'GitHub', description: 'Host your code, contribute to open source, and build your developer identity.', icon: Github, label: 'Portfolio', href: 'https://github.com', gradient: 'from-slate-700 to-slate-900' },
                    { name: 'Polywork', description: 'Showcase what you do and who you work with. The next generation of professional profiles.', icon: Globe, label: 'Modern CV', href: 'https://polywork.com', gradient: 'from-purple-500 to-indigo-700' },
                    { name: 'Discord', description: 'Connect with peers in real-time. Join communities, share labs, and find study buddies.', icon: MessageSquare, label: 'Community', href: 'https://discord.com', gradient: 'from-indigo-500 to-indigo-700' },
                    { name: 'Twitter / X', description: 'Build your public presence and stay updated with industry trends in real-time.', icon: Globe, label: 'Visibility', href: 'https://twitter.com', gradient: 'from-sky-400 to-blue-600' },
                ]}
            />

            {/* --- ELITE KNOWLEDGE RESERVES --- */}
            <MarqueeCards title="Knowledge Reserves" subtitle="Access Free Elite Educational Resources"
                icon={GraduationCap} iconColor="text-orange-400"
                reverse={true}
                items={[
                    { name: 'Coursera', description: 'Free courses from top universities. Master data science, business, and tech skills.', icon: School, label: 'University', href: 'https://coursera.org', gradient: 'from-blue-500 to-indigo-600' },
                    { name: 'edX', description: 'Open university courses from Harvard, MIT, and more. Highly academic focus.', icon: School, label: 'Academic', href: 'https://edx.org', gradient: 'from-red-500 to-rose-700' },
                    { name: 'FreeCodeCamp', description: 'The gold standard for free coding education. Learn by building real projects.', icon: Code, label: 'Coding', href: 'https://freecodecamp.org', gradient: 'from-emerald-500 to-teal-700' },
                    { name: 'Roadmap.sh', description: 'Community-driven career paths and guides. Visualize what you need to learn.', icon: Compass, label: 'Roadmaps', href: 'https://roadmap.sh', gradient: 'from-orange-500 to-amber-600' },
                    { name: 'MIT OCW', description: 'Full course materials from MIT. The ultimate open knowledge repository.', icon: School, label: 'Research', href: 'https://ocw.mit.edu', gradient: 'from-slate-600 to-slate-800' },
                ]}
            />

        </div>
    )
}
