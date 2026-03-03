"use client"

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Compass, LogOut, Loader2, UserCircle, BarChart, TrendingUp, FileText, Mic, Briefcase, Globe, Users, Camera } from 'lucide-react';
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
                    updateProfile({ image: dataUrl });
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
        <div className="min-h-screen text-foreground relative flex flex-col">
            <AnimatedBackground />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Logo Area */}
                    <Link href="/dashboard" className="flex items-center shrink-0">
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:scale-105 transition-transform">CareerIntel</h2>
                    </Link>

                    {/* Right Side Navigation & Profile */}
                    <div className="flex items-center gap-4 flex-1 justify-end overflow-hidden">
                        {/* Center Navigation Links (Desktop) */}
                        <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto scrollbar-hide">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${isActive
                                            ? 'bg-neon-cyan/20 text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Side - Profile and Logout */}
                        <div className="flex items-center gap-4">
                            {/* Profile and Logout */}
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-medium text-white">{user?.name}</span>
                                <span className="text-xs text-slate-400 max-w-[150px] truncate">{user?.email}</span>
                            </div>

                            <div className="relative group shrink-0">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                />
                                <div
                                    className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-indigo-400 overflow-hidden cursor-pointer hover:border-neon-cyan transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {isUploadingImage ? (
                                        <Loader2 className="h-5 w-5 text-neon-cyan animate-spin" />
                                    ) : user?.image || user?.profileImage ? (
                                        <Image
                                            src={user.image || user.profileImage}
                                            alt={user.name || "User Avatar"}
                                            width={150}
                                            height={150}
                                            unoptimized={true}
                                            className="h-full w-full object-cover group-hover:opacity-70 transition-opacity"
                                        />
                                    ) : (
                                        <UserCircle className="h-6 w-6 text-slate-400 group-hover:text-neon-cyan transition-colors" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-3 w-3 text-neon-cyan" />
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-slate-300 hover:text-white hover:bg-red-500/20 hover:text-red-400 ml-1 rounded-full"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="md:hidden border-t border-white/10 px-4 py-2 flex gap-4 overflow-x-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${isActive
                                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto p-4 md:p-8 z-10 w-full relative">
                {/* A semi-transparent wrapper for the children to make them readable over the animated background */}
                <div className="bg-slate-900/60 backdrop-blur-sm border border-white/10 shadow-2xl rounded-2xl p-6 md:p-8 min-h-[calc(100vh-8rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
