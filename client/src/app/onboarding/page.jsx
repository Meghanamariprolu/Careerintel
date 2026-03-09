"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const steps = [
    { id: 'goal', title: 'Career Goal', question: 'What is your primary career goal?' },
    { id: 'experience', title: 'Experience Level', question: 'What is your current experience level?' },
    { id: 'education', title: 'Education', question: 'What is your highest level of education?' },
    { id: 'skills', title: 'Current Skills', question: 'What are your core skills? (comma separated)' },
    { id: 'interests', title: 'Interests', question: 'What areas are you most interested in? (comma separated)' }
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
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
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
            };

            // Assuming user is logged in, we update the backend profile
            const token = localStorage.getItem('token');
            if (token) {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Send to backend via our updated authController routes at /api/auth/profile
                // Or /api/user/profile if we explicitly create that alias. 
                // We'll use the existing /api/auth/profile that we just upgraded to support these fields.
                await axios.put('/api/auth/profile', formattedData, config);
            }

            // Sync with local context cache
            updateProfile({
                careerGoal: formattedData.careerGoal,
                experienceLevel: formattedData.experienceLevel,
                education: formattedData.education,
                currentSkills: formattedData.skills,
                interests: formattedData.interests
            });

            // Navigate to Dashboard
            router.push('/dashboard');

        } catch (error) {
            console.error('Error saving onboarding data:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const step = steps[currentStep];

    return (
        <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="w-full max-w-xl z-10">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 text-xs uppercase tracking-widest text-purple-300"
                    >
                        <Sparkles className="h-4 w-4" /> Career Intelligence Engine
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-3xl md:text-4xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400 font-light mb-4"
                    >
                        Design Your Path.
                    </motion.h1>
                    <p className="text-white/60 text-sm md:text-base">
                        To build the most accurate roadmap, we need to understand your current position and destination.
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    <div className="min-h-[160px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-xl md:text-2xl text-white mb-6 font-light">{step.question}</h2>

                                {step.id === 'experience' ? (
                                    <select
                                        name={step.id}
                                        value={formData.experienceLevel}
                                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                                    >
                                        <option value="" disabled>Select Level</option>
                                        <option value="Beginner">Beginner (0-1 yrs)</option>
                                        <option value="Intermediate">Intermediate (2-4 yrs)</option>
                                        <option value="Advanced">Advanced (5-8 yrs)</option>
                                        <option value="Expert">Expert (8+ yrs)</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name={step.id === 'skills' ? 'skills' : step.id === 'interests' ? 'interests' : step.id === 'education' ? 'education' : 'careerGoal'}
                                        value={formData[step.id === 'skills' ? 'skills' : step.id === 'interests' ? 'interests' : step.id === 'education' ? 'education' : 'careerGoal']}
                                        onChange={handleChange}
                                        placeholder={`e.g., ${step.id === 'skills' ? 'JavaScript, React, Node' : step.id === 'interests' ? 'AI, FinTech, Design' : step.id === 'education' ? 'BSc Computer Science' : 'Senior AI Engineer'}`}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                                        autoFocus
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 text-sm uppercase tracking-widest transition-colors ${currentStep === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:text-white'}`}
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                            >
                                Next <ArrowRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Architecting...' : 'Build Strategy'} <ArrowRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
