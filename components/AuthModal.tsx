'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Loader2, ArrowRight, Check } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (email: string) => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(false)
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/arcade`,
                }
            })

            if (error) throw error

            setEmailSent(true)

            // Delay to show the success state
            setTimeout(() => {
                onSuccess(email)
                onClose()
                // Reset states
                setEmailSent(false)
                setEmail('')
            }, 2000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1E1E1E] border border-white/10 rounded-2xl p-8 z-50 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">
                                {isLogin ? 'Welcome Back' : 'Secure Your Spot'}
                            </h2>
                            <p className="text-foreground-secondary">
                                {isLogin
                                    ? 'We\'ll send you a magic link to sign in'
                                    : 'Enter your email to join the waitlist'}
                            </p>
                        </div>

                        {emailSent ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">Check Your Email!</h3>
                                <p className="text-gray-400">
                                    We've sent a magic link to <span className="text-primary font-mono">{email}</span>
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="you@example.com"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-gray-300">
                                    <p className="flex items-start gap-2">
                                        <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                        <span>No password needed! We'll send you a secure link to access your account.</span>
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent-purple text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending Magic Link...
                                        </>
                                    ) : (
                                        <>
                                            {isLogin ? 'Send Magic Link' : 'Join Waitlist'} <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {!emailSent && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    {isLogin
                                        ? "New here? Join the waitlist"
                                        : 'Already joined? Sign in'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
