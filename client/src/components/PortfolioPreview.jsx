"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Code2, Rocket, Globe, Sparkles, Terminal } from 'lucide-react';

export default function PortfolioPreview({ data }) {
    if (!data) return null;

    const skillsArray = data.skills.split(',').map(s => s.trim()).filter(s => s !== '');

    return (
        <div className="w-full space-y-20">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative py-10 text-center border-b border-white/5"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-xl md:text-3xl font-bold mb-2  text-white ">
                        {data.name}
                    </h1>
                    <p className="text-xs md:text-sm font-bold text-purple-400 mb-4  ">
                        {data.title}
                    </p>
                    <p className="text-sm md:text-xs text-white/70 max-w-xl mx-auto leading-relaxed  st italic">
                        &ldquo;{data.bio}&rdquo;
                    </p>
                </motion.div>

                <div className="flex justify-center gap-3 mt-6">
                    {data.email && (
                        <a href={`mailto:${data.email}`} className="p-2.5 bg-white/[0.01] border border-white/5 rounded-lg hover:bg-white/5 transition-all shadow-xl">
                            <Mail className="h-4 w-4 text-purple-400/50" />
                        </a>
                    )}
                    {data.github && (
                        <a href={data.github} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.01] border border-white/5 rounded-lg hover:bg-white/5 transition-all shadow-xl">
                            <Github className="h-4 w-4 text-purple-400/50" />
                        </a>
                    )}
                    {data.linkedin && (
                        <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/[0.01] border border-white/5 rounded-lg hover:bg-white/5 transition-all shadow-xl">
                            <Linkedin className="h-4 w-4 text-purple-400/50" />
                        </a>
                    )}
                </div>
            </motion.section>

            {/* Arsenal (Skills) */}
            <section className="relative pt-10">
                <div className="flex items-center gap-3 mb-6">
                    <Terminal className="h-4 w-4 text-purple-500" />
                    <h2 className="text-sm font-bold  st text-white/70">Competency Matrix</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skillsArray.map((skill, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-4 py-1.5 bg-white/[0.01] border border-white/5 rounded-lg text-sm font-bold  st text-purple-200/50 shadow-xl"
                        >
                            {skill}
                        </motion.span>
                    ))}
                </div>
            </section>

            {/* Projects Grid */}
            <section className="relative">
                <div className="flex items-center gap-3 mb-6">
                    <Code2 className="h-4 w-4 text-purple-500" />
                    <h2 className="text-sm font-bold  st text-white/70">Deployment Nodes</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-lg p-6 hover:border-purple-500/10 transition-all shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Rocket className="h-20 w-20 text-purple-400" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xs md:text-sm font-bold text-white/90 group-hover:text-purple-400 transition-colors  ">
                                        {project.title}
                                    </h3>
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-purple-500/5 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-all">
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                </div>

                                <p className="text-sm text-white/70 leading-relaxed mb-6 font-medium  st italic">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                                    {project.tech.split(',').map((t, idx) => (
                                        <span key={idx} className="text-sm font-bold  st text-white/60 px-2 py-0.5 bg-white/5 rounded">
                                            {t.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer Mock */}
            <footer className="py-10 text-center border-t border-white/5">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="inline-block mb-4"
                >
                    <Sparkles className="h-6 w-6 text--400" />
                </motion.div>
                <p className="text-white/60 text-sm font-bold  ">
                    Generated by CareerIntel Intelligence Engine
                </p>
            </footer>
        </div>
    );
}
