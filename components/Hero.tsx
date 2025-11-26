'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Hero() {
  const [text, setText] = useState('')
  const fullText = 'CURSOR FOR GAME DEVELOPMENT'

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 grid-pattern opacity-40" />

      {/* Geometric accent shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 border-2 border-neon-cyan opacity-20 rotate-45 animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 border-2 border-neon-magenta opacity-10 -rotate-12" />

      <div className="container mx-auto px-4 z-10 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded border-2 border-neon-lime mb-8 bg-black/60 backdrop-blur-sm neon-border animate-flicker">
            <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
            <span className="text-sm font-bold text-neon-lime tracking-widest">
              AI-NATIVE DEVELOPMENT FOR UNREAL
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
        >
          <span className="block text-foreground mb-4">CURSOR FOR</span>
          <span className="block text-neon-lime text-glow typing-cursor" style={{ fontFamily: 'var(--font-orbitron)' }}>
            {text || 'GAME DEVELOPMENT'}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-foreground-secondary max-w-3xl mx-auto mb-12 text-balance font-mono"
        >
          {'>'} BUILD FASTER. LEARN FASTER. SHIP BETTER.
          <br />
          {'>'} INTEGRATED AI THAT UNDERSTANDS YOUR BLUEPRINTS, C++, AND PROJECT CONTEXT.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="#waitlist"
            className="group relative px-8 py-4 bg-black border-2 border-neon-lime text-neon-lime font-bold text-lg transition-all hover:bg-neon-lime hover:text-black uppercase tracking-wider overflow-hidden"
          >
            <span className="relative z-10">Join the Waitlist</span>
            <div className="absolute inset-0 bg-neon-lime transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 animate-pulse-glow" />
            </div>
          </Link>
          <Link
            href="#demo"
            className="px-8 py-4 bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black font-bold text-lg transition-all uppercase tracking-wider"
          >
            Watch Demo
          </Link>
        </motion.div>

        {/* Terminal-style decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 flex justify-center gap-8 text-xs font-mono text-foreground-secondary"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-lime rounded-full animate-pulse" />
            <span>SYSTEM: ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            <span>AI: READY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-magenta rounded-full animate-pulse" />
            <span>STATUS: ACTIVE</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-neon-lime flex justify-center p-1 neon-border">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-neon-lime"
          />
        </div>
      </motion.div>
    </section>
  )
}
