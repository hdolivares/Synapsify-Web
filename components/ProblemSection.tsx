'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, BrainCircuit, Clock } from 'lucide-react'

const problems = [
    {
        title: "Breaking Focus",
        description: "Switching to external AI tools breaks your flow and slows down iteration cycles.",
        icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
        delay: 0
    },
    {
        title: "Missing Context",
        description: "Generic LLMs lack awareness of your project structure, assets, and Unreal best practices.",
        icon: <BrainCircuit className="w-8 h-8 text-orange-400" />,
        delay: 0.1
    },
    {
        title: "Slow Onboarding",
        description: "Ramping up new developers on Unreal is slow; knowledge transfer is often ad-hoc and inefficient.",
        icon: <Clock className="w-8 h-8 text-yellow-400" />,
        delay: 0.2
    }
]

export default function ProblemSection() {
    return (
        <section className="py-24 relative bg-black/20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Game Dev AI is <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Fragmented & Out-of-Flow</span>
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
                            className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="mb-6 p-4 rounded-full bg-white/5 w-fit">
                                {problem.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{problem.title}</h3>
                            <p className="text-foreground-secondary leading-relaxed">
                                {problem.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
