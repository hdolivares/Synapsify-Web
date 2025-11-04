'use client'

import { motion } from 'framer-motion'

export default function AnimatedGradient({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(78, 235, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.3) 0%, transparent 50%)',
        }}
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(78, 235, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(78, 235, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(78, 235, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(138, 43, 226, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(78, 235, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

