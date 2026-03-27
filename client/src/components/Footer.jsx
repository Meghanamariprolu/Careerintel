"use client"

import Link from 'next/link';
import {
    LayoutDashboard,
    TrendingUp,
    Route,
    Layout,
    FileUser,
    Gamepad2,
    UserRoundCog,
    Brain,
    Star,
    Combine,
    BarChart3,
    Bot,
    FileText,
    Linkedin,
    Twitter,
    Github,
    Compass
} from 'lucide-react';
import { Logo } from './ui/Logo';

export const Footer = () => {
    return (
        <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-400 py-4 mt-auto flex-none">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] font-medium">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                    <span className="text-slate-300 mr-2">© 2024 CareerIntel</span>
                    <Link href="/help-center" className="hover:text-slate-200 transition-colors">Help</Link>
                    <Link href="/privacy-policy" className="hover:text-slate-200 transition-colors">Privacy</Link>
                    <Link href="/terms-of-service" className="hover:text-slate-200 transition-colors">Terms</Link>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-6">
                    <Link href="/career-blog" className="hover:text-slate-200 transition-colors">Blog</Link>
                    <Link href="/expert-mentors" className="hover:text-slate-200 transition-colors">Mentors</Link>
                    <Link href="/community" className="hover:text-slate-200 transition-colors">Community</Link>
                    <Link href="/cookie-settings" className="hover:text-slate-200 transition-colors">Settings</Link>
                </div>
            </div>
        </footer>
    );
};
