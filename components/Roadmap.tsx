'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Roadmap() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.8])

  return (
    <section
      ref={ref}
      className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <motion.div
        style={{ y, opacity }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-bold gradient-text-cyan text-center mb-4"
        >
          We're Already Building
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-300 text-center mb-12"
        >
          This isn't just an idea. Phase 1 is complete and functional. We are now
          developing Phase 2, focused on deep, interactive learning.
        </motion.p>
        
        <div className="space-y-8">
          {/* Phase 1 - Complete */}
          <motion.div
            initial={{ opacity: 0, x: -150, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative pl-8 border-l-2 border-[#4eebff]"
          >
            <div className="absolute -left-2 top-0 w-4 h-4 bg-[#4eebff] rounded-full shadow-lg shadow-[#4eebff]/50"></div>
            <div className="bg-[#1a2332]/60 backdrop-blur-sm p-6 rounded-lg border border-[#4eebff]/30">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-white">Phase 1</h3>
                <span className="px-3 py-1 bg-[#4eebff]/20 text-[#4eebff] rounded-full text-sm font-semibold">
                  Complete
                </span>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-[#4eebff]">✓</span>
                  AI Blueprint Generation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4eebff]">✓</span>
                  C++ Code Engine
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4eebff]">✓</span>
                  Multi-Provider AI Support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4eebff]">✓</span>
                  Crash-Free Function Creation
                </li>
              </ul>
            </div>
          </motion.div>
          
          {/* Phase 2 - In Progress */}
          <motion.div
            initial={{ opacity: 0, x: -150, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative pl-8 border-l-2 border-[#8a2be2]"
          >
            <div className="absolute -left-2 top-0 w-4 h-4 bg-[#8a2be2] rounded-full animate-pulse shadow-lg shadow-[#8a2be2]/50"></div>
            <div className="bg-[#1a2332]/60 backdrop-blur-sm p-6 rounded-lg border border-[#8a2be2]/30">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-white">Phase 2</h3>
                <span className="px-3 py-1 bg-[#8a2be2]/20 text-[#8a2be2] rounded-full text-sm font-semibold">
                  In Progress
                </span>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-[#8a2be2]">⟳</span>
                  Interactive Tutor
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#8a2be2]">⟳</span>
                  Live Design Pattern Recognition
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#8a2be2]">⟳</span>
                  System-Wide Architecture Analysis
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

