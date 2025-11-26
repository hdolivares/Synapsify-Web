'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
    {
        name: "HOBBY",
        price: "FREE",
        description: "For individuals exploring AI dev.",
        features: [
            "Limited Agent requests",
            "Limited tab completions",
            "Short Pro trial"
        ],
        highlight: false,
        borderColor: "border-foreground-secondary"
    },
    {
        name: "PRO",
        price: "$20",
        period: "/mo",
        description: "For professional developers.",
        features: [
            "Extended Agent limits",
            "Unlimited tab completions",
            "Background Agents",
            "Max context windows"
        ],
        highlight: true,
        borderColor: "border-neon-lime"
    },
    {
        name: "PRO+",
        price: "$60",
        period: "/mo",
        description: "For power users.",
        features: [
            "Everything in Pro",
            "~3x usage limits",
            "Priority access to new models (OpenAI/Claude/Gemini)"
        ],
        highlight: false,
        borderColor: "border-neon-cyan"
    },
    {
        name: "TEAMS",
        price: "$40",
        period: "/user/mo",
        description: "For collaborative studios.",
        features: [
            "Everything in Pro",
            "Centralized team billing",
            "Usage analytics/reporting",
            "Org-wide privacy mode"
        ],
        highlight: false,
        borderColor: "border-neon-magenta"
    }
]

export default function PricingSection() {
    return (
        <section className="py-24 relative bg-black/40">
            <div className="absolute inset-0 grid-pattern opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-block mb-4">
                        <span className="text-sm font-mono text-neon-lime px-4 py-2 border border-neon-lime bg-black/60">
                            [ PRICING MATRIX ]
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">
                        SIMPLE, TRANSPARENT <br />
                        <span className="text-neon-lime text-glow">PRICING</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative p-8 border-2 ${plan.borderColor} bg-black flex flex-col group hover:scale-105 transition-transform`}
                            style={{
                                boxShadow: plan.highlight ? '0 0 30px rgba(204, 255, 0, 0.3)' : 'none'
                            }}
                        >
                            {/* Terminal header */}
                            <div className="absolute top-0 left-0 right-0 bg-black/80 px-4 py-2 border-b-2 border-current flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-current" />
                                    <div className="w-2 h-2 bg-current opacity-70" />
                                    <div className="w-2 h-2 bg-current opacity-40" />
                                </div>
                                {plan.highlight && (
                                    <span className="ml-2 text-xs font-mono text-neon-lime font-bold">
                                        [RECOMMENDED]
                                    </span>
                                )}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-black mb-2 font-mono">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-black font-mono">{plan.price}</span>
                                    {plan.period && <span className="text-foreground-secondary text-sm font-mono">{plan.period}</span>}
                                </div>
                                <p className="text-foreground-secondary text-sm mb-8 min-h-[40px] font-mono">
                                    {'>'} {plan.description}
                                </p>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm">
                                            <div className="w-5 h-5 border-2 border-current flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="text-foreground font-mono text-xs">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-3 font-bold transition-all uppercase border-2 ${plan.highlight
                                        ? 'bg-neon-lime text-black border-neon-lime hover:bg-black hover:text-neon-lime'
                                        : 'bg-transparent text-current border-current hover:bg-current hover:text-black'
                                    }`}>
                                    Get Started
                                </button>
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
