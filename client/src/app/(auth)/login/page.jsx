"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
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
    } = useForm({
        resolver: zodResolver(loginSchema),
    })

    const { login } = useAuth()

    async function onSubmit(data) {
        setIsLoading(true)
        setErrorMsg("")
        try {
            login(data.email, data.password)
            router.push("/dashboard")
        } catch (error) {
            setErrorMsg(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-deep-purple/5 pointer-events-none" />

            <div className="mb-8 relative z-10">
                <Link href="/">
                    <Logo scale="md" />
                </Link>
            </div>

            <Card className="max-w-md w-full border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative z-10">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl  tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-deep-purple">Welcome back</CardTitle>
                    <CardDescription className="text-slate-400">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm  leading-none" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register("email")}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm  leading-none" htmlFor="password">Password</label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                        </div>
                        {errorMsg && <p className="text-sm text-destructive ">{errorMsg}</p>}
                        <Button type="submit" className="w-full bg-neon-cyan text-black hover:bg-neon-cyan/80  shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all duration-300" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-neon-cyan hover:underline ">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
