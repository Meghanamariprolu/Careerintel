"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateCareerAnalytics } from '@/services/analyticsService';

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({
        careerGoal: "",
        currentSkills: [],
        experienceLevel: "",
        targetIndustry: "",
        learningProgress: {}, // e.g., { python: true, machineLearning: true }
        portfolioProjects: [],
        resumeScore: 0,
        marketInsights: {},
        behavioralInsights: {},
        qualityScore: 0,
        careerStrategy: null,
        analytics: {
            careerReadiness: 0,
            skillMatch: 0,
            resumeScore: 0,
            portfolioStrength: 0,
            learningProgress: 0
        }
    });

    // Load from localStorage on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('careerintel_user_profile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                setProfile(parsed);
            } catch (e) {
                console.error("Failed to parse profile", e);
            }
        }
    }, []);

    // Persist and update analytics whenever profile changes
    useEffect(() => {
        const newAnalytics = calculateCareerAnalytics(profile);

        // Only update if analytics actually changed to prevent loops
        if (JSON.stringify(profile.analytics) !== JSON.stringify(newAnalytics)) {
            setProfile(prev => ({
                ...prev,
                analytics: newAnalytics
            }));
        }

        localStorage.setItem('careerintel_user_profile', JSON.stringify(profile));
    }, [profile]);

    const updateProfile = (updates) => {
        setProfile(prev => ({
            ...prev,
            ...updates
        }));
    };

    const markSkillComplete = (skillId) => {
        setProfile(prev => ({
            ...prev,
            learningProgress: {
                ...prev.learningProgress,
                [skillId]: true
            }
        }));
    };

    return (
        <UserProfileContext.Provider value={{ profile, updateProfile, markSkillComplete }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};
