'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'
import AchievementToast from './AchievementToast'
import AuthModal from './AuthModal'
import GameGateModal from './GameGateModal'
import { supabase } from '@/lib/supabaseClient'

export default function WaitlistSection() {
    const [mounted, setMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [showGameGate, setShowGameGate] = useState(false)
    const [showAuth, setShowAuth] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        }).catch(() => {
            setUser(null)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [mounted])

    return (
        <section className="py-24 relative overflow-hidden bg-black" id="waitlist">
            {/* Grid Background */}
            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="terminal-window border-neon-lime p-12 relative overflow-hidden"
                    >
                        {/* Terminal header */}
                        <div className="absolute top-0 left-0 right-0 bg-black/80 px-4 py-2 border-b-2 border-neon-lime flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-neon-lime animate-pulse" />
                                <div className="w-2 h-2 bg-neon-lime animate-pulse" style={{ animationDelay: '0.2s' }} />
                                <div className="w-2 h-2 bg-neon-lime animate-pulse" style={{ animationDelay: '0.4s' }} />
                            </div>
                            <span className="text-xs font-mono text-neon-lime ml-2 animate-flicker">ACCESS_TERMINAL.exe</span>
                        </div>

                        <div className="mt-8 text-center">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">
                                READY TO <span className="text-neon-lime text-glow">UPGRADE</span> YOUR WORKFLOW?
                            </h2>
                            <p className="text-xl text-foreground-secondary mb-10 max-w-2xl mx-auto font-mono text-sm">
                                {'>'} JOIN THE WAITLIST TO GET EARLY ACCESS TO SYNAPSIFY.<br />
                                {'>'} PROVE YOUR SKILLS IN THE SYSTEM TO SECURE YOUR SPOT.
                            </p>

                            {mounted && user ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-3 bg-black px-6 py-4 border-2 border-neon-lime relative overflow-hidden">
                                        <div className="absolute inset-0 bg-neon-lime opacity-10 animate-pulse" />
                                        <CheckCircle2 className="w-5 h-5 text-neon-lime relative z-10" />
                                        <span className="font-mono text-neon-lime font-bold relative z-10">
                                            SPOT SECURED: {user.email?.toUpperCase()}
                                        </span>
                                    </div>
                                    <a
                                        href="/arcade"
                                        className="text-neon-cyan hover:text-cyan-300 transition-colors flex items-center gap-2 font-mono text-sm border-b-2 border-neon-cyan hover:border-cyan-300 pb-1"
                                    >
                                        {'>'} GO TO ARCADE <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-6">
                                    <button
                                        onClick={() => setShowGameGate(true)}
                                        className="group relative px-10 py-5 bg-neon-lime text-black font-black text-lg hover:bg-black hover:text-neon-lime border-2 border-neon-lime transition-all uppercase tracking-wider"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            {'>'} Join Waitlist <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setShowAuth(true)}
                                        className="text-sm text-foreground-secondary hover:text-neon-cyan transition-colors font-mono border-b border-transparent hover:border-neon-cyan pb-1"
                                    >
                                        {'>'} ALREADY JOINED? SIGN IN WITH EMAIL
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Corner decorations */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-neon-lime opacity-50" />
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-neon-lime opacity-50" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-neon-lime opacity-50" />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-neon-lime opacity-50" />
                    </motion.div>
                </div>
            </div>

            <GameGateModal
                isOpen={showGameGate}
                onClose={() => setShowGameGate(false)}
            />

            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                onSuccess={() => {
                    setShowAuth(false)
                    window.location.href = '/arcade'
                }}
            />

            <AchievementToast
                trigger={!!user}
                title="System Access Granted"
                description="You have secured your spot on the waitlist."
            />
        </section>
    )
}
