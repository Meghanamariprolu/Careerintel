"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    Compass, FileText, Loader2, ArrowRight, Trash2,
    TrendingUp, Route, Layout, FileUser, Gamepad2,
    UserRoundCog, Brain, Star, Combine, BarChart3, Bot,
    Sparkles
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

const careerTools = [
    { name: "Market Integration", slug: "market-integration", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Learning Routes", slug: "personalized-learning", icon: Route, color: "text-green-400", bg: "bg-green-400/10" },
    { name: "Portfolio Builder", slug: "portfolio-builder", icon: Layout, color: "text-purple-400", bg: "bg-purple-400/10" },
    { name: "Resume Enhancer", slug: "resume-enhancer", icon: FileUser, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { name: "Scenario Simulator", slug: "scenario-simulator", icon: Gamepad2, color: "text-red-400", bg: "bg-red-400/10" },
    { name: "AI Coaching", slug: "coaching", icon: UserRoundCog, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { name: "Behavioral Mapping", slug: "behavioral-mapping", icon: Brain, color: "text-pink-400", bg: "bg-pink-400/10" },
    { name: "Quality Scoring", slug: "quality-scoring", icon: Star, color: "text-orange-400", bg: "bg-orange-400/10" },
    { name: "Skill Transfer", slug: "skill-transfer", icon: Combine, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { name: "Outcome Tracking", slug: "outcome-tracking", icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Mentor Personas", slug: "mentor-personas", icon: Bot, color: "text-violet-400", bg: "bg-violet-400/10" },
]

export default function DashboardPage() {
    const { user } = useAuth()

    const [roadmaps, setRoadmaps] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        function fetchRoadmaps() {
            try {
                const savedRoadmaps = JSON.parse(localStorage.getItem('careerintel_roadmaps') || '[]');
                // Filter roadmaps belonging to the current user (if user is logged in)
                const userRoadmaps = savedRoadmaps.filter(r => r.userId === user?.id);
                setRoadmaps(userRoadmaps);
            } catch (error) {
                console.error("Error fetching roadmaps", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (user?.id) {
            fetchRoadmaps();
        } else {
            setIsLoading(false);
        }
    }, [user?.id]);

    const handleDelete = (id, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!confirm("Are you sure you want to delete this roadmap?")) return;

        try {
            const allRoadmaps = JSON.parse(localStorage.getItem('careerintel_roadmaps') || '[]');
            const updatedRoadmaps = allRoadmaps.filter(r => r._id !== id);
            localStorage.setItem('careerintel_roadmaps', JSON.stringify(updatedRoadmaps));

            setRoadmaps((prevRoadmaps) => prevRoadmaps.filter((r) => r._id !== id));
        } catch (error) {
            console.error("Error deleting roadmap:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-deep-purple drop-shadow-sm">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back, {user?.name}. Here are your career intelligence insights.
                </p>
            </div>

            {/* Feature Hub */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-xl font-semibold tracking-tight">AI Career Intelligence Hub</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {careerTools.map((tool) => (
                        <Link key={tool.slug} href={`/dashboard/tools/${tool.slug}`}>
                            <Button
                                variant="outline"
                                className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-slate-900/40 border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-300 group"
                            >
                                <div className={`p-2 rounded-xl ${tool.bg} group-hover:scale-110 transition-transform`}>
                                    <tool.icon className={`h-5 w-5 ${tool.color}`} />
                                </div>
                                <span className="text-[10px] font-medium text-center line-clamp-1">{tool.name}</span>
                            </Button>
                        </Link>
                    ))}
                    <Link href="/dashboard/generate">
                        <Button
                            variant="outline"
                            className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-indigo-600/10 border-indigo-500/20 hover:bg-indigo-600/20 transition-all duration-300 group"
                        >
                            <div className="p-2 rounded-xl bg-indigo-500/20 group-hover:scale-110 transition-transform">
                                <Compass className="h-5 w-5 text-indigo-400" />
                            </div>
                            <span className="text-[10px] font-bold text-center text-indigo-400">Generate New</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-neon-cyan/10 via-deep-purple/10 to-neon-cyan/5 border-neon-cyan/20 shadow-[0_0_15px_rgba(0,243,255,0.05)]">
                    <CardHeader>
                        <CardTitle>AI Career Intelligence</CardTitle>
                        <CardDescription>Generate a highly personalized roadmap tailored to your skills and goals.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center py-6">
                        <Compass className="h-20 w-20 text-neon-cyan opacity-80 drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]" />
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/generate" className="w-full">
                            <Button className="w-full bg-deep-purple hover:bg-deep-purple/80 text-white shadow-[0_0_20px_rgba(112,0,255,0.3)] transition-all duration-300">
                                Generate New Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                {isLoading ? (
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : roadmaps.length === 0 ? (
                    <Card className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mb-4 opacity-50" />
                        <p>You haven't generated any roadmaps yet.</p>
                        <p className="text-sm">Click "Generate New Roadmap" to get started.</p>
                    </Card>
                ) : (
                    roadmaps.map((roadmap) => (
                        <Card key={roadmap._id} className="group hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all duration-300 relative bg-slate-900/40 backdrop-blur-md">
                            <div className="absolute top-4 right-4 z-10">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
                            <CardHeader>
                                <CardTitle className="truncate pr-8">{roadmap.careerTitle}</CardTitle>
                                <CardDescription className="line-clamp-2">{roadmap.careerSummary}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Link href={`/dashboard/roadmap/${roadmap._id}`} className="w-full">
                                    <Button variant="outline" className="w-full border-neon-cyan/30 group-hover:bg-neon-cyan group-hover:text-black transition-all duration-500 font-bold">
                                        View Roadmap
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
            <div className="pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Best Free Learning Platforms</h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Curated resources to help you master new skills without spending a dime.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            name: "freeCodeCamp",
                            description: "Learn to code for free. Build projects. Earn certifications.",
                            url: "https://www.freecodecamp.org",
                            icon: "Code"
                        },
                        {
                            name: "Harvard CS50",
                            description: "Introduction to the intellectual enterprises of computer science and the art of programming.",
                            url: "https://pll.harvard.edu/course/cs50-introduction-computer-science",
                            icon: "GraduationCap"
                        },
                        {
                            name: "Coursera Free",
                            description: "Access world-class education from top universities and companies.",
                            url: "https://www.coursera.org/courses?query=free",
                            icon: "BookOpen"
                        },
                        {
                            name: "edX Free Courses",
                            description: "High-quality courses from the world's best institutions.",
                            url: "https://www.edx.org/search?q=free",
                            icon: "University"
                        }
                    ].map((platform) => (
                        <Card key={platform.name} className="hover:border-indigo-500/50 transition-all group bg-slate-900/40">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-lg flex items-center justify-between">
                                    {platform.name}
                                    <Link href={platform.url} target="_blank" rel="noopener noreferrer">
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {platform.description}
                                </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Link
                                    href={platform.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                >
                                    Explore Courses
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Community & Networking Suggestions</h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Connect with professionals and peers to accelerate your career growth.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            name: "LinkedIn",
                            description: "Build your professional brand and network with industry leaders.",
                            url: "https://www.linkedin.com",
                            icon: "Linkedin"
                        },
                        {
                            name: "Discord Communities",
                            description: "Join tech-focused servers for real-time collaboration and networking.",
                            url: "https://discord.com",
                            icon: "MessageSquare"
                        },
                        {
                            name: "GitHub",
                            description: "Collaborate on open-source projects and showcase your code.",
                            url: "https://github.com",
                            icon: "Github"
                        },
                        {
                            name: "Meetup",
                            description: "Find local tech events and groups to connect in person.",
                            url: "https://www.meetup.com",
                            icon: "Users"
                        }
                    ].map((suggestion) => (
                        <Card key={suggestion.name} className="hover:border-purple-500/50 transition-all group bg-slate-900/40">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-lg flex items-center justify-between">
                                    {suggestion.name}
                                    <Link href={suggestion.url} target="_blank" rel="noopener noreferrer">
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {suggestion.description}
                                </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Link
                                    href={suggestion.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                >
                                    Visit Platform
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
