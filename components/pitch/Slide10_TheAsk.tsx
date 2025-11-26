import SlideLayout from './SlideLayout'
import { motion } from 'framer-motion'

export default function Slide10_TheAsk() {
    return (
        <SlideLayout>
            <div className="flex flex-col h-full items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                        Accelerating the AI-Native Future
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full max-w-6xl">
                    {/* Left: The Numbers */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="text-gray-400 text-sm uppercase tracking-widest mb-2">Raising</div>
                            <div className="text-7xl md:text-8xl font-display font-bold text-neon-lime text-glow">$500,000</div>
                            <div className="text-xl text-white font-mono mt-2">Pre-Seed</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="text-gray-400 text-sm uppercase tracking-widest mb-2">Runway</div>
                            <div className="text-5xl font-display font-bold text-white">18 Months</div>
                            <div className="text-gray-400 mt-2">To reach Series A metrics</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="pt-8 border-t border-gray-800"
                        >
                            <div className="text-gray-400 text-sm uppercase tracking-widest mb-2">Goal</div>
                            <div className="text-xl text-white">Reach <span className="text-neon-cyan font-bold">1,000 paid users</span> and standard-setting studio partnerships.</div>
                        </motion.div>
                    </div>

                    {/* Right: Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <div className="relative w-80 h-80 rounded-full bg-gray-900 border-8 border-gray-800 shadow-2xl flex items-center justify-center">
                            {/* Conic Gradient Pie Chart */}
                            <div
                                className="absolute inset-0 rounded-full opacity-80"
                                style={{
                                    background: `conic-gradient(
                      var(--neon-lime) 0% 50%,
                      var(--neon-cyan) 50% 75%,
                      var(--neon-magenta) 75% 100%
                    )`
                                }}
                            />
                            {/* Inner Circle for Donut Chart effect */}
                            <div className="absolute inset-4 bg-black rounded-full flex items-center justify-center z-10">
                                <span className="text-gray-500 font-mono text-sm uppercase tracking-widest">Use of Funds</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-8 space-y-4 w-full max-w-xs">
                            {[
                                { label: 'Product & Engine Integrations', pct: '50%', color: 'bg-neon-lime', desc: 'Interactive Tutor & System Awareness' },
                                { label: 'Reliability & Infra', pct: '25%', color: 'bg-neon-cyan', desc: '99.9% Uptime & Secure VPCs' },
                                { label: 'GTM & Ops', pct: '25%', color: 'bg-neon-magenta', desc: 'Community & Pilots' }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + (index * 0.1) }}
                                    className="flex items-start gap-3"
                                >
                                    <div className={`w-4 h-4 rounded-sm ${item.color} mt-1 shrink-0`} />
                                    <div>
                                        <div className="flex justify-between w-full gap-4">
                                            <span className="text-white font-bold text-sm">{item.label}</span>
                                            <span className={`font-mono font-bold ${item.color.replace('bg-', 'text-')}`}>{item.pct}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">{item.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </SlideLayout>
    )
}
