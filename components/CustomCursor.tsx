'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)
  const rafRef = useRef<number>()

  // Smooth spring for cursor movement - optimized for responsiveness
  const springX = useSpring(x, { stiffness: 600, damping: 40, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 600, damping: 40, mass: 0.1 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateMousePosition = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother updates
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(() => {
        x.set(e.clientX)
        y.set(e.clientY)
      })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add hover listeners to interactive elements (with mutation observer for dynamic elements)
    const updateInteractiveElements = () => {
      const interactiveElements = document.querySelectorAll('button, a, [role="button"]')
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter)
        el.addEventListener('mouseleave', handleMouseLeave)
      })
    }

    updateInteractiveElements()

    // Watch for new interactive elements
    const observer = new MutationObserver(updateInteractiveElements)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', updateMousePosition, { passive: true })

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      observer.disconnect()
      const interactiveElements = document.querySelectorAll('button, a, [role="button"]')
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [x, y])

  return (
    <>
      {/* Main cursor - only show on desktop */}
      {/* Higher z-index than modal content but lower than modal backdrop */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 w-4 h-4 rounded-full bg-gradient-to-r from-[#4eebff] to-[#00aaff] pointer-events-none mix-blend-difference"
        style={{ 
          zIndex: 10002, // Higher than modal (10001) so cursor shows over modal content
          x: springX,
          y: springY,
          scale: isHovering ? 1.5 : 1,
        }}
      />
      {/* Outer ring - only show on desktop */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#4eebff]/30 pointer-events-none"
        style={{ 
          zIndex: 10001, // Same as modal content
          x: springX,
          y: springY,
          scale: isHovering ? 2 : 1,
        }}
      />
    </>
  )
}

