"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Compass, LogOut, Loader2 } from 'lucide-react';
import { signOut, useSession } from "next-auth/react";
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const user = session?.user;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({ redirect: false });
            router.push('/login');
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

    if (status === "loading") {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Since middleware protects this route, if we have no session here, we should be redirecting anyway
    // but we can render nothing in the split second before middleware kicks in.
    if (!session) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card hidden md:block">
                <div className="h-full flex flex-col justify-between py-6">
                    <div className="px-6 space-y-8">
                        <h2 className="text-2xl font-bold tracking-tight text-primary">CareerIntel</h2>
                        <nav className="space-y-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="px-6">
                        <div className="mb-4">
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <Button variant="outline" className="w-full justify-start" onClick={handleLogout} disabled={isLoggingOut}>
                            {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                            Sign out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
                    <h2 className="text-xl font-bold text-primary">CareerIntel</h2>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </header>
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
