"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, ShieldCheck, KeyRound, Server, Eye, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const measures = [
    {
        icon: KeyRound,
        title: "Password Security",
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        points: [
            "Passwords are hashed using bcrypt with a work factor of 12 — we never store plaintext passwords",
            "Minimum password length of 8 characters is enforced",
            "Passwords are never logged or included in error messages",
        ]
    },
    {
        icon: Lock,
        title: "Data Transmission",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        points: [
            "All data is transmitted over HTTPS with TLS 1.2+ encryption",
            "HTTP Strict Transport Security (HSTS) is enforced",
            "API responses include security headers (Helmet.js) to prevent common attacks like XSS and clickjacking",
        ]
    },
    {
        icon: Server,
        title: "Database Security",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        points: [
            "MongoDB Atlas with TLS-encrypted connections and IP allowlisting",
            "Database credentials are stored securely as environment variables, never in code",
            "Regular automated database backups with encryption at rest",
        ]
    },
    {
        icon: ShieldCheck,
        title: "Authentication",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        points: [
            "JWT tokens with 30-day expiration windows and server-side validation",
            "Tokens are transmitted via secure Authorization headers, not exposed in URLs",
            "Session tokens are invalidated upon logout",
        ]
    },
    {
        icon: Eye,
        title: "Access Controls",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        points: [
            "Role-based access control (RBAC) ensures users can only access their own data",
            "All API endpoints require valid authentication tokens",
            "Administrative actions require elevated privilege verification",
        ]
    },
    {
        icon: AlertTriangle,
        title: "Vulnerability Management",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        points: [
            "Input validation using Zod on all API endpoints to prevent injection attacks",
            "Rate limiting applied to sensitive endpoints like login and registration",
            "Regular dependency audits using npm audit to identify and patch vulnerabilities",
        ]
    },
];

export default function DataSecurityPage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden">
            <div className="relative py-20 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-600/10 blur-[120px] rounded-full" />
                </div>
                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-xs uppercase tracking-[0.25em] text-emerald-300">
                    <Lock className="h-3 w-3" /> Security Architecture
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-light tracking-tighter text-white mb-4">Data Security</h1>
                <p className="text-white/70 max-w-xl mx-auto">We take the security of your career data seriously. Here's exactly how we protect it.</p>
            </div>

            <div className="max-w-5xl mx-auto px-6 pb-24">
                {/* Overview */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 mb-12 text-center">
                    <ShieldCheck className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
                    <p className="text-white/60 text-sm leading-relaxed max-w-2xl mx-auto">
                        CareerIntel is built with a security-first architecture. We apply industry best practices across every layer of our stack — from how we store your password, to how we transmit your data, to how we restrict access to our databases.
                    </p>
                </div>

                {/* Security Measures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {measures.map((m, idx) => (
                        <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                            className={`p-7 rounded-xl border ${m.border} bg-white/[0.02] hover:bg-white/[0.04] transition-all`}>
                            <div className={`p-3 rounded-xl ${m.bg} border ${m.border} w-fit mb-5`}>
                                <m.icon className={`h-5 w-5 ${m.color}`} />
                            </div>
                            <h3 className={`text-base font-light ${m.color} mb-4`}>{m.title}</h3>
                            <ul className="space-y-3">
                                {m.points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                                        <div className={`h-1.5 w-1.5 rounded-full ${m.bg} border ${m.border} mt-1.5 shrink-0`} />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Responsible Disclosure */}
                <div className="mt-12 p-8 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                    <h3 className="text-lg font-light text-white mb-3">Found a Security Issue?</h3>
                    <p className="text-white/70 text-sm mb-6 max-w-xl mx-auto">We take security disclosures seriously. If you discover a vulnerability, please report it responsibly and we will address it promptly.</p>
                    <a href="mailto:security@careerintel.ai" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600/80 hover:bg-emerald-600 rounded-xl text-white text-sm transition-colors">
                        <Lock className="h-4 w-4" /> Report a Vulnerability
                    </a>
                </div>
            </div>
        </div>
    );
}
