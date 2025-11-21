'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Trophy, Award, Target } from 'lucide-react'

interface SuccessModalProps {
    isOpen: boolean
    onClose: () => void
    userEmail: string
}

export default function SuccessModal({ isOpen, onClose, userEmail }: SuccessModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#1E1E1E] border border-white/10 rounded-2xl p-8 z-50 shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Success Header */}
                        <div className="text-center mb-8">
                            <div className="mb-4 flex justify-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                                    <Trophy className="w-10 h-10 text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Welcome to Cortx! 🎉
                            </h2>
                            <p className="text-foreground-secondary">
                                You've proven your skills and secured your spot
                            </p>
                        </div>

                        {/* Email Verification Notice */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
                            <div className="flex items-start gap-4">
                                <Mail className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-white mb-2">Check Your Email</h3>
                                    <p className="text-gray-300 text-sm mb-3">
                                        We've sent a magic link to <span className="font-mono text-blue-400">{userEmail}</span>
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        Click the link in your email to verify your account and access the arcade.
                                        The link will expire in 1 hour.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Prizes */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-center">
                                🏆 Compete for Amazing Prizes!
                            </h3>
                            <p className="text-gray-400 text-center mb-6">
                                Play Bug Invaders and climb the leaderboard to unlock exclusive rewards
                            </p>

                            <div className="space-y-3">
                                {/* 1st-3rd Place */}
                                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Trophy className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-yellow-400 mb-1">1st - 3rd Place</div>
                                            <div className="text-white font-semibold">1 Year Cortx Ultra FREE</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4th-10th Place */}
                                <div className="bg-gradient-to-r from-gray-400/10 to-gray-500/10 border border-gray-400/20 rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-400 mb-1">4th - 10th Place</div>
                                            <div className="text-white font-semibold">70% OFF Any Subscription</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 11th-20th Place */}
                                <div className="bg-gradient-to-r from-orange-500/10 to-amber-600/10 border border-orange-500/20 rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-orange-400 mb-1">11th - 20th Place</div>
                                            <div className="text-white font-semibold">50% OFF Any Subscription</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 21st-50th Place */}
                                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-blue-400 mb-1">21st - 50th Place</div>
                                            <div className="text-white font-semibold">25% OFF Any Subscription</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-4">
                                After verifying your email, you'll be able to play unlimited games and submit your scores to the leaderboard
                            </p>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-gradient-to-r from-primary to-accent-purple text-white rounded-full font-bold hover:opacity-90 transition-opacity"
                            >
                                Got It!
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
