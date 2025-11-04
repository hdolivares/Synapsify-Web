'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

export default function Solution() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Parallax effect - moves faster than scroll (opposite direction)
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])

  return (
    <section
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0f1626]/50 relative overflow-hidden"
    >
      {/* Animated background elements */}
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
      </div>
      <motion.div style={{ y }} className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold gradient-text-purple mb-6"
          >
            Your AI Development Lead
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Synapsify is your creative partner. It translates your ideas into robust,
            optimized, and crash-free code. It's not just a code generator; it's an
            educational tool that explains the "why" behind every design, making you a
            more effective developer.
          </motion.p>
        </motion.div>
        
        {/* Visual: Before/After */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 relative">
          {/* Center divider/arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8a2be2] to-[#4eebff] flex items-center justify-center shadow-lg shadow-[#4eebff]/30"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 20px rgba(78, 235, 255, 0.3)',
                  '0 0 40px rgba(78, 235, 255, 0.5)',
                  '0 0 20px rgba(78, 235, 255, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl">→</span>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -150, rotateY: -30 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="bg-[#1a2332]/80 backdrop-blur-sm p-6 rounded-xl border border-[#8a2be2]/50 overflow-hidden shadow-lg shadow-[#8a2be2]/20 relative group"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute top-4 right-4 px-3 py-1 bg-[#8a2be2]/20 text-[#8a2be2] rounded-full text-xs font-semibold border border-[#8a2be2]/30"
            >
              Problem
            </motion.div>
            <h3 className="text-xl font-semibold text-[#8a2be2] mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Before
            </h3>
            <div className="relative w-full aspect-video rounded overflow-hidden">
              <Image
                src="/Problem.jpg"
                alt="Spaghetti Code - Dev Frustration"
                fill
                className="object-cover"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <p className="text-gray-400 text-sm mt-4">Messy Blueprints • Spaghetti Code</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 150, rotateY: 30 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="bg-[#1a2332]/80 backdrop-blur-sm p-6 rounded-xl border border-[#4eebff]/50 overflow-hidden shadow-lg shadow-[#4eebff]/20 relative group"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute top-4 right-4 px-3 py-1 bg-[#4eebff]/20 text-[#4eebff] rounded-full text-xs font-semibold border border-[#4eebff]/30"
            >
              Solution
            </motion.div>
            <h3 className="text-xl font-semibold text-[#4eebff] mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> After
            </h3>
            <div className="relative w-full aspect-video rounded overflow-hidden">
              <Image
                src="/Solution.jpg"
                alt="Clean Code - Dev Satisfaction"
                fill
                className="object-cover"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <p className="text-gray-400 text-sm mt-4">Clean AI-Generated Graph • Organized Code</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

