import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, PlayCircle, BookOpen, Atom } from 'lucide-react';

const PLATFORM_MAP = {
    "Full Stack Developer": [
        { name: "FreeCodeCamp", icon: BookOpen, description: "Massive library of 10+ hour full-stack web development tutorials.", url: "https://www.youtube.com/@freecodecamp" },
        { name: "Traversy Media", icon: Atom, description: "Practical crash courses on modern web frameworks and tools.", url: "https://www.youtube.com/@TraversyMedia" },
        { name: "Adding freeCodeCamp", icon: PlayCircle, description: "Interactive 'code-along' learning for full-stack developers.", url: "https://www.youtube.com/@freecodecamp" }
    ],
    "Frontend Developer": [
        { name: "Kevin Powell", icon: Award, description: "The definitive YouTube channel for mastering CSS and responsive design.", url: "https://www.youtube.com/@KevinPowell" },
        { name: "Web Dev Simplified", icon: PlayCircle, description: "Clear, concise tutorials breaking down complex React and JS concepts.", url: "https://www.youtube.com/@WebDevSimplified" },
        { name: "Fireship", icon: BookOpen, description: "High-intensity, high-paced summaries of frontend ecosystems.", url: "https://www.youtube.com/@Fireship" }
    ],
    "Backend Developer": [
        { name: "Hussein Nasser", icon: Award, description: "Deep dives into backend architecture, proxies, and database engineering.", url: "https://www.youtube.com/@hnasr" },
        { name: "FreeCodeCamp", icon: BookOpen, description: "Comprehensive multi-hour backend crash courses (Node, Python).", url: "https://www.youtube.com/@freecodecamp" },
        { name: "ByteByteGo", icon: PlayCircle, description: "Visual explanations of large-scale system design.", url: "https://www.youtube.com/@ByteByteGo" }
    ],
    "LLM Engineer": [
        { name: "Andrej Karpathy", icon: Award, description: "World-class neural network breakdowns from an AI industry leader.", url: "https://www.youtube.com/@AndrejKarpathy" },
        { name: "Sentdex", icon: Atom, description: "Hands-on Python tutorials for building and fine-tuning models.", url: "https://www.youtube.com/@sentdex" },
        { name: "3Blue1Brown", icon: PlayCircle, description: "Unmatched visual explanations of the math behind neural networks.", url: "https://www.youtube.com/@3blue1brown" }
    ],
    "RAG Systems Engineer": [
        { name: "Langchain", icon: BookOpen, description: "Official tutorials for building robust Retrieval-Augmented Generation.", url: "https://www.youtube.com/@LangChain" },
        { name: "Sam Witteveen", icon: Atom, description: "Cutting edge implementations of LLMs and RAG with Python.", url: "https://www.youtube.com/@samwitteveenai" },
        { name: "Prompt Engineering", icon: Award, description: "Real-world breakdowns of building AI agents and vector stores.", url: "https://www.youtube.com/@PromptEngineeringYouTube" }
    ],
    "AI Engineer": [
        { name: "AI Jason", icon: Award, description: "Practical demonstrations of autonomous AI agents in action.", url: "https://www.youtube.com/@AIJasonZ" },
        { name: "Matthew Berman", icon: Atom, description: "Testing and building local open-source LLMs and AI workflows.", url: "https://www.youtube.com/@matthew_berman" },
        { name: "World of AI", icon: BookOpen, description: "Daily showcases of the latest accessible AI developer tools.", url: "https://www.youtube.com/@WorldofAI" }
    ],
    "Machine Learning Engineer": [
        { name: "StatQuest", icon: Award, description: "Machine learning algorithms explained clearly with simple visuals.", url: "https://www.youtube.com/@statquest" },
        { name: "Lex Fridman", icon: Atom, description: "MIT Deep Learning lectures and advanced AI engineering podcasts.", url: "https://www.youtube.com/@lexfridman" },
        { name: "Yannic Kilcher", icon: PlayCircle, description: "In-depth reviews of the latest machine learning research papers.", url: "https://www.youtube.com/@YannicKilcher" }
    ],
    "Cybersecurity Analyst": [
        { name: "NetworkChuck", icon: Award, description: "High-energy tutorials on Linux, hacking, and massive IT concepts.", url: "https://www.youtube.com/@NetworkChuck" },
        { name: "David Bombal", icon: BookOpen, description: "Interviews and hands-on demonstrations with master hackers.", url: "https://www.youtube.com/@davidbombal" },
        { name: "John Hammond", icon: PlayCircle, description: "Real-world malware analysis and CTF (Capture The Flag) walkthroughs.", url: "https://www.youtube.com/@_JohnHammond" }
    ],
    "Data Scientist": [
        { name: "Ken Jee", icon: Award, description: "Career advice and project walkthroughs for getting into Data Science.", url: "https://www.youtube.com/@KenJee_DS" },
        { name: "Corey Schafer", icon: Atom, description: "The undisputed best Pandas and Python tutorials on YouTube.", url: "https://www.youtube.com/@coreyms" },
        { name: "Alex The Analyst", icon: PlayCircle, description: "Complete bootcamps covering SQL, Tableau, and Python data roles.", url: "https://www.youtube.com/@AlexTheAnalyst" }
    ],
    "Default": [
        { name: "FreeCodeCamp", icon: Award, description: "The premier destination for free, high-quality development courses.", url: "https://www.youtube.com/@freecodecamp" },
        { name: "CS50", icon: PlayCircle, description: "Harvard's legendary introductory Computer Science lectures.", url: "https://www.youtube.com/@cs50" },
        { name: "CrashCourse", icon: BookOpen, description: "High-quality, fast-paced educational overviews of tech topics.", url: "https://www.youtube.com/@crashcourse" }
    ]
};

export default function PlatformRecommendation({ goal }) {
    const platforms = PLATFORM_MAP[goal] || PLATFORM_MAP["Default"];

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm md:text-base font-bold text-white ">Recommended Learning Resources</h3>
                    <p className="text-sm font-semibold text-purple-400/60">Multiple Career Pathway Options</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platforms.map((platform, idx) => (
                    <motion.a
                        key={idx}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.06)' }}
                        className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="h-3 w-3 text-purple-400" />
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 border border-white/5 text-purple-400">
                                <platform.icon className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors  r">
                                    {platform.name}
                                </h4>
                                <p className="text-sm text-white/70 leading-relaxed font-medium">
                                    {platform.description}
                                </p>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
