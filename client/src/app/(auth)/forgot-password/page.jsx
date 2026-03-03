"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { ArrowLeft, Loader2, Mail } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    })

    async function onSubmit(data) {
        setIsLoading(true)
        setErrorMsg("")
        try {
            // Check if user exists in localStorage
            const users = JSON.parse(localStorage.getItem('careerintel_all_users') || '[]');
            const userExists = users.find(u => u.email === data.email);

            if (!userExists) {
                throw new Error("No account found with this email address.");
            }

            // In a real local-only app, we just mock the success message
            // or provide a direct link for convenience in dev mode
            console.log("Password reset requested for:", data.email);
            setIsSuccess(true)
        } catch (error) {
            setErrorMsg(error.message || "Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-xl border-border/50">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        Forgot Password
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email address and we will send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isSuccess ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium leading-none" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        className="pl-9"
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
                                )}
                            </div>

                            {errorMsg && (
                                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                                    {errorMsg}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mb-2">
                                <Mail className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Check your email</h3>
                            <p className="text-muted-foreground text-sm">
                                We've sent a password reset link to your email address. Please check your inbox and spam folder. (Check the backend console in development mode).
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center border-t border-border/50 pt-4">
                    <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
