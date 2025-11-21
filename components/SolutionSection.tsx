'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Users, Zap } from 'lucide-react'

export default function SolutionSection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-accent-purple/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                            AI Maturity Meets <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan">Unreal Adoption</span>
                        </h2>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center border border-accent-purple/20">
                                        <ShieldCheck className="w-6 h-6 text-accent-purple" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Reliable AI</h3>
                                    <p className="text-foreground-secondary">
                                        LLMs are now reliable for structured, domain-specific tasks.
                                        We embed "engineering intuition" into the editor to ensure quality without sacrificing velocity.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20">
                                        <Users className="w-6 h-6 text-accent-cyan" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Shared Knowledge</h3>
                                    <p className="text-foreground-secondary">
                                        Remote teams need shared tools. Cortx acts as a centralized knowledge base,
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
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-cyan blur-[100px] opacity-20" />
                        <div className="glass-panel p-1 rounded-2xl border border-white/10 relative overflow-hidden">
                            <div className="bg-[#0a0f1e] rounded-xl p-8 h-[400px] flex flex-col items-center justify-center text-center">
                                <Zap className="w-16 h-16 text-yellow-400 mb-6 animate-pulse" />
                                <h3 className="text-3xl font-bold mb-2">Quality + Velocity</h3>
                                <p className="text-foreground-secondary max-w-md">
                                    Studios seek velocity without sacrificing quality. Cortx delivers both by integrating directly into your workflow.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
