"use client"

import { useState, useEffect } from"react"
import { motion, AnimatePresence } from"framer-motion"
import { Search, Filter, Briefcase, MapPin, DollarSign, ExternalLink, ArrowLeft, Building2, CheckCircle2, Circle, TrendingUp, BarChart, Plus, Target, Info, Target as TargetIcon } from"lucide-react"
import Link from"next/link"
import { useAuth } from"@/context/AuthContext"
import { NextModulePrompter } from"@/components/NextModulePrompter"

import { Button } from"@/components/ui/Button"
import { Input } from"@/components/ui/Input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from"@/components/ui/Card"

// --- Utilities ---
const normalizeSkill = (skill) => {
    return skill.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// --- Mock Data ---
const MOCK_JOBS = [
    {
        id:"job-1",
        title:"Senior Frontend Developer",
        company:"TechNova Solutions",
        location:"Remote",
        type:"Full-time",
        salary:"$120k - $150k",
        postedAt:"2 days ago",
        description:"Looking for an experienced Frontend Developer to lead our core product team. Must have strong expertise in React, Next.js, and modern CSS frameworks.",
        requiredSkills: ["React","Next.js","TypeScript","Tailwind CSS","Redux"],
        demandTrend:"🔥 Very High",
        salaryPercentile:"Top 20%",
        url:"#"
    },
    {
        id:"job-2",
        title:"Full Stack Engineer",
        company:"Innovate AI",
        location:"San Francisco, CA (Hybrid)",
        type:"Full-time",
        salary:"$140k - $180k",
        postedAt:"5 hours ago",
        description:"Join our fast-growing startup to build scalable AI-driven applications. You will work across the entire stack.",
        requiredSkills: ["Node.js","React JS","MongoDB","Express","Docker"],
        demandTrend:"📈 High",
        salaryPercentile:"Top 10%",
        url:"#"
    },
    {
        id:"job-3",
        title:"Data Scientist",
        company:"Global Analytics Corp",
        location:"New York, NY",
        type:"Full-time",
        salary:"$130k - $160k",
        postedAt:"1 week ago",
        description:"We are seeking a Data Scientist to analyze large datasets and build predictive models for our enterprise clients.",
        requiredSkills: ["Python","Machine Learning","SQL","Pandas","TensorFlow"],
        demandTrend:"🔥 Very High",
        salaryPercentile:"Top 15%",
        url:"#"
    },
    {
        id:"job-4",
        title:"Junior Web Developer",
        company:"Creative Digital Agency",
        location:"Remote",
        type:"Contract",
        salary:"$60k - $80k",
        postedAt:"3 days ago",
        description:"Great opportunity for a junior developer to build and maintain websites for various clients.",
        requiredSkills: ["HTML","CSS","JavaScript","React"],
        demandTrend:"Stable",
        salaryPercentile:"Market Average",
        url:"#"
    },
    {
        id:"job-5",
        title:"Backend Specialist",
        company:"SecureFinTech",
        location:"London, UK (On-site)",
        type:"Full-time",
        salary:"£80k - £110k",
        postedAt:"Just now",
        description:"Build robust and secure backend services for our next-generation financial platform.",
        requiredSkills: ["Java","Spring Boot","PostgreSQL","Microservices","AWS"],
        demandTrend:"📈 High",
        salaryPercentile:"Top 25%",
        url:"#"
    },
    {
        id:"job-6",
        title:"UI/UX Designer",
        company:"Designers Hub",
        location:"Remote",
        type:"Freelance",
        salary:"$50/hr - $80/hr",
        postedAt:"4 days ago",
        description:"Seeking a talented UI/UX designer to revamp our core web application interface.",
        requiredSkills: ["Figma","UI Design","User Research","Prototyping"],
        demandTrend:"Stable",
        salaryPercentile:"Market Average",
        url:"#"
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

        if (filterLocation !=="All") {
            if (filterLocation ==="Remote") {
                filtered = filtered.filter(job => job.location.includes("Remote"))
            } else if (filterLocation ==="On-site") {
                filtered = filtered.filter(job => !job.location.includes("Remote") && !job.location.includes("Hybrid"))
            } else if (filterLocation ==="Hybrid") {
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
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-16 relative">
            <header className="mb-6">
                <Link href="/dashboard">
                    <motion.button
                        whileHover={{ x: -10 }} className="flex items-center gap-2 text-white/70 hover:text-white text-xs  font-semibold  transition-colors mb-4 md:mb-6"
                    >
                        <ArrowLeft className="h-3 w-3" /> Command Center
                    </motion.button>
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2.5 text-sm  font-semibold  text-blue-400 shadow-xl"
                        >
                            <Target className="h-2.5 w-2.5" /> MARKET PULSE ENGINE
                        </motion.div>
                        <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-blue-400">
                            Market Pulse Node<span className="text-blue-500">.</span>
                        </h1>
                        <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                            Real-time job opportunities synchronized with your mastered skills.
                        </p>
                    </div>

                    {/* Stats Summary */}
                    <div className="flex gap-2">
                        <div className="bg-white/[0.01] border border-white/5 rounded-lg p-1.5 px-2.5 text-center shadow-xl backdrop-blur-3xl min-w-[70px]">
                            <p className="text-sm text-white/70 mb-0.5  font-semibold">Mastered</p>
                            <p className="text-xs font-semibold text-indigo-400/60 tabular-nums">{userMasteredSkills.length}</p>
                        </div>
                        <div className="bg-white/[0.01] border border-white/5 rounded-lg p-1.5 px-2.5 text-center shadow-xl backdrop-blur-3xl min-w-[70px]">
                            <p className="text-sm text-white/70 mb-0.5  font-semibold">Active Leads</p>
                            <p className="text-xs font-semibold text-blue-400/60 tabular-nums">{jobs.length}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search and Filters */}
            <Card className="bg-white/[0.01] border-white/5 backdrop-blur-3xl rounded-lg shadow-xl mb-3.5">
                <CardContent className="p-1.5 flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 text-white/90" />
                        <Input placeholder="Query job infrastructure..." className="pl-6 bg-black/40 border-white/5 text-xs h-6 rounded-lg placeholder:text-white/70 focus:ring-blue-500/10 font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-1 flex-wrap">
                        {["All","Remote","Hybrid","On-site"].map((filter) => (
                            <Button
                                key={filter}
                                variant={filterLocation === filter ?"default" :"outline"}
                                className={`
                                    h-6 px-2 text-sm font-semibold   rounded-lg border-white/5 transition-all
                                    ${filterLocation === filter ?"bg-blue-600/80 hover:bg-blue-600 text-white shadow-xl" :"bg-white/[0.01] text-white/70 hover:bg-white/5 hover:text-white"}
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.length > 0 ? jobs.map((job, index) => {
                    const { score: matchScore, matched: matchedSkills, missing: missingSkills } = job.matchInfo || calculateMatch(job.requiredSkills)

                    // Determine match color
                    let matchBadgeBg ="bg-slate-800"
                    if (matchScore >= 80) { matchBadgeBg ="bg-green-500/5 border-green-500/10 text-green-500/40" }
                    else if (matchScore >= 40) { matchBadgeBg ="bg-yellow-500/5 border-yellow-500/10 text-yellow-500/40" }
                    else if (matchScore > 0) { matchBadgeBg ="bg-blue-500/5 border-blue-500/10 text-blue-500/40" }

                    return (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col hover:border-blue-500/10 transition-all group bg-white/[0.01] border-white/5 relative overflow-hidden rounded-lg shadow-xl"
                            >
                                <CardHeader className="p-3 pb-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-1 bg-blue-500/5 rounded border border-blue-500/10 shrink-0">
                                            <Building2 className="h-2.5 w-2.5 text-blue-400" />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className={`px-1 py-0.5 rounded text-sm font-semibold   border ${matchBadgeBg} flex items-center gap-1`}>
                                                <TargetIcon className="h-2 w-2" />
                                                {matchScore}% SYNC
                                            </div>
                                        </div>
                                    </div>
                                    <CardTitle className="text-sm font-semibold leading-tight group-hover:text-blue-400 transition-colors  ">
                                        {job.title}
                                    </CardTitle>
                                    <p className="text-sm font-semibold text-white/70   mt-0.5">{job.company}</p>
                                </CardHeader>

                                <CardContent className="p-3 pt-0 flex-grow space-y-3">
                                    <div className="space-y-1 text-xs text-white/70 bg-white/[0.01] p-2 rounded border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-2.5 w-2.5 text-white/70 shrink-0" />
                                            <span className="truncate font-medium  ">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-2.5 w-2.5 text-orange-500/10 shrink-0" />
                                            <span className="text-orange-400 font-semibold">{job.demandTrend}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                                            <span className="text-emerald-400 font-semibold">{job.salary}</span>
                                        </div>
                                    </div>

                                    {/* Actionable Skill Gap Analysis */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-white/70">Protocol Sync Status</p>
                                        <div className="flex flex-col gap-1">
                                            {/* Matched Skills */}
                                            {matchedSkills.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {matchedSkills.map(skill => (
                                                        <span key={skill} className="text-sm font-semibold   px-1 py-0.5 rounded border bg-emerald-500/5 border-emerald-500/10 text-emerald-400 flex items-center gap-1 shadow-sm">
                                                            <CheckCircle2 className="h-2 w-2" />
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {/* Missing Skills */}
                                            {missingSkills.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {missingSkills.map(skill => (
                                                        <button
                                                            key={skill}
                                                            onClick={(e) => { e.preventDefault(); handleAddToRoadmap(skill); }} className="text-sm font-semibold   px-1 py-0.5 rounded border bg-white/[0.01] border-white/5 text-white/90 flex items-center gap-1 hover:bg-white/5 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Plus className="h-2 w-2 text-blue-400" />
                                                            {skill}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-3 pt-0 mt-auto flex flex-col gap-2">
                                    <div className="w-full flex items-center justify-between border-t border-white/5 pt-2.5">
                                        <span className="text-sm font-semibold   text-white/70">{job.postedAt}</span>
                                        <Link href={job.url}>
                                            <Button size="sm" className="h-6 px-2.5 bg-blue-600/80 hover:bg-blue-600 text-white shadow-xl text-sm font-semibold   rounded-lg transition-all active:scale-95">
                                                Initialize <ExternalLink className="h-2 w-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )
                }) : (
                    <div className="col-span-full py-16 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-lg">
                        <Search className="h-6 w-6 text-white/70 mx-auto mb-3" />
                        <h3 className="text-sm  font-semibold  text-white/70">No matching leads</h3>
                        <Button variant="link" className="text-xs  font-semibold  text-blue-400/40 mt-1"
                            onClick={() => { setSearchQuery(""); setFilterLocation("All") }}
                        >
                            Reset Protocol
                        </Button>
                    </div>
                )}
            </div>

            <NextModulePrompter nextModuleName="Skill Gap Analyzer" nextModuleHref="/dashboard/tools/skill-gap" description="Bridge the gap between your current skills and these market demands with a deep-dive capability analysis."
            />
        </div>
    )
}
