"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, User, Mail, MapPin, Briefcase, BookOpen, Save, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    bio: z.string().max(500, "Bio is too long").optional().or(z.literal("")),
    location: z.string().optional().or(z.literal("")),
    skills: z.string().optional().or(z.literal("")), // User enters comma-separated string
    profileImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
})

export default function ProfilePage() {
    const { user, updateProfile: saveProfile } = useAuth()

    const [isSaving, setIsSaving] = useState(false) // This now refers to the saving state
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(profileSchema),
    })

    useEffect(() => {
        if (user) {
            // Pre-fill form
            reset({
                name: user.name || "",
                email: user.email || "",
                bio: user.bio || "",
                location: user.location || "",
                skills: Array.isArray(user.skills) ? user.skills.join(", ") : (user.skills || ""), // Convert array to string for input
                profileImage: user.profileImage || "",
            })
        }
    }, [user, reset])

    async function onSubmit(data) {
        setIsSaving(true)
        setErrorMsg("")
        setSuccessMsg("")

        // Convert comma-separated skills back to array
        const skillsArray = data.skills
            ? data.skills.split(",").map(skill => skill.trim()).filter(Boolean)
            : []

        const formattedData = {
            ...data,
            skills: skillsArray
        }

        try {
            await saveProfile(formattedData)
            setSuccessMsg("Profile updated successfully!")

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMsg(""), 3000)

        } catch (error) {
            setErrorMsg(error.message || "Failed to update profile.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-deep-purple drop-shadow-sm">Edit Profile</h1>
                <p className="text-muted-foreground mt-2">
                    Update your personal information and career details.
                </p>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-neon-cyan" />
                        Personal Information
                    </CardTitle>
                    <CardDescription>
                        These details are used to personalize your AI roadmaps.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 relative">
                                    <label className="text-sm font-medium leading-none">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder="John Doe"
                                            {...register("name")}
                                        />
                                    </div>
                                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="text-sm font-medium leading-none">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9 bg-muted/50"
                                            type="email"
                                            readOnly // Prevent email change for now to avoid re-verification complexities
                                            title="Email cannot be changed"
                                            {...register("email")}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium leading-none">Bio / Headline</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                    <Textarea
                                        className="pl-9 min-h-[100px] resize-none"
                                        placeholder="Software Engineer passionate about building scalable web applications..."
                                        {...register("bio")}
                                    />
                                </div>
                                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 relative">
                                    <label className="text-sm font-medium leading-none">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder="New York, NY"
                                            {...register("location")}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="text-sm font-medium leading-none">Profile Image URL</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder="https://example.com/avatar.jpg"
                                            {...register("profileImage")}
                                        />
                                    </div>
                                    {errors.profileImage && <p className="text-sm text-destructive">{errors.profileImage.message}</p>}
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="text-sm font-medium leading-none">Skills (Comma separated)</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder="JavaScript, React, Node.js"
                                            {...register("skills")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                                {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div className="p-3 flex items-center gap-2 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium transition-all">
                                <CheckCircle2 className="h-4 w-4" />
                                {successMsg}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-border/50 py-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={!isDirty || isSaving}
                            className="bg-deep-purple hover:bg-deep-purple/80 text-white min-w-[140px] shadow-[0_0_15px_rgba(112,0,255,0.3)] transition-all duration-300"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
