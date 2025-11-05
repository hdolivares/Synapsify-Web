'use client'

import { motion } from 'framer-motion'
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
function GlowingOrb({ delay, size, color, x, y, index }: { delay: number; size: number; color: string; x: string; y: string; index: number }) {
  // Use index-based seed for deterministic duration (prevents hydration mismatch)
  const durationSeed = index * 0.618 // Golden ratio for better distribution
  const duration = 20 + (durationSeed % 10) // Deterministic duration between 20-30
  
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-30"
      style={{
        width: size,
        height: size,
        background: color,
        left: x,
        top: y,
      }}
      animate={{
        x: [0, 100, -100, 0],
        y: [0, 50, -50, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// Floating geometric shape component
function FloatingShape({ delay, shape, size, x, y, colorIndex }: { delay: number; shape: 'circle' | 'square' | 'triangle'; size: number; x: string; y: string; colorIndex: number }) {
  const colors = ['rgba(78, 235, 255, 0.1)', 'rgba(0, 170, 255, 0.1)', 'rgba(138, 43, 226, 0.1)', 'rgba(255, 140, 63, 0.1)']
  const color = colors[colorIndex % colors.length]

  const renderShape = () => {
    switch (shape) {
      case 'circle':
        return <div className="w-full h-full rounded-full border border-[#4eebff]/20" style={{ background: color }} />
      case 'square':
        return (
          <div
            className="w-full h-full border border-[#4eebff]/20"
            style={{
              background: color,
              transform: 'rotate(45deg)',
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
            }}
          />
        )
      case 'triangle':
        return (
          <div
            className="w-full h-full border border-[#4eebff]/20"
            style={{
              background: color,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        )
    }
  }

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        y: [0, -30, 0],
        x: [0, 20, 0],
      }}
      transition={{
        duration: 10 + delay * 2,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {renderShape()}
    </motion.div>
  )
}

// Animated mesh gradient background
function MeshGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(at 0% 0%, rgba(78, 235, 255, 0.3) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(138, 43, 226, 0.3) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(0, 170, 255, 0.3) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(255, 140, 63, 0.2) 0px, transparent 50%)
          `,
        }}
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 30, -30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

// Code-inspired grid pattern
function CodeGrid() {
  return (
    <div className="absolute inset-0 opacity-10">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(78, 235, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78, 235, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  )
}

export default function Hero() {
  // Generate spark particles - reduced from 30 to 15 for better performance
  const sparks = Array.from({ length: 15 }, (_, i) => i)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Generate floating shapes
  const shapes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    shape: ['circle', 'square', 'triangle'][i % 3] as 'circle' | 'square' | 'triangle',
    size: 60 + (i % 4) * 30,
    x: `${(i * 137.5) % 100}%`,
    y: `${(i * 73) % 100}%`,
    delay: i * 0.5,
    colorIndex: i,
  }))

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 overflow-hidden bg-[#0a0f1e]">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <MeshGradient />
      </div>

      {/* Code Grid Pattern */}
      <div className="absolute inset-0 z-[1]">
        <CodeGrid />
      </div>

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#0a0f1e]/60 via-[#0a0f1e]/40 to-[#0a0f1e]/60" />

      {/* Glowing orbs for depth - using brand colors */}
      <div className="absolute inset-0 z-[3] overflow-hidden">
        <GlowingOrb delay={0} size={500} color="rgba(78, 235, 255, 0.4)" x="10%" y="20%" index={0} />
        <GlowingOrb delay={5} size={400} color="rgba(0, 170, 255, 0.3)" x="80%" y="60%" index={1} />
        <GlowingOrb delay={10} size={450} color="rgba(138, 43, 226, 0.25)" x="50%" y="80%" index={2} />
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        {shapes.map((shape) => (
          <FloatingShape
            key={shape.id}
            delay={shape.delay}
            shape={shape.shape}
            size={shape.size}
            x={shape.x}
            y={shape.y}
            colorIndex={shape.colorIndex}
          />
        ))}
      </div>

      {/* Animated Spark Particles */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        {sparks.map((spark) => (
          <SparkParticle key={spark} delay={spark * 0.1} index={spark} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
        >
          <span className="gradient-text-full">Build in Unreal Engine.</span>
          <br />
          <span className="text-white">Faster. Smarter.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Synapsify is an AI co-developer that lives in your editor. It generates
          bug-free Blueprints and production-ready C++ from plain English, teaching you
          professional design principles along the way.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
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

