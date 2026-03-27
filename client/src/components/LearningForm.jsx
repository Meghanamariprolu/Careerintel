import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap } from 'lucide-react';

const careers = [
    'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Software Engineer', 
    'Machine Learning Engineer', 'Data Scientist', 'AI Engineer', 'LLM Engineer', 
    'RAG Systems Engineer', 'DevOps Engineer', 'Cloud Engineer', 'Cybersecurity Analyst', 
    'Ethical Hacker', 'Mobile App Developer', 'Blockchain Developer', 'Data Analyst', 
    'Game Developer', 'Site Reliability Engineer'
];
const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function LearningForm({ onGenerate, isGenerating }) {
    const [goal, setGoal] = useState(careers[0]);
    const [level, setLevel] = useState(levels[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isGenerating) {
            onGenerate({ goal, level });
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="relative bg-[#0c0c1e]/60 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/10 max-w-sm w-full mb-8 overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-5">
                    <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                    <h2 className="text-lg font-bold text-white text-center ">Strategy Parameters</h2>
                </div>

                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-white/80 text-sm  font-bold st ml-1">
                            <Target className="h-3 w-3" /> Specialization
                        </label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full bg-white/5 text-white rounded-xl border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 p-3 outline-none transition-all cursor-pointer hover:bg-white/10 text-sm"
                        >
                            {careers.map(c => <option key={c} value={c} className="bg-[#0c0c1e]">{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-white/80 text-sm  font-bold st ml-1">
                            <Zap className="h-3 w-3" /> Deployment Level
                        </label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full bg-white/5 text-white rounded-xl border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 p-3 outline-none transition-all cursor-pointer hover:bg-white/10 text-sm"
                        >
                            {levels.map(l => <option key={l} value={l} className="bg-[#0c0c1e]">{l}</option>)}
                        </select>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)" }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isGenerating}
                        className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold  st text-xs hover:from-purple-500 hover:to-violet-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Initialize Path
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.form>
    );
}
