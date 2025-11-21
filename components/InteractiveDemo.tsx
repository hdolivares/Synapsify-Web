'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Play, CheckCircle2, Plus, Zap } from 'lucide-react'

const steps = [
    { text: "Create an RPG inventory system with weight limits", type: "user" },
    { text: "Analyzing request...", type: "system" },
    { text: "Generating Blueprint structure...", type: "system" },
    { text: "Creating variables: CurrentWeight, MaxWeight, Items...", type: "success" },
    { text: "Implementing AddItem function with weight check...", type: "success" },
    { text: "System generation complete.", type: "done" }
]

export default function InteractiveDemo() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isTyping, setIsTyping] = useState(true)
    const [displayText, setDisplayText] = useState("")

    useEffect(() => {
        if (currentStep >= steps.length) {
            const timeout = setTimeout(() => {
                setCurrentStep(0)
                setDisplayText("")
                setIsTyping(true)
            }, 5000)
            return () => clearTimeout(timeout)
        }

        const step = steps[currentStep]

        if (isTyping && step.type === 'user') {
            if (displayText.length < step.text.length) {
                const timeout = setTimeout(() => {
                    setDisplayText(step.text.slice(0, displayText.length + 1))
                }, 50)
                return () => clearTimeout(timeout)
            } else {
                setIsTyping(false)
                setTimeout(() => setCurrentStep(prev => prev + 1), 1000)
            }
        } else {
            const timeout = setTimeout(() => {
                setCurrentStep(prev => prev + 1)
            }, 1500)
            return () => clearTimeout(timeout)
        }
    }, [currentStep, isTyping, displayText])

    return (
        <section id="demo" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Watch it in <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan">Action</span>
                    </h2>
                    <p className="text-xl text-foreground-secondary">
                        From natural language to compiled code in seconds.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-xl overflow-hidden border border-white/10 bg-[#1E1E1E] shadow-2xl"
                    >
                        {/* Fake IDE Toolbar */}
                        <div className="bg-[#252526] px-4 py-3 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-2 mr-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <span className="text-sm text-gray-400 font-mono">Cortx Editor - BP_InventorySystem</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#333] text-xs text-gray-300">
                                    <Play className="w-3 h-3 text-green-400" /> Compile
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 h-[500px]">
                            {/* Chat Interface */}
                            <div className="bg-[#1E1E1E] border-r border-white/5 p-4 flex flex-col">
                                <div className="flex-1 space-y-4 overflow-y-auto">
                                    {currentStep > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-[#2D2D2D] p-3 rounded-lg rounded-tl-none max-w-[90%]"
                                        >
                                            <p className="text-sm text-gray-300">{steps[0].text}</p>
                                        </motion.div>
                                    )}

                                    {steps.slice(1, currentStep).map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-3 rounded-lg max-w-[90%] ml-auto ${step.type === 'success' ? 'bg-green-900/20 border border-green-500/30' :
                                                step.type === 'done' ? 'bg-blue-900/20 border border-blue-500/30' :
                                                    'bg-[#252526]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {step.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                                {step.type === 'system' && <Zap className="w-4 h-4 text-yellow-400" />}
                                                <p className="text-sm text-gray-300">{step.text}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <div className="bg-[#252526] p-3 rounded-lg flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-300 font-mono">
                                            {currentStep === 0 ? displayText : ""}
                                            <span className="animate-pulse">|</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Node Graph */}
                            <div className="col-span-2 bg-[#151515] relative overflow-hidden p-8">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                                <AnimatePresence>
                                    {currentStep > 2 && (
                                        <div className="relative z-10 h-full w-full">
                                            {/* Event Node */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, x: 50, y: 50 }}
                                                animate={{ opacity: 1, scale: 1, x: 50, y: 50 }}
                                                className="absolute top-10 left-10 w-48 bg-[#2A2A2A] rounded border-t-4 border-red-500 shadow-lg"
                                            >
                                                <div className="px-3 py-1 bg-white/5 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-white">Event BeginPlay</span>
                                                    <Zap className="w-3 h-3 text-red-500" />
                                                </div>
                                                <div className="p-3 h-20"></div>
                                            </motion.div>

                                            {/* Function Node */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, x: 300, y: 50 }}
                                                animate={{ opacity: 1, scale: 1, x: 300, y: 50 }}
                                                transition={{ delay: 0.5 }}
                                                className="absolute top-10 left-80 w-48 bg-[#2A2A2A] rounded border-t-4 border-blue-500 shadow-lg"
                                            >
                                                <div className="px-3 py-1 bg-white/5 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-white">Init Inventory</span>
                                                    <div className="w-3 h-3 rounded-full border border-white/50" />
                                                </div>
                                                <div className="p-3 h-24"></div>
                                            </motion.div>

                                            {/* Connection Line */}
                                            <motion.svg
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 1 }}
                                                transition={{ delay: 1, duration: 0.5 }}
                                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                            >
                                                <path
                                                    d="M 242 85 C 292 85, 292 85, 320 85"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    fill="none"
                                                />
                                            </motion.svg>

                                            {/* Variable List */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1.5 }}
                                                className="absolute bottom-4 left-4 bg-[#252526] p-3 rounded border border-white/10"
                                            >
                                                <div className="text-xs text-gray-400 mb-2">My Blueprint</div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs text-orange-400">
                                                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                                                        CurrentWeight
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-orange-400">
                                                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                                                        MaxWeight
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-blue-400">
                                                        <div className="w-2 h-2 rounded bg-blue-400" />
                                                        Items
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
