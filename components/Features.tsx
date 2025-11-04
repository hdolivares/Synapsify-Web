'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'

interface FeatureCardProps {
  title: string
  description: string
  delay: number
  index: number
  icon: string
  gradient: string
}

function FeatureCard({ title, description, delay, index, icon, gradient }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })

  // 3D tilt effect based on scroll position
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [
    index % 2 === 0 ? -5 : 5,
    0,
    index % 2 === 0 ? 5 : -5,
  ])
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [
    index % 2 === 0 ? 3 : -3,
    0,
    index % 2 === 0 ? -3 : 3,
  ])
  
  // Parallax and scale effects
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${(index + 1) * 15}%`])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const z = useTransform(scrollYProgress, [0, 0.5, 1], [0, 50, 0])

  // Smooth spring animations
  const rotateXSpring = useSpring(rotateX, { stiffness: 100, damping: 30 })
  const rotateYSpring = useSpring(rotateY, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={cardRef}
      style={{
        y,
        scale,
        rotateX: isHovered ? 0 : rotateXSpring,
        rotateY: isHovered ? 0 : rotateYSpring,
        z,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Glowing background effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: gradient,
          filter: 'blur(40px)',
          zIndex: -1,
        }}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Card */}
      <div className="relative bg-[#1a2332]/80 backdrop-blur-md p-8 rounded-xl border border-[#4eebff]/20 hover:border-[#4eebff]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-[#4eebff]/20">
        {/* Icon */}
        <motion.div
          className="text-5xl mb-6"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            rotate: isHovered ? [0, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {icon}
        </motion.div>
        
        {/* Gradient line accent */}
        <motion.div
          className="h-1 rounded-full mb-6"
          style={{
            background: gradient,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
        />
        
        <h3 className="text-2xl font-bold text-white mb-4" style={{ transform: 'translateZ(20px)' }}>
          {title}
        </h3>
        <p className="text-gray-300 leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
          {description}
        </p>
      </div>
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.8])

  return (
    <motion.section
      ref={ref}
      style={{ opacity, position: 'relative' }}
      className="pt-20 pb-48 px-4 sm:px-6 lg:px-8 relative"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold gradient-text-full mb-6"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Everything you need to build faster, smarter, and with confidence
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8" style={{ perspective: '1000px' }}>
          <FeatureCard
            title="Go from Idea to Blueprint in Seconds"
            description="Generate entire game systems, from complex math operations to flow control and gameplay framework nodes, using natural language."
            delay={0}
            index={0}
            icon="⚡"
            gradient="linear-gradient(135deg, #4eebff, #00aaff)"
          />
          <FeatureCard
            title="Generate Crash-Free C++ & Blueprints"
            description="We've eliminated fatal crashes. Synapsify builds on a 'multi-pass architecture' using official engine APIs, ensuring the code it generates is robust and reliable."
            delay={0.2}
            index={1}
            icon="🛡️"
            gradient="linear-gradient(135deg, #00aaff, #8a2be2)"
          />
          <FeatureCard
            title="Learn from a Pro, Not a Prompt"
            description="Synapsify is your built-in tutor. It explains the design patterns, architecture, and Unreal best practices behind its code, turning every prompt into a learning opportunity."
            delay={0.4}
            index={2}
            icon="🎓"
            gradient="linear-gradient(135deg, #8a2be2, #c700ff)"
          />
        </div>
      </motion.div>
    </motion.section>
  )
}

