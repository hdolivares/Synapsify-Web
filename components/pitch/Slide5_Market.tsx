import SlideLayout from './SlideLayout'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Globe } from 'lucide-react'

export default function Slide5_Market() {
    return (
        <SlideLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full items-center">
                {/* Left Column: Stats */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                            Riding the Wave
                        </h2>
                        <p className="text-xl text-neon-cyan font-mono">of Engine Adoption.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6">
                        {[
                            {
                                icon: Globe,
                                label: 'Global Games Market',
                                value: '$187B+',
                                sub: 'But the real opportunity is the toolchain.',
                                color: 'text-white'
                            },
                            {
                                icon: Users,
                                label: 'Target Audience',
                                value: '100k+',
                                sub: 'Unreal Pros at $20-$40/seat.',
                                color: 'text-neon-cyan'
                            },
                            {
                                icon: DollarSign,
                                label: 'SAM Potential',
                                value: '$15M - $48M',
                                sub: 'Serviceable Addressable Market ARR.',
                                color: 'text-neon-lime'
                            }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="glass-panel p-6 rounded-lg flex items-center gap-6"
                            >
                                <div className={`p-3 rounded-full bg-white/5 ${stat.color}`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">{stat.label}</div>
                                    <div className={`text-3xl font-display font-bold ${stat.color} mb-1`}>{stat.value}</div>
                                    <div className="text-xs text-gray-500">{stat.sub}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Graph */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="h-[500px] glass-panel rounded-xl p-8 relative flex flex-col"
                >
                    <h3 className="text-lg font-bold text-white mb-8">Unreal Engine Adoption (Non-Gaming)</h3>

                    <div className="flex-1 relative border-l border-b border-gray-700">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-full h-px bg-gray-800" />
                            ))}
                        </div>

                        {/* Graph Line */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="var(--neon-lime)" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="var(--neon-lime)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                d="M 0 350 C 100 340, 200 300, 300 200 S 500 50, 600 20"
                                fill="none"
                                stroke="var(--neon-lime)"
                                strokeWidth="4"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M 0 350 C 100 340, 200 300, 300 200 S 500 50, 600 20 V 400 H 0 Z"
                                fill="url(#gradient)"
                                stroke="none"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 1 }}
                            />
                        </svg>

                        {/* Data Points */}
                        <div className="absolute top-[5%] right-[0%] transform translate-x-1/2 -translate-y-1/2">
                            <div className="bg-neon-lime text-black text-xs font-bold px-2 py-1 rounded">Film & Auto</div>
                        </div>
                    </div>

                    <div className="flex justify-between mt-4 text-xs text-gray-500 font-mono">
                        <span>2020</span>
                        <span>2021</span>
                        <span>2022</span>
                        <span>2023</span>
                        <span>2024</span>
                        <span>2025</span>
                    </div>
                </motion.div>
            </div>
        </SlideLayout>
    )
}
