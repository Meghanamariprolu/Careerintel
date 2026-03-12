"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { 
    Loader2, Sparkles, Target, Zap, Clock, 
    ChevronRight, Brain, Rocket, Info, AlertCircle 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

const generateSchema = z.object({
    career: z.string().min(2, "Career role is required"),
    experienceLevel: z.string().min(2, "Experience level is required"),
    timeCommitment: z.string().min(2, "Time commitment is required"),
    goal: z.string().min(2, "Primary goal is required"),
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
            timeCommitment: "15 hours/week",
            goal: "Full-time Job",
            currentSkills: ""
        }
    })

    async function onSubmit(data) {
        setIsLoading(true)
        setErrorMsg("")
        try {
            // INCREASED TIMEOUT: AI generation can takes time (30s timeout)
            const response = await axios.post('/api/roadmaps/generate', {
                career: data.career,
                experienceLevel: data.experienceLevel,
                timeCommitment: data.timeCommitment,
                currentSkills: data.currentSkills || 'None',
                goal: data.goal
            }, {
                timeout: 45000 // 45 seconds for AI processing
            });

            const newRoadmap = response.data;
            router.push(`/dashboard/roadmap/${newRoadmap._id}`)
        } catch (error) {
            console.error("Roadmap generation error:", error);
            let message = "Failed to generate roadmap. The AI engine might be busy.";
            
            if (error.code === 'ECONNABORTED') {
                message = "The request timed out. Our AI is taking longer than usual, but the roadmap might still be generating. Check your dashboard in a minute.";
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            
            setErrorMsg(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header Section */}
            <div className="space-y-4">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase font-black tracking-widest"
                >
                    <Sparkles className="h-3.5 w-3.5" /> Intelligence Synthesis
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                    Generate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">AI Career Strategy</span>
                </h1>
                <p className="text-white/40 text-lg max-w-2xl font-medium">
                    Our neural network analyzes current 2025 market telemetry to craft a precision learning path tailored to your specific goals and availability.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-12">
                    <Card className="bg-[#0c0c1e]/60 border-white/[0.08] backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-purple-600/[0.03] blur-[120px] rounded-full pointer-events-none" />
                        
                        <CardHeader className="p-8 md:p-12 pb-4">
                            <CardTitle className="text-2xl font-bold flex items-center gap-3">
                                <Brain className="h-6 w-6 text-purple-400" /> Roadmap Parameters
                            </CardTitle>
                            <CardDescription className="text-white/40 font-medium">Provide the foundational data for the AI architect.</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-8 md:p-12 pt-4">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Career Role */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-white/60 ml-1 flex items-center gap-2">
                                            <Target className="h-3.5 w-3.5" /> Target Career Role
                                        </label>
                                        <Input
                                            placeholder="e.g. Senior Frontend Engineer, Data Scientist"
                                            className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-purple-500/20 px-6 text-white placeholder:text-white/20"
                                            {...register("career")}
                                        />
                                        {errors.career && <p className="text-xs text-red-400 font-bold ml-1">{errors.career.message}</p>}
                                    </div>

                                    {/* Experience Level */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-white/60 ml-1 flex items-center gap-2">
                                            <Zap className="h-3.5 w-3.5" /> Experience level
                                        </label>
                                        <select
                                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 px-6 text-white outline-none transition-all appearance-none"
                                            {...register("experienceLevel")}
                                        >
                                            <option value="Beginner" className="bg-[#0c0c1e]">Beginner / Career Starter</option>
                                            <option value="Intermediate" className="bg-[#0c0c1e]">Intermediate / Professional</option>
                                            <option value="Advanced" className="bg-[#0c0c1e]">Advanced / Senior</option>
                                            <option value="Expert" className="bg-[#0c0c1e]">Expert / Lead</option>
                                        </select>
                                    </div>

                                    {/* Time Commitment */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-white/60 ml-1 flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5" /> Weekly Commitment
                                        </label>
                                        <Input
                                            placeholder="e.g. 15 hours/week"
                                            className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-purple-500/20 px-6 text-white placeholder:text-white/20"
                                            {...register("timeCommitment")}
                                        />
                                        {errors.timeCommitment && <p className="text-xs text-red-400 font-bold ml-1">{errors.timeCommitment.message}</p>}
                                    </div>

                                    {/* Primary Goal */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-white/60 ml-1 flex items-center gap-2">
                                            <Rocket className="h-3.5 w-3.5" /> Primary Milestone Goal
                                        </label>
                                        <Input
                                            placeholder="e.g. FAANG Internship, Startup CTO"
                                            className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-purple-500/20 px-6 text-white placeholder:text-white/20"
                                            {...register("goal")}
                                        />
                                        {errors.goal && <p className="text-xs text-red-400 font-bold ml-1">{errors.goal.message}</p>}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/60 ml-1 flex items-center gap-2">
                                        <Info className="h-3.5 w-3.5" /> Current Skills (Optional)
                                    </label>
                                    <textarea
                                        placeholder="e.g. JavaScript, AWS Basics, Figma, Team Management..."
                                        className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 p-6 text-white placeholder:text-white/20 resize-none transition-all outline-none"
                                        {...register("currentSkills")}
                                    />
                                </div>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {errorMsg && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold"
                                        >
                                            <AlertCircle className="h-5 w-5 shrink-0" />
                                            {errorMsg}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Button 
                                    type="submit" 
                                    className="w-full h-16 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-purple-900/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                            Synthesizing Neural Path... (Up to 45s)
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-3 h-5 w-5" />
                                            Initialize AI Strategy Engine
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
