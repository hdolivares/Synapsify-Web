'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState, useEffect } from 'react'

const specs = [
    "UNREAL ENGINE 5.0+",
    "WINDOWS 10/11 (64-BIT)",
    "VISUAL STUDIO 2019/2022",
    "INTERNET CONNECTION (FOR AI)"
]

export default function TechSpecs() {
    const [displayedSpecs, setDisplayedSpecs] = useState<string[]>([])

    useEffect(() => {
        specs.forEach((spec, index) => {
            setTimeout(() => {
                setDisplayedSpecs(prev => [...prev, spec])
            }, index * 200)
        })
    }, [])

    return (
        <section className="py-16 border-t-2 border-neon-cyan bg-black">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto p-8 terminal-window border-neon-cyan">
                    {/* Terminal header */}
                    <div className="absolute top-0 left-0 right-0 bg-black/80 px-4 py-2 border-b-2 border-neon-cyan flex items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-neon-cyan" />
                            <div className="w-2 h-2 bg-neon-cyan" />
                            <div className="w-2 h-2 bg-neon-cyan" />
                        </div>
                        <span className="text-xs font-mono text-neon-cyan ml-2">SYSTEM_REQUIREMENTS.txt</span>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row items-start justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-black mb-2 uppercase font-mono text-neon-cyan">System Requirements</h3>
                            <p className="text-foreground-secondary font-mono text-sm">
                                {'>'} COMPATIBLE WITH YOUR EXISTING WORKFLOW.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                            {displayedSpecs.map((spec, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-5 h-5 border-2 border-neon-lime flex items-center justify-center bg-black">
                                        <Check className="w-3 h-3 text-neon-lime" />
                                    </div>
                                    <span className="text-sm font-mono text-foreground">{spec}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
