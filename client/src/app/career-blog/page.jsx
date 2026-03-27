"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Clock, ArrowRight, Tag, Sparkles, TrendingUp, Brain, Rocket } from 'lucide-react';
import Link from 'next/link';

const posts = [
    {
        category:"AI & Careers",
        tag:"bg-indigo-500/20 text-indigo-300",
        icon: Sparkles,
        title:"How AI is Reshaping Career Development in 2025",
        excerpt:"From personalized learning paths to real-time job market signals, AI is transforming how professionals plan and execute their careers. We explore the key trends driving this revolution.",
        readTime:"6 min read",
        date:"March 5, 2025",
        featured: true,
    },
    {
        category:"Skill Strategy",
        tag:"bg-purple-500/20 text-purple-300",
        icon: TrendingUp,
        title:"The 5 Most In-Demand Tech Skills of 2025",
        excerpt:"TypeScript, LLM Engineering, Distributed Systems, Kubernetes, and Rust — we break down why these skills have seen explosive growth in job postings this year.",
        readTime:"4 min read",
        date:"March 1, 2025",
        featured: false,
    },
    {
        category:"Resume & Portfolio",
        tag:"bg-orange-500/20 text-orange-300",
        icon: Brain,
        title:"Why Your Resume is Being Rejected by ATS (And How to Fix It)",
        excerpt:"Over 75% of resumes are never seen by a human recruiter. Learn how Applicant Tracking Systems work and what changes will get your resume through the gates.",
        readTime:"8 min read",
        date:"Feb 25, 2025",
        featured: false,
    },
    {
        category:"Career Growth",
        tag:"bg-emerald-500/20 text-emerald-300",
        icon: Rocket,
        title:"From Junior to Senior: The Skills That Actually Matter",
        excerpt:"Technical depth, communication and system ownership — discover the three dimensions of seniority that go beyond just years of experience.",
        readTime:"5 min read",
        date:"Feb 20, 2025",
        featured: false,
    },
    {
        category:"AI & Careers",
        tag:"bg-indigo-500/20 text-indigo-300",
        icon: Sparkles,
        title:"Using AI Tools Effectively Without Losing Your Edge",
        excerpt:"GitHub Copilot, ChatGPT, and Cursor are useful, but over-reliance creates blind spots. Here's how to integrate AI tools into your workflow without stunting your growth.",
        readTime:"5 min read",
        date:"Feb 15, 2025",
        featured: false,
    },
    {
        category:"Skill Strategy",
        tag:"bg-purple-500/20 text-purple-300",
        icon: TrendingUp,
        title:"The Power of T-Shaped Skills in a Specialized Job Market",
        excerpt:"Broad knowledge with deep expertise in one or two areas is the winning formula. We explain how to build your T-shape strategically.",
        readTime:"3 min read",
        date:"Feb 10, 2025",
        featured: false,
    },
];

export default function CareerBlogPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const categories = ['All', 'AI & Careers', 'Skill Strategy', 'Resume & Portfolio', 'Career Growth'];

    const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);
    const featured = posts.find(p => p.featured);
    const rest = filtered.filter(p => !p.featured);

    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden">
            {/* Header */}
            <div className="relative py-20 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full" />
                </div>
                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs   transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-xs   text-purple-300">
                    <BookOpen className="h-3 w-3" /> Career Intelligence Blog
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-light  text-white mb-4">Career Blog</h1>
                <p className="text-white/70 max-w-xl mx-auto">Insights, strategies, and intelligence to accelerate your professional trajectory.</p>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-24">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs   transition-all border ${activeCategory === cat ? 'bg-white/10 border-white/20 text-white' : 'border-white/10 text-white/70 hover:text-white hover:border-white/20'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured Post */}
                {activeCategory === 'All' && featured && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 p-10 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-white/10 group cursor-pointer hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`text-xs px-3 py-1 rounded-full border ${featured.tag} border-indigo-500/30`}>{featured.category}</span>
                            <span className="text-white/75 text-xs   flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readTime}</span>
                            <span className="text-white/75 text-xs">{featured.date}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-light text-white mb-4  group-hover:text-indigo-400 transition-colors">{featured.title}</h2>
                        <p className="text-white/75 leading-relaxed max-w-3xl mb-6">{featured.excerpt}</p>
                        <span className="inline-flex items-center gap-2 text-indigo-400 text-sm hover:gap-3 transition-all">Read Article <ArrowRight className="h-4 w-4" /></span>
                    </motion.div>
                )}

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((post, idx) => (
                        <motion.article
                            key={post.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.07 }} className="group p-7 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <post.icon className="h-4 w-4 text-white/75" />
                                </div>
                                <span className={`text-sm px-2 py-0.5 rounded-full ${post.tag}`}>{post.category}</span>
                            </div>
                            <h3 className="text-base font-light text-white mb-3 leading-snug group-hover:text-purple-300 transition-colors flex-grow">{post.title}</h3>
                            <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3 text-white/75 text-xs">
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                                    <span>{post.date}</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-white/75 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
}
