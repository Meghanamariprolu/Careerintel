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
        <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-4">
            {/* Personal Intelligence Section */}
            <motion.div
                whileHover={{ y: -2 }}
                className="bg-white/[0.01] backdrop-blur-3xl p-4 md:p-6 rounded-lg border border-white/5 shadow-xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <User className="h-20 w-20 text-purple-400" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/5 rounded-lg border border-purple-500/10">
                            <User className="h-4 w-4 text-purple-400" />
                        </div>
                        <h2 className="text-sm st  text-white/70 font-bold">Identity Matrix</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm  st text-white/60 font-bold ml-1">Full Name</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Alex Rivera"
                                className="w-full bg-black/40 border border-white/5 rounded-lg p-3 text-xs focus:border-purple-500 outline-none transition-all placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm  st text-white/60 font-bold ml-1">Professional Focus</label>
                            <input
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. AI Research Engineer"
                                className="w-full bg-black/40 border border-white/5 rounded-lg p-3 text-xs focus:border-purple-500 outline-none transition-all placeholder:text-white/10"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-sm  st text-white/60 font-bold ml-1">Mission Statement (Bio)</label>
                            <textarea
                                required
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell your story..."
                                rows={3}
                                className="w-full bg-black/40 border border-white/5 rounded-lg p-3 text-xs focus:border-purple-500 outline-none transition-all placeholder:text-white/10 resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/10" />
                            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full bg-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:border-purple-500/50 outline-none transition-all" />
                        </div>
                        <div className="relative">
                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/10" />
                            <input name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" className="w-full bg-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:border-purple-500/50 outline-none transition-all" />
                        </div>
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/10" />
                            <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="w-full bg-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:border-purple-500/50 outline-none transition-all" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Core Competencies */}
            <motion.div
                whileHover={{ y: -2 }}
                className="bg-white/[0.01] backdrop-blur-3xl p-4 md:p-6 rounded-lg border border-white/5 shadow-xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu className="h-20 w-20 text-indigo-400" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                            <Cpu className="h-4 w-4 text-indigo-400" />
                        </div>
                        <h2 className="text-sm st  text-white/70 font-bold">Tech Stack</h2>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm  st text-white/60 font-bold ml-1">Key Skills (Comma Separated)</label>
                        <input
                            required
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Python, Tensor Flow, AWS..."
                            className="w-full bg-black/40 border border-white/5 rounded-lg p-3 text-xs focus:border-indigo-500 outline-none transition-all placeholder:text-white/10"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Projects Section */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/5 rounded-lg border border-purple-500/10">
                            <Briefcase className="h-4 w-4 text-purple-400" />
                        </div>
                        <h2 className="text-sm st  text-white/70 font-bold">Showcase Matrix</h2>
                    </div>
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addProject}
                        className="flex items-center gap-2 px-4 py-2 bg-white/[0.01] border border-white/5 rounded-lg text-sm font-bold  st hover:bg-white/5 transition-all shadow-xl"
                    >
                        <Plus className="h-3 w-3" /> New Node
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence>
                        {formData.projects.map((project, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-white/[0.01] backdrop-blur-3xl p-4 rounded-lg border border-white/5 shadow-xl relative"
                            >
                                <div className="absolute top-4 right-4">
                                    <button
                                        type="button"
                                        onClick={() => removeProject(index)}
                                        className="p-1.5 text-white/60 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold  st text-white/60 ml-1">Project Identifier</label>
                                            <input
                                                required
                                                value={project.title}
                                                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                                                className="w-full bg-black/40 border border-white/5 rounded-lg p-2.5 text-sm focus:border-purple-500/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold  st text-white/60 ml-1">Deployment URL</label>
                                            <input
                                                value={project.link}
                                                onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                                                className="w-full bg-black/40 border border-white/5 rounded-lg p-2.5 text-sm focus:border-purple-500/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold  st text-white/60 ml-1">Tech Stack Arsenal</label>
                                            <input
                                                required
                                                value={project.tech}
                                                onChange={(e) => handleProjectChange(index, 'tech', e.target.value)}
                                                placeholder="React, Node.js..."
                                                className="w-full bg-black/40 border border-white/5 rounded-lg p-2.5 text-sm focus:border-purple-500/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold  st text-white/60 ml-1">Execution Narrative</label>
                                        <textarea
                                            required
                                            value={project.description}
                                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                            rows={5}
                                            className="w-full bg-black/40 border border-white/5 rounded-lg p-2.5 text-sm focus:border-purple-500/50 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Submission Logic */}
            <div className="flex justify-center pt-6">
                <motion.button
                    whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(168, 85, 247, 0.1)" }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isGenerating}
                    type="submit"
                    className="group relative px-6 py-3 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 rounded-lg text-sm font-bold   overflow-hidden shadow-xl disabled:opacity-50 border border-white/5"
                >
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center gap-2">
                        {isGenerating ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full" />
                        ) : (
                            <>
                                <Sparkles className="h-3 w-3" />
                                Synchronize Architecture
                            </>
                        )}
                    </span>
                </motion.button>
            </div>
        </form>
    );
}
