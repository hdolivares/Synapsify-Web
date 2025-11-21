'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-glow/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent-purple/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-primary/30">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-sm font-medium text-accent-cyan tracking-wide">
              AI-NATIVE DEVELOPMENT FOR UNREAL
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
        >
          Cursor for
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-cyan to-accent-purple text-glow">
            Game Development
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-foreground-secondary max-w-3xl mx-auto mb-12 text-balance"
        >
          Build faster. Learn faster. Ship better.
          <br />
          Integrated AI that understands your Blueprints, C++, and project context.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="#waitlist"
            className="px-8 py-4 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"
          >
            Join the Waitlist
          </Link>
          <Link
            href="#demo"
            className="px-8 py-4 rounded-lg glass-panel hover:bg-white/5 text-white font-medium text-lg transition-all border border-white/10 hover:border-white/20"
          >
            Watch Demo
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-white"
          />
        </div>
      </motion.div>
    </section>
  )
}
