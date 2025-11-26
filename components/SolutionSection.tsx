'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Users, Zap } from 'lucide-react'

export default function SolutionSection() {
    return (
        <section className="py-24 relative overflow-hidden bg-black">
            {/* Background Grid */}
            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-block mb-4">
                        <span className="text-sm font-mono text-neon-lime px-4 py-2 border border-neon-lime bg-black/60">
                            [ SOLUTION INITIALIZED ]
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight uppercase">
                        AI MATURITY MEETS <br />
                        <span className="text-neon-cyan text-glow-cyan">
                            UNREAL ADOPTION
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="terminal-window border-neon-lime p-6 relative">
                            <div className="absolute top-0 left-0 right-0 bg-black/80 px-4 py-2 border-b-2 border-neon-lime flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-neon-lime" />
                                    <div className="w-2 h-2 bg-neon-lime" />
                                    <div className="w-2 h-2 bg-neon-lime" />
                                </div>
                                <span className="text-xs font-mono text-neon-lime ml-2">RELIABLE_AI.sys</span>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <div className="mt-1">
                                    <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-neon-lime">
                                        <ShieldCheck className="w-6 h-6 text-neon-lime" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black mb-2 uppercase font-mono">Reliable AI</h3>
                                    <p className="text-foreground-secondary font-mono text-sm">
                                        {'>'} LLMs are now reliable for structured, domain-specific tasks.
                                        We embed "engineering intuition" into the editor to ensure quality without sacrificing velocity.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="terminal-window border-neon-cyan p-6 relative">
                            <div className="absolute top-0 left-0 right-0 bg-black/80 px-4 py-2 border-b-2 border-neon-cyan flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-neon-cyan" />
                                    <div className="w-2 h-2 bg-neon-cyan" />
                                    <div className="w-2 h-2 bg-neon-cyan" />
                                </div>
                                <span className="text-xs font-mono text-neon-cyan ml-2">KNOWLEDGE_SHARE.db</span>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <div className="mt-1">
                                    <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-neon-cyan">
                                        <Users className="w-6 h-6 text-neon-cyan" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black mb-2 uppercase font-mono">Shared Knowledge</h3>
                                    <p className="text-foreground-secondary font-mono text-sm">
                                        {'>'} Remote teams need shared tools. Synapsify acts as a centralized knowledge base,
                                        helping onboard new developers faster by explaining project-specific patterns.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative lg:mt-0"
                    >
                        <div className="terminal-window border-neon-magenta p-1 relative overflow-hidden h-full">
                            <div className="bg-black p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center relative">
                                {/* Animated corner accents */}
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-neon-magenta"
                                />
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                    className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-neon-magenta"
                                />

                                <Zap className="w-20 h-20 text-neon-magenta mb-6 animate-pulse" />
                                <h3 className="text-3xl font-black mb-4 uppercase">Quality + Velocity</h3>
                                <p className="text-foreground-secondary max-w-md font-mono text-sm">
                                    {'>'} Studios seek velocity without sacrificing quality. Synapsify delivers both by integrating directly into your workflow.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
