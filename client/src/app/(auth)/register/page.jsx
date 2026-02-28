"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"

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

    async function onSubmit(data) {
        setIsLoading(true)
        setErrorMsg("")
        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || "Failed to register")
            }

            // Auto-login after successful registration
            const signInRes = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false
            })

            if (signInRes?.error) {
                throw new Error("Account created, but failed to automatically log in.")
            }

            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            setErrorMsg(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register("email")}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                        </div>
                        {errorMsg && <p className="text-sm text-destructive font-semibold">{errorMsg}</p>}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
