"use client"

import { ArrowLeft, Play } from"lucide-react"
import Link from"next/link"
import { motion } from"framer-motion"
import { Button } from"@/components/ui/Button"
import ScenarioSimulator from"@/components/tools/ScenarioSimulator"

export default function ScenarioSimulatorPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16 relative">
            {/* Header */}
            <header className="mb-6">
                <Link href="/dashboard">
                    <motion.button
                        whileHover={{ x: -10 }} className="flex items-center gap-2 text-white/70 hover:text-white text-xs  font-semibold  transition-colors mb-4 md:mb-6"
                    >
                        <ArrowLeft className="h-3 w-3" /> Command Center
                    </motion.button>
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-2.5 text-sm  font-semibold  text-cyan-400 shadow-xl"
                        >
                            <Play className="h-2.5 w-2.5" /> SCENARIO INTELLIGENCE ENGINE
                        </motion.div>
                        <h1 className="text-lg md:text-xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-400">
                            Scenario Simulator Node<span className="text-cyan-500">.</span>
                        </h1>
                        <p className="text-xs md:text-sm text-white/70 max-w-xl mt-1.5 font-medium leading-relaxed">
                            High-stakes professional simulations. Practice negotiations and technical leadership with AI-driven culture protocols.
                        </p>
                    </div>
                </div>
            </header>

            <ScenarioSimulator />
        </div>
    )
}
