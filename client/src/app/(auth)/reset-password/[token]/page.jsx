"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { Loader2, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"

const resetPasswordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export default function ResetPasswordPage() {
    const { token } = useParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    })

    async function onSubmit(data) {
        setIsLoading(true)
        setErrorMsg("")
        try {
            // In our local-only mock, we don't have a real token validation
            // We'll just update the user password if they are currently resetting
            // But since this is a mock, let's just show success

            const users = JSON.parse(localStorage.getItem('careerintel_all_users') || '[]');
            // For a mock, we'll just update the first user or skip if no users
            if (users.length > 0) {
                users[0].password = data.password;
                localStorage.setItem('careerintel_all_users', JSON.stringify(users));
            }

            setIsSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 3000)
        } catch (error) {
            setErrorMsg("Failed to reset password. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-xl border-border/50">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter a new password for your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isSuccess ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium leading-none" htmlFor="password">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-9"
                                        {...register("password")}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-9"
                                        {...register("confirmPassword")}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive font-medium">{errors.confirmPassword.message}</p>
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
                                        Resetting Password...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mb-2">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Password Reset Successful</h3>
                            <p className="text-muted-foreground text-sm">
                                Your password has been updated. You will be redirected to the login page shortly.
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
