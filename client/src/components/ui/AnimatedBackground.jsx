"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Create an array of abstract "nodes" representing career paths/skills
    const nodes = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        // Random starting positions
        x: Math.random() * 100,
        y: Math.random() * 100,
        // Random sizes
        size: Math.random() * 60 + 20,
        // Random animation durations and delays
        duration: Math.random() * 30 + 30,
        delay: Math.random() * 5,
    }));

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-950">
            {/* Base subtle gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_50%)]" />

            {/* Moving nodes */}
            {nodes.map((node) => (
                <motion.div
                    key={node.id}
                    className="absolute rounded-full opacity-10 blur-xl bg-indigo-500"
                    style={{
                        width: node.size,
                        height: node.size,
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                    }}
                    animate={{
                        x: [0, Math.random() * 200 - 100, 0],
                        y: [0, Math.random() * 200 - 100, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: node.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                        delay: node.delay,
                    }}
                />
            ))}

            {/* Connecting subtle SVG lines (optional, simulating a network) */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
                <pattern
                    id="network-pattern"
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M0 100 L100 0"
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                    />
                </pattern>
                <rect width="100%" height="100%" fill="url(#network-pattern)" />
            </svg>
        </div>
    );
}
