"use client"

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Compass, LogOut, Loader2, UserCircle, BarChart, TrendingUp, FileText, Mic, Briefcase, Globe, Users, Camera, Linkedin, Twitter, Github } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, updateProfile, isLoading: authLoading } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const img = new Image();
            img.src = base64String;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 150;
                const MAX_HEIGHT = 150;
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

                if (updateProfile) {
                    updateProfile({ profileImage: dataUrl });
                }
                setIsUploadingImage(false);
            };
        };
        reader.readAsDataURL(file);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            logout();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Roadmap', href: '/dashboard/roadmap', icon: Compass },
        { name: 'Skill Gap', href: '/dashboard/skill-gap', icon: BarChart },
        { name: 'Progress', href: '/dashboard/progress', icon: TrendingUp },
        { name: 'Resume', href: '/dashboard/resume', icon: FileText },
        { name: 'Interview', href: '/dashboard/interview', icon: Mic },
        { name: 'Portfolio', href: '/dashboard/portfolio', icon: Briefcase },
        { name: 'Insights', href: '/dashboard/insights', icon: Globe },
        { name: 'Network', href: '/dashboard/network', icon: Users },
    ];

    if (authLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-950 text-foreground selection:bg-purple-500/30">
            <AnimatedBackground />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/90 backdrop-blur-xl">
                <div className="container mx-auto flex h-14 items-center justify-between px-6">
                    {/* Left Area: Logo and Logout */}
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center group">
                            <h2 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-100 to-purple-400">
                                CareerIntel
                            </h2>
                        </Link>

                        <div className="h-4 w-[1px] bg-white/10 mx-2 hidden md:block" />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            title="Logout"
                        >
                            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                        </Button>
                    </div>

                    {/* Right Side - Profile */}
                    <div className="flex items-center gap-5">
                        <div className="hidden md:flex flex-col items-end leading-tight text-right">
                            <span className="text-xs font-bold text-slate-100">{user?.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{user?.email}</span>
                        </div>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="relative h-8 w-8 rounded-full border border-white/10 overflow-hidden hover:border-purple-400 transition-all active:scale-95 duration-200 shadow-2xl shrink-0"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                            />
                            {isUploadingImage ? (
                                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                    <Loader2 className="h-3 w-3 text-purple-400 animate-spin" />
                                </div>
                            ) : null}
                            {user?.profileImage || user?.image ? (
                                <Image
                                    src={user.profileImage || user.image}
                                    alt={user.name || "User"}
                                    fill
                                    unoptimized={true}
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-slate-800 flex items-center justify-center">
                                    <UserCircle className="h-4 w-4 text-slate-500" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full flex flex-col pt-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.99 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="container mx-auto p-4 md:p-8 flex-1"
                    >
                        <div className="min-h-full">
                            {children}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
