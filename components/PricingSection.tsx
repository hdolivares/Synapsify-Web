'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
    {
        name: "Hobby",
        price: "Free",
        description: "For individuals exploring AI dev.",
        features: [
            "Limited Agent requests",
            "Limited tab completions",
            "Short Pro trial"
        ],
        highlight: false
    },
    {
        name: "Pro",
        price: "$20",
        period: "/mo",
        description: "For professional developers.",
        features: [
            "Extended Agent limits",
            "Unlimited tab completions",
            "Background Agents",
            "Max context windows"
        ],
        highlight: true
    },
    {
        name: "Pro+",
        price: "$60",
        period: "/mo",
        description: "For power users.",
        features: [
            "Everything in Pro",
            "~3x usage limits",
            "Priority access to new models (OpenAI/Claude/Gemini)"
        ],
        highlight: false
    },
    {
        name: "Teams",
        price: "$40",
        period: "/user/mo",
        description: "For collaborative studios.",
        features: [
            "Everything in Pro",
            "Centralized team billing",
            "Usage analytics/reporting",
            "Org-wide privacy mode"
        ],
        highlight: false
    }
]

export default function PricingSection() {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Simple, Transparent <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-cyan">Pricing</span>
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
                            className={`relative p-8 rounded-2xl border ${plan.highlight
                                    ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                                    : 'border-white/10 glass-panel hover:border-white/20'
                                } flex flex-col`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.period && <span className="text-foreground-secondary text-sm">{plan.period}</span>}
                            </div>
                            <p className="text-foreground-secondary text-sm mb-8 min-h-[40px]">
                                {plan.description}
                            </p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm">
                                        <Check className="w-5 h-5 text-primary shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 rounded-lg font-bold transition-all ${plan.highlight
                                    ? 'bg-primary text-white hover:bg-primary/90'
                                    : 'bg-white/5 text-white hover:bg-white/10'
                                }`}>
                                Get Started
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
