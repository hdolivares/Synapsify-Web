'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import MagneticButton from './MagneticButton'
import WaitlistModal from './WaitlistModal'

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-md border-b border-[#4eebff]/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <Image
              src="/Synapsify Logo 512.png"
              alt="Synapsify Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold gradient-text-cyan">
              Synapsify
            </span>
          </motion.div>
          <MagneticButton
            magneticStrength={0.3}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 gradient-button-primary rounded-full hover:opacity-90 transition-all shadow-lg shadow-[#4eebff]/20"
          >
            Join Waitlist
          </MagneticButton>
        </div>
      </div>
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.nav>
  )
}

