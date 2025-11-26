import SlideLayout from './SlideLayout'
import { motion } from 'framer-motion'
import { CheckSquare, Server, Shield, Activity } from 'lucide-react'

export default function Slide6_Traction() {
    return (
        <SlideLayout>
            <div className="flex flex-col h-full items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        Built, Tested, and <span className="text-neon-lime">Production Ready</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-mono">Core Systems Live.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                    {/* Card 1: Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-8 rounded-xl border-t-4 border-t-neon-lime flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-neon-lime/10 flex items-center justify-center mb-6">
                            <Activity className="w-8 h-8 text-neon-lime" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Core Systems Live</h3>
                        <p className="text-gray-400">The AI Assistant, Blueprint Generation, and C++ Tools are fully implemented and operational.</p>
                    </motion.div>

                    {/* Card 2: Capabilities */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel p-8 rounded-xl border-t-4 border-t-neon-cyan flex flex-col"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-neon-cyan/10 flex items-center justify-center">
                                <Server className="w-6 h-6 text-neon-cyan" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Capabilities</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                'Full Math, Array, and String libraries implemented',
                                'Multi-Provider Support (OpenAI, Gemini, Anthropic)',
                                'Secure, Encrypted API Key Storage'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-left">
                                    <CheckSquare className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
                                    <span className="text-gray-300 text-sm">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Card 3: Validation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-panel p-8 rounded-xl border-t-4 border-t-neon-magenta flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-neon-magenta/10 flex items-center justify-center mb-6">
                            <Shield className="w-8 h-8 text-neon-magenta" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Validation</h3>
                        <div className="text-5xl font-display font-bold text-white mb-2">0</div>
                        <p className="text-neon-magenta font-bold uppercase tracking-wider mb-2">Fatal Crashes</p>
                        <p className="text-gray-400 text-sm">In current build due to robust error handling and engine source study.</p>
                    </motion.div>
                </div>
            </div>
        </SlideLayout>
    )
}
