'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import BugInvaders from '@/components/BugInvaders'
import Navbar from '@/components/Navbar'
import { Trophy, Award, Target } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const prizes = [
    {
        place: "1st - 3rd Place",
        reward: "1 Year Synapsify Ultra FREE",
        gradient: "from-yellow-500/10 to-orange-500/10",
        border: "border-yellow-500/20",
        iconBg: "from-yellow-400 to-orange-500",
        textColor: "text-yellow-400",
        icon: Trophy
    },
    {
        place: "4th - 10th Place",
        reward: "70% OFF Any Subscription",
        gradient: "from-gray-400/10 to-gray-500/10",
        border: "border-gray-400/20",
        iconBg: "from-gray-300 to-gray-400",
        textColor: "text-gray-400",
        icon: Award
    },
    {
        place: "11th - 20th Place",
        reward: "50% OFF Any Subscription",
        gradient: "from-orange-500/10 to-amber-600/10",
        border: "border-orange-500/20",
        iconBg: "from-orange-400 to-amber-500",
        textColor: "text-orange-400",
        icon: Award
    },
    {
        place: "21st - 50th Place",
        reward: "25% OFF Any Subscription",
        gradient: "from-blue-500/10 to-cyan-500/10",
        border: "border-blue-500/20",
        iconBg: "from-blue-400 to-cyan-500",
        textColor: "text-blue-400",
        icon: Target
    }
]

export default function ArcadePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Use .then() instead of async/await to avoid React Promise tracking issues
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push('/')
            } else {
                setLoading(false)
            }
        }).catch(() => {
            router.push('/')
        })
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-neon-lime animate-pulse font-mono">{'>'} INITIALIZING ARCADE...</div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white selection:bg-primary/30">
            <Navbar />
            <div className="pt-20 pb-16">
                {/* Header Section */}
                <div className="container mx-auto px-4 mb-12">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
                            <span className="text-neon-magenta text-glow-magenta">BUG INVADERS</span> ARCADE
                        </h1>
                        <p className="text-xl text-foreground-secondary font-mono max-w-2xl mx-auto">
                            {'>'} DESTROY BUGS. CLIMB THE LEADERBOARD. WIN PRIZES.
                        </p>
                    </div>

                    {/* Prize Section */}
                    <div className="max-w-4xl mx-auto mb-12 terminal-window border-neon-cyan p-6">
                        <div className="absolute top-0 left-0 right-0 bg-black/80 px-4 py-2 border-b-2 border-neon-cyan flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-neon-cyan" />
                                <div className="w-2 h-2 bg-neon-cyan" />
                                <div className="w-2 h-2 bg-neon-cyan" />
                            </div>
                            <span className="text-xs font-mono text-neon-cyan ml-2">PRIZE_STRUCTURE.txt</span>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-2xl font-black mb-4 text-center uppercase font-mono">
                                🏆 COMPETE FOR PRIZES
                            </h3>
                            <p className="text-foreground-secondary text-center mb-6 font-mono text-sm">
                                {'>'} PLAY BUG INVADERS AND CLIMB THE LEADERBOARD TO UNLOCK EXCLUSIVE REWARDS
                            </p>

                            <div className="space-y-3">
                                {prizes.map((prize, index) => (
                                    <div
                                        key={index}
                                        className={`bg-gradient-to-r ${prize.gradient} border ${prize.border} rounded p-4`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${prize.iconBg} rounded flex items-center justify-center flex-shrink-0`}>
                                                <prize.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className={`font-bold ${prize.textColor} mb-1 font-mono`}>{prize.place}</div>
                                                <div className="text-white font-semibold font-mono text-sm">{prize.reward}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-neon-lime text-sm font-mono animate-pulse">
                                    {'>'} SCORES UPDATE IN REAL-TIME ON THE LEADERBOARD
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Game */}
                <BugInvaders mode="arcade" />
            </div>
        </main>
    )
}
