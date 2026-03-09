"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Briefcase, MapPin, DollarSign, ExternalLink, ArrowLeft, Building2, CheckCircle2, Circle, TrendingUp, BarChart, Plus, Target, Info, Target as TargetIcon } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { NextModulePrompter } from "@/components/NextModulePrompter"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"

// --- Utilities ---
const normalizeSkill = (skill) => {
    return skill.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// --- Mock Data ---
const MOCK_JOBS = [
    {
        id: "job-1",
        title: "Senior Frontend Developer",
        company: "TechNova Solutions",
        location: "Remote",
        type: "Full-time",
        salary: "$120k - $150k",
        postedAt: "2 days ago",
        description: "Looking for an experienced Frontend Developer to lead our core product team. Must have strong expertise in React, Next.js, and modern CSS frameworks.",
        requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
        demandTrend: "🔥 Very High",
        salaryPercentile: "Top 20%",
        url: "#"
    },
    {
        id: "job-2",
        title: "Full Stack Engineer",
        company: "Innovate AI",
        location: "San Francisco, CA (Hybrid)",
        type: "Full-time",
        salary: "$140k - $180k",
        postedAt: "5 hours ago",
        description: "Join our fast-growing startup to build scalable AI-driven applications. You will work across the entire stack.",
        requiredSkills: ["Node.js", "React JS", "MongoDB", "Express", "Docker"],
        demandTrend: "📈 High",
        salaryPercentile: "Top 10%",
        url: "#"
    },
    {
        id: "job-3",
        title: "Data Scientist",
        company: "Global Analytics Corp",
        location: "New York, NY",
        type: "Full-time",
        salary: "$130k - $160k",
        postedAt: "1 week ago",
        description: "We are seeking a Data Scientist to analyze large datasets and build predictive models for our enterprise clients.",
        requiredSkills: ["Python", "Machine Learning", "SQL", "Pandas", "TensorFlow"],
        demandTrend: "🔥 Very High",
        salaryPercentile: "Top 15%",
        url: "#"
    },
    {
        id: "job-4",
        title: "Junior Web Developer",
        company: "Creative Digital Agency",
        location: "Remote",
        type: "Contract",
        salary: "$60k - $80k",
        postedAt: "3 days ago",
        description: "Great opportunity for a junior developer to build and maintain websites for various clients.",
        requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
        demandTrend: "Stable",
        salaryPercentile: "Market Average",
        url: "#"
    },
    {
        id: "job-5",
        title: "Backend Specialist",
        company: "SecureFinTech",
        location: "London, UK (On-site)",
        type: "Full-time",
        salary: "£80k - £110k",
        postedAt: "Just now",
        description: "Build robust and secure backend services for our next-generation financial platform.",
        requiredSkills: ["Java", "Spring Boot", "PostgreSQL", "Microservices", "AWS"],
        demandTrend: "📈 High",
        salaryPercentile: "Top 25%",
        url: "#"
    },
    {
        id: "job-6",
        title: "UI/UX Designer",
        company: "Designers Hub",
        location: "Remote",
        type: "Freelance",
        salary: "$50/hr - $80/hr",
        postedAt: "4 days ago",
        description: "Seeking a talented UI/UX designer to revamp our core web application interface.",
        requiredSkills: ["Figma", "UI Design", "User Research", "Prototyping"],
        demandTrend: "Stable",
        salaryPercentile: "Market Average",
        url: "#"
    }
]

export default function MarketIntegrationPage() {
    const { user } = useAuth()
    const [jobs, setJobs] = useState(MOCK_JOBS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterLocation, setFilterLocation] = useState("All")
    const [userMasteredSkills, setUserMasteredSkills] = useState([])

    // Load user skills from localStorage (from roadmaps)
    useEffect(() => {
        loadUserSkills()
    }, [user?.id])

    const loadUserSkills = () => {
        try {
            const allRoadmaps = JSON.parse(localStorage.getItem('careerintel_roadmaps') || '[]')
            const myRoadmaps = allRoadmaps.filter(r => r.userId === user?.id)

            // Gather all userSkills from all roadmaps into a unique Set
            const allSkills = new Set()
            myRoadmaps.forEach(r => {
                if (r.userSkills && Array.isArray(r.userSkills)) {
                    r.userSkills.forEach(skill => allSkills.add(normalizeSkill(skill)))
                }
            })
            setUserMasteredSkills(Array.from(allSkills))
        } catch (error) {
            console.error("Error loading user skills:", error)
        }
    }

    // Calculate exact percentage overlap using normalized skills
    const calculateMatch = (jobSkills) => {
        if (userMasteredSkills.length === 0 || jobSkills.length === 0) return { score: 0, matched: [], missing: jobSkills }

        const matched = []
        const missing = []

        jobSkills.forEach(skill => {
            const normalized = normalizeSkill(skill)
            if (userMasteredSkills.includes(normalized)) {
                matched.push(skill)
            } else {
                missing.push(skill)
            }
        })

        const score = Math.round((matched.length / jobSkills.length) * 100)
        return { score, matched, missing }
    }

    // Filter and Sort jobs
    useEffect(() => {
        let filtered = MOCK_JOBS

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.company.toLowerCase().includes(query) ||
                job.requiredSkills.some(skill => skill.toLowerCase().includes(query))
            )
        }

        if (filterLocation !== "All") {
            if (filterLocation === "Remote") {
                filtered = filtered.filter(job => job.location.includes("Remote"))
            } else if (filterLocation === "On-site") {
                filtered = filtered.filter(job => !job.location.includes("Remote") && !job.location.includes("Hybrid"))
            } else if (filterLocation === "Hybrid") {
                filtered = filtered.filter(job => job.location.includes("Hybrid"))
            }
        }

        // Rank Logic: Match % + High Demand Boost + Salary Boost
        const ranked = filtered.map(job => {
            const matchInfo = calculateMatch(job.requiredSkills)
            let rankScore = matchInfo.score

            // Add subtle boosts to rank score for better career progression suggestions
            if (job.demandTrend.includes("🔥")) rankScore += 10
            else if (job.demandTrend.includes("📈")) rankScore += 5

            if (job.salaryPercentile.includes("Top 10%")) rankScore += 8
            else if (job.salaryPercentile.includes("Top 20%")) rankScore += 5

            return { ...job, matchInfo, rankScore }
        }).sort((a, b) => b.rankScore - a.rankScore)

        setJobs(ranked)
    }, [searchQuery, filterLocation, userMasteredSkills])

    const handleAddToRoadmap = (skillName) => {
        // Simulation of adding to an active roadmap
        try {
            const allRoadmaps = JSON.parse(localStorage.getItem('careerintel_roadmaps') || '[]')
            const myRoadmaps = allRoadmaps.filter(r => r.userId === user?.id)

            if (myRoadmaps.length > 0) {
                // Add to the first active roadmap for simulation
                const activeRoadmap = myRoadmaps[0]
                if (!activeRoadmap.userSkills) activeRoadmap.userSkills = []

                // Only add if not already present (normalized check)
                const isAlreadyPresent = activeRoadmap.userSkills.some(s => normalizeSkill(s) === normalizeSkill(skillName))
                if (!isAlreadyPresent) {
                    activeRoadmap.userSkills.push(skillName)

                    // Save back
                    const updatedRoadmaps = allRoadmaps.map(r => r.id === activeRoadmap.id ? activeRoadmap : r)
                    localStorage.setItem('careerintel_roadmaps', JSON.stringify(updatedRoadmaps))

                    // Refresh skills state
                    loadUserSkills()
                }
            } else {
                // If no roadmaps exist, just mock saving to local state to demonstrate UI feedback immediately
                setUserMasteredSkills(prev => [...prev, normalizeSkill(skillName)])
            }
        } catch (error) {
            console.error(error)
        }
    }



    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4 mr-1" /> Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl  tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Live Market Integration
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Discover real-time job opportunities perfectly matched to the skills you've mastered in your roadmaps.
                    </p>
                </div>

                {/* Stats Summary */}
                <div className="flex gap-4">
                    <div className="bg-slate-900/50 border border-white/5 rounded-lg p-3 px-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Your Mastered Skills</p>
                        <p className="text-xl  text-indigo-400">{userMasteredSkills.length}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-white/5 rounded-lg p-3 px-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Jobs Found</p>
                        <p className="text-xl  text-blue-400">{jobs.length}</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <Card className="bg-slate-900/40 border-white/5 backdrop-blur-sm">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by job title, company, or skill..."
                            className="pl-9 bg-background/50 border-white/10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {["All", "Remote", "Hybrid", "On-site"].map((filter) => (
                            <Button
                                key={filter}
                                variant={filterLocation === filter ? "default" : "outline"}
                                className={`
                                    ${filterLocation === filter ? "bg-blue-600 hover:bg-blue-700" : "bg-background/50 border-white/10 hover:bg-background/80"}
                                `}
                                onClick={() => setFilterLocation(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Job Listings Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.length > 0 ? jobs.map((job, index) => {
                    const { score: matchScore, matched: matchedSkills, missing: missingSkills } = job.matchInfo || calculateMatch(job.requiredSkills)

                    // Determine match color
                    let matchColor = "text-muted-foreground"
                    let matchBadgeBg = "bg-slate-800"
                    if (matchScore >= 80) { matchColor = "text-green-400"; matchBadgeBg = "bg-green-500/20 border-green-500/30 text-green-300" }
                    else if (matchScore >= 40) { matchColor = "text-yellow-400"; matchBadgeBg = "bg-yellow-500/20 border-yellow-500/30 text-yellow-300" }
                    else if (matchScore > 0) { matchColor = "text-blue-400"; matchBadgeBg = "bg-blue-500/20 border-blue-500/30 text-blue-300" }

                    return (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card
                                className="h-full flex flex-col hover:border-blue-500/50 transition-all group bg-slate-900/60 border-white/5 relative overflow-hidden"
                            >
                                <CardHeader className="p-5 pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                                            <Building2 className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="flex flex-col items-end relative group/score cursor-help">
                                            {/* Match Score Badge */}
                                            <div className={`px-2 py-1 rounded text-xs  border ${matchBadgeBg} flex items-center gap-1 shadow-sm`}>
                                                <TargetIcon className="h-3 w-3" />
                                                {matchScore}% Match
                                            </div>
                                            {/* Score Explanation Tooltip */}
                                            <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-slate-800 text-[10px] text-slate-300 rounded shadow-lg border border-white/10 opacity-0 group-hover/score:opacity-100 transition-opacity z-10 pointer-events-none text-right">
                                                You have {matchedSkills.length} out of {job.requiredSkills.length} required skills matched.
                                            </div>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg leading-tight group-hover:text-blue-300 transition-colors">
                                        {job.title}
                                    </CardTitle>
                                    <p className="text-sm  text-muted-foreground">{job.company}</p>
                                </CardHeader>

                                <CardContent className="p-5 pt-0 flex-grow space-y-4">
                                    <div className="space-y-2 text-sm text-slate-300 bg-black/20 p-3 rounded-md border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span className="truncate">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-orange-400 shrink-0" />
                                            <span className="text-orange-200">{job.demandTrend} Trend</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-green-400 shrink-0" />
                                            <span className="text-green-200">{job.salary} <span className="text-muted-foreground text-xs ml-1">({job.salaryPercentile})</span></span>
                                        </div>
                                    </div>

                                    {/* Actionable Skill Gap Analysis */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px]  text-muted-foreground uppercase tracking-wider">Skill Gap Analysis</p>
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Info className="h-3 w-3" /> Click '+' to add to roadmap</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {/* Matched Skills */}
                                            {matchedSkills.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {matchedSkills.map(skill => (
                                                        <span key={skill} className="text-xs px-2 py-1 rounded-md border bg-green-500/10 border-green-500/30 text-green-300 flex items-center gap-1">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {/* Missing Skills */}
                                            {missingSkills.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                    {missingSkills.map(skill => (
                                                        <button
                                                            key={skill}
                                                            onClick={(e) => { e.preventDefault(); handleAddToRoadmap(skill); }}
                                                            className="text-xs px-2 py-1 rounded-md border bg-slate-800/80 border-rose-500/20 text-slate-400 flex items-center gap-1 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/30 transition-all group/btn"
                                                            title={`Add ${skill} to your roadmap`}
                                                        >
                                                            <Plus className="h-3 w-3 group-hover/btn:scale-110 transition-transform" />
                                                            {skill}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-5 pt-0 mt-auto flex flex-col gap-3">
                                    <div className="w-full flex items-center justify-between border-t border-white/5 pt-4">
                                        <span className="text-xs text-muted-foreground">{job.postedAt}</span>
                                        <Link href={job.url}>
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1.5 text-white shadow-lg shadow-blue-900/20">
                                                Apply <ExternalLink className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )
                }) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-flex items-center justify-center p-4 bg-slate-900/50 rounded-full mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg ">No jobs found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                        <Button
                            variant="link"
                            className="text-blue-400 mt-2"
                            onClick={() => { setSearchQuery(""); setFilterLocation("All") }}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>

            <NextModulePrompter
                nextModuleName="Behavioral Mapping"
                nextModuleHref="/dashboard/tools/behavioral-mapping"
                description="Understand your working style and cognitive behaviors to align with the market integrations you just explored."
            />
        </div>
    )
}
