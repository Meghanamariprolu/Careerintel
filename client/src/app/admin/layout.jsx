"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Loader2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Simple protection for admin route
    if (!user || user.role !== 'admin') {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <ShieldAlert className="h-16 w-16 text-destructive" />
                <h1 className="text-2xl font-bold">Unauthorized Access</h1>
                <p className="text-muted-foreground">You do not have permission to view the admin area.</p>
                <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
            </div>
        )
    }

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const navLinks = [
        { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
    ];

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <aside className="w-64 border-r border-border bg-card hidden md:block">
                <div className="h-full flex flex-col justify-between py-6">
                    <div className="px-6 space-y-8">
                        <h2 className="text-xl font-bold tracking-tight text-destructive">Admin Portal</h2>
                        <nav className="space-y-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                            ? 'bg-destructive/10 text-destructive font-medium'
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
                        <Button variant="outline" className="w-full justify-start" onClick={handleLogout} disabled={isLoggingOut}>
                            {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                            Sign out
                        </Button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto w-full">
                <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
                    <h2 className="text-xl font-bold text-destructive">Admin Portal</h2>
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
