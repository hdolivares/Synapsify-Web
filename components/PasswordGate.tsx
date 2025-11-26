'use client'

import { useState, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, AlertCircle } from 'lucide-react'

interface PasswordGateProps {
    children: React.ReactNode
    correctPassword?: string
}

export default function PasswordGate({ children, correctPassword = 'synapseDeck2025!' }: PasswordGateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if already authenticated in this session
        const auth = sessionStorage.getItem('pitch_auth')
        if (auth === 'true') {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (password === correctPassword) {
            sessionStorage.setItem('pitch_auth', 'true')
            setIsAuthenticated(true)
            setError('')
        } else {
            setError('Incorrect password. Please try again.')
            setPassword('')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-pulse text-neon-lime text-xl font-mono">Loading...</div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-lime/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel p-8 md:p-12 rounded-xl border border-neon-lime/30 max-w-md w-full relative z-10"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 rounded-full bg-black border-2 border-neon-lime flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                            <Lock className="w-10 h-10 text-neon-lime" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white text-center mb-2">
                            PROTECTED CONTENT
                        </h1>
                        <p className="text-gray-400 text-center font-mono text-sm">
                            Enter password to access pitch deck
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white font-mono rounded focus:border-neon-lime focus:outline-none transition-colors"
                                autoFocus
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-2 text-neon-magenta text-sm font-mono bg-neon-magenta/10 border border-neon-magenta/30 rounded p-3"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            className="w-full py-3 bg-neon-lime text-black font-bold font-display uppercase tracking-wider rounded hover:bg-neon-lime/90 transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                        >
                            Access Pitch Deck
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-500 text-xs font-mono">
                        This content is confidential
                    </p>
                </motion.div>
            </div>
        )
    }

    return <>{children}</>
}
