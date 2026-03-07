"use client"

import { motion } from "framer-motion"
import { Construction, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function ComingSoon({ title, description }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-slate-900/20 rounded-xl border border-white/5 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 p-6 bg-indigo-500/10 rounded-full relative"
            >
                <Construction className="h-16 w-16 text-indigo-400" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2"
                >
                    <Sparkles className="h-8 w-8 text-yellow-500/50" />
                </motion.div>
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl  tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
            >
                {title || "Feature Coming Soon"}
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground max-w-md mb-8 text-lg"
            >
                {description || "We're working hard to bring this advanced career intelligence tool to life. Stay tuned for updates!"}
            </motion.p>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Link href="/dashboard">
                    <Button variant="outline" className="border-indigo-500/30 hover:bg-indigo-500/10 gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
            </motion.div>
        </div>
    )
}
