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
                className="relative py-20 text-center"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-lg md:text-2xl  mb-4 tracking-tight text-white drop-shadow-[0_10px_30px_rgba(168,85,247,0.3)] uppercase">
                        {data.name}
                    </h1>
                    <p className="text-base md:text-xl  bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-6 uppercase tracking-widest">
                        {data.title}
                    </p>
                    <p className="text-sm md:text-lg text-white/40 max-w-2xl mx-auto  leading-relaxed">
                        {data.bio}
                    </p>
                </motion.div>

                <div className="flex justify-center gap-6 mt-12">
                    {data.email && (
                        <a href={`mailto:${data.email}`} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/50 transition-all">
                            <Mail className="h-6 w-6 text-purple-300" />
                        </a>
                    )}
                    {data.github && (
                        <a href={data.github} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/50 transition-all">
                            <Github className="h-6 w-6 text-purple-300" />
                        </a>
                    )}
                    {data.linkedin && (
                        <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/50 transition-all">
                            <Linkedin className="h-6 w-6 text-purple-300" />
                        </a>
                    )}
                </div>
            </motion.section>

            {/* Arsenal (Skills) */}
            <section className="relative">
                <div className="flex items-center gap-4 mb-12">
                    <Terminal className="h-8 w-8 text-purple-500" />
                    <h2 className="text-base md:text-xl  tracking-tighter text-white">The Arsenal</h2>
                </div>
                <div className="flex flex-wrap gap-4">
                    {skillsArray.map((skill, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -5, backgroundColor: "rgba(168, 85, 247, 0.2)", borderColor: "rgba(168, 85, 247, 0.4)" }}
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] md:text-xs  uppercase tracking-[0.2em] text-purple-200 transition-all cursor-default"
                        >
                            {skill}
                        </motion.span>
                    ))}
                </div>
            </section>

            {/* Projects Grid */}
            <section className="relative">
                <div className="flex items-center gap-4 mb-12">
                    <Code2 className="h-8 w-8 text-purple-500" />
                    <h2 className="text-base md:text-xl  tracking-tighter text-white">Deployments</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {data.projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-10 hover:border-purple-500/30 transition-all shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Rocket className="h-40 w-40 text-purple-400" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-base md:text-xl  tracking-tight group-hover:text-purple-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-3 bg-purple-500/20 rounded-xl text-purple-400 hover:bg-purple-500/40 transition-all">
                                            <ExternalLink className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>

                                <p className="text-sm md:text-lg text-white/40  leading-relaxed mb-8">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                                    {project.tech.split(',').map((t, idx) => (
                                        <span key={idx} className="text-[10px]  uppercase tracking-widest text-purple-300/40 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
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
            <footer className="py-20 text-center border-t border-white/5">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="inline-block mb-6"
                >
                    <Sparkles className="h-8 w-8 text-purple-500/30" />
                </motion.div>
                <p className="text-white/10 text-xs  uppercase tracking-[0.5em]">
                    Generated by CareerIntel Intelligence Engine
                </p>
            </footer>
        </div>
    );
}
