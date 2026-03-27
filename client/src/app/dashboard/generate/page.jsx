"use client"

import { useState } from"react"
import { useRouter } from"next/navigation"
import Link from"next/link"
import axios from"axios"
import { z } from"zod"
import { zodResolver } from"@hookform/resolvers/zod"
import { useForm } from"react-hook-form"
import { 
    Loader2, Sparkles, Target, Zap, Clock, 
    ChevronRight, Brain, Rocket, Info, AlertCircle, ArrowLeft
} from"lucide-react"
import { motion, AnimatePresence } from"framer-motion"
import { useAuth } from"@/context/AuthContext"

import { Button } from"@/components/ui/Button"
import { Input } from"@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/Card"

const generateSchema = z.object({
    career: z.string().min(2,"Career role is required"),
    experienceLevel: z.string().min(2,"Experience level is required"),
    timeCommitment: z.string().min(2,"Time commitment is required"),
    goal: z.string().min(2,"Primary goal is required"),
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
            experienceLevel:"Beginner",
            timeCommitment:"15 hours/week",
            goal:"Full-time Job",
            currentSkills:""
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
            let message ="Failed to generate roadmap. The AI engine might be busy.";
            
            if (error.code === 'ECONNABORTED') {
                message ="The request timed out. Our AI is taking longer than usual, but the roadmap might still be generating. Check your dashboard in a minute.";
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            
            setErrorMsg(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-lg mx-auto space-y-4 pb-12">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-4 mb-2">
                <Link href="/dashboard" className="w-fit self-start">
                    <button className="flex items-center gap-2 text-white/70 hover:text-white text-xs  font-semibold  transition-colors">
                        <ArrowLeft className="h-3 w-3" /> Command Center
                    </button>
                </Link>
                
                <div className="text-center space-y-1.5">
                    <motion.div 
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm  font-semibold  shadow-xl"
                    >
                        <Sparkles className="h-2.5 w-2.5" /> INTELLIGENCE SYNTHESIS ENGINE
                    </motion.div>
                    <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-purple-400">
                        Strategy Synthesis Node<span className="text-purple-500">.</span>
                    </h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-12">
                    <Card className="bg-slate-900/40 border-white/5 backdrop-blur-3xl shadow-2xl rounded-lg overflow-hidden">
                        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-purple-600/[0.02] blur-[120px] rounded-full pointer-events-none" />
                        
                        <CardHeader className="p-3.5 pb-1.5">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white/90  ">
                                <Brain className="h-3 w-3 text-purple-400" /> Synthesis Parameters
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="p-3.5 pt-1.5">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-3">
                                    {/* Career Role */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold   text-white/70 ml-1 flex items-center gap-2">
                                            <Target className="h-2 w-2" /> Target Designation
                                        </label>
                                        <Input placeholder="e.g. Frontend Engineer" className="h-8 bg-white/5 border-white/5 rounded-md focus:border-purple-500/30 focus:ring-purple-500/10 px-3 text-sm text-white placeholder:text-white/90 shadow-xl"
                                            {...register("career")}
                                        />
                                        {errors.career && <p className="text-xs text-red-500 font-semibold ml-1">{errors.career.message}</p>}
                                    </div>

                                    {/* Experience Level */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold   text-white/70 ml-1 flex items-center gap-2">
                                            <Zap className="h-2 w-2" /> Seniority Level
                                        </label>
                                        <select className="w-full h-8 bg-white/5 border border-white/5 rounded-md focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/10 px-3 text-sm text-white outline-none transition-all appearance-none shadow-xl"
                                            {...register("experienceLevel")}
                                        >
                                            <option value="Beginner" className="bg-[#0c0c1e]">Beginner</option>
                                            <option value="Intermediate" className="bg-[#0c0c1e]">Intermediate</option>
                                            <option value="Advanced" className="bg-[#0c0c1e]">Advanced</option>
                                            <option value="Expert" className="bg-[#0c0c1e]">Expert</option>
                                        </select>
                                    </div>

                                    {/* Time Commitment */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold   text-white/70 ml-1 flex items-center gap-2">
                                            <Clock className="h-2 w-2" /> Bandwidth Protocol
                                        </label>
                                        <Input placeholder="e.g. 15 hours" className="h-8 bg-white/5 border-white/5 rounded-md focus:border-purple-500/30 focus:ring-purple-500/10 px-3 text-sm text-white placeholder:text-white/90 shadow-xl"
                                            {...register("timeCommitment")}
                                        />
                                        {errors.timeCommitment && <p className="text-xs text-red-500 font-semibold ml-1">{errors.timeCommitment.message}</p>}
                                    </div>

                                    {/* Primary Goal */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold   text-white/70 ml-1 flex items-center gap-2">
                                            <Rocket className="h-2 w-2" /> Objective Alpha
                                        </label>
                                        <Input placeholder="e.g. FAANG" className="h-8 bg-white/5 border-white/5 rounded-md focus:border-purple-500/30 focus:ring-purple-500/10 px-3 text-sm text-white placeholder:text-white/90 shadow-xl"
                                            {...register("goal")}
                                        />
                                        {errors.goal && <p className="text-xs text-red-500 font-semibold ml-1">{errors.goal.message}</p>}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold   text-white/70 ml-1 flex items-center gap-2">
                                        <Info className="h-2 w-2" /> Telemetry Overrides (Optional)
                                    </label>
                                    <textarea placeholder="JavaScript, AWS..." className="w-full h-12 bg-white/5 border border-white/5 rounded-md focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/10 p-3 text-sm text-white placeholder:text-white/90 resize-none transition-all outline-none shadow-xl"
                                        {...register("currentSkills")}
                                    />
                                </div>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {errorMsg && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold"
                                        >
                                            <AlertCircle className="h-3 w-3 shrink-0" />
                                            {errorMsg}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Button type="submit" className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold   text-xs rounded-lg shadow-2xl shadow-purple-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-2.5 w-2.5 animate-spin" />
                                            PROTOCOL INITIATION...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-2.5 w-2.5" />
                                            INITIALIZE SYNTHESIS
                                            <ChevronRight className="ml-1 h-2 w-2" />
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
