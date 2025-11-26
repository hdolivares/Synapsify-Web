'use client'

import { motion } from 'framer-motion'
import { Cpu, Code2, Zap, ShieldCheck, BookOpen, Layers } from 'lucide-react'

const features = [
    {
        title: "BLUEPRINT INTEGRATION",
        description: "Generate and modify graphs, nodes, and connections. The AI understands your Blueprint logic and structure.",
        icon: <Cpu className="w-8 h-8 text-neon-cyan" />,
        colSpan: "md:col-span-2",
        borderColor: "border-neon-cyan"
    },
    {
        title: "C++ SCAFFOLDING",
        description: "Modules, components, UPROPERTY/UFUNCTION patterns. Build graph and dependency awareness.",
        icon: <Code2 className="w-8 h-8 text-neon-lime" />,
        colSpan: "md:col-span-1",
        borderColor: "border-neon-lime"
    },
    {
        title: "CONTEXT HOOKS",
        description: "Local context ingestion (Blueprints, modules, build system) for accurate changes and fewer regressions.",
        icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
        colSpan: "md:col-span-1",
        borderColor: "border-green-400"
    },
    {
        title: "EXPLAINERS",
        description: '"Why this change?" + links to Unreal docs & patterns. Learn best practices as you build.',
        icon: <BookOpen className="w-8 h-8 text-neon-magenta" />,
        colSpan: "md:col-span-2",
        borderColor: "border-neon-magenta"
    },
    {
        title: "AGENTIC TASKS",
        description: '"Implement sprint ability", "Refactor input", "Add save/load". Multi-step workflows tuned to game tasks.',
        icon: <Layers className="w-8 h-8 text-orange-400" />,
        colSpan: "md:col-span-3",
        borderColor: "border-orange-400"
    }
]

export default function FeatureGrid() {
    return (
        <section className="py-24 relative bg-black">
            <div className="absolute inset-0 grid-pattern-cyan opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-block mb-4">
                        <span className="text-sm font-mono text-neon-cyan px-4 py-2 border border-neon-cyan bg-black/60">
                            [ FEATURE SET ]
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">
                        CORE <span className="text-neon-cyan text-glow-cyan">CAPABILITIES</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={`relative p-8 h-full flex flex-col terminal-window ${feature.colSpan} ${feature.borderColor} group hover:scale-[1.02] transition-all`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Terminal header bar */}
                            <div className="absolute top-0 left-0 right-0 bg-black/80 px-4 py-2 border-b-2 border-current flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-current" />
                                    <div className="w-2 h-2 bg-current opacity-70" />
                                    <div className="w-2 h-2 bg-current opacity-40" />
                                </div>
                                <span className="text-xs font-mono opacity-70">FEATURE_{(index + 1).toString().padStart(2, '0')}</span>
                            </div>

                            <div className="mt-8">
                                <div className="mb-6 p-3 bg-black w-fit border-2 border-current backdrop-blur-sm">
                                    {feature.icon}
                                </div>

                                <h3 className="text-2xl font-black mb-3 font-mono">{feature.title}</h3>
                                <p className="text-foreground-secondary leading-relaxed font-mono text-sm">
                                    {'>'} {feature.description}
                                </p>
                            </div>

                            {/* Corner decorations */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-current opacity-40 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-current opacity-40 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-current opacity-40 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-current opacity-40 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
