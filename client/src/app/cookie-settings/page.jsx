"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

const cookieTypes = [
    {
        id: "essential",
        title: "Essential Cookies",
        description: "These cookies are required for the platform to function. They enable core features like user authentication, session management, and security. These cannot be disabled.",
        required: true,
        examples: ["JWT session token", "CSRF protection token", "User preference locale"],
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
    {
        id: "analytics",
        title: "Analytics Cookies",
        description: "Help us understand how users interact with our platform so we can improve the experience. All data is aggregated and anonymized — we never track individual users.",
        required: false,
        examples: ["Page view counts", "Feature usage rates", "Session duration (aggregated)"],
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
    },
    {
        id: "preferences",
        title: "Preference Cookies",
        description: "Remember your platform settings and preferences so you don't have to reconfigure them each time you visit.",
        required: false,
        examples: ["Theme preference", "Dashboard layout", "Notification settings"],
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
    },
];

export default function CookieSettingsPage() {
    const [settings, setSettings] = useState({ analytics: true, preferences: true });

    const toggle = (id) => setSettings(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden">
            <div className="relative py-20 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/10 blur-[120px] rounded-full" />
                </div>
                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-xs uppercase tracking-[0.25em] text-orange-300">
                    <Cookie className="h-3 w-3" /> Privacy Controls
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-light tracking-tighter text-white mb-4">Cookie Settings</h1>
                <p className="text-white/70 max-w-xl mx-auto">Manage your cookie preferences. We only use cookies that are necessary or that directly improve your experience.</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-6">
                {cookieTypes.map((type, idx) => (
                    <motion.div key={type.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                        className={`p-8 rounded-xl border ${type.border} bg-white/[0.02]`}>
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className={`text-base font-light ${type.color}`}>{type.title}</h2>
                                    {type.required && <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/30 uppercase tracking-widest">Required</span>}
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed mb-4">{type.description}</p>
                                <div>
                                    <p className="text-xs text-white/75 uppercase tracking-widest mb-2">Examples:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {type.examples.map(ex => (
                                            <span key={ex} className={`text-xs px-2 py-1 rounded-lg ${type.bg} border ${type.border} ${type.color} opacity-70`}>{ex}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Toggle */}
                            <div className="shrink-0 mt-1">
                                {type.required ? (
                                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                                ) : (
                                    <button onClick={() => toggle(type.id)} className="relative w-12 h-6 rounded-full transition-all duration-300"
                                        style={{ backgroundColor: settings[type.id] ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)' }}>
                                        <span className="absolute top-1 transition-all duration-300 w-4 h-4 bg-white rounded-full"
                                            style={{ left: settings[type.id] ? '26px' : '4px' }} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                <div className="flex gap-4 pt-4">
                    <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-colors">
                        Reject All Optional
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors">
                        Save Preferences
                    </button>
                </div>

                <p className="text-center text-white/75 text-xs">For more information, see our <Link href="/privacy-policy" className="text-white/70 hover:text-white underline transition-colors">Privacy Policy</Link>.</p>
            </div>
        </div>
    );
}
