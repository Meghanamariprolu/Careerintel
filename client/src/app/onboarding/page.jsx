"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { Sparkles, ArrowRight, ArrowLeft, Target, GraduationCap, Briefcase, Code, Brain, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Logo } from '@/components/ui/Logo';

const steps = [
    { 
        id: 'goal', 
        title: 'Career Destination', 
        question: 'What is your primary career goal?',
        icon: Target,
        placeholder: 'e.g., Senior Frontend Engineer @ Google',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10'
    },
    { 
        id: 'experience', 
        title: 'Seniority Level', 
        question: 'Where are you in your career journey?',
        icon: Briefcase,
        placeholder: 'Select your level',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10'
    },
    { 
        id: 'education', 
        title: 'Academic Profile', 
        question: 'What is your highest level of education?',
        icon: GraduationCap,
        placeholder: 'e.g., MS in Computer Science',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10'
    },
    { 
        id: 'skills', 
        title: 'Technical Arsenal', 
        question: 'What are your core technical skills?',
        icon: Code,
        placeholder: 'e.g. React, Node.js, Python, AWS (comma separated)',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10'
    },
    { 
        id: 'interests', 
        title: 'Strategic Interests', 
        question: 'What areas fascinate you most?',
        icon: Brain,
        placeholder: 'e.g. Artificial Intelligence, Cloud Computing, UX Design',
        color: 'text-pink-400',
        bg: 'bg-pink-500/10'
    }
];

export default function OnboardingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { updateProfile } = useUserProfile();

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        careerGoal: '',
        experienceLevel: '',
        education: '',
        skills: '',
        interests: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Map step.id to formData keys
    const idToKey = {
        goal: 'careerGoal',
        experience: 'experienceLevel',
        education: 'education',
        skills: 'skills',
        interests: 'interests'
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const key = idToKey[id];
        if (key) {
            setFormData(prev => ({ ...prev, [key]: value }));
        }
    };

    const handleNext = () => {
        const step = steps[currentStep];
        const key = idToKey[step.id];
        const value = formData[key];
        
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formattedData = {
                ...formData,
                skills: typeof formData.skills === 'string' ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : formData.skills,
                interests: typeof formData.interests === 'string' ? formData.interests.split(',').map(s => s.trim()).filter(Boolean) : formData.interests,
            };

            const token = localStorage.getItem('token');
            if (token) {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Using relative path, axios usually prepends the baseURL if configured
                await axios.put('/api/auth/profile', formattedData, config);
            }

            updateProfile({
                careerGoal: formattedData.careerGoal,
                experienceLevel: formattedData.experienceLevel,
                education: formattedData.education,
                currentSkills: formattedData.skills,
                interests: formattedData.interests
            });

            router.push('/dashboard');
        } catch (error) {
            console.error('Error saving onboarding data:', error);
            toast.error('Failed to save profile. Please ensure you are logged in and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const step = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-6 text-white overflow-hidden relative font-sans">
            {/* Immersive Background */}
            <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-25%] right-[-15%] w-[60%] h-[60%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-xl z-10 flex flex-col gap-6">
                {/* Header Profile Identity */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease:"easeOut" }} className="flex flex-col items-center gap-4"
                    >
                        <Logo scale="sm" />
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold shadow-lg">
                            <Sparkles className="h-3 w-3" /> Intelligence Engine Initialization
                        </div>
                    </motion.div>
                </div>

                <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    {/* Atmospheric Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-white/[0.03]">
                        <motion.div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease:"circOut" }}
                        />
                    </div>

                    <div className="min-h-[220px] flex flex-col justify-center gap-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 1.02, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} className="space-y-8"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl ${step.bg} border border-white/[0.05] shadow-inner`}>
                                        <step.icon className={`h-8 w-8 ${step.color}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-sm   text-white/70 font-bold">Step {currentStep + 1} of {steps.length}</span>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white  leading-zero">{step.title}</h2>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-base text-white/80 font-medium pl-1">{step.question}</h3>
                                    
                                    {step.id === 'experience' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((lvl) => (
                                                <button
                                                    key={lvl}
                                                    onClick={() => setFormData({ ...formData, experienceLevel: lvl })}
                                                    className={`px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 flex items-center justify-between group ${
                                                        formData.experienceLevel === lvl 
                                                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-lg translate-y-[-1px]' 
                                                        : 'bg-white/[0.03] border-white/10 text-white/80 hover:border-white/20 hover:text-white'
                                                    }`}
                                                >
                                                    {lvl}
                                                    <Zap className={`h-4 w-4 transition-all duration-300 ${formData.experienceLevel === lvl ? 'text-indigo-400 opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <input type="text"
                                                id={step.id}
                                                value={formData[idToKey[step.id]]}
                                                onChange={handleChange}
                                                placeholder={step.placeholder} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm font-medium placeholder:text-white/60 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
                                                autoFocus
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-indigo-400 transition-opacity">
                                                <step.icon className="h-4 w-4" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 py-2 px-3 rounded-lg ${currentStep === 0 ? 'text-white/40 cursor-not-allowed grayscale' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                        >
                            <ArrowLeft className="h-4 w-4" /> Go Back
                        </button>

                        <div className="flex items-center gap-4">
                            {currentStep < steps.length - 1 ? (
                                <button
                                    onClick={handleNext} className="group flex items-center gap-2 bg-white text-slate-950 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/90 hover:shadow-[0_4px_14px_0_rgba(255,255,255,0.2)] transition-all active:scale-[0.98]"
                                >
                                    Continue
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting} className="group flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white px-10 py-4 rounded-[1.25rem] text-xs font-semibold   shadow-2xl shadow-indigo-900/40 transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Architecting...
                                        </>
                                    ) : (
                                        <>
                                            Finalize Strategy
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tactical Context Nudge */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }} className="text-center"
                >
                    <p className="text-sm text-white/60   font-medium leading-relaxed max-w-sm mx-auto">
                        Your strategy is computed in real-time based on high-volatility market telemetry.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
