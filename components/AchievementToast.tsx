'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useState, useEffect } from 'react'

interface AchievementProps {
    title: string
    description: string
    trigger: boolean
    onClose?: () => void
}

export default function AchievementToast({ title, description, trigger, onClose }: AchievementProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (trigger) {
            setIsVisible(true)
            const timer = setTimeout(() => {
                setIsVisible(false)
                if (onClose) onClose()
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [trigger, onClose])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 right-8 z-50 flex items-center gap-4 bg-[#1a2332] border border-accent-cyan/30 p-4 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.2)] max-w-sm"
                >
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-primary flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full border border-white/50"
                        />
                    </div>

                    <div>
                        <h4 className="text-accent-cyan font-bold text-sm tracking-wider uppercase mb-1">
                            Achievement Unlocked
                        </h4>
                        <p className="text-white font-bold text-lg leading-none mb-1">{title}</p>
                        <p className="text-gray-400 text-xs">{description}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
