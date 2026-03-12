import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, GraduationCap, LayoutPanelLeft, Layers, Briefcase, UserCheck } from 'lucide-react';
import ResourceCard from './ResourceCard';
import { fetchLearningResources } from '../services/apiService';

const ROUTE_STEPS = [
    { name: 'Fundamentals', icon: GraduationCap },
    { name: 'Tools & Technologies', icon: LayoutPanelLeft },
    { name: 'Hands-on Projects', icon: Layers },
    { name: 'Portfolio Building', icon: Briefcase },
    { name: 'Interview Preparation', icon: UserCheck }
];

export default function RoadmapDisplay({ route, completedSteps, onToggleStep }) {
    const [expandedStep, setExpandedStep] = useState(null);
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState(false);

    // Use dynamic steps from route.roadmapData if available, otherwise default to legacy/static names
    const steps = route.roadmapData?.length > 0 
        ? route.roadmapData.map((s, idx) => ({ 
            name: s.level || s.month || `Phase ${idx+1}`, 
            description: s.description || '',
            skills: s.skills || [],
            icon: idx === 0 ? GraduationCap : idx === route.roadmapData.length - 1 ? UserCheck : Layers
          }))
        : ROUTE_STEPS;

    const handleExpand = async (index) => {
        if (expandedStep === index) {
            setExpandedStep(null);
            return;
        }

        setExpandedStep(index);

        if (!resources[index]) {
            setLoading(true);
            const stepName = steps[index].name;
            const query = `${route.goal} ${stepName} ${steps[index].skills?.join(' ')}`;
            const fetched = await fetchLearningResources(query);
            setResources(prev => ({ ...prev, [index]: fetched }));
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isExpanded = expandedStep === index;
                const stepResources = resources[index] || [];

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative group bg-[#0c0c1e]/40 backdrop-blur-md border rounded-[1.5rem] transition-all duration-300 ${isCompleted
                            ? 'border-green-500/30 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.05)]'
                            : 'border-white/10 hover:border-purple-500/30 hover:bg-white/10'
                            } overflow-hidden`}
                    >
                        {/* Interactive Step Header */}
                        <div
                            className="p-6 flex items-center justify-between cursor-pointer"
                            onClick={() => handleExpand(index)}
                        >
                            <div className="flex items-center gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleStep(index);
                                    }}
                                    className="relative z-10"
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-8 w-8 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]" />
                                    ) : (
                                        <Circle className="h-8 w-8 text-white/20 group-hover:text-purple-400 transition-colors" />
                                    )}
                                </motion.div>

                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-500/20' : 'bg-purple-500/20 group-hover:bg-purple-500/30'} transition-colors`}>
                                        <step.icon className={`h-6 w-6 ${isCompleted ? 'text-green-400' : 'text-purple-300'}`} />
                                    </div>
                                    <div className="max-w-[150px] md:max-w-none">
                                        <h3 className={`text-base md:text-xl font-bold tracking-tight ${isCompleted ? 'text-green-400 line-through opacity-60' : 'text-white'}`}>
                                            {step.name}
                                        </h3>
                                        <p className={`text-[10px] uppercase font-black tracking-[0.2em] ${isCompleted ? 'text-green-400/50' : 'text-purple-400/60'}`}>
                                            {isCompleted ? 'Mastered' : `Module 0${index + 1}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                className="text-white/20 group-hover:text-white transition-colors"
                            >
                                <ChevronDown className="h-6 w-6" />
                            </motion.div>
                        </div>

                        {/* Expandable Content */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    className="overflow-hidden border-t border-white/5 bg-black/40"
                                >
                                    <div className="p-8 md:p-10 space-y-8">
                                        {/* Description & Skills */}
                                        <div className="space-y-4">
                                            <p className="text-white/60 text-base leading-relaxed font-medium">
                                                {step.description || "Synthesizing deep-dive modules for this level..."}
                                            </p>
                                            {step.skills?.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {step.skills.map(skill => (
                                                        <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="h-px bg-white/5 w-full" />

                                        {/* Resources */}
                                        <div className="space-y-6">
                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                                                <Sparkles className="h-3.5 w-3.5" /> Intelligence Feeds
                                            </h4>
                                            
                                            {loading ? (
                                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                        className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full"
                                                    />
                                                    <p className="text-purple-300/40 text-xs font-black uppercase tracking-widest animate-pulse tracking-[0.3em]">Scanning Knowledge Graph...</p>
                                                </div>
                                            ) : stepResources.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {stepResources.map((res, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: i * 0.05 }}
                                                        >
                                                            <ResourceCard resource={res} />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed">
                                                    <p className="text-white/20 text-sm font-bold">No external intelligence mapped for this node yet.</p>
                                                </div>
                                            )}
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
