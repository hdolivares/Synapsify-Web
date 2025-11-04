'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import MagneticButton from './MagneticButton'
import WaitlistModal from './WaitlistModal'

// Spark particle component with gradient colors
function SparkParticle({ delay, index }: { delay: number; index: number }) {
  // Use index-based seed for consistent initial position (prevents hydration mismatch)
  const seed = index * 0.618 // Golden ratio for better distribution
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({
    x: (seed * 100) % 100,
    y: ((seed * 137) % 100),
  })

  // Define the two gradient options
  const gradients = [
    {
      // Cyan gradient: #4eebff to #a1eaff
      gradient: 'linear-gradient(135deg, #4eebff 0%, #a1eaff 100%)',
    },
    {
      // Orange gradient: #ff8c3f to #ffcb93
      gradient: 'linear-gradient(135deg, #ff8c3f 0%, #ffcb93 100%)',
    },
  ]

  // Alternate or randomly assign gradient based on index
  const gradient = gradients[index % 2]

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    }, 3000 + (index % 5) * 400) // More predictable timing

    return () => clearInterval(interval)
  }, [index])

  // Only render after mount to prevent hydration mismatch
  if (!mounted) return null

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        background: gradient.gradient,
        boxShadow: `0 0 10px ${gradient.gradient.includes('#4eebff') ? '#4eebff' : '#ff8c3f'}40, 0 0 20px ${gradient.gradient.includes('#4eebff') ? '#4eebff' : '#ff8c3f'}20`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.8, 0],
        scale: [0, 1.2, 1, 0],
        x: [0, ((index % 3) - 1) * 15], // Deterministic movement
        y: [0, ((index % 5) - 2) * 12],
      }}
      transition={{
        duration: 2 + (index % 3),
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// Glowing orb component for subtle background effects
function GlowingOrb({ delay, size, color }: { delay: number; size: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-30"
      style={{
        width: size,
        height: size,
        background: color,
      }}
      animate={{
        x: [0, 100, -100, 0],
        y: [0, 50, -50, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: 20 + Math.random() * 10,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export default function Hero() {
  // Generate spark particles - reduced from 30 to 15 for better performance
  const sparks = Array.from({ length: 15 }, (_, i) => i)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <div className="relative w-full h-full">
          <Image
            src="/hero-image.jpg"
            alt="AI Neural Network - Synapsify"
            fill
            className="object-cover blur-sm"
            priority
            quality={90}
            style={{ objectPosition: 'center' }}
          />
          {/* Enhanced layered overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/80 via-[#0a0f1e]/60 to-[#0a0f1e]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1e]/40 via-transparent to-[#0a0f1e]/40"></div>
        </div>
      </motion.div>

      {/* Glowing orbs for depth - using brand colors */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        <GlowingOrb delay={0} size={400} color="rgba(78, 235, 255, 0.5)" />
        <GlowingOrb delay={5} size={300} color="rgba(0, 170, 255, 0.4)" />
        <GlowingOrb delay={10} size={350} color="rgba(138, 43, 226, 0.3)" />
      </div>

      {/* Animated Spark Particles */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {sparks.map((spark) => (
          <SparkParticle key={spark} delay={spark * 0.1} index={spark} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
          style={{
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 2px 10px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 0, 0, 0.4)',
          }}
        >
          Build in Unreal Engine.
          <br />
          Faster. Smarter.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto"
          style={{
            textShadow: '0 2px 15px rgba(0, 0, 0, 0.8), 0 1px 5px rgba(0, 0, 0, 0.6)',
          }}
        >
          Synapsify is an AI co-developer that lives in your editor. It generates
          bug-free Blueprints and production-ready C++ from plain English, teaching you
          professional design principles along the way.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <MagneticButton
            magneticStrength={0.4}
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 gradient-button-primary rounded-full text-lg hover:opacity-90 transition-all shadow-2xl shadow-[#4eebff]/30 relative overflow-hidden"
          >
            <span className="relative z-10">Join the Waitlist</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </MagneticButton>
        </motion.div>
      </div>
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

