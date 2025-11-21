'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import MagneticButton from './MagneticButton'
import GameGateModal from './GameGateModal'
import AnimatedGradient from './AnimatedGradient'

export default function CallToAction() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0f1e] via-[#0f1626] to-[#0a0f1e] overflow-hidden">
      <AnimatedGradient />
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold gradient-text-full mb-6"
        >
          The Future of Game Development is Here
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-300 mb-8"
        >
          Be the first to get access to Synapsify. Join the waitlist for our private beta.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MagneticButton
            magneticStrength={0.4}
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-5 gradient-button-primary rounded-full text-lg hover:opacity-90 transition-all shadow-2xl shadow-[#4eebff]/30 relative overflow-hidden"
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
      <GameGateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

