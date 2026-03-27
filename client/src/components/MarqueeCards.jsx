"use client"

import { motion } from 'framer-motion'
import { Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const MarqueeCards = ({ 
    items, 
    reverse = false, 
    title, 
    subtitle, 
    icon: SectionIcon, 
    iconColor = "text-indigo-400",
    bgAccent = "bg-indigo-500/10"
}) => {
    // Duplicate items for seamless loop
    const duplicatedItems = [...items, ...items]

    return (
        <div className="space-y-8 pt-8 border-t border-white/5">
            {/* Section Header */}
            <div className="flex items-center gap-4 px-2">
                {SectionIcon && (
                    <div className={`p-3 rounded-2xl bg-[#0c0c1e] border border-white/5`}>
                        <SectionIcon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                )}
                <div>
                    <h2 className="text-2xl font-bold  text-white">{title}</h2>
                    <p className="text-sm text-white/60 font-bold  st">{subtitle}</p>
                </div>
            </div>

            {/* Marquee Container */}
            <div className="w-full overflow-hidden relative">
                <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />
                
                <div className={`flex gap-6 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} py-8 hover:[animation-play-state:paused] px-6`}>
                    {duplicatedItems.map((item, idx) => (
                        <motion.div
                            key={`${item.name}-${idx}`}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative w-[320px] shrink-0"
                        >
                            <Link href={item.href || '#'} target={item.href?.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer">
                                <div className="h-full min-h-[220px] p-7 rounded-3xl bg-[#0c0c1e] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden flex flex-col">
                                    {/* Abstract background glow */}
                                    <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${item.gradient || 'from-indigo-600/20 to-purple-600/20'} blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity duration-700`} />
                                    
                                    <div className="relative z-10 flex flex-col h-full flex-grow">
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all duration-500 text-white/70 group-hover:text-white">
                                                {item.icon && <item.icon className="h-6 w-6" />}
                                            </div>
                                            {item.label && (
                                                <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-sm font-bold  st text-white/60 group-hover:text-indigo-400 transition-colors">
                                                    {item.label}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-white mb-2  group-hover:text-indigo-300 transition-colors">
                                            {item.name}
                                        </h3>
                                        
                                        <p className="text-white/90 text-sm font-medium leading-relaxed mb-6 flex-grow line-clamp-3">
                                            {item.description}
                                        </p>
                                        
                                        <div className="flex items-center gap-2 text-sm font-bold  st text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 mt-auto">
                                            Explore Resource <ArrowRight className="h-3 w-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
