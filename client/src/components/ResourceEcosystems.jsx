"use client"

import { motion } from 'framer-motion'
import { Github, Linkedin, Globe, MessageSquare, Code2, Database, Terminal, Rocket, Compass } from 'lucide-react'
import Link from 'next/link'

const ecosystems = [
    {
        name: 'GitHub',
        description: 'Host your code, contribute to open source, and build your developer identity.',
        icon: Github,
        color: 'from-slate-700 to-slate-900',
        textColor: 'text-white',
        shadowColor: 'shadow-slate-900/50',
        href: 'https://github.com',
        label: 'Portfolio'
    },
    {
        name: 'LinkedIn',
        description: 'The professional gold standard. Network with recruiters and showcase your career growth.',
        icon: Linkedin,
        color: 'from-blue-600 to-blue-800',
        textColor: 'text-white',
        shadowColor: 'shadow-blue-900/50',
        href: 'https://linkedin.com',
        label: 'Network'
    },
    {
        name: 'Vercel',
        description: 'Deploy your projects instantly. The best platform for frontend developers and teams.',
        icon: Rocket,
        color: 'from-gray-100 to-gray-300',
        textColor: 'text-slate-900',
        shadowColor: 'shadow-white/20',
        href: 'https://vercel.com',
        label: 'Deployments'
    },
    {
        name: 'Kaggle',
        description: 'The home for data science. Compete, learn from notebooks, and master machine learning.',
        icon: Database,
        color: 'from-cyan-500 to-cyan-700',
        textColor: 'text-white',
        shadowColor: 'shadow-cyan-900/50',
        href: 'https://kaggle.com',
        label: 'Data Science'
    },
    {
        name: 'Discord',
        description: 'Connect with peers in real-time. Join communities, share labs, and find study buddies.',
        icon: MessageSquare,
        color: 'from-indigo-500 to-indigo-700',
        textColor: 'text-white',
        shadowColor: 'shadow-indigo-900/50',
        href: 'https://discord.com',
        label: 'Community'
    },
    {
        name: 'Roadmap.sh',
        description: 'Community-driven roadmaps, articles, and guides for developers. The best place to visualize your learning path.',
        icon: Compass,
        color: 'from-orange-500 to-red-600',
        textColor: 'text-white',
        shadowColor: 'shadow-orange-900/50',
        href: 'https://roadmap.sh',
        label: 'Learning Paths'
    }
]

export const ResourceEcosystems = () => {
    // Duplicate the array to create a seamless scrolling loop
    const duplicatedEcosystems = [...ecosystems, ...ecosystems]

    return (
        <div className="w-full overflow-hidden relative" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#050510] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#050510] to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-6 animate-marquee py-10 hover:[animation-play-state:paused] px-6">
                {duplicatedEcosystems.map((item, idx) => (
                    <motion.div
                        key={`${item.name}-${idx}`}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="group relative w-[350px] shrink-0"
                    >
                        <Link href={item.href} target="_blank" rel="noopener noreferrer">
                            <div className={`h-full min-h-[250px] p-8 rounded-[2.5rem] bg-[#0c0c1e] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden flex flex-col`}>
                                {/* Abstract background glow */}
                                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${item.color} blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-700`} />
                                
                                <div className="relative z-10 flex flex-col h-full flex-grow">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all duration-500`}>
                                            <item.icon className={`h-7 w-7 ${idx % 2 === 0 ? 'text-indigo-400' : 'text-purple-400'}`} />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-indigo-400 transition-colors">
                                            {item.label}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors">
                                        {item.name}
                                    </h3>
                                    
                                    <p className="text-white/40 text-sm font-medium leading-relaxed mb-8 flex-grow">
                                        {item.description}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 mt-auto">
                                        Establish Presence <Globe className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
