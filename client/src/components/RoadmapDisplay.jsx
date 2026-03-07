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

    const handleExpand = async (index) => {
        if (expandedStep === index) {
            setExpandedStep(null);
            return;
        }

        setExpandedStep(index);

        if (!resources[index]) {
            setLoading(true);
            const stepName = ROUTE_STEPS[index].name;
            const query = `${route.goal} ${stepName}`;
            const fetched = await fetchLearningResources(query);
            setResources(prev => ({ ...prev, [index]: fetched }));
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            {ROUTE_STEPS.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isExpanded = expandedStep === index;
                const stepResources = resources[index] || [];

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative group bg-white/5 backdrop-blur-md border rounded-[1.5rem] transition-all duration-300 ${isCompleted
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
                                        <CheckCircle2 className="h-8 w-8 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                                    ) : (
                                        <Circle className="h-8 w-8 text-white/30 group-hover:text-purple-400 group-hover:border-purple-400 transition-colors" />
                                    )}
                                </motion.div>

                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-500/20' : 'bg-purple-500/20 group-hover:bg-purple-500/30'} transition-colors`}>
                                        <step.icon className={`h-6 w-6 ${isCompleted ? 'text-green-400' : 'text-purple-300'}`} />
                                    </div>
                                    <div>
                                        <h3 className={`text-base md:text-xl  tracking-tight ${isCompleted ? 'text-green-400 line-through opacity-60' : 'text-white'}`}>
                                            {step.name}
                                        </h3>
                                        <p className={`text-[10px] md:text-xs  uppercase tracking-widest ${isCompleted ? 'text-green-400/50' : 'text-purple-300/40'}`}>
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

                        {/* Expandable Content with AnimatePresence */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    className="overflow-hidden border-t border-white/5 bg-black/20"
                                >
                                    <div className="p-6 md:p-8">
                                        {loading ? (
                                            <div className="flex flex-col items-center justify-center py-10 gap-4">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                    className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full"
                                                />
                                                <p className="text-purple-300/60  text-sm uppercase tracking-widest animate-pulse">Scanning Intelligence...</p>
                                            </div>
                                        ) : stepResources.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {stepResources.map((res, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                    >
                                                        <ResourceCard resource={res} />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10">
                                                <p className="text-purple-300/40 ">Resources are being prepared. Check back shortly.</p>
                                            </div>
                                        )}
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
