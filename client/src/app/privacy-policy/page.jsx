"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const sections = [
    {
        title: "1. Information We Collect",
        content: `We collect information you provide directly to us when you:\n\n• Create an account (name, email address, password)\n• Generate career roadmaps (career goals, experience level, target roles)\n• Update your profile and skills\n• Communicate with us via support\n\nWe also automatically collect certain information when you use our Service, including your IP address, browser type, operating system, and usage data through standard server logs.`
    },
    {
        title: "2. How We Use Your Information",
        content: `We use the information we collect to:\n\n• Provide, maintain, and improve our services\n• Generate personalized AI career roadmaps\n• Authenticate your account and protect against unauthorized access\n• Send you technical notices and support messages\n• Analyze usage patterns to improve our platform\n\nWe do NOT sell your personal data to third parties. We do not use your career data to train our AI models without explicit, informed consent.`
    },
    {
        title: "3. Data Security",
        content: `We implement industry-standard security measures to protect your personal information:\n\n• All data is transmitted over HTTPS/TLS encrypted connections\n• Passwords are hashed using bcrypt — we never store plaintext passwords\n• Authentication uses JWT tokens with appropriate expiration windows\n• Our database connections use TLS and IP allowlisting\n• We conduct regular security reviews of our infrastructure\n\nWhile we take security seriously, no method of transmission over the Internet is 100% secure.`
    },
    {
        title: "4. Data Retention",
        content: `We retain your personal information for as long as your account is active. You can request deletion of your account and associated data at any time by contacting support@careerintel.ai.\n\nUpon deletion, we will remove your personal data from our active databases within 30 days. Some information may be retained in our backup systems for up to 90 days before being permanently deleted.`
    },
    {
        title: "5. Cookies",
        content: `We use minimal, essential cookies to:\n\n• Maintain your login session\n• Remember your preferences\n• Analyze aggregate usage patterns (via analytics tools)\n\nWe do not use advertising or cross-site tracking cookies. See our Cookie Settings page for more details and to manage your preferences.`
    },
    {
        title: "6. Your Rights",
        content: `Depending on your location, you may have the following rights regarding your personal data:\n\n• Right to access the personal data we hold about you\n• Right to correct inaccurate data\n• Right to delete your data ("right to be forgotten")\n• Right to data portability\n• Right to object to processing\n\nTo exercise any of these rights, please contact us at legal@careerintel.ai.`
    },
    {
        title: "7. Contact Us",
        content: `If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:\n\nCareerIntel Technology Group\nEmail: legal@careerintel.ai\nSupport: support@careerintel.ai`
    },
];

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden">
            <div className="relative py-20 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full" />
                </div>
                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-xs uppercase tracking-[0.25em] text-blue-300">
                    <Shield className="h-3 w-3" /> Legal
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-light tracking-tighter text-white mb-4">Privacy Policy</h1>
                <p className="text-white/30 text-sm">Last updated: March 7, 2025</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 pb-24">
                <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/20 mb-10">
                    <p className="text-white/60 text-sm leading-relaxed">
                        At CareerIntel, your privacy is fundamental to our mission. This Privacy Policy explains how we collect, use, and protect your personal information when you use our AI career intelligence platform.
                    </p>
                </div>

                <div className="space-y-10">
                    {sections.map((section, idx) => (
                        <motion.section key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                            <h2 className="text-base font-light text-white mb-4 tracking-wide border-b border-white/5 pb-3">{section.title}</h2>
                            <div className="text-white/75 text-sm leading-relaxed whitespace-pre-line">{section.content}</div>
                        </motion.section>
                    ))}
                </div>
            </div>
        </div>
    );
}
