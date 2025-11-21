'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import BugInvaders from './BugInvaders'
import AuthModal from './AuthModal'

interface GameGateModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function GameGateModal({ isOpen, onClose }: GameGateModalProps) {
    const [showAuth, setShowAuth] = useState(false)

    const handleGateWin = () => {
        // Delay slightly to show the "Access Granted" message
        setTimeout(() => {
            setShowAuth(true)
        }, 2000)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
                    />

                    {/* Game Container */}
                    {!showAuth && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="relative w-full max-w-4xl">
                                <button
                                    onClick={onClose}
                                    className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-8 h-8" />
                                </button>
                                <BugInvaders mode="gate" onGateWin={handleGateWin} />
                            </div>
                        </motion.div>
                    )}

                    {/* Auth Modal (Reusing existing component but managed here) */}
                    <AuthModal
                        isOpen={showAuth}
                        onClose={() => {
                            setShowAuth(false)
                            onClose()
                        }}
                        onSuccess={() => {
                            // Redirect handled in AuthModal or parent
                            window.location.href = '/arcade'
                        }}
                    />
                </>
            )}
        </AnimatePresence>
    )
}
