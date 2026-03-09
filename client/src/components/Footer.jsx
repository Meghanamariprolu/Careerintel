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
    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Market Integration', href: '/dashboard/tools/market-integration', icon: TrendingUp },
        { name: 'Learning Routes', href: '/learning-route', icon: Route },
        { name: 'Portfolio Builder', href: '/portfolio-builder', icon: Layout },
        { name: 'Resume Enhancer', href: '/dashboard/tools/resume-enhancer', icon: FileUser },
        { name: 'Scenario Simulator', href: '/dashboard/tools/scenario-simulator', icon: Gamepad2 },
        { name: 'AI Coaching', href: '/dashboard/tools/coaching', icon: UserRoundCog },
        { name: 'Behavioral Mapping', href: '/dashboard/tools/behavioral-mapping', icon: Brain },
        { name: 'Quality Scoring', href: '/dashboard/tools/quality-scoring', icon: Star },
        { name: 'Skill Transfer', href: '/dashboard/tools/skill-transfer', icon: Combine },
        { name: 'Outcome Tracking', href: '/dashboard/tools/outcome-tracking', icon: BarChart3 },
        { name: 'Mentor Personas', href: '/dashboard/tools/mentor-personas', icon: Bot },
        { name: 'Career Intelligence Report', href: '/dashboard/report', icon: FileText },
        { name: 'Career Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Generate New', href: '/dashboard/generate', icon: Compass },
    ];

    return (
        <footer className="relative flex-none w-full border-t border-white/5 bg-slate-950/50 backdrop-blur-sm pt-12 pb-8 mt-auto overflow-hidden">
            {/* Purple Light Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Column 1: Brand Strategy */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Link href="/">
                                <Logo scale="sm" />
                            </Link>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed max-w-[200px]">
                            Precision. Strategy. Success. AI-driven intelligence for modern careers.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Linkedin, href: "#", label: "LinkedIn" },
                                { icon: Twitter, href: "#", label: "Twitter" },
                                { icon: Github, href: "#", label: "GitHub" }
                            ].map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="h-7 w-7 flex items-center justify-center rounded-full bg-white/5 text-slate-300 hover:text-white hover:bg-purple-500/20 transition-all border border-white/10"
                                >
                                    <social.icon className="h-3 w-3" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Dashboard Features */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white text-[10px] uppercase tracking-widest mb-4 opacity-80">Intelligence Hub</h4>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-300 hover:text-purple-300 text-[11px] transition-colors flex items-center gap-2 group"
                                    >
                                        <div className="h-1 w-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 className="text-white text-[10px] uppercase tracking-widest mb-4 opacity-80">Expert Resources</h4>
                        <ul className="space-y-2">
                            {[
                                { name: 'Help Center', href: '/help-center' },
                                { name: 'Career Blog', href: '/career-blog' },
                                { name: 'Community', href: '/community' },
                                { name: 'Expert Mentors', href: '/expert-mentors' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-300 hover:text-white text-[11px] transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Platform */}
                    <div>
                        <h4 className="text-white text-[10px] uppercase tracking-widest mb-4 opacity-80">Legal & Security</h4>
                        <ul className="space-y-2">
                            {[
                                { name: 'Privacy Policy', href: '/privacy-policy' },
                                { name: 'Terms of Service', href: '/terms-of-service' },
                                { name: 'Cookie Settings', href: '/cookie-settings' },
                                { name: 'Data Security', href: '/data-security' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-300 hover:text-white text-[11px] transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[9px] text-slate-400 uppercase tracking-tighter">
                        © 2024 CareerIntel Technology Group.
                    </p>
                    <div className="flex items-center gap-4 text-[9px] text-slate-400 uppercase tracking-tighter">
                        <Link href="#" className="hover:text-white transition-colors">Status</Link>
                        <Link href="#" className="hover:text-white transition-colors">Feedback</Link>
                        <Link href="#" className="hover:text-white transition-colors">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
