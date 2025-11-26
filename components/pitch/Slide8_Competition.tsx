import SlideLayout from './SlideLayout'
import { motion } from 'framer-motion'

export default function Slide8_Competition() {
    return (
        <SlideLayout>
            <div className="flex flex-col h-full items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        Why We Win
                    </h2>
                </motion.div>

                <div className="relative w-full max-w-4xl aspect-square md:aspect-[16/9] bg-black/20 rounded-xl border border-gray-800 p-8">
                    {/* Axes */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-gray-700 relative">
                            <span className="absolute left-4 -top-8 text-gray-500 text-xs font-mono uppercase">Generic</span>
                            <span className="absolute right-4 -top-8 text-neon-lime text-xs font-mono uppercase font-bold">Engine Native</span>
                        </div>
                        <div className="h-full w-px bg-gray-700 absolute">
                            <span className="absolute -left-24 bottom-4 text-gray-500 text-xs font-mono uppercase w-20 text-right">Text Only</span>
                            <span className="absolute -left-32 top-4 text-neon-lime text-xs font-mono uppercase font-bold w-28 text-right">Actionable Code</span>
                        </div>
                    </div>

                    {/* Competitors */}

                    {/* Bottom Left: Generic + Text Only */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute bottom-[20%] left-[20%] transform -translate-x-1/2 translate-y-1/2 flex flex-col items-center"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-xl">🤖</div>
                        <span className="text-gray-500 text-xs mt-2 font-bold">ChatGPT / Claude</span>
                        <span className="text-gray-600 text-[10px] max-w-[100px] text-center mt-1">Zero Context</span>
                    </motion.div>

                    {/* Top Left: Generic + Actionable */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="absolute top-[30%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-xl">🐱</div>
                        <span className="text-gray-400 text-xs mt-2 font-bold">GitHub Copilot</span>
                        <span className="text-gray-600 text-[10px] max-w-[100px] text-center mt-1">Great for C++, No Blueprints</span>
                    </motion.div>

                    {/* Top Right: Synapsify */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="absolute top-[15%] right-[15%] transform translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
                    >
                        <div className="w-20 h-20 rounded-full bg-black border-2 border-neon-lime flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.4)]">
                            <span className="text-3xl font-display text-neon-lime">S</span>
                        </div>
                        <span className="text-neon-lime text-lg mt-3 font-bold font-display">Synapsify</span>
                        <span className="text-white text-xs max-w-[150px] text-center mt-1 bg-black/50 backdrop-blur px-2 py-1 rounded border border-gray-800">
                            Understands C++ & Blueprints
                        </span>
                    </motion.div>

                </div>
            </div>
        </SlideLayout>
    )
}
