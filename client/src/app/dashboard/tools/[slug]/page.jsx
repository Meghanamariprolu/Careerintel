"use client"

import { useParams } from "next/navigation"
import ComingSoon from "@/components/ComingSoon"

const toolsMetadata = {
    "market-integration": {
        title: "Real-Time Job Market Integration",
        description: "Connect directly with live job boards and market trends to see exactly what skills are paying off right now."
    },
    "personalized-learning": {
        title: "Adaptive & Personalized Learning Routes",
        description: "An AI-driven curriculum that adjusts in real-time based on your learning speed and performance."
    },
    "portfolio-builder": {
        title: "Project-Based Milestones (Portfolio Builder)",
        description: "Translate your learning into a professional portfolio with AI-suggested projects for every skill level."
    },
    "resume-enhancer": {
        title: "AI-Assisted Resume & LinkedIn Enhancer",
        description: "Optimize your professional profiles with keyword targeting and AI-generated accomplishment statements."
    },
    "scenario-simulator": {
        title: "Career Scenario Simulator",
        description: "Roleplay high-stakes career decisions and interview scenarios with our advanced behavioral AI."
    },
    "coaching": {
        title: "Personalized Coaching & Accountability",
        description: "Get daily nudges, performance reviews, and mentorship from your dedicated AI career coach."
    },
    "behavioral-mapping": {
        title: "Soft Skills & Behavioral Mapping",
        description: "Go beyond technical skills. Map your emotional intelligence, leadership potential, and communication style."
    },
    "quality-scoring": {
        title: "Learning Source Quality Scoring",
        description: "We rate thousands of courses and books so you only spend time on the highest quality resources."
    },
    "skill-transfer": {
        title: "Skill Transfer Mapping",
        description: "Discover how your existing skills translate to entirely new industries and high-growth roles."
    },
    "outcome-tracking": {
        title: "Success Benchmarks & Outcome Tracking",
        description: "Measure your growth against top industry performers and track your journey to the finish line."
    },
    "mentor-personas": {
        title: "AI Mentor Persona Options",
        description: "Choose your mentor's personality—from a tough-love drill sergeant to a supportive visionary leader."
    }
}

export default function ToolPlaceholderPage() {
    const { slug } = useParams()
    const metadata = toolsMetadata[slug] || {
        title: "Advanced Career Tool",
        description: "This feature is currently under development to provide you with the best career intelligence experience."
    }

    return (
        <div className="py-8">
            <ComingSoon title={metadata.title} description={metadata.description} />
        </div>
    )
}
