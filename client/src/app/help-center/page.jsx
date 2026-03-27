"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, ChevronDown, ChevronUp, BookOpen, MessageSquare, Zap, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const faqs = [
    {
        category:"Getting Started",
        icon: Zap,
        color:"text-indigo-400",
        bg:"bg-indigo-500/10",
        border:"border-indigo-500/20",
        items: [
            { q:"How do I generate my first AI Career Roadmap?", a:"Navigate to your Dashboard and click 'Generate New Roadmap'. Enter your target career, experience level, and goals. Our AI will generate a personalized, step-by-step learning path in seconds." },
            { q:"What information do I need to get started?", a:"All you need is a registered account. You can start generating roadmaps immediately. For best results, have your current skills and target role in mind before generating." },
            { q:"Is my data secure?", a:"Yes. We use industry-standard JWT authentication, encrypted database connections (TLS), and never share your personal career data with third parties." },
        ]
    },
    {
        category:"AI Roadmaps",
        icon: BookOpen,
        color:"text-purple-400",
        bg:"bg-purple-500/10",
        border:"border-purple-500/20",
        items: [
            { q:"How does the AI generate my roadmap?", a:"Our system uses the Hugging Face Inference API combined with structured career intelligence data to create custom roadmaps based on your career goal, experience level, and market demand signals." },
            { q:"Can I track my progress on a roadmap?", a:"Yes! On each roadmap detail page, you can check off individual skills as you complete them. Your progress is saved automatically to the database." },
            { q:"Can I delete a roadmap I no longer need?", a:"Yes. From your Dashboard, each roadmap card has a delete option. You can also delete it from the roadmap's detail page." },
        ]
    },
    {
        category:"Account & Billing",
        icon: Shield,
        color:"text-emerald-400",
        bg:"bg-emerald-500/10",
        border:"border-emerald-500/20",
        items: [
            { q:"How do I update my profile information?", a:"Go to Dashboard → Profile to update your name, email, and other personal details." },
            { q:"How do I reset my password?", a:"Currently, password reset is handled by contacting support. We are working on adding a self-service password reset feature soon." },
            { q:"Is CareerIntel free to use?", a:"CareerIntel is currently in beta and all core features are free. We will introduce premium tiers in the future with advanced AI credits and priority generation." },
        ]
    },
];

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItem, setOpenItem] = useState(null);

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden">
            {/* Header */}
            <div className="relative py-20 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full" />
                </div>
                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs   transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-xs   text-indigo-300">
                    <HelpCircle className="h-3 w-3" /> Support Center
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-light  text-white mb-4">Help Center</h1>
                <p className="text-white/70 max-w-xl mx-auto mb-10">Find answers to common questions about CareerIntel's AI-powered career intelligence platform.</p>

                {/* Search */}
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input type="text" placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white placeholder:text-white/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                </div>
            </div>

            {/* FAQs */}
            <div className="max-w-4xl mx-auto px-6 pb-24 space-y-12">
                {filteredFaqs.map((cat) => (
                    <section key={cat.category}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-xl ${cat.bg} border ${cat.border}`}>
                                <cat.icon className={`h-5 w-5 ${cat.color}`} />
                            </div>
                            <h2 className="text-xl font-light text-white ">{cat.category}</h2>
                        </div>
                        <div className="space-y-3">
                            {cat.items.map((item, idx) => {
                                const key = `${cat.category}-${idx}`;
                                const isOpen = openItem === key;
                                return (
                                    <motion.div key={key} className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden">
                                        <button
                                            onClick={() => setOpenItem(isOpen ? null : key)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-colors"
                                        >
                                            <span className="text-white/80 font-light">{item.q}</span>
                                            {isOpen ? <ChevronUp className="h-4 w-4 text-white/60 shrink-0" /> : <ChevronDown className="h-4 w-4 text-white/60 shrink-0" />}
                                        </button>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }} className="overflow-hidden"
                                                >
                                                    <p className="px-5 pb-5 text-white/75 text-sm leading-relaxed border-t border-white/5 pt-4">{item.a}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {/* Contact Card */}
                <div className="p-8 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-center">
                    <MessageSquare className="h-8 w-8 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-xl font-light text-white mb-2">Still need help?</h3>
                    <p className="text-white/70 text-sm mb-6">Our support team is available to help you with any questions.</p>
                    <a href="mailto:support@careerintel.ai" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-sm transition-colors">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
