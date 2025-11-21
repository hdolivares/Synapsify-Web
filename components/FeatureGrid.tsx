'use client'

import { motion } from 'framer-motion'
import { Cpu, Code2, Zap, ShieldCheck, BookOpen, Layers } from 'lucide-react'

const features = [
    {
        title: "Blueprint Integration",
        description: "Generate and modify graphs, nodes, and connections. The AI understands your Blueprint logic and structure.",
        icon: <Cpu className="w-8 h-8 text-accent-cyan" />,
        colSpan: "md:col-span-2",
        bg: "bg-gradient-to-br from-accent-cyan/10 to-transparent"
    },
    {
        title: "C++ Scaffolding",
        description: "Modules, components, UPROPERTY/UFUNCTION patterns. Build graph and dependency awareness.",
        icon: <Code2 className="w-8 h-8 text-primary" />,
        colSpan: "md:col-span-1",
        bg: "bg-gradient-to-br from-primary/10 to-transparent"
    },
    {
        title: "Context Hooks",
        description: "Local context ingestion (Blueprints, modules, build system) for accurate changes and fewer regressions.",
        icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
        colSpan: "md:col-span-1",
        bg: "bg-gradient-to-br from-green-400/10 to-transparent"
    },
    {
        title: "Explainers",
        description: "\"Why this change?\" + links to Unreal docs & patterns. Learn best practices as you build.",
        icon: <BookOpen className="w-8 h-8 text-accent-purple" />,
        colSpan: "md:col-span-2",
        bg: "bg-gradient-to-br from-accent-purple/10 to-transparent"
    },
    {
        title: "Agentic Tasks",
        description: "\"Implement sprint ability\", \"Refactor input\", \"Add save/load\". Multi-step workflows tuned to game tasks.",
        icon: <Layers className="w-8 h-8 text-orange-400" />,
        colSpan: "md:col-span-3",
        bg: "bg-gradient-to-r from-orange-400/10 via-red-400/5 to-transparent"
    }
]

export default function FeatureGrid() {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={`relative p-8 h-full flex flex-col rounded-xl border border-white/10 ${feature.colSpan} ${feature.bg}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="mb-6 p-3 rounded-lg bg-white/5 w-fit backdrop-blur-sm border border-white/10">
                                {feature.icon}
                            </div>

                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-foreground-secondary leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div >
                    ))}
                </div >
            </div >
        </section >
    )
}
