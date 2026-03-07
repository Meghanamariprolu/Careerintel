"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import {
    Compass, FileText, Loader2, ArrowRight, Trash2,
    TrendingUp, Route, Layout, FileUser, Gamepad2,
    UserRoundCog, Brain, Star, Combine, BarChart3, Bot,
    Sparkles,
    Code, GraduationCap, BookOpen, School,
    Linkedin, Github, MessageSquare, Users,
    Globe
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useUserProfile } from "@/context/UserProfileContext"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

const careerTools = [
    { name: "Market Integration", slug: "market-integration", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Learning Routes", href: "/learning-route", icon: Route, color: "text-green-400", bg: "bg-green-400/10" },
    { name: "Portfolio Builder", href: "/portfolio-builder", icon: Layout, color: "text-purple-400", bg: "bg-purple-400/10" },
    { name: "Resume Enhancer", slug: "resume-enhancer", icon: FileUser, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { name: "Scenario Simulator", slug: "scenario-simulator", icon: Gamepad2, color: "text-red-400", bg: "bg-red-400/10" },
    { name: "AI Coaching", href: "/dashboard/tools/coaching", icon: UserRoundCog, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { name: "Behavioral Mapping", href: "/dashboard/tools/behavioral-mapping", icon: Brain, color: "text-pink-400", bg: "bg-pink-400/10" },
    { name: "Quality Scoring", href: "/dashboard/tools/quality-scoring", icon: Star, color: "text-orange-400", bg: "bg-orange-400/10" },
    { name: "Skill Transfer", href: "/dashboard/tools/skill-transfer", icon: Combine, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { name: "Outcome Tracking", href: "/dashboard/tools/outcome-tracking", icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Mentor Personas", href: "/dashboard/tools/mentor-personas", icon: Bot, color: "text-violet-400", bg: "bg-violet-400/10" },
    { name: "Career Intelligence Report", href: "/dashboard/report", icon: FileText, color: "text-indigo-400", bg: "bg-indigo-400/10" },
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="text-lg md:text-2xl  tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-deep-purple drop-shadow-sm mb-2"
                >
                    Dashboard
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-sm md:text-lg text-muted-foreground "
                >
                    Welcome back, {user?.name}. Here are your career intelligence insights.
                </motion.p>
            </div>

            {/* Career Readiness Progress Bar */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
                <Card className="bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-colors duration-1000" />
                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="flex-1 w-full space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base md:text-lg  text-white uppercase tracking-widest flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-indigo-400" /> Global Career Readiness
                                </h3>
                                <span className="text-xl md:text-3xl  text-indigo-400">{profile?.analytics?.careerReadiness || 0}%</span>
                            </div>
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${profile?.analytics?.careerReadiness || 0}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                />
                            </div>
                            <p className="text-xs md:text-sm text-white/50 ">
                                Complete intelligence modules to build your profile and increase your market viability.
                            </p>
                        </div>

                        <Link href="/dashboard/analytics">
                            <Button className="w-full md:w-auto shrink-0 bg-white text-slate-950  uppercase tracking-widest text-xs py-6 px-8 rounded-xl hover:bg-indigo-50 border border-white/20 shadow-xl transition-all hover:scale-105 hover:shadow-indigo-500/20">
                                View Full Analytics
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Feature Hub */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.05
                        }
                    }
                }}
                className="space-y-4"
            >
                <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-base md:text-xl  tracking-tight text-white">AI Career Intelligence Hub</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {careerTools.map((tool) => (
                        <motion.div key={tool.name} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <Link href={tool.href || `/dashboard/tools/${tool.slug}`}>
                                <Button
                                    variant="outline"
                                    className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-slate-900/40 border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                                >
                                    <div className={`p-2 rounded-xl ${tool.bg} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                        <tool.icon className={`h-5 w-5 ${tool.color}`} />
                                    </div>
                                    <span className="text-[10px] text-center line-clamp-1">{tool.name}</span>
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <Link href="/dashboard/generate">
                            <Button
                                variant="outline"
                                className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-indigo-600/10 border-indigo-500/20 hover:bg-indigo-600/20 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                            >
                                <div className="p-2 rounded-xl bg-indigo-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                    <Compass className="h-5 w-5 text-indigo-400" />
                                </div>
                                <span className="text-[10px] text-center text-indigo-400">Generate New</span>
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-neon-cyan/10 via-deep-purple/10 to-neon-cyan/5 border-neon-cyan/20 shadow-[0_0_15px_rgba(0,243,255,0.05)] overflow-hidden group">
                    <CardHeader className="p-6 relative z-10">
                        <CardTitle className="text-base md:text-xl tracking-tight text-white">AI Career Intelligence</CardTitle>
                        <CardDescription className="text-sm md:text-lg text-white/40  mt-1">
                            Generate a highly personalized roadmap tailored to your skills and goals.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center py-6 relative z-10">
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                            <Compass className="h-20 w-20 text-neon-cyan opacity-80 drop-shadow-[0_0_15px_rgba(0,243,255,0.4)] group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    </CardContent>
                    <CardFooter className="relative z-10">
                        <Link href="/dashboard/generate" className="w-full">
                            <Button className="w-full bg-deep-purple hover:bg-deep-purple/80 text-white shadow-[0_0_20px_rgba(112,0,255,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(112,0,255,0.6)]">
                                Generate New Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-deep-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </Card>

                {isLoading ? (
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : roadmaps.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 md:col-span-2 lg:col-span-2 h-full">
                        <Card className="h-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-slate-900/40 border-white/5 backdrop-blur-md">
                            <FileText className="h-12 w-12 mb-4 opacity-50" />
                            <p>You haven't generated any roadmaps yet.</p>
                            <p className="text-sm">Click "Generate New Roadmap" to get started.</p>
                        </Card>
                    </motion.div>
                ) : (
                    roadmaps.map((roadmap, idx) => (
                        <motion.div
                            key={roadmap._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx, duration: 0.5 }}
                        >
                            <Card className="group hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] transition-all duration-500 relative bg-slate-900/40 backdrop-blur-md h-full flex flex-col overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className="absolute top-4 right-4 z-10">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDelete(roadmap._id, e);
                                        }}
                                        title="Delete Roadmap"
                                    >
                                        <Trash2 className="h-4 w-4 pointer-events-none" />
                                    </Button>
                                </div>
                                <CardHeader className="p-5 relative z-10">
                                    <CardTitle className="text-base md:text-xl tracking-tight text-white pr-8 truncate group-hover:text-neon-cyan transition-colors duration-300">{roadmap.careerTitle}</CardTitle>
                                    <CardDescription className="text-xs md:text-base text-white/40  mt-1 line-clamp-2">{roadmap.careerSummary}</CardDescription>
                                </CardHeader>
                                <CardFooter className="p-6 pt-0 mt-auto relative z-10">
                                    <Link href={`/dashboard/roadmap/${roadmap._id}`} className="w-full">
                                        <Button variant="outline" className="w-full py-4 border-white/10 group-hover:border-neon-cyan/50 group-hover:bg-neon-cyan group-hover:text-black transition-all duration-500 uppercase tracking-widest text-xs">
                                            View Roadmap <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
            <div className="pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base md:text-xl  tracking-tight text-white">Best Free Learning Platforms</h2>
                        <p className="text-sm md:text-lg text-white/40  mt-1">
                            Curated resources to help you master new skills without spending a dime.
                        </p>
                    </div>
                </div>

                <div className="relative overflow-hidden w-full group/marquee py-4">
                    <motion.div
                        className="flex gap-4 w-max"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{
                            ease: "linear",
                            duration: 30,
                            repeat: Infinity,
                        }}
                        style={{ display: "flex", width: "max-content" }}
                    >
                        {/* Double the array for seamless looping */}
                        {[...platforms, ...platforms].map((platform, idx) => (
                            <div key={`${platform.name}-${idx}`} className="w-[300px] flex-shrink-0">
                                <Card className="h-full hover:border-indigo-500/50 transition-colors group bg-slate-900/60 backdrop-blur-xl border-white/5 overflow-hidden">
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-base md:text-xl  tracking-tight text-white mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg bg-white/5 ${platform.color}`}>
                                                    <platform.icon className="h-4 w-4" />
                                                </div>
                                                {platform.name}
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-xs md:text-base text-white/40  line-clamp-2">
                                            {platform.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 mt-auto">
                                        <Link
                                            href={platform.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs  text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group/link"
                                        >
                                            Explore Courses
                                            <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base md:text-xl  tracking-tight text-white">Community & Networking Suggestions</h2>
                        <p className="text-sm md:text-lg text-white/40  mt-1">
                            Connect with professionals and peers to accelerate your career growth.
                        </p>
                    </div>
                </div>

                <div className="relative overflow-hidden w-full group/marquee py-4">
                    <motion.div
                        className="flex gap-4 w-max"
                        animate={{ x: ["-50%", "0%"] }} // Scroll other way for visual interest
                        transition={{
                            ease: "linear",
                            duration: 35,
                            repeat: Infinity,
                        }}
                        style={{ display: "flex", width: "max-content" }}
                    >
                        {/* Double array for seamless looping */}
                        {[...suggestions, ...suggestions].map((suggestion, idx) => (
                            <div key={`${suggestion.name}-${idx}`} className="w-[300px] flex-shrink-0">
                                <Card className="h-full hover:border-purple-500/50 transition-colors group bg-slate-900/60 backdrop-blur-xl border-white/5 overflow-hidden">
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-base md:text-xl  tracking-tight text-white mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg bg-white/5 ${suggestion.color}`}>
                                                    <suggestion.icon className="h-4 w-4" />
                                                </div>
                                                {suggestion.name}
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-xs md:text-base text-white/40  line-clamp-2">
                                            {suggestion.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 mt-auto">
                                        <Link
                                            href={suggestion.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs  text-purple-400 hover:text-purple-300 flex items-center gap-1 group/link"
                                        >
                                            Visit Platform
                                            <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

const platforms = [
    {
        name: "freeCodeCamp",
        description: "Learn to code for free. Build projects. Earn certifications.",
        url: "https://www.freecodecamp.org",
        icon: Code,
        color: "text-green-400"
    },
    {
        name: "Harvard CS50",
        description: "Introduction to the intellectual enterprises of computer science and the art of programming.",
        url: "https://pll.harvard.edu/course/cs50-introduction-computer-science",
        icon: GraduationCap,
        color: "text-red-400"
    },
    {
        name: "Coursera Free",
        description: "Access world-class education from top universities and companies.",
        url: "https://www.coursera.org/courses?query=free",
        icon: BookOpen,
        color: "text-blue-400"
    },
    {
        name: "edX Free Courses",
        description: "High-quality courses from the world's best institutions.",
        url: "https://www.edx.org/search?q=free",
        icon: School,
        color: "text-indigo-400"
    }
];

const suggestions = [
    {
        name: "LinkedIn",
        description: "Build your professional brand and network with industry leaders.",
        url: "https://www.linkedin.com",
        icon: Linkedin,
        color: "text-blue-500"
    },
    {
        name: "Discord Communities",
        description: "Join tech-focused servers for real-time collaboration and networking.",
        url: "https://discord.com",
        icon: MessageSquare,
        color: "text-indigo-500"
    },
    {
        name: "GitHub",
        description: "Collaborate on open-source projects and showcase your code.",
        url: "https://github.com",
        icon: Github,
        color: "text-slate-200"
    },
    {
        name: "Meetup",
        description: "Find local tech events and groups to connect in person.",
        url: "https://www.meetup.com",
        icon: Users,
        color: "text-red-500"
    }
];
