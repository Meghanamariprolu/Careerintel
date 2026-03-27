"use client"

import React, { useEffect, useState } from"react"
import Link from"next/link"
import { motion } from"framer-motion"
import { useAuth } from"@/context/AuthContext"
import { z } from"zod"
import { zodResolver } from"@hookform/resolvers/zod"
import { useForm } from"react-hook-form"
import { Loader2, User, Mail, MapPin, Briefcase, BookOpen, Save, CheckCircle2, Trash2, ArrowLeft } from"lucide-react"

import { Button } from"@/components/ui/Button"
import { Input } from"@/components/ui/Input"
import { Textarea } from"@/components/ui/Textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from"@/components/ui/Card"

const profileSchema = z.object({
    name: z.string().min(2,"Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    bio: z.string().max(500,"Bio is too long").optional().or(z.literal("")),
    location: z.string().optional().or(z.literal("")),
    skills: z.string().optional().or(z.literal("")), // User enters comma-separated string
    profileImage: z.string().optional().or(z.literal("")).or(z.null()),
})

export default function ProfilePage() {
    const { user, updateProfile: saveProfile } = useAuth()
    const fileInputRef = React.useRef(null)

    const [isSaving, setIsSaving] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [previewImage, setPreviewImage] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(profileSchema),
    })

    const currentProfileImage = watch("profileImage")

    useEffect(() => {
        if (currentProfileImage) {
            setPreviewImage(currentProfileImage)
        }
    }, [currentProfileImage])

    useEffect(() => {
        if (user) {
            // Pre-fill form
            reset({
                name: user.name ||"",
                email: user.email ||"",
                bio: user.bio ||"",
                location: user.location ||"",
                skills: Array.isArray(user.skills) ? user.skills.join(",") : (user.skills ||""),
                profileImage: user.profileImage || user.image ||"",
            })
            setPreviewImage(user.profileImage || user.image ||"")
        }
    }, [user, reset])

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const img = new window.Image();
            img.src = base64String;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 300; // Larger for profile page
                const MAX_HEIGHT = 300;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                setValue("profileImage", dataUrl, { shouldDirty: true });
                setPreviewImage(dataUrl);
                setIsUploadingImage(false);
            };
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteImage = () => {
        setValue("profileImage","", { shouldDirty: true });
        setPreviewImage("");
        if (fileInputRef.current) {
            fileInputRef.current.value ="";
        }
    };

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
            setTimeout(() => setSuccessMsg(""), 3000)
        } catch (error) {
            setErrorMsg(error.message ||"Failed to update profile.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            <header className="mb-6">
                <Link href="/dashboard">
                    <motion.button
                        whileHover={{ x: -10 }} className="flex items-center gap-2 text-white/70 hover:text-white text-xs  font-semibold  transition-colors mb-4 md:mb-6"
                    >
                        <ArrowLeft className="h-3 w-3" /> Command Center
                    </motion.button>
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-2.5 text-sm  font-semibold  text-indigo-400 shadow-xl"
                        >
                            <User className="h-2.5 w-2.5" /> PROFILE CONFIGURATION
                        </motion.div>
                        <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-indigo-400">
                            Identity Registry Node<span className="text-indigo-500">.</span>
                        </h1>
                        <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                            Update your personal parameters and career synchronization data.
                        </p>
                    </div>
                </div>
            </header>

            <Card className="bg-slate-900/40 border-white/5 backdrop-blur-3xl shadow-2xl rounded-lg overflow-hidden">
                <CardHeader className="p-4 pb-1.5">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white/90  ">
                        <User className="h-3 w-3 text-indigo-400" /> Identity Core
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="p-4 pt-1.5 space-y-4">
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5 relative">
                                    <label className="text-xs font-semibold   text-white/70 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-white/90" />
                                        <Input className="pl-8 bg-white/5 border-white/5 text-sm h-8 rounded-md placeholder:text-white/70 font-semibold" placeholder="John Doe"
                                            {...register("name")}
                                        />
                                    </div>
                                    {errors.name && <p className="text-sm text-red-500 font-semibold ml-1">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-1.5 relative">
                                    <label className="text-xs font-semibold   text-white/70 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-white/90" />
                                        <Input className="pl-8 bg-white/5 border-white/5 text-sm h-8 rounded-md opacity-50 cursor-not-allowed font-semibold" type="email"
                                            readOnly 
                                            {...register("email")}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-semibold   text-white/70 ml-1">Bio / Headline</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-2.5 top-3 h-2.5 w-2.5 text-white/90 z-10" />
                                    <Textarea className="pl-8 min-h-[80px] bg-white/5 border-white/5 text-sm rounded-md placeholder:text-white/70 font-medium" placeholder="Software Engineer passionate about building scalable web applications..."
                                        {...register("bio")}
                                    />
                                </div>
                                {errors.bio && <p className="text-sm text-red-500 font-semibold ml-1">{errors.bio.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5 relative">
                                    <label className="text-xs font-semibold   text-white/70 ml-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-white/90" />
                                        <Input className="pl-8 bg-white/5 border-white/5 text-sm h-8 rounded-md placeholder:text-white/70 font-semibold" placeholder="New York, NY"
                                            {...register("location")}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold   text-white/70 ml-1">Profile Identity Image</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-14 w-14 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center cursor-pointer group shadow-xl"
                                            onClick={() => previewImage ? handleDeleteImage() : fileInputRef.current?.click()}
                                        >
                                            {previewImage ? (
                                                <>
                                                    <img
                                                        src={previewImage} alt="Preview" className="h-full w-full object-cover transition-opacity group-hover:opacity-30"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-500/40 transition-opacity">
                                                        <Trash2 className="h-4 w-4 text-white" />
                                                    </div>
                                                </>
                                            ) : (
                                                <User className="h-6 w-6 text-white/90" />
                                            )}
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <input type="file" accept="image/*" className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                            />
                                            <div className="flex gap-2">
                                                <Button type="button" variant="outline" className="h-7 px-3 text-sm font-semibold   rounded-lg border-white/5 bg-white/[0.01] text-white/70 hover:bg-white/5 hover:text-white transition-all shadow-xl"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    Modify Stream
                                                </Button>
                                            </div>
                                            <p className="text-sm text-white/90  font-semibold">
                                                JPG/PNG. MAX 2MB.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 relative">
                                    <label className="text-xs font-semibold   text-white/70 ml-1">Profile Image URL</label>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-white/90" />
                                        <Input className="pl-8 bg-white/5 border-white/5 text-sm h-8 rounded-md placeholder:text-white/70 font-semibold" placeholder="https://example.com/avatar.jpg"
                                            {...register("profileImage")}
                                        />
                                    </div>
                                    {errors.profileImage && <p className="text-sm text-red-500 font-semibold ml-1">{errors.profileImage.message}</p>}
                                </div>
                                <div className="space-y-1.5 relative">
                                    <label className="text-xs font-semibold   text-white/70 ml-1">Skills (Override)</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-white/90" />
                                        <Input className="pl-8 bg-white/5 border-white/5 text-sm h-8 rounded-md placeholder:text-white/70 font-semibold" placeholder="JavaScript, React, Node.js"
                                            {...register("skills")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="p-2.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                                {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div className="p-2.5 flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                                <CheckCircle2 className="h-3 w-3" />
                                {successMsg}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="bg-black/20 border-t border-white/5 py-3 p-4 flex justify-end">
                        <Button type="submit"
                            disabled={!isDirty || isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 px-5 shadow-2xl shadow-indigo-900/40 text-xs font-semibold   transition-all"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                    SYNCING identity...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-3 w-3" />
                                    commit changes
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
