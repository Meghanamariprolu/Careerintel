"use client"

import { motion } from "framer-motion"
import { Construction, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function ComingSoon({ title, description }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-slate-900/40 rounded-lg border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20 relative shadow-xl"
            >
                <Construction className="h-8 w-8 text-indigo-400" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1.5 -right-1.5"
                >
                    <Sparkles className="h-4 w-4 text-indigo-400/50" />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4"
            >
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm font-bold  st text-amber-400">
                    Feature Deployment Pending
                </span>
            </motion.div>

            <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl font-bold  mb-3 text-white "
            >
                {title || "Protocol Under Development"} Node<span className="text-indigo-500">.</span>
            </motion.h1>

            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 max-w-xs mb-8 text-sm font-medium leading-relaxed"
            >
                {description || "The Career Intel Engine is currently synthesizing this module. Access is restricted until final validation protocols are cleared."}
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Link href="/dashboard">
                    <Button variant="outline" className="h-9 px-5 border-white/10 hover:bg-white/5 text-sm font-bold  st rounded-lg gap-2 text-white/90 hover:text-white transition-all">
                        <ArrowLeft className="h-3 w-3" /> Dashboard
                    </Button>
                </Link>
            </motion.div>
        </div>
    )
}
