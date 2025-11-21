'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'
import AchievementToast from './AchievementToast'
import AuthModal from './AuthModal'
import GameGateModal from './GameGateModal'
import { supabase } from '@/lib/supabaseClient'

export default function WaitlistSection() {
    const [user, setUser] = useState<any>(null)
    const [showGameGate, setShowGameGate] = useState(false)
    const [showAuth, setShowAuth] = useState(false) // Keep for direct login if needed

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <section className="py-24 relative overflow-hidden" id="waitlist">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-primary/5 to-black/0" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-panel p-12 rounded-3xl border border-white/10 relative overflow-hidden"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[100px] rounded-full" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-purple/20 blur-[100px] rounded-full" />

                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to <span className="text-glow text-primary">Upgrade</span> Your Workflow?
                        </h2>
                        <p className="text-xl text-foreground-secondary mb-10 max-w-2xl mx-auto">
                            Join the waitlist to get early access to Cortx.
                            Prove your skills in the system to secure your spot.
                        </p>

                        {user ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-6 py-3 rounded-full border border-green-400/20">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="font-mono">Spot Secured: {user.email}</span>
                                </div>
                                <a
                                    href="/arcade"
                                    className="text-primary hover:text-primary-light transition-colors flex items-center gap-2"
                                >
                                    Go to Arcade <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <button
                                    onClick={() => setShowGameGate(true)}
                                    className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Join Waitlist <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent-purple opacity-0 group-hover:opacity-10 transition-opacity" />
                                </button>
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="text-sm text-gray-500 hover:text-white transition-colors"
                                >
                                    Already joined? Sign in with email
                                </button>
                            </div>
                        )}
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
