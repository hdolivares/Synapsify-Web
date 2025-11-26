'use client'

import { useState, useEffect, useRef } from 'react'
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
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    // Auto-scroll messages container to bottom when new messages appear
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }, [currentStep])

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
        <section id="demo" className="py-24 relative overflow-hidden bg-black">
            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="text-sm font-mono text-neon-magenta px-4 py-2 border border-neon-magenta bg-black/60 animate-pulse">
                            [ LIVE DEMO ]
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">
                        WATCH IT IN <span className="text-neon-magenta text-glow-magenta">ACTION</span>
                    </h2>
                    <p className="text-xl text-foreground-secondary font-mono">
                        {'>'} FROM NATURAL LANGUAGE TO COMPILED CODE IN SECONDS.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="overflow-hidden border-2 border-neon-lime bg-black shadow-2xl neon-border"
                    >
                        {/* Terminal Toolbar */}
                        <div className="bg-black px-4 py-3 flex items-center justify-between border-b-2 border-neon-lime">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-2 mr-4">
                                    <div className="w-3 h-3 bg-neon-magenta" />
                                    <div className="w-3 h-3 bg-neon-cyan" />
                                    <div className="w-3 h-3 bg-neon-lime" />
                                </div>
                                <span className="text-sm text-neon-lime font-mono font-bold">SYNAPSIFY_EDITOR - BP_InventorySystem</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-black border border-neon-lime text-xs text-neon-lime font-mono">
                                    <Play className="w-3 h-3" /> COMPILE
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 h-[500px]">
                            {/* Chat Interface */}
                            <div className="bg-black border-r-2 border-neon-lime p-4 flex flex-col overflow-hidden">
                                {/* Messages Container with Fixed Height - DISABLE HORIZONTAL SCROLL */}
                                <div
                                    ref={messagesContainerRef}
                                    className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden max-h-[360px] mb-4 pr-2 custom-scrollbar"
                                >
                                    {currentStep > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-black/90 border-2 border-neon-cyan p-3 max-w-[90%]"
                                        >
                                            <p className="text-sm text-neon-cyan font-mono">{steps[0].text}</p>
                                        </motion.div>
                                    )}

                                    {steps.slice(1, currentStep).map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-3 max-w-[90%] ml-auto border-2 ${step.type === 'success' ? 'bg-black/90 border-neon-lime' :
                                                step.type === 'done' ? 'bg-black/90 border-neon-cyan' :
                                                    'bg-black/90 border-foreground-secondary'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {step.type === 'success' && <CheckCircle2 className="w-4 h-4 text-neon-lime" />}
                                                {step.type === 'system' && <Zap className="w-4 h-4 text-neon-cyan" />}
                                                <p className="text-sm text-white font-mono">{step.text}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Input Box - Always Visible at Bottom */}
                                <div className="pt-4 border-t-2 border-neon-lime">
                                    <div className="bg-black border-2 border-neon-lime p-3 flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-neon-lime" />
                                        <span className="text-sm text-neon-lime font-mono">
                                            {currentStep === 0 ? displayText : ""}
                                            <span className="animate-pulse">█</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Node Graph */}
                            <div className="col-span-2 bg-black relative overflow-hidden p-8">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

                                <AnimatePresence>
                                    {currentStep > 2 && (
                                        <div className="relative z-10 h-full w-full">
                                            {/* Event Node - BeginPlay */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, x: 20, y: 30 }}
                                                animate={{ opacity: 1, scale: 1, x: 20, y: 30 }}
                                                className="absolute top-6 left-6 w-40 bg-black border-t-4 border-neon-magenta border-2"
                                            >
                                                <div className="px-3 py-1 bg-black/80 border-b-2 border-neon-magenta flex justify-between items-center">
                                                    <span className="text-xs font-bold text-neon-magenta font-mono">EVENT_BEGINPLAY</span>
                                                    <Zap className="w-3 h-3 text-neon-magenta" />
                                                </div>
                                                <div className="p-3 h-16"></div>
                                            </motion.div>

                                            {/* Function Node - Init Inventory (MOVED CLOSER) */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, x: 200, y: 30 }}
                                                animate={{ opacity: 1, scale: 1, x: 200, y: 30 }}
                                                transition={{ delay: 0.5 }}
                                                className="absolute top-6 left-48 w-40 bg-black border-t-4 border-neon-cyan border-2"
                                            >
                                                <div className="px-3 py-1 bg-black/80 border-b-2 border-neon-cyan flex justify-between items-center">
                                                    <span className="text-xs font-bold text-neon-cyan font-mono">INIT_INVENTORY</span>
                                                    <div className="w-3 h-3 rounded-full border-2 border-neon-cyan" />
                                                </div>
                                                <div className="p-3 h-20"></div>
                                            </motion.div>

                                            {/* Connection Line - BeginPlay to Init */}
                                            <motion.svg
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 1 }}
                                                transition={{ delay: 1, duration: 0.5 }}
                                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                            >
                                                <path
                                                    d="M 182 80 C 202 80, 202 80, 216 80"
                                                    stroke="#CCFF00"
                                                    strokeWidth="3"
                                                    fill="none"
                                                />
                                            </motion.svg>

                                            {/* AddItem Function Node - NOW VISIBLE */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, x: 200, y: 140 }}
                                                animate={{ opacity: 1, scale: 1, x: 200, y: 140 }}
                                                transition={{ delay: 1.5 }}
                                                className="absolute top-32 left-48 w-40 bg-black border-t-4 border-neon-magenta border-2"
                                            >
                                                <div className="px-3 py-1 bg-black/80 border-b-2 border-neon-magenta flex justify-between items-center">
                                                    <span className="text-xs font-bold text-neon-magenta font-mono">ADD_ITEM</span>
                                                    <Plus className="w-3 h-3 text-neon-magenta" />
                                                </div>
                                                <div className="p-3 h-16 text-xs text-gray-400 font-mono">
                                                    <div>Check Weight</div>
                                                    <div>Add to Array</div>
                                                </div>
                                            </motion.div>

                                            {/* Variable List - Bottom Left */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1.5 }}
                                                className="absolute bottom-4 left-4 bg-black p-3 border-2 border-neon-lime"
                                            >
                                                <div className="text-xs text-neon-lime mb-2 font-mono font-bold">MY_BLUEPRINT</div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs text-orange-400 font-mono">
                                                        <div className="w-2 h-2 bg-orange-400" />
                                                        CURRENT_WEIGHT
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-orange-400 font-mono">
                                                        <div className="w-2 h-2 bg-orange-400" />
                                                        MAX_WEIGHT
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-neon-cyan font-mono">
                                                        <div className="w-2 h-2 bg-neon-cyan" />
                                                        ITEMS
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

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #000;
                    border-left: 1px solid #CCFF00;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #CCFF00;
                    border-radius: 4px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(204, 255, 0, 0.8);
                }

                /* Firefox scrollbar */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #CCFF00 #000;
                }
            `}</style>
        </section>
    )
}
