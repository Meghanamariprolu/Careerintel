"use client"

import React from 'react';
import { motion } from 'framer-motion';

export const Logo = ({ scale = "md", className = "" }) => {
    const scales = {
        sm: { height: 60 },
        md: { height: 100 },
        lg: { height: 180 },
    };

    const currentScale = scales[scale] || scales.md;

    return (
        <motion.div
            className={`flex items-center ${className} cursor-pointer relative group`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                opacity: { duration: 0.5 }
            }}
        >
            <motion.img
                src="/logo.png"
                alt="CareerIntel Logo"
                style={{ height: currentScale.height }}
                className="object-contain"
                animate={{
                    y: [0, -3, 0]
                }}
                transition={{
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
            />
        </motion.div>
    );
};
