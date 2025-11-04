'use client'

import { motion, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'

interface StepProps {
  number: number
  title: string
  description: string
  visual: React.ReactNode
  index: number
  currentSlide: number
}

function Step({ number, title, description, visual, index, currentSlide }: StepProps) {
  // Calculate opacity and scale based on distance from current slide
  const distance = Math.abs(currentSlide - index)
  const opacity = Math.max(0, 1 - distance * 0.8)
  const scale = Math.max(0.7, 1 - distance * 0.15)
  const rotateY = (currentSlide - index) * 15 // 3D rotation effect
  const z = Math.max(-200, -distance * 100) // 3D depth

  return (
    <motion.div
      style={{
        opacity,
        scale,
        rotateY,
        z,
        transformStyle: 'preserve-3d',
      }}
      className="flex-shrink-0 w-full md:w-[80vw] lg:w-[70vw] px-4 flex items-center justify-center"
    >
      <div className="w-full max-w-2xl">
        {/* Step Number Badge */}
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#4eebff] to-[#00aaff] flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-[#4eebff]/30">
            {number}
          </div>
        </motion.div>

        {/* Card */}
        <div
          className="bg-[#1a2332]/90 backdrop-blur-md p-8 rounded-2xl border border-[#4eebff]/30 shadow-2xl shadow-[#4eebff]/10"
          style={{ transform: 'translateZ(50px)' }}
        >
          {/* Visual */}
          <div className="mb-6 min-h-[250px] flex items-center justify-center overflow-hidden rounded-lg bg-[#0f1626]/60">
            {visual}
          </div>

          {/* Title */}
          <h3 className="text-3xl font-bold text-white mb-4 text-center">{title}</h3>

          {/* Description */}
          <p className="text-gray-300 text-center leading-relaxed text-lg">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 100, damping: 30 })

  const steps = [
    {
      number: 1,
      title: 'Prompt',
      description: 'Type your idea in plain English',
      visual: (
        <div className="w-full p-4">
          <div className="bg-[#0f1626]/80 p-6 rounded-lg border border-[#4eebff]/20 backdrop-blur-sm">
            <p className="text-gray-300 text-base">
              "Create an RPG leveling system with health, mana, and an experience curve."
            </p>
          </div>
        </div>
      ),
    },
    {
      number: 2,
      title: 'Generate',
      description: 'Synapsify creates organized Blueprints and C++ instantly',
      visual: (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src="/Promp and Generate.jpg"
            alt="Before and After - Prompt to Network Generation"
            fill
            className="object-cover"
            quality={90}
          />
        </div>
      ),
    },
    {
      number: 3,
      title: 'Learn',
      description: 'Get explanations of design patterns and best practices',
      visual: (
        <div className="w-full p-4">
          <div className="bg-[#8a2be2]/20 p-6 rounded-lg border border-[#8a2be2]/30 backdrop-blur-sm">
            <p className="text-[#4eebff] text-sm mb-3 font-semibold flex items-center gap-2">
              <span>💡</span> Design Pattern
            </p>
            <p className="text-gray-300 text-sm">
              "This uses the 'Strategy Pattern' for scalable damage calculation..."
            </p>
          </div>
        </div>
      ),
    },
  ]

  // Update x position when slide changes
  const handleSlideChange = useCallback((slideIndex: number) => {
    setCurrentSlide(slideIndex)
    
    if (!containerRef.current) return
    
    // Get the first slide element to measure its width
    const firstSlide = containerRef.current.querySelector('[data-slide="0"]') as HTMLElement
    if (!firstSlide) return
    
    // Measure the actual width of a slide including gap
    const slideRect = firstSlide.getBoundingClientRect()
    
    // Calculate the transform based on actual slide width
    // Each slide width + gap should be calculated
    const slideWidth = slideRect.width
    const gap = 48 // Gap in pixels (gap-12 = 3rem = 48px on desktop)
    
    // Calculate transform in pixels
    const transform = -slideIndex * (slideWidth + gap)
    x.set(transform)
  }, [x])

  // Update position on window resize
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleResize = () => {
      handleSlideChange(currentSlide)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentSlide, handleSlideChange])

  // Initialize position on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      handleSlideChange(0)
    }, 100)
    return () => clearTimeout(timer)
  }, [handleSlideChange])

  // Handle slider input
  const handleSliderChange = (value: number) => {
    const slideIndex = Math.round(value)
    handleSlideChange(slideIndex)
  }

  return (
    <section className="relative bg-[#0f1626]/50 overflow-hidden py-20">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00aaff]/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8a2be2]/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Title - outside the horizontal container, properly centered */}
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text-full text-center mb-16 px-4 relative z-10"
      >
        How It Works
      </motion.h2>

      {/* Horizontal slider container */}
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Horizontal scrolling container with 3D perspective */}
        <div className="overflow-hidden mb-12" ref={containerRef}>
          <motion.div
            style={{
              x: springX,
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
            className="flex items-center gap-8 md:gap-12 lg:gap-16"
          >
            {steps.map((step, index) => (
              <div key={step.number} data-slide={index}>
                <Step
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  visual={step.visual}
                  index={index}
                  currentSlide={currentSlide}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Horizontal Slider */}
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <div className="mb-4 relative">
            <input
              type="range"
              min="0"
              max={steps.length - 1}
              step="1"
              value={currentSlide}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-full h-2 bg-[#1a2332] rounded-lg appearance-none cursor-pointer range-slider"
              style={{
                background: `linear-gradient(to right, #4eebff 0%, #4eebff ${steps.length > 1 ? (currentSlide / (steps.length - 1)) * 100 : 0}%, #1a2332 ${steps.length > 1 ? (currentSlide / (steps.length - 1)) * 100 : 0}%, #1a2332 100%)`,
              }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => handleSlideChange(index)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  index === currentSlide ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-75'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-[#4eebff] shadow-lg shadow-[#4eebff]/50 scale-150'
                      : 'bg-gray-600'
                  }`}
                />
                <span className="text-xs text-gray-400 font-medium">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
