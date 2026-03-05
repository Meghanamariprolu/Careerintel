import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const NextModulePrompter = ({ nextModuleName, nextModuleHref, description }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 p-8 md:p-12 rounded-[3rem] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-3xl"
        >
            <div className="max-w-2xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 mb-4 text-[10px] font-black uppercase tracking-widest text-indigo-300">
                    <Sparkles className="h-3 w-3" /> Intelligence Pipeline
                </div>
                <h3 className="text-lg md:text-2xl font-black text-white mb-2 tracking-tight">
                    Continue to {nextModuleName}
                </h3>
                <p className="text-xs md:text-base text-white/50 font-medium leading-relaxed">
                    {description || `Proceed to the next module in your career intelligence sequence to further refine your strategic profile.`}
                </p>
            </div>
            <Link href={nextModuleHref} className="shrink-0 w-full md:w-auto">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-8 py-5 bg-white text-slate-950 font-black text-xs md:text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 transition-all hover:bg-indigo-50"
                >
                    Proceed <ArrowRight className="h-5 w-5" />
                </motion.button>
            </Link>
        </motion.div>
    );
};
