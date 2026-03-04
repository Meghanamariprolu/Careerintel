"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Compass, LogOut, Loader2, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isLoading: authLoading } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        { name: 'Generate Roadmap', href: '/dashboard/generate', icon: Compass },
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
        <div className="h-screen w-full flex flex-col bg-slate-950 text-foreground overflow-hidden">
            <AnimatedBackground />

            {/* Top Navigation Bar */}
            <header className="flex-none z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Logo Area */}
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center">
                            <h2 className="text-2xl font-bold tracking-tight text-white">CareerIntel</h2>
                        </Link>

                        {/* Center Navigation Links (Desktop) */}
                        <nav className="hidden md:flex items-center space-x-1 ml-6">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-indigo-500/20 text-indigo-300'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Side - Profile and Logout */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all group"
                        >
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{user?.name}</span>
                                <span className="text-xs text-slate-400 max-w-[150px] truncate">{user?.email}</span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-indigo-400 overflow-hidden shrink-0 group-hover:border-indigo-300 group-hover:scale-105 transition-all">
                                {user?.image || user?.profileImage ? (
                                    <img
                                        src={user.image || user.profileImage}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserCircle className="h-6 w-6 text-white" />
                                )}
                            </div>
                        </Link>
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

                {/* Mobile Navigation Links */}
                <nav className="md:hidden border-t border-white/10 px-4 py-2 flex gap-4 overflow-x-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${isActive
                                    ? 'bg-indigo-500/20 text-indigo-300'
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
            <main className="flex-1 overflow-y-auto w-full z-10 relative">
                <div className="container mx-auto p-4 md:p-8 min-h-full">
                    {/* A semi-transparent wrapper for the children to make them readable over the animated background */}
                    <div className="bg-slate-900/60 backdrop-blur-sm border border-white/10 shadow-2xl rounded-2xl p-6 md:p-8 min-h-[calc(100vh-8rem)]">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
