"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: `By accessing or using CareerIntel ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.\n\nThese Terms apply to all visitors, users, and others who access or use the Service.`
    },
    {
        title: "2. Description of Service",
        content: `CareerIntel is an AI-powered career intelligence platform that helps users:\n\n• Generate personalized career roadmaps using AI\n• Track skill development and learning progress\n• Analyze job market compatibility\n• Enhance resumes and professional profiles\n• Receive AI-driven career coaching and mentorship\n\nThe Service is provided "as is" and CareerIntel reserves the right to modify, suspend, or discontinue features at any time.`
    },
    {
        title: "3. User Accounts",
        content: `To access certain features, you must create an account. You are responsible for:\n\n• Maintaining the confidentiality of your account credentials\n• All activities that occur under your account\n• Notifying us immediately of any unauthorized access\n\nYou must provide accurate and complete information when creating an account. CareerIntel reserves the right to terminate accounts that violate these terms.`
    },
    {
        title: "4. Acceptable Use",
        content: `You agree NOT to use the Service to:\n\n• Violate any applicable laws or regulations\n• Upload malicious code or attempt to breach security\n• Misrepresent yourself or your professional background\n• Scrape, harvest, or collect user data without permission\n• Use the AI outputs to deceive employers with fabricated credentials\n• Interfere with other users' enjoyment of the Service\n\nViolation of these terms may result in immediate account suspension.`
    },
    {
        title: "5. AI-Generated Content Disclaimer",
        content: `CareerIntel uses AI to generate career roadmaps and recommendations. Please note:\n\n• AI-generated content is for informational purposes only and does not constitute professional career advice\n• Job market data and salary information is estimated and may not reflect current conditions\n• Skill recommendations should be verified against current industry standards\n• You should consult human career professionals for major career decisions\n\nCareerIntel does not guarantee career outcomes or employment success.`
    },
    {
        title: "6. Intellectual Property",
        content: `The Service and its original content, features, and functionality are owned by CareerIntel and are protected by international copyright, trademark, and other IP laws.\n\nAI-generated roadmaps and content produced for your account are yours to use for personal career development purposes. You may not resell or distribute AI-generated content from CareerIntel as your own product.`
    },
    {
        title: "7. Limitation of Liability",
        content: `To the maximum extent permitted by law, CareerIntel shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:\n\n• Your use or inability to use the Service\n• Career decisions made based on AI recommendations\n• Any errors or omissions in the Service's content\n• Unauthorized access to or alteration of your data`
    },
    {
        title: "8. Changes to Terms",
        content: `We reserve the right to modify these Terms at any time. We will provide notice of significant changes via email or a prominent notice on our Service. Your continued use of the Service after changes constitutes acceptance of the new Terms.\n\nFor questions about these Terms, contact us at legal@careerintel.ai.`
    },
];

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden">
            <div className="relative py-20 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full" />
                </div>
                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-xs uppercase tracking-[0.25em] text-indigo-300">
                    <FileText className="h-3 w-3" /> Legal
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-light tracking-tighter text-white mb-4">Terms of Service</h1>
                <p className="text-white/30 text-sm">Last updated: March 7, 2025</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 pb-24">
                <div className="p-6 rounded-xl bg-indigo-500/5 border border-indigo-500/20 mb-10">
                    <p className="text-white/60 text-sm leading-relaxed">
                        Please read these Terms of Service carefully before using CareerIntel. These terms govern your access to and use of our platform and services.
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
