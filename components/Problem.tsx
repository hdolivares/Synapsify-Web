'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// Problem stat component
function ProblemStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <motion.div
        className="text-4xl sm:text-5xl font-bold gradient-text-cyan mb-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-gray-400 uppercase tracking-wider">{label}</div>
    </motion.div>
  )
}

export default function Problem() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Parallax effect - moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.8])

  return (
    <section
      ref={ref}
      className="pt-20 pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Subtle mesh gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(at 20% 30%, rgba(78, 235, 255, 0.1) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(138, 43, 226, 0.1) 0px, transparent 50%),
              radial-gradient(at 40% 80%, rgba(0, 170, 255, 0.08) 0px, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(78, 235, 255, 0.3) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#4eebff]/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#8a2be2]/5 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        initial={{ opacity: 0, x: -100, scale: 0.8 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-5xl mx-auto relative z-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold gradient-text-cyan mb-6 text-center"
          animate={{
            textShadow: [
              '0 0 20px rgba(78, 235, 255, 0.3)',
              '0 0 30px rgba(78, 235, 255, 0.5)',
              '0 0 20px rgba(78, 235, 255, 0.3)',
            ],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3 },
            y: { duration: 0.8, delay: 0.3 },
            textShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          The "Unreal Wall"
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-300 leading-relaxed text-center mb-12"
        >
          Building complex game systems is slow. You're buried in C++ boilerplate,
          debugging "spaghetti" Blueprints, and searching forums for best practices.
          The learning curve is steep, and it keeps you from what matters: creating.
        </motion.p>

        {/* Problem Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 mt-12 pt-8 relative"
        >
          {/* Animated gradient divider */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4eebff]/50 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.7 }}
          />
          <motion.div
            className="absolute top-0 h-px bg-[#4eebff]"
            style={{ width: '60%', left: '20%' }}
            animate={{
              boxShadow: [
                '0 0 10px rgba(78, 235, 255, 0.5)',
                '0 0 20px rgba(78, 235, 255, 0.8)',
                '0 0 10px rgba(78, 235, 255, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <ProblemStat value="70%" label="Time on Boilerplate" delay={0.7} />
          <ProblemStat value="50+ hrs" label="Learning Curve" delay={0.8} />
          <ProblemStat value="∞" label="Forum Searches" delay={0.9} />
        </motion.div>

        {/* Visual pain points */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 grid grid-cols-3 gap-4"
        >
          {[
            { icon: '📚', text: 'C++ Complexity' },
            { icon: '🕸️', text: 'Spaghetti Code' },
            { icon: '🔍', text: 'Endless Research' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 + idx * 0.1 }}
              className="text-center p-4 rounded-lg bg-[#1a2332]/40 border border-[#8a2be2]/20"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm text-gray-400">{item.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

