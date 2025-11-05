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

// Floating game-related element component
function FloatingGameElement({ delay, elementType, size, x, y, colorIndex }: { delay: number; elementType: 'bracket' | 'controller' | 'block' | 'coin' | 'node' | 'code' | 'sword' | 'invader'; size: number; x: string; y: string; colorIndex: number }) {
  const colors = ['rgba(78, 235, 255, 0.15)', 'rgba(0, 170, 255, 0.15)', 'rgba(138, 43, 226, 0.15)', 'rgba(255, 140, 63, 0.15)']
  const color = colors[colorIndex % colors.length]

  const renderElement = () => {
    switch (elementType) {
      case 'bracket':
        // Code brackets {}
        return (
          <div className="w-full h-full flex items-center justify-center" style={{ color: '#4eebff', fontSize: size * 0.8 }}>
            <span className="font-bold">{'{'}</span>
            <span className="font-bold ml-1">{'}'}</span>
          </div>
        )
      case 'controller':
        // Game controller emoji
        return (
          <div className="w-full h-full flex items-center justify-center" style={{ fontSize: size * 0.7 }}>
            🎮
          </div>
        )
      case 'block':
        // Game block/platform
        return (
          <div
            className="w-full h-full border-2 border-[#4eebff]/30"
            style={{
              background: `linear-gradient(135deg, ${color}, transparent)`,
              clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)',
            }}
          />
        )
      case 'coin':
        // Game coin
        return (
          <div className="w-full h-full relative">
            <div
              className="absolute inset-0 rounded-full border-2 border-[#ff8c3f]/40"
              style={{
                background: `radial-gradient(circle at 30% 30%, rgba(255, 140, 63, 0.3), ${color})`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center" style={{ fontSize: size * 0.3 }}>
              $
            </div>
          </div>
        )
      case 'node':
        // Blueprint node (circular with connection points)
        return (
          <div className="w-full h-full relative">
            <div
              className="absolute inset-0 rounded-full border-2 border-[#4eebff]/40"
              style={{ background: color }}
            />
            {/* Connection points */}
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#4eebff]/60 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-[#4eebff]/60 rounded-full transform -translate-x-1/2 translate-y-1/2" />
            <div className="absolute left-0 top-1/2 w-2 h-2 bg-[#4eebff]/60 rounded-full transform -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute right-0 top-1/2 w-2 h-2 bg-[#4eebff]/60 rounded-full transform -translate-y-1/2 translate-x-1/2" />
          </div>
        )
      case 'code':
        // Code angle brackets <>
        return (
          <div className="w-full h-full flex items-center justify-center" style={{ color: '#4eebff', fontSize: size * 0.8 }}>
            <span className="font-bold">{'<'}</span>
            <span className="font-bold ml-1">{'>'}</span>
          </div>
        )
      case 'sword':
        // Sword icon
        return (
          <div className="w-full h-full flex items-center justify-center" style={{ fontSize: size * 0.7 }}>
            ⚔️
          </div>
        )
      case 'invader':
        // Space invader (8-bit style)
        return (
          <div className="w-full h-full relative" style={{ fontSize: size * 0.6 }}>
            <div className="absolute inset-0 flex items-center justify-center" style={{ color: '#4eebff' }}>
              👾
            </div>
          </div>
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
        opacity: [0.4, 0.7, 0.4],
        scale: [1, 1.15, 1],
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
      {renderElement()}
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

  // Generate floating game elements
  const gameElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    elementType: ['bracket', 'controller', 'sword', 'coin', 'node', 'code', 'bracket', 'invader'][i % 8] as 'bracket' | 'controller' | 'coin' | 'node' | 'code' | 'sword' | 'invader',
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

      {/* Floating Game Elements */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        {gameElements.map((element) => (
          <FloatingGameElement
            key={element.id}
            delay={element.delay}
            elementType={element.elementType}
            size={element.size}
            x={element.x}
            y={element.y}
            colorIndex={element.colorIndex}
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

