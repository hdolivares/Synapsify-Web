import SlideLayout from './SlideLayout'
import { motion } from 'framer-motion'

export default function Slide1_Title() {
    return (
        <SlideLayout>
            <div className="flex flex-col items-center text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-black border-2 border-neon-lime rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.3)] mb-8 mx-auto">
                        {/* Placeholder for Logo */}
                        <span className="text-4xl md:text-6xl font-display text-neon-lime">S</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-6xl md:text-8xl font-display font-bold text-white tracking-wider text-glow"
                >
                    SYNAPSIFY
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-2xl md:text-4xl font-mono text-neon-lime tracking-widest uppercase"
                >
                    Cursor for Game Development
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-xl text-gray-400 max-w-2xl"
                >
                    The first AI-native development environment integrated directly inside Unreal Engine.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="pt-12 text-sm font-mono text-gray-500"
                >
                    <p>Hugo • Jorge Ruiz • Cristina Manrique</p>
                </motion.div>
            </div>
        </SlideLayout>
    )
}
