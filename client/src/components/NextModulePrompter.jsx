import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const NextModulePrompter = ({ nextModuleName, nextModuleHref, description }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-10 p-4 md:p-5 rounded-lg bg-gradient-to-r from-violet-500/5 via-indigo-500/5 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-3xl shadow-xl"
        >
            <div className="max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-2 text-sm  font-bold st text-violet-400">
                    <Sparkles className="h-2 w-2" /> INTELLIGENCE PIPELINE
                </div>
                <h3 className="text-sm md:text-xs font-bold text-white/90 mb-1  ">
                    Continue to {nextModuleName}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed max-w-lg font-medium  st italic">
                    {description || `Proceed to the next module in your career intelligence sequence.`}
                </p>
            </div>
            <Link href={nextModuleHref} className="shrink-0 w-full md:w-auto">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-5 h-8 bg-white text-slate-950 text-sm font-bold  st rounded-lg shadow-xl flex items-center justify-center gap-2 transition-all hover:bg-slate-50"
                >
                    Proceed <ArrowRight className="h-3 w-3" />
                </motion.button>
            </Link>
        </motion.div>
    );
};
