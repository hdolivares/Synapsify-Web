'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DebugTheCodeGame from './DebugTheCodeGame'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

type GameState = 'game' | 'won' | 'lost' | 'form' | 'submitted'

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [gameState, setGameState] = useState<GameState>('game')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleWin = () => {
    setGameState('won')
  }

  const handleLose = () => {
    setGameState('lost')
  }

  const handleRetry = () => {
    setGameState('game')
    setSubmitError('')
  }

  const handleContinue = () => {
    setGameState('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit')
      }

      setSubmitSuccess(true)
      setGameState('submitted')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setGameState('game')
    setFormData({ firstName: '', lastName: '', email: '' })
    setSubmitError('')
    setSubmitSuccess(false)
    onClose()
  }

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000]"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Modal Container - Fixed centering (always centered regardless of scroll) */}
          <div
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              margin: 0,
              padding: '1rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="pointer-events-auto w-full max-w-4xl"
              style={{ zIndex: 10001 }}
            >
              <div
                className="bg-[#0f1626] border border-[#4eebff]/30 rounded-2xl p-8 w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-[#4eebff]/20 relative"
                onClick={(e) => e.stopPropagation()}
                style={{ zIndex: 10001 }}
              >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl z-20"
                style={{ position: 'absolute', zIndex: 20 }}
              >
                ×
              </button>

              {/* Game State */}
              {gameState === 'game' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <DebugTheCodeGame onWin={handleWin} onLose={handleLose} />
                </motion.div>
              )}

              {/* Won State */}
              {gameState === 'won' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-4xl font-bold gradient-text-full mb-4">
                    Congratulations!
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    You've debugged the code! Now let's get you on the waitlist.
                  </p>
                  <button
                    onClick={handleContinue}
                    className="px-8 py-4 gradient-button-primary rounded-full text-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-[#4eebff]/30 relative z-10"
                    style={{ position: 'relative', zIndex: 10 }}
                  >
                    Continue to Form
                  </button>
                </motion.div>
              )}

              {/* Lost State */}
              {gameState === 'lost' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-6xl mb-4"
                  >
                    🐛
                  </motion.div>
                  <h2 className="text-4xl font-bold text-red-400 mb-4">
                    Game Over!
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    The bugs got through! Try again to join the waitlist.
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-8 py-4 gradient-button-primary rounded-full text-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-[#4eebff]/30 relative z-10"
                    style={{ position: 'relative', zIndex: 10 }}
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              {/* Form State */}
              {gameState === 'form' && (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold gradient-text-cyan mb-2">
                      Join the Waitlist
                    </h2>
                    <p className="text-gray-400">
                      You've earned your spot! Fill in your details below.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-[#1a2332] border border-[#4eebff]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4eebff] focus:ring-2 focus:ring-[#4eebff]/20 transition-all"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-[#1a2332] border border-[#4eebff]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4eebff] focus:ring-2 focus:ring-[#4eebff]/20 transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-[#1a2332] border border-[#4eebff]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4eebff] focus:ring-2 focus:ring-[#4eebff]/20 transition-all"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
                    >
                      {submitError}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 gradient-button-primary rounded-full text-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-[#4eebff]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                  </button>
                </motion.form>
              )}

              {/* Submitted State */}
              {gameState === 'submitted' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-6xl mb-4"
                  >
                    ✨
                  </motion.div>
                  <h2 className="text-4xl font-bold gradient-text-full mb-4">
                    You're In!
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Thanks for joining! We'll notify you when Synapsify is ready.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-8 py-4 gradient-button-primary rounded-full text-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-[#4eebff]/30"
                  >
                    Close
                  </button>
                </motion.div>
              )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  // Render in a portal to escape any transformed ancestors (e.g., navbar)
  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
