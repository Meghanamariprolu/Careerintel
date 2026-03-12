"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Mail, Lock, ArrowRight, Sparkles } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Logo } from "@/components/ui/Logo"

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
})

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(loginSchema) })

    const { login } = useAuth()

    async function onSubmit(data) {
        setIsLoading(true)
        setErrorMsg("")
        try {
            await login(data.email, data.password)
            router.push("/dashboard")
        } catch (error) {
            setErrorMsg(error.message || "Invalid email or password.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-[#09090b] text-white">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-purple-950/60 via-[#09090b] to-indigo-950/40 border-r border-white/5 p-12 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[50%] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

                <Link href="/" className="relative z-10"><Logo scale="md" /></Link>

                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs uppercase tracking-widest">
                        <Sparkles className="h-3 w-3" /> AI Career Intelligence
                    </div>
                    <h2 className="text-4xl font-bold text-white leading-tight">
                        Your career path,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">precisely architected.</span>
                    </h2>
                    <p className="text-white/55 text-base leading-relaxed">
                        12 AI-powered tools working in sync to map your skills, close gaps, and get you hired faster than ever.
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                        {["AI Roadmap Generation", "Skill Gap Analyzer", "Resume Enhancer", "AI Career Coach"].map(f => (
                            <div key={f} className="flex items-center gap-3 text-sm text-white/70">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                                {f}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-white/25 text-xs relative z-10">© 2025 CareerIntel. All rights reserved.</p>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12">
                {/* Mobile logo */}
                <div className="lg:hidden mb-8">
                    <Link href="/"><Logo scale="md" /></Link>
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back</h1>
                        <p className="text-white/55 text-sm sm:text-base">Enter your credentials to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-white/80" htmlFor="email">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 h-12 rounded-xl"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-white/80" htmlFor="password">Password</label>
                                <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Your password"
                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 h-12 rounded-xl"
                                    {...register("password")}
                                />
                            </div>
                            {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
                        </div>

                        {/* Error Banner */}
                        {errorMsg && (
                            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {errorMsg}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.01]"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-sm text-white/45 text-center mt-8">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
