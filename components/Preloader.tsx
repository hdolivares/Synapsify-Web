'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState('Initializing Core Systems...')

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer)
                    setTimeout(() => setIsLoading(false), 500)
                    return 100
                }

                // Random progress jumps
                const jump = Math.random() * 15
                const newProgress = Math.min(prev + jump, 100)

                // Update status text based on progress
                if (newProgress > 20 && newProgress < 40) setStatus('Loading Neural Modules...')
                if (newProgress > 40 && newProgress < 60) setStatus('Connecting to Unreal Engine...')
                if (newProgress > 60 && newProgress < 80) setStatus('Compiling Shaders...')
                if (newProgress > 80) setStatus('Ready to Launch')

                return newProgress
            })
        }, 150)

        return () => clearInterval(timer)
    }, [])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] bg-[#0a0f1e] flex flex-col items-center justify-center font-mono"
                >
                    <div className="w-64 mb-8 relative">
                        {/* Progress Bar Background */}
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-accent-cyan"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Glitch Effect Text */}
                        <div className="mt-4 flex justify-between text-xs text-accent-cyan/80">
                            <span>{status}</span>
                            <span>{Math.floor(progress)}%</span>
                        </div>
                    </div>

                    {/* Decorative HUD Elements */}
                    <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-white/20 rounded-tl-xl" />
                    <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-white/20 rounded-br-xl" />

                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute bottom-10 left-10 text-xs text-white/30"
                    >
                        SYSTEM_ID: CORTX_V1.0
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
