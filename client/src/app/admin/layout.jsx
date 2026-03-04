"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Loader2, ShieldAlert, BarChart2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isLoading: authLoading } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Simple protection for admin route
    if (authLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4 bg-slate-950 text-white">
                <ShieldAlert className="h-16 w-16 text-deep-purple" />
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-deep-purple">Unauthorized Access</h1>
                <p className="text-slate-400">You do not have permission to view the admin area.</p>
                <Button variant="outline" className="border-neon-cyan/30 text-neon-cyan" onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
            </div>
        )
    }

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
        { name: 'Admin Overview', href: '/admin', icon: BarChart2 },
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ];

    return (
        <div className="min-h-screen text-foreground relative flex flex-col">
            <AnimatedBackground />

            {/* Top Navigation Bar (matching Dashboard Layout) */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <Link href="/admin" className="flex items-center">
                            <h2 className="text-2xl font-bold tracking-tight text-deep-purple drop-shadow-[0_0_10px_rgba(112,0,255,0.3)]">AdminPortal</h2>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-1 ml-6">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${isActive
                                            ? 'bg-deep-purple/20 text-deep-purple shadow-[0_0_10px_rgba(112,0,255,0.2)]'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end text-xs">
                            <span className="font-bold text-white uppercase tracking-widest">{user?.role}</span>
                            <span className="text-slate-400">{user?.name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-300 hover:text-white hover:bg-white/10"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto p-4 md:p-8 z-10 w-full relative">
                <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-6 md:p-8 min-h-[calc(100vh-8rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
