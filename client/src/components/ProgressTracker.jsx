import React from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, BarChart } from 'lucide-react';

export default function ProgressTracker({ progress, onReset, onSave, hasSaved }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-xl p-8 rounded-xl shadow-2xl border border-white/10 w-full mb-8 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <BarChart className="h-16 w-16 text-purple-400" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="text-base md:text-xl  text-white ">Your Mastery</h3>
                        <p className="text-purple-300/60 text-xs md:text-sm ">Tracking your journey to success</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onReset}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all text-sm "
                        >
                            <RefreshCw className="h-4 w-4" /> Reset
                        </motion.button>
                        <motion.button
                            whileHover={!hasSaved ? { scale: 1.05, boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)" } : {}}
                            whileTap={!hasSaved ? { scale: 0.95 } : {}}
                            onClick={onSave}
                            disabled={hasSaved}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all text-sm  shadow-lg ${hasSaved
                                ? 'bg-white/10 text-white/70 cursor-not-allowed border border-white/5'
                                : 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/30'
                                }`}
                        >
                            <Save className="h-4 w-4" /> {hasSaved ? 'Stored' : 'Save Path'}
                        </motion.button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-xs md:text-base  text-purple-200  st">Progress</span>
                        <span className="text-xl md:text-2xl  text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-5 p-1 shadow-inner border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 relative shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                        >
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
