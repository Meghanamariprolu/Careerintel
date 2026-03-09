"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, MessageSquare, Github, Linkedin, Twitter, Globe, Sparkles, Zap, Trophy } from 'lucide-react';
import Link from 'next/link';

const channels = [
    {
        icon: MessageSquare,
        title: "Discord Community",
        description: "Join 2,400+ career builders, engineers, and strategists in our active Discord server. Share tips, get feedback, and find accountability partners.",
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        cta: "Join Discord",
        href: "#",
    },
    {
        icon: Linkedin,
        title: "LinkedIn Group",
        description: "Connect professionally with other CareerIntel users. Share career milestones, roadmap completions, and industry insights.",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        cta: "Join LinkedIn Group",
        href: "#",
    },
    {
        icon: Github,
        title: "Open Source & GitHub",
        description: "CareerIntel is open source. Contribute to the codebase, report bugs, request features, or fork the project for your own use.",
        color: "text-white/70",
        bg: "bg-white/5",
        border: "border-white/10",
        cta: "View on GitHub",
        href: "#",
    },
    {
        icon: Twitter,
        title: "Follow on X / Twitter",
        description: "Stay updated on new features, AI career trends, and platform announcements by following us on X (formerly Twitter).",
        color: "text-sky-400",
        bg: "bg-sky-500/10",
        border: "border-sky-500/20",
        cta: "Follow Us",
        href: "#",
    },
];

const highlights = [
    { icon: Users, stat: "2,400+", label: "Active Members" },
    { icon: Globe, stat: "45+", label: "Countries Represented" },
    { icon: Trophy, stat: "830+", label: "Career Milestones Shared" },
    { icon: Sparkles, stat: "12k+", label: "Roadmaps Generated" },
];

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden">
            {/* Header */}
            <div className="relative py-20 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-600/10 blur-[120px] rounded-full" />
                </div>
                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-xs uppercase tracking-[0.25em] text-emerald-300">
                    <Users className="h-3 w-3" /> Global Career Network
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-light tracking-tighter text-white mb-4">Community</h1>
                <p className="text-white/70 max-w-xl mx-auto">Join thousands of ambitious professionals using CareerIntel to accelerate their growth together.</p>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-24">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {highlights.map((h, idx) => (
                        <motion.div key={h.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                            <h.icon className="h-5 w-5 text-white/30 mx-auto mb-3" />
                            <p className="text-2xl font-light text-white mb-1">{h.stat}</p>
                            <p className="text-xs text-white/30 uppercase tracking-widest">{h.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Channels */}
                <h2 className="text-xl font-light text-white mb-8 tracking-wide">Join the Conversation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {channels.map((ch, idx) => (
                        <motion.div key={ch.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                            className={`p-8 rounded-xl border ${ch.border} bg-white/[0.02] hover:bg-white/[0.05] transition-all group`}>
                            <div className={`p-3 rounded-xl ${ch.bg} border ${ch.border} w-fit mb-5`}>
                                <ch.icon className={`h-6 w-6 ${ch.color}`} />
                            </div>
                            <h3 className="text-lg font-light text-white mb-2">{ch.title}</h3>
                            <p className="text-white/70 text-sm leading-relaxed mb-6">{ch.description}</p>
                            <Link href={ch.href} className={`text-sm ${ch.color} hover:opacity-80 transition-opacity flex items-center gap-2 font-light`}>
                                {ch.cta} →
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Community Guidelines */}
                <div className="p-10 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 text-center">
                    <Zap className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-light text-white mb-3">Community Values</h3>
                    <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed">
                        We believe in <span className="text-emerald-400">radical transparency</span>, <span className="text-emerald-400">mutual growth</span>, and <span className="text-emerald-400">no gatekeeping</span>. 
                        Whether you're a junior developer or a seasoned executive, your insights are valuable here. Be kind, be specific, and pay it forward.
                    </p>
                </div>
            </div>
        </div>
    );
}
