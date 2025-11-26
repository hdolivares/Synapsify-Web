import SlideLayout from './SlideLayout'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function Slide7_BusinessModel() {
    return (
        <SlideLayout>
            <div className="flex flex-col h-full items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        Simple Seat-Based SaaS
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl items-center">
                    {/* Hobby */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-8 rounded-xl border border-gray-800 flex flex-col h-[400px]"
                    >
                        <h3 className="text-2xl font-bold text-white mb-2">Hobby</h3>
                        <div className="text-4xl font-display font-bold text-gray-400 mb-6">Free</div>
                        <p className="text-gray-400 text-sm mb-8 flex-1">Functions as a lead magnet to get devs addicted to the workflow.</p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-gray-500" /> Limited requests
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-gray-500" /> Basic generation
                            </li>
                        </ul>
                        <button className="w-full py-3 rounded border border-gray-700 text-gray-300 font-mono text-sm hover:bg-white/5 transition-colors">
                            Start Free
                        </button>
                    </motion.div>

                    {/* Pro */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel p-8 rounded-xl border-2 border-neon-lime flex flex-col h-[450px] relative shadow-[0_0_30px_rgba(204,255,0,0.1)] transform md:-translate-y-4"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neon-lime text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Core Driver
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                        <div className="text-4xl font-display font-bold text-neon-lime mb-6">$20 - $40 <span className="text-sm text-gray-500 font-normal">/ mo</span></div>
                        <p className="text-gray-300 text-sm mb-8 flex-1">The core revenue driver. For serious developers.</p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-white">
                                <Check className="w-4 h-4 text-neon-lime" /> Unlimited tab completions
                            </li>
                            <li className="flex items-center gap-2 text-sm text-white">
                                <Check className="w-4 h-4 text-neon-lime" /> Advanced agent capabilities
                            </li>
                            <li className="flex items-center gap-2 text-sm text-white">
                                <Check className="w-4 h-4 text-neon-lime" /> Background processing
                            </li>
                        </ul>
                        <button className="w-full py-3 rounded bg-neon-lime text-black font-bold font-mono text-sm hover:bg-neon-lime/90 transition-colors shadow-[0_0_15px_rgba(204,255,0,0.4)]">
                            Go Pro
                        </button>
                    </motion.div>

                    {/* Enterprise */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="glass-panel p-8 rounded-xl border border-gray-800 flex flex-col h-[400px]"
                    >
                        <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                        <div className="text-4xl font-display font-bold text-white mb-6">Custom</div>
                        <p className="text-gray-400 text-sm mb-8 flex-1">For Studios requiring security and control.</p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-white" /> Centralized billing
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-white" /> RBAC
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-white" /> Private cloud deployment
                            </li>
                        </ul>
                        <button className="w-full py-3 rounded border border-gray-700 text-white font-mono text-sm hover:bg-white/5 transition-colors">
                            Contact Sales
                        </button>
                    </motion.div>
                </div>
            </div>
        </SlideLayout>
    )
}
