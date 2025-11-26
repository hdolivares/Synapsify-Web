import SlideLayout from './SlideLayout'
import { motion } from 'framer-motion'
import { CheckCircle2, Zap, Database, Terminal } from 'lucide-react'

export default function Slide3_Solution() {
    return (
        <SlideLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full items-center">
                {/* Left Column: Visual Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[500px] w-full bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden shadow-2xl"
                >
                    {/* Fake Unreal Editor UI */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-[#0a0a0a] border-b border-gray-800 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="ml-4 text-xs text-gray-500 font-mono">Unreal Editor - MyProject</div>
                    </div>

                    {/* Viewport */}
                    <div className="absolute top-8 left-0 right-0 bottom-0 bg-gradient-to-br from-gray-900 to-black p-4 flex">
                        <div className="flex-1 border border-gray-800 rounded bg-gray-900/50 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-mono text-sm">
                                [3D VIEWPORT]
                            </div>
                        </div>

                        {/* Synapsify Overlay */}
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="w-80 ml-4 glass-panel rounded-lg border border-neon-lime/50 flex flex-col shadow-[0_0_30px_rgba(204,255,0,0.1)]"
                        >
                            <div className="h-10 border-b border-white/10 flex items-center px-4 justify-between bg-neon-lime/10">
                                <span className="text-neon-lime font-bold text-sm">Synapsify AI</span>
                                <div className="w-2 h-2 rounded-full bg-neon-lime animate-pulse"></div>
                            </div>
                            <div className="flex-1 p-4 space-y-3 overflow-y-auto font-mono text-xs">
                                <div className="bg-white/5 p-2 rounded rounded-tl-none self-start max-w-[90%] text-gray-300">
                                    How do I spawn a projectile?
                                </div>
                                <div className="bg-neon-lime/20 p-2 rounded rounded-tr-none self-end max-w-[90%] text-white border border-neon-lime/30">
                                    I can help with that. Here is the Blueprint logic to spawn an actor...
                                </div>
                                <div className="h-20 bg-black/40 rounded border border-white/10 flex items-center justify-center text-gray-600">
                                    [Blueprint Snippet]
                                </div>
                            </div>
                            <div className="p-3 border-t border-white/10">
                                <div className="h-8 bg-black/50 rounded border border-white/20 flex items-center px-3 text-gray-500 text-xs">
                                    Ask Synapsify...
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Column: Content */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                            Synapsify
                        </h2>
                        <p className="text-xl text-neon-lime font-mono uppercase tracking-widest">AI Native. Engine Integrated.</p>
                    </motion.div>

                    <div className="space-y-6">
                        {[
                            {
                                icon: Terminal,
                                title: 'In-Editor Assistant',
                                desc: 'Lives right next to your viewport. No alt-tabbing required.',
                            },
                            {
                                icon: Zap,
                                title: 'Hybrid Power',
                                desc: 'The only tool that handles both C++ Scaffolding and Blueprint Generation seamlessly.',
                            },
                            {
                                icon: Database,
                                title: 'Context Aware',
                                desc: 'Instantly reads your local codebase, assets, and dependencies to generate code that actually compiles.',
                            },
                            {
                                icon: CheckCircle2,
                                title: 'Value Prop',
                                desc: 'Build faster. Learn faster. Ship better.',
                                highlight: true
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                                className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${item.highlight ? 'bg-neon-lime/10 border border-neon-lime/30' : 'hover:bg-white/5'}`}
                            >
                                <div className={`p-2 rounded-lg ${item.highlight ? 'bg-neon-lime text-black' : 'bg-gray-800 text-neon-lime'}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-bold ${item.highlight ? 'text-neon-lime' : 'text-white'} mb-1`}>{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </SlideLayout>
    )
}
