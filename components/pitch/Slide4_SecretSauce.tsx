import SlideLayout from './SlideLayout'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Cpu, GitMerge } from 'lucide-react'

export default function Slide4_SecretSauce() {
    return (
        <SlideLayout>
            <div className="flex flex-col h-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        Deterministic Generation
                    </h2>
                    <p className="text-xl text-gray-400 font-mono">Not Just Hallucinations.</p>
                </motion.div>

                {/* Diagram */}
                <div className="flex-1 flex flex-col justify-center mb-12">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                        {[
                            { label: 'Input', color: 'border-gray-500 text-gray-300' },
                            { label: 'Contract', color: 'border-neon-cyan text-neon-cyan' },
                            { label: 'Compile', color: 'border-neon-magenta text-neon-magenta' },
                            { label: 'Node Gen', color: 'border-neon-lime text-neon-lime' }
                        ].map((step, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.2, duration: 0.5 }}
                                    className={`w-32 h-32 md:w-40 md:h-40 rounded-xl border-2 ${step.color} bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] relative z-10`}
                                >
                                    <span className="font-display font-bold text-lg md:text-xl">{step.label}</span>
                                </motion.div>

                                {index < 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        whileInView={{ opacity: 1, width: 'auto' }}
                                        transition={{ delay: index * 0.2 + 0.3, duration: 0.3 }}
                                    >
                                        <ArrowRight className="w-8 h-8 text-gray-600 rotate-90 md:rotate-0" />
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-8 text-center"
                    >
                        <div className="inline-block px-4 py-2 rounded-full border border-neon-lime/30 bg-neon-lime/10 text-neon-lime text-sm font-mono">
                            Multi-Pass Architecture
                        </div>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: ShieldCheck,
                            title: 'Crash-Free',
                            desc: 'Multi-Pass Architecture ensures stability before code touches the engine.'
                        },
                        {
                            icon: GitMerge,
                            title: 'Deep Integration',
                            desc: 'Leveraging official engine APIs (FBlueprintEditorUtils) to prevent file corruption.'
                        },
                        {
                            icon: Cpu,
                            title: 'Dynamic Node Factory',
                            desc: 'Supports 50+ node types including Math, Flow Control, and Gameplay Frameworks.'
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (index * 0.2), duration: 0.5 }}
                            className="glass-panel p-6 rounded-lg border-t-2 border-t-neon-lime/50 hover:border-t-neon-lime transition-colors"
                        >
                            <item.icon className="w-8 h-8 text-neon-lime mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </SlideLayout>
    )
}
