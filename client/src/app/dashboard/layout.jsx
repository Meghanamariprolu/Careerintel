"use client"

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Compass, LogOut, Loader2, UserCircle, 
    BarChart, TrendingUp, FileText, Mic, Briefcase, Globe, 
    Users, Camera, Linkedin, Twitter, Github, Menu, X, 
    Settings, HelpCircle, Bell, ChevronRight, Sparkles 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, updateProfile, isLoading: authLoading } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    // Navigation configuration
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'AI Roadmaps', href: '/dashboard/generate', icon: Compass },
        { name: 'Career Report', href: '/dashboard/report', icon: FileText },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
        { name: 'Community', href: '/community', icon: Users },
    ];

    const secondaryNav = [
        { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
        { name: 'Help Center', href: '/help-center', icon: HelpCircle },
    ];

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

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
                const MAX_WIDTH = 150;
                const MAX_HEIGHT = 150;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
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

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] flex flex-col lg:flex-row font-sans text-white overflow-hidden">
            
            {/* --- MOBILE TOP NAVBAR --- */}
            <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Logo scale="sm" />
                </Link>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-white/50 hover:text-white transition-colors">
                        <Bell className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-white bg-white/5 border border-white/10 rounded-xl"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden lg:flex flex-col w-72 h-screen border-r border-white/5 bg-[#0c0c1e] sticky top-0 shrink-0">
                <div className="p-8 pb-4">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <Logo scale="md" />
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 scrollbar-hide">
                    {/* Main Menu */}
                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-4">Main Command</p>
                        {navItems.map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${
                                    pathname === item.href 
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-950/40 translate-x-1' 
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${pathname === item.href ? 'text-white' : 'text-indigo-400'}`} />
                                {item.name}
                                {pathname === item.href && (
                                    <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Secondary Navigation */}
                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-4">System</p>
                        {secondaryNav.map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                                    pathname === item.href 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <item.icon className="h-5 w-5 text-white/30" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* User Section Footer */}
                <div className="p-4 border-t border-white/5 bg-[#09090b]/40">
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="relative group">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 overflow-hidden shrink-0">
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle className="h-6 w-6 text-indigo-400" />
                                )}
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                                disabled={isUploadingImage}
                            >
                                {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Camera className="h-4 w-4 text-white" />}
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                            title="Sign Out"
                        >
                            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- MOBILE MENU OVERLAY --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-40 lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-80 bg-[#0c0c1e] z-50 lg:hidden flex flex-col"
                        >
                            <div className="p-8 flex items-center justify-between">
                                <Logo scale="md" />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/40"><X className="h-6 w-6" /></button>
                            </div>
                            <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                                <div className="space-y-1">
                                    {navItems.map((item) => (
                                        <Link 
                                            key={item.name} 
                                            href={item.href}
                                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                                                pathname === item.href 
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                                                : 'text-white/50 hover:bg-white/5'
                                            }`}
                                        >
                                            <item.icon className="h-6 w-6" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <UserCircle className="h-7 w-7 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{user?.name}</p>
                                        <p className="text-xs text-white/40">{user?.email}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-400 font-bold uppercase tracking-[0.2em] text-[10px] border border-red-500/10 hover:bg-red-500/20 transition-all"
                                >
                                    <LogOut className="h-4 w-4" /> Sign Out from Intel
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Desktop Top Header Bar (Optional but useful for context) */}
                <header className="hidden lg:flex items-center justify-between px-10 py-6 border-b border-white/5 bg-[#09090b]/40 backdrop-blur-md shrink-0">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-3">
                            {navItems.find(n => n.href === pathname)?.name || 'Command Center'}
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="h-3 w-3" /> Intel Node: Active
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-white/40">
                                <Bell className="h-5 w-5" />
                            </button>
                            <Link href="/dashboard/profile">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center hover:scale-105 transition-transform">
                                    <UserCircle className="h-6 w-6 text-white/60" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content Holder */}
                <div className="flex-1 overflow-y-auto page-padding scrollbar-visible relative">
                    {/* Atmospheric background glows that move with scroll or stay fixed */}
                    <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-600/[0.03] blur-[140px] rounded-full pointer-events-none -z-10" />
                    <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-600/[0.03] blur-[140px] rounded-full pointer-events-none -z-10" />
                    
                    <div className="max-w-7xl mx-auto pb-20">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
