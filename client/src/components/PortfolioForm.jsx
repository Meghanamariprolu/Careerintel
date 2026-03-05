"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Plus, Trash2, Cpu, Globe, Mail, Github, Linkedin, Sparkles } from 'lucide-react';

export default function PortfolioForm({ initialData, onGenerate, isGenerating }) {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        title: '',
        bio: '',
        email: '',
        github: '',
        linkedin: '',
        skills: '',
        projects: [{ title: '', description: '', tech: '', link: '' }]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index][field] = value;
        setFormData(prev => ({ ...prev, projects: updatedProjects }));
    };

    const addProject = () => {
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, { title: '', description: '', tech: '', link: '' }]
        }));
    };

    const removeProject = (index) => {
        if (formData.projects.length > 1) {
            const updatedProjects = formData.projects.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, projects: updatedProjects }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-10">
            {/* Personal Intelligence Section */}
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <User className="h-32 w-32 text-purple-400" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                            <User className="h-6 w-6 text-purple-400" />
                        </div>
                        <h2 className="text-base md:text-xl font-black tracking-tight">Identity</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-purple-300/60 ml-1">Full Name</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Alex Rivera"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-purple-300/60 ml-1">Professional Focus</label>
                            <input
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. AI Research Engineer"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all placeholder:text-white/10"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-purple-300/60 ml-1">Mission Statement (Bio)</label>
                            <textarea
                                required
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell your story..."
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none transition-all placeholder:text-white/10 resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-purple-500/50 outline-none transition-all" />
                        </div>
                        <div className="relative">
                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <input name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-purple-500/50 outline-none transition-all" />
                        </div>
                        <div className="relative">
                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-purple-500/50 outline-none transition-all" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Core Competencies */}
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu className="h-32 w-32 text-indigo-400" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                            <Cpu className="h-6 w-6 text-indigo-400" />
                        </div>
                        <h2 className="text-base md:text-xl font-black tracking-tight">Tech Stack</h2>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-indigo-300/60 ml-1">Key Skills (Comma Separated)</label>
                        <input
                            required
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Python, Tensor Flow, AWS..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-indigo-500 outline-none transition-all placeholder:text-white/10"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Projects Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                            <Briefcase className="h-6 w-6 text-purple-400" />
                        </div>
                        <h2 className="text-base md:text-xl font-black tracking-tight">Showcase</h2>
                    </div>
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addProject}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        <Plus className="h-4 w-4" /> Add Logic
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <AnimatePresence>
                        {formData.projects.map((project, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-xl relative"
                            >
                                <div className="absolute top-6 right-6">
                                    <button
                                        type="button"
                                        onClick={() => removeProject(index)}
                                        className="p-2 text-white/10 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-white/20 ml-1">Project Name</label>
                                            <input
                                                required
                                                value={project.title}
                                                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl p-3 focus:border-purple-500/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-white/20 ml-1">Live/Repo URL</label>
                                            <input
                                                value={project.link}
                                                onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl p-3 focus:border-purple-500/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-white/20 ml-1">Arsenal (Tech Used)</label>
                                            <input
                                                required
                                                value={project.tech}
                                                onChange={(e) => handleProjectChange(index, 'tech', e.target.value)}
                                                placeholder="React, Node.js..."
                                                className="w-full bg-black/40 border border-white/5 rounded-xl p-3 focus:border-purple-500/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-white/20 ml-1">Execution Story (Description)</label>
                                        <textarea
                                            required
                                            value={project.description}
                                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                            rows={6}
                                            className="w-full bg-black/40 border border-white/5 rounded-xl p-3 focus:border-purple-500/50 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Submission Logic */}
            <div className="flex justify-center pt-10">
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isGenerating}
                    type="submit"
                    className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-[2rem] text-xl font-black uppercase tracking-[0.3em] overflow-hidden shadow-2xl disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center gap-4">
                        {isGenerating ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full" />
                        ) : (
                            <>
                                <Sparkles className="h-6 w-6" />
                                Build Presence
                            </>
                        )}
                    </span>
                </motion.button>
            </div>
        </form>
    );
}
