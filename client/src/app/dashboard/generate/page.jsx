"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Sparkles } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"

const generateSchema = z.object({
    career: z.string().min(2, "Career title is required"),
    experienceLevel: z.string().min(2, "Experience level is required"),
    timeCommitment: z.string().min(2, "Time commitment is required"),
    goal: z.string().min(2, "Goal is required"),
    currentSkills: z.string().optional(),
})

export default function GenerateRoadmapPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(generateSchema),
        defaultValues: {
            experienceLevel: "Beginner",
            timeCommitment: "10 hours/week",
            goal: "Job",
            currentSkills: ""
        }
    })

    async function onSubmit(data) {
        setIsLoading(true)
        setErrorMsg("")
        try {
            // Mock AI Generation - simulating what the server used to do
            // In a real scenario, this could hit a free API as requested
            const newRoadmap = {
                _id: Date.now().toString(),
                userId: user.id,
                careerTitle: data.career,
                careerSummary: `A comprehensive roadmap to becoming a ${data.career} starting as a ${data.experienceLevel}.`,
                marketDemandScore: 85,
                salaryRange: {
                    india: "₹12L - ₹35L",
                    global: "$80k - $150k"
                },
                careerReadinessScore: 65,
                futureGrowthPrediction: "High",
                learningPath: [
                    { level: "Basics", description: `Master the fundamentals of ${data.career}.`, skills: ["Core Principles", "Standard Tools"] },
                    { level: "Intermediate", description: "Build real-world applications and projects.", skills: ["Advanced Concepts", "Best Practices"] },
                    { level: "Advanced", description: "Master architectural patterns and optimization.", skills: ["System Design", "Scalability"] }
                ],
                learningTimeline: [
                    { track: "Standard", milestone: "Foundations in 4 weeks" },
                    { track: "Accelerated", milestone: "Core skills in 8 weeks" },
                    { track: "Job-Ready", milestone: "Full proficiency in 6 months" }
                ],
                coreTechnicalSkills: ["Problem Solving", "Core Architecture", "Data Structures"],
                currentMarketDemandSkills2025: ["AI Integration", "Cloud Native", "Vulnerability Management"],
                supportingTools: ["Git", "Docker", "CI/CD Pipelines"],
                roleSpecificProjects: [
                    { name: "Portfolio Project", description: "A comprehensive showcase of your skills.", techStack: ["Primary Tech", "Secondary Tech"] },
                    { name: "Enterprise App", description: "A scalable solution for business needs.", techStack: ["Cloud", "Database"] }
                ],
                interviewPreparation: ["Conceptual deep dives", "Coding challenges", "System design interviews"],
                portfolioGuidance: "Focus on building 2-3 high-quality projects that demonstrate your ability to solve real problems.",
                createdAt: new Date().toISOString()
            };

            const allRoadmaps = JSON.parse(localStorage.getItem('careerintel_roadmaps') || '[]');
            localStorage.setItem('careerintel_roadmaps', JSON.stringify([...allRoadmaps, newRoadmap]));

            router.push(`/dashboard/roadmap/${newRoadmap._id}`)
        } catch (error) {
            setErrorMsg(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Generate AI Roadmap</h1>
                <p className="text-muted-foreground mt-2">
                    Tell us about your career goals and let our AI craft a personalized learning path.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        Roadmap Parameters
                    </CardTitle>
                    <CardDescription>Fill out the details below to generate your custom plan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Target Career Role</label>
                            <Input
                                placeholder="e.g. Full Stack Developer, Data Scientist"
                                {...register("career")}
                            />
                            {errors.career && <p className="text-sm text-destructive">{errors.career.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Current Experience Level</label>
                                <Input
                                    placeholder="e.g. Beginner, Intermediate"
                                    {...register("experienceLevel")}
                                />
                                {errors.experienceLevel && <p className="text-sm text-destructive">{errors.experienceLevel.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Time Commitment</label>
                                <Input
                                    placeholder="e.g. 10 hours/week"
                                    {...register("timeCommitment")}
                                />
                                {errors.timeCommitment && <p className="text-sm text-destructive">{errors.timeCommitment.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Primary Goal</label>
                            <Input
                                placeholder="e.g. Internship, Job, Career Switch"
                                {...register("goal")}
                            />
                            {errors.goal && <p className="text-sm text-destructive">{errors.goal.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Current Skills (Optional)</label>
                            <Input
                                placeholder="e.g. HTML, CSS, basic JavaScript"
                                {...register("currentSkills")}
                            />
                        </div>

                        {errorMsg && <p className="text-sm text-destructive font-semibold">{errorMsg}</p>}

                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating AI Roadmap... This may take up to 30 seconds.
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Magic AI Roadmap
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
