import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronDown, 
    CheckCircle2, 
    Circle, 
    GraduationCap, 
    Layers, 
    UserCheck, 
    PlayCircle, 
    Terminal, 
    Box, 
    Cpu,
    ExternalLink,
    Wrench,
    FileCode,
    Rocket, 
    ShieldCheck, 
    Loader2,
    Brain
} from 'lucide-react';

export default function RoadmapDisplay({ 
    route, 
    completedModules = [], 
    onCompleteModule,
    isProcessing = false 
}) {
    const [expandedStep, setExpandedStep] = useState(0);

    // Support new Architect structure AND legacy structures
    const modules = route.roadmapData?.learning_route || 
                    (Array.isArray(route.roadmapData) ? route.roadmapData : []) ||
                    route.roadmapData?.learningPath || [];

    const handleExpand = (index) => {
        // Allow expanding if it's the first module or the previous one is completed
        const isLocked = index > 0 && !completedModules.includes(String(index - 1)) && !completedModules.includes(index - 1);
        if (isLocked) return;
        setExpandedStep(expandedStep === index ? null : index);
    };

    return (
        <div className="w-full space-y-6">
            {modules.map((module, index) => {
                const moduleId = String(module.module_number || index);
                const isCompleted = completedModules.includes(moduleId) || completedModules.includes(index);
                const isLocked = index > 0 && !completedModules.includes(String(index - 1)) && !completedModules.includes(index - 1);
                const isExpanded = expandedStep === index;

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative group bg-white/[0.01] border rounded-lg transition-all duration-500 ${
                            isCompleted ? 'border-emerald-500/20 bg-emerald-500/[0.03]' : 
                            isLocked ? 'border-white/[0.02] opacity-40 grayscale' : 
                            'border-white/[0.08] hover:border-violet-500/10 bg-white/[0.01]'
                        } overflow-hidden shadow-xl`}
                    >
                        {/* Header */}
                        <div
                            className={`p-3 md:p-3.5 flex items-center justify-between ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={() => handleExpand(index)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {isCompleted ? (
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-xl">
                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                        </div>
                                    ) : (
                                        <div className={`h-6 w-6 rounded-md border flex items-center justify-center font-semibold text-sm ${
                                            isLocked ? 'border-white/5 text-white/50' : 'border-violet-500/20 text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all'
                                        }`}>
                                            {index + 1}
                                        </div>
                                    )}
                                </div>
 
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`text-xs md:text-sm font-semibold   ${isCompleted ? 'text-emerald-500 opacity-60' : 'text-white/90'}`}>
                                            {module.module_title}
                                        </h3>
                                        {isLocked && <Layers className="h-3 w-3 text-white/40" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-violet-400/60">
                                            {module.level}
                                        </span>
                                        <span className="text-white/30 text-sm">•</span>
                                        <span className="text-sm font-semibold text-white/50">
                                            {module.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>
 
                            <div className="flex items-center gap-3">
                                {isCompleted && (
                                    <span className="hidden md:block text-sm font-semibold text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">Validated</span>
                                )}
                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                    <ChevronDown className={`h-3 w-3 ${isLocked ? 'text-white/40' : 'text-white/30'}`} />
                                </motion.div>
                            </div>
                        </div>

                        {/* Content */}
                        <AnimatePresence>
                            {isExpanded && !isLocked && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    <div className="border-t border-white/[0.05]">
                                        <div className="p-4 md:p-5 space-y-5">
                                            {/* Concepts & Tools */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-semibold text-white/50 flex items-center gap-2">
                                                        <Brain className="h-3 w-3 text-violet-500/50" /> Mastery Target
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {module.concepts?.map(c => (
                                                            <span key={c} className="px-2 py-1 rounded bg-white/[0.03] border border-white/10 text-xs font-semibold text-white/90 hover:text-white transition-colors">
                                                                {c}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-semibold text-white/50 flex items-center gap-2">
                                                        <Wrench className="h-3 w-3 text-cyan-500/50" /> Tech Stack
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {module.tools?.map(t => (
                                                            <span key={t} className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Video Training */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-white/50 flex items-center gap-2">
                                                    <PlayCircle className="h-3 w-3 text-red-500/50" /> Resource Hub
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {module.videos?.map((v, i) => (
                                                        <a 
                                                            key={i} href={v.url} target="_blank" rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-violet-500/30 transition-all group/v"
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="p-1.5 rounded bg-red-500/10 text-red-400">
                                                                    <PlayCircle className="h-3 w-3" />
                                                                </div>
                                                                <span className="text-xs font-semibold text-white/80 group-hover/v:text-white truncate max-w-[150px]">{v.title}</span>
                                                            </div>
                                                            <ExternalLink className="h-2.5 w-2.5 text-white/40 group-hover/v:text-violet-400 transition-colors" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Lab & Projects */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-semibold text-white/50 flex items-center gap-2">
                                                        <Terminal className="h-3 w-3 text-emerald-500/50" /> Laboratory
                                                    </h4>
                                                    <ul className="space-y-1.5">
                                                        {module.practice_tasks?.map((t, i) => (
                                                            <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-medium text-white/90 leading-relaxed hover:text-white transition-colors italic">
                                                                <div className="mt-1 h-1 w-1 rounded-full bg-violet-500/50 shrink-0" />
                                                                {t}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-semibold text-violet-400/80 flex items-center gap-2">
                                                        <FileCode className="h-3 w-3" /> Capstone
                                                    </h4>
                                                    <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20 shadow-xl">
                                                        <p className="text-xs font-semibold text-white/90 leading-relaxed mb-2 italic">
                                                            {module.mini_project}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-300">
                                                            <Rocket className="h-2.5 w-2.5" /> Deployment Target
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-white/5">
                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    disabled={isProcessing}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onCompleteModule(moduleId);
                                                    }}
                                                    className="w-full h-8 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-white font-semibold text-xs shadow-xl border border-violet-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                                                    {isProcessing ? "Verifying..." : "Sync Module"}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}
