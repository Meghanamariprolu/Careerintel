import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap } from 'lucide-react';

const careers = ['AI', 'Data Science', 'Full Stack', 'Cybersecurity'];
const levels = ['Beginner', 'Intermediate'];

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
            className="relative bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20 max-w-lg w-full mb-8 overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-violet-500/10 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
                    <h2 className="text-base md:text-xl font-black text-white text-center tracking-tight">Generate Route</h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-purple-200 text-xs md:text-base font-bold ml-1">
                            <Target className="h-4 w-4" /> Career Goal
                        </label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full bg-black/40 text-white rounded-2xl border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 p-3 md:p-4 outline-none transition-all cursor-pointer hover:bg-black/60 text-sm md:text-lg font-medium"
                        >
                            {careers.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-purple-200 text-xs md:text-base font-bold ml-1">
                            <Zap className="h-4 w-4" /> Skill Level
                        </label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full bg-black/40 text-white rounded-2xl border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 p-3 md:p-4 outline-none transition-all cursor-pointer hover:bg-black/60 text-sm md:text-lg font-medium"
                        >
                            {levels.map(l => <option key={l} value={l} className="bg-gray-900">{l}</option>)}
                        </select>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(168, 85, 247, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isGenerating}
                        className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-black text-xl hover:from-purple-500 hover:to-violet-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : 'Create Your Path'}
                    </motion.button>
                </div>
            </div>
        </motion.form>
    );
}
