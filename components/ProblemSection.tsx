'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, BrainCircuit, Clock } from 'lucide-react'

const problems = [
    {
        title: "BREAKING FOCUS",
        description: "Switching to external AI tools breaks your flow and slows down iteration cycles.",
        icon: <AlertTriangle className="w-8 h-8 text-neon-magenta" />,
        delay: 0,
        borderColor: 'border-neon-magenta'
    },
    {
        title: "MISSING CONTEXT",
        description: "Generic LLMs lack awareness of your project structure, assets, and Unreal best practices.",
        icon: <BrainCircuit className="w-8 h-8 text-red-500" />,
        delay: 0.1,
        borderColor: 'border-red-500'
    },
    {
        title: "SLOW ONBOARDING",
        description: "Ramping up new developers on Unreal is slow; knowledge transfer is often ad-hoc and inefficient.",
        icon: <Clock className="w-8 h-8 text-orange-500" />,
        delay: 0.2,
        borderColor: 'border-orange-500'
    }
]

export default function ProblemSection() {
    return (
        <section className="py-24 relative bg-black/40">
            {/* Warning grid pattern */}
            <div className="absolute inset-0 grid-pattern-cyan opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-block mb-4">
                        <span className="text-sm font-mono text-neon-magenta px-4 py-2 border border-neon-magenta bg-black/60">
                            [ ERROR REPORT ]
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">
                        GAME DEV AI IS <br />
                        <span className="text-neon-magenta text-glow-magenta">
                            FRAGMENTED & OUT-OF-FLOW
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: problem.delay }}
                            className={`terminal-window p-8 rounded-none relative group hover:scale-105 transition-transform ${problem.borderColor}`}
                        >
                            {/* Terminal header */}
                            <div className="absolute top-0 left-0 right-0 bg-black/80 px-4 py-2 border-b-2 border-current flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-neon-magenta" />
                                    <div className="w-2 h-2 bg-neon-magenta opacity-50" />
                                    <div className="w-2 h-2 bg-neon-magenta opacity-25" />
                                </div>
                                <span className="text-xs font-mono text-neon-magenta ml-2">ERROR_{index + 1}.log</span>
                            </div>

                            <div className="mt-8">
                                <div className="mb-6 p-4 bg-black/60 w-fit border-2 border-current">
                                    {problem.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 font-mono">{problem.title}</h3>
                                <p className="text-foreground-secondary leading-relaxed font-mono text-sm">
                                    {'>'} {problem.description}
                                </p>
                            </div>

                            {/* Decorative corner brackets */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current opacity-50" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-current opacity-50" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-current opacity-50" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current opacity-50" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
