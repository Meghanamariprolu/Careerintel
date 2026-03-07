"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
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
            // Call the Express backend to generate and save the roadmap
            const response = await axios.post('/api/roadmaps/generate', {
                career: data.career,
                experienceLevel: data.experienceLevel,
                timeCommitment: data.timeCommitment,
                currentSkills: data.currentSkills || 'None',
                goal: data.goal
            });

            const newRoadmap = response.data;
            router.push(`/dashboard/roadmap/${newRoadmap._id}`)
        } catch (error) {
            const message = error.response?.data?.message || "Failed to generate roadmap. Please try again.";
            setErrorMsg(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl  tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-deep-purple drop-shadow-sm">Generate AI Roadmap</h1>
                <p className="text-muted-foreground mt-2">
                    Tell us about your career goals and let our AI craft a personalized learning path.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-neon-cyan" />
                        Roadmap Parameters
                    </CardTitle>
                    <CardDescription>Fill out the details below to generate your custom plan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm  leading-none">Target Career Role</label>
                            <Input
                                placeholder="e.g. Full Stack Developer, Data Scientist"
                                {...register("career")}
                            />
                            {errors.career && <p className="text-sm text-destructive">{errors.career.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm  leading-none">Current Experience Level</label>
                                <Input
                                    placeholder="e.g. Beginner, Intermediate"
                                    {...register("experienceLevel")}
                                />
                                {errors.experienceLevel && <p className="text-sm text-destructive">{errors.experienceLevel.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm  leading-none">Time Commitment</label>
                                <Input
                                    placeholder="e.g. 10 hours/week"
                                    {...register("timeCommitment")}
                                />
                                {errors.timeCommitment && <p className="text-sm text-destructive">{errors.timeCommitment.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm  leading-none">Primary Goal</label>
                            <Input
                                placeholder="e.g. Internship, Job, Career Switch"
                                {...register("goal")}
                            />
                            {errors.goal && <p className="text-sm text-destructive">{errors.goal.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm  leading-none">Current Skills (Optional)</label>
                            <Input
                                placeholder="e.g. HTML, CSS, basic JavaScript"
                                {...register("currentSkills")}
                            />
                        </div>

                        {errorMsg && <p className="text-sm text-destructive ">{errorMsg}</p>}

                        <Button type="submit" className="w-full bg-deep-purple hover:bg-deep-purple/80 text-white shadow-[0_0_20px_rgba(112,0,255,0.3)] transition-all duration-300" disabled={isLoading}>
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
