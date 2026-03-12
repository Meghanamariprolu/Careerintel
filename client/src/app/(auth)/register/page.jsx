"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Logo } from "@/components/ui/Logo"

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    })

    const { register: registerUser } = useAuth()

    async function onSubmit(data) {
        setIsLoading(true)
        setErrorMsg("")
        try {
            await registerUser(data)
            router.push("/onboarding")
        } catch (error) {
            setErrorMsg(error.message || "Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-[#09090b] text-white">
            {/* Left Panel — Branding (Amazon-style split) */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-indigo-950/60 via-[#09090b] to-purple-950/40 border-r border-white/5 p-12 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[50%] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

                <Link href="/" className="relative z-10">
                    <Logo scale="md" />
                </Link>

                <div className="relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs uppercase tracking-widest font-semibold">
                        <Sparkles className="h-3 w-3" /> Join the Intelligence Era
                    </div>
                    
                    <div>
                        <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                            Start building your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">career future today.</span>
                        </h2>
                        <p className="text-white/60 text-lg leading-relaxed max-w-md">
                            Get access to personalized AI roadmaps, deep market insights, and tools designed to accelerate your growth.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        {[
                            "Unlock 12+ AI Career Tools",
                            "Generate Precision Roadmaps",
                            "ATS-Grade Resume Enhancement",
                            "AI-Powered Learning Progress Tracking"
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-white/80 font-medium">
                                <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-white/30 text-xs relative z-10 tracking-wide">
                    © 2025 CareerIntel. Empowering professional evolution.
                </p>
            </div>

            {/* Right Panel — Registration Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-16 overflow-y-auto">
                {/* Mobile Identity */}
                <div className="lg:hidden mb-12">
                    <Link href="/"><Logo scale="md" /></Link>
                </div>

                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Create your account</h1>
                        <p className="text-white/50 text-base">Enter your details and begin your AI-guided journey</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/90 px-1" htmlFor="name">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="e.g. Alexander Pierce"
                                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-14 rounded-2xl transition-all"
                                    {...register("name")}
                                />
                            </div>
                            {errors.name && <p className="text-sm text-red-400 font-medium">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/90 px-1" htmlFor="email">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-14 rounded-2xl transition-all"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && <p className="text-sm text-red-400 font-medium">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/90 px-1" htmlFor="password">Security Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimum 8 characters"
                                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-14 rounded-2xl transition-all"
                                    {...register("password")}
                                />
                            </div>
                            {errors.password && <p className="text-sm text-red-400 font-medium">{errors.password.message}</p>}
                        </div>

                        {/* Feedback / Terms */}
                        <div className="text-xs text-white/40 leading-relaxed px-1">
                            By clicking create account, you agree to our{" "}
                            <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Terms of Service</Link> and{" "}
                            <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Privacy Policy</Link>.
                        </div>

                        {/* Error Notification */}
                        {errorMsg && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                {errorMsg}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-950/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating Profile...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-white/50 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-all">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
