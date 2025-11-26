import SlideLayout from './SlideLayout'
import { motion } from 'framer-motion'
import { AlertTriangle, Layers, BrainCircuit } from 'lucide-react'

export default function Slide2_Problem() {
    return (
        <SlideLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full items-center">
                {/* Left Column: Text Content */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                            Game Development is <span className="text-neon-magenta">Broken</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-mono">by Context Switching.</p>
                    </motion.div>

                    <div className="space-y-6">
                        {[
                            {
                                icon: AlertTriangle,
                                title: 'The "Flow" Killer',
                                desc: 'Developers constantly switch between the Engine and external AI tools, losing focus and momentum.',
                                color: 'text-neon-magenta'
                            },
                            {
                                icon: BrainCircuit,
                                title: 'The Context Gap',
                                desc: 'Generic LLMs are smart but "blind." They don\'t know your specific project structure or custom C++ classes.',
                                color: 'text-neon-cyan'
                            },
                            {
                                icon: Layers,
                                title: 'The Talent Bottleneck',
                                desc: 'Onboarding new developers to Unreal’s complex system is slow, and knowledge transfer is manual.',
                                color: 'text-neon-lime'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                                className="glass-panel p-6 rounded-lg border-l-4 border-l-neon-magenta"
                                style={{ borderLeftColor: item.color === 'text-neon-lime' ? 'var(--neon-lime)' : item.color === 'text-neon-cyan' ? 'var(--neon-cyan)' : 'var(--neon-magenta)' }}
                            >
                                <div className="flex items-start gap-4">
                                    <item.icon className={`w-8 h-8 ${item.color} mt-1`} />
                                    <div>
                                        <h3 className={`text-xl font-bold ${item.color} mb-1`}>{item.title}</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Visuals */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative h-full max-h-[600px] flex flex-col gap-4"
                >
                    {/* Visual representation of "Messy Blueprint" */}
                    <div className="flex-1 glass-panel rounded-xl overflow-hidden relative border border-white/10 p-4">
                        <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-center" />
                        <div className="absolute top-4 left-4 text-xs font-mono text-neon-magenta">/// ERROR: DISCONNECTED GRAPH</div>

                        {/* Abstract nodes */}
                        <div className="absolute top-1/4 left-1/4 w-32 h-20 bg-gray-800 border border-gray-600 rounded p-2">
                            <div className="h-2 w-full bg-gray-700 mb-2 rounded"></div>
                            <div className="h-2 w-2/3 bg-gray-700 rounded"></div>
                        </div>
                        <div className="absolute top-1/2 right-1/4 w-32 h-20 bg-gray-800 border border-gray-600 rounded p-2">
                            <div className="h-2 w-full bg-gray-700 mb-2 rounded"></div>
                            <div className="h-2 w-2/3 bg-gray-700 rounded"></div>
                        </div>

                        {/* Connection lines (messy) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path d="M 150 150 C 200 150, 200 300, 350 300" stroke="#FF006E" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                            <path d="M 150 160 C 250 160, 250 200, 180 250" stroke="#FF006E" strokeWidth="2" fill="none" />
                        </svg>
                    </div>

                    {/* Browser tabs visual */}
                    <div className="h-32 glass-panel rounded-xl p-4 flex flex-col gap-2 opacity-80">
                        <div className="flex gap-1 overflow-hidden">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-6 w-24 bg-gray-800 rounded-t-md border-t border-x border-gray-700 flex items-center px-2 text-[8px] text-gray-500">
                                    StackOverflow...
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 bg-gray-900 rounded border border-gray-700 p-2 text-xs text-gray-500 font-mono">
                            How to cast to custom player controller in C++...
                        </div>
                    </div>
                </motion.div>
            </div>
        </SlideLayout>
    )
}
