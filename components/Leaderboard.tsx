'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Trophy, Medal } from 'lucide-react'

interface Score {
    id: string
    username: string
    score: number
    created_at: string
}

export default function Leaderboard() {
    const [scores, setScores] = useState<Score[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchScores()

        // Subscribe to realtime changes
        const channel = supabase
            .channel('leaderboard_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leaderboard' }, (payload) => {
                setScores(prev => [...prev, payload.new as Score].sort((a, b) => b.score - a.score).slice(0, 10))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchScores = async () => {
        try {
            const { data, error } = await supabase
                .from('leaderboard')
                .select('*')
                .order('score', { ascending: false })
                .limit(10)

            if (error) throw error
            if (data) setScores(data)
        } catch (error) {
            console.error('Error fetching scores:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold">Top Agents</h3>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {scores.map((entry, index) => (
                        <div
                            key={entry.id}
                            className={`flex items-center justify-between p-3 rounded ${index === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                                    index === 1 ? 'bg-gray-400/10 border border-gray-400/20' :
                                        index === 2 ? 'bg-orange-500/10 border border-orange-500/20' :
                                            'bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`font-mono font-bold w-6 ${index === 0 ? 'text-yellow-400' :
                                        index === 1 ? 'text-gray-400' :
                                            index === 2 ? 'text-orange-400' :
                                                'text-gray-500'
                                    }`}>#{index + 1}</span>
                                <span className="font-medium text-gray-200">{entry.username}</span>
                            </div>
                            <span className="font-mono text-primary font-bold">{entry.score}</span>
                        </div>
                    ))}

                    {scores.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            No scores yet. Be the first!
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
