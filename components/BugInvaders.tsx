'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Play, RotateCcw, Loader2, Lock, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import Leaderboard from './Leaderboard'
import AuthModal from './AuthModal'

interface GameState {
    isPlaying: boolean
    isGameOver: boolean
    score: number
    wave: number
    won: boolean
}

interface BugInvadersProps {
    mode?: 'gate' | 'arcade'
    onGateWin?: () => void
}

export default function BugInvaders({ mode = 'arcade', onGateWin }: BugInvadersProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [gameState, setGameState] = useState<GameState>({
        isPlaying: false,
        isGameOver: false,
        score: 0,
        wave: 1,
        won: false
    })
    const [user, setUser] = useState<any>(null)
    const [showAuth, setShowAuth] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    // Game Constants
    const PLAYER_SPEED = 5
    const BULLET_SPEED = 7
    const ENEMY_SPEED = 1
    const ENEMY_DROP = 20
    const GATE_SCORE_TARGET = 500

    useEffect(() => {
        // Check auth state
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

    useEffect(() => {
        if (!gameState.isPlaying) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Game Objects
        let player = { x: canvas.width / 2, y: canvas.height - 50, width: 40, height: 40 }
        let bullets: any[] = []
        let enemies: any[] = []
        let particles: any[] = []
        let animationFrameId: number
        let lastShot = 0
        let enemyDirection = 1

        // Initialize Enemies
        const initEnemies = () => {
            enemies = []
            const rows = 3 + Math.min(gameState.wave, 3)
            const cols = 8
            const padding = 50
            const width = 30
            const height = 30

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    enemies.push({
                        x: padding + j * (width + 20),
                        y: padding + i * (height + 20),
                        width,
                        height,
                        type: i === 0 ? 'bug_hard' : 'bug_normal'
                    })
                }
            }
        }

        initEnemies()

        // Input Handling
        const keys: { [key: string]: boolean } = {}
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent scrolling with arrow keys and space when game is focused/playing
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault()
            }
            keys[e.code] = true
        }
        const handleKeyUp = (e: KeyboardEvent) => keys[e.code] = false

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        // Game Loop
        const render = (time: number) => {
            // Clear Canvas
            ctx.fillStyle = '#0a0f1e'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Player Movement
            if (keys['ArrowLeft'] || keys['KeyA']) player.x = Math.max(0, player.x - PLAYER_SPEED)
            if (keys['ArrowRight'] || keys['KeyD']) player.x = Math.min(canvas.width - player.width, player.x + PLAYER_SPEED)

            // Shooting
            if ((keys['Space'] || keys['ArrowUp']) && time - lastShot > 300) {
                bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10 })
                lastShot = time
            }

            // Update Bullets
            bullets = bullets.filter(b => b.y > 0)
            bullets.forEach(b => {
                b.y -= BULLET_SPEED
                ctx.fillStyle = '#4eebff'
                ctx.fillRect(b.x, b.y, b.width, b.height)
            })

            // Update Enemies
            let hitWall = false
            enemies.forEach(e => {
                e.x += ENEMY_SPEED * enemyDirection * (1 + gameState.wave * 0.1)
                if (e.x <= 0 || e.x + e.width >= canvas.width) hitWall = true
            })

            if (hitWall) {
                enemyDirection *= -1
                enemies.forEach(e => e.y += ENEMY_DROP)
            }

            // Collision Detection
            bullets.forEach((b, bIdx) => {
                enemies.forEach((e, eIdx) => {
                    if (
                        b.x < e.x + e.width &&
                        b.x + b.width > e.x &&
                        b.y < e.y + e.height &&
                        b.y + b.height > e.y
                    ) {
                        // Hit!
                        bullets.splice(bIdx, 1)
                        enemies.splice(eIdx, 1)

                        setGameState(prev => {
                            const newScore = prev.score + 100

                            // Check Gate Win Condition
                            if (mode === 'gate' && newScore >= GATE_SCORE_TARGET) {
                                return { ...prev, score: newScore, won: true, isPlaying: false }
                            }

                            return { ...prev, score: newScore }
                        })

                        // Explosion Particles
                        for (let i = 0; i < 5; i++) {
                            particles.push({
                                x: e.x + e.width / 2,
                                y: e.y + e.height / 2,
                                vx: (Math.random() - 0.5) * 5,
                                vy: (Math.random() - 0.5) * 5,
                                life: 1
                            })
                        }
                    }
                })
            })

            // Draw Enemies
            enemies.forEach(e => {
                ctx.fillStyle = e.type === 'bug_hard' ? '#ff4e4e' : '#4eff4e'
                // Draw Bug Shape (Simple)
                ctx.beginPath()
                ctx.arc(e.x + e.width / 2, e.y + e.height / 2, e.width / 2, 0, Math.PI * 2)
                ctx.fill()
                // Eyes
                ctx.fillStyle = '#000'
                ctx.fillRect(e.x + 8, e.y + 8, 4, 4)
                ctx.fillRect(e.x + e.width - 12, e.y + 8, 4, 4)
            })

            // Draw Player
            ctx.fillStyle = '#4eebff'
            ctx.beginPath()
            ctx.moveTo(player.x + player.width / 2, player.y)
            ctx.lineTo(player.x + player.width, player.y + player.height)
            ctx.lineTo(player.x, player.y + player.height)
            ctx.fill()

            // Update & Draw Particles
            particles = particles.filter(p => p.life > 0)
            particles.forEach(p => {
                p.x += p.vx
                p.y += p.vy
                p.life -= 0.05
                ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`
                ctx.fillRect(p.x, p.y, 2, 2)
            })

            // Win/Loss Conditions
            if (enemies.length === 0) {
                // Wave Cleared
                if (mode === 'gate') {
                    // In gate mode, clearing a wave is good but we check score mainly. 
                    // If they clear wave but score < 500, respawn? 
                    // For simplicity, let's just respawn enemies but keep score
                    initEnemies()
                } else {
                    // Arcade mode - next wave
                    setGameState(prev => ({ ...prev, wave: prev.wave + 1 }))
                    initEnemies()
                }
            }

            enemies.forEach(e => {
                if (e.y + e.height >= player.y) {
                    setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }))
                }
            })

            if (gameState.isPlaying && !gameState.won) {
                animationFrameId = requestAnimationFrame(render)
            }
        }

        animationFrameId = requestAnimationFrame(render)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            cancelAnimationFrame(animationFrameId)
        }
    }, [gameState.isPlaying, gameState.wave, mode])

    // Trigger onGateWin when won in gate mode
    useEffect(() => {
        if (mode === 'gate' && gameState.won && onGateWin) {
            onGateWin()
        }
    }, [gameState.won, mode, onGateWin])

    const startGame = () => {
        setGameState({
            isPlaying: true,
            isGameOver: false,
            score: 0,
            wave: 1,
            won: false
        })
        setSubmitted(false)
    }

    const submitScore = async () => {
        if (!user) {
            setShowAuth(true)
            return
        }
        setSubmitting(true)
        try {
            // Use email username part as display name for now
            const username = user.email?.split('@')[0] || 'Anonymous'

            const { error } = await supabase
                .from('leaderboard')
                .insert([{ username, score: gameState.score, user_id: user.id }])

            if (error) throw error
            setSubmitted(true)
        } catch (error) {
            console.error('Error submitting score:', error)
            alert('Failed to submit score. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    // Render simplified view for Gate Mode (just the game canvas, no section wrapper if embedded)
    const GameContent = () => (
        <div className="relative aspect-[4/3] bg-[#0a0f1e] rounded-xl overflow-hidden border border-white/10 shadow-2xl mx-auto max-w-4xl">
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-contain"
            />

            {/* UI Overlays */}
            <div className="absolute top-4 left-4 text-white font-mono text-xl z-10">
                SCORE: {gameState.score} {mode === 'gate' && `/ ${GATE_SCORE_TARGET}`}
            </div>

            <AnimatePresence>
                {!gameState.isPlaying && !gameState.isGameOver && !gameState.won && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20"
                    >
                        <h3 className="text-4xl font-bold text-white mb-8">BUG INVADERS</h3>
                        {mode === 'gate' && (
                            <p className="text-accent-blue mb-6 text-lg">Score {GATE_SCORE_TARGET} points to unlock access</p>
                        )}
                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-primary hover:bg-primary/80 text-white rounded-full font-bold text-xl flex items-center gap-3 transition-all hover:scale-105"
                        >
                            <Play className="w-6 h-6" /> START MISSION
                        </button>
                        <p className="mt-4 text-gray-400">Use Arrow Keys to Move • Space to Shoot</p>
                    </motion.div>
                )}

                {gameState.isGameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 backdrop-blur-sm z-20"
                    >
                        <h3 className="text-4xl font-bold text-white mb-4">SYSTEM FAILURE</h3>
                        <p className="text-xl text-white/80 mb-8">Score: {gameState.score}</p>
                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-white text-red-900 hover:bg-gray-200 rounded-full font-bold text-xl flex items-center gap-3 transition-all hover:scale-105"
                        >
                            <RotateCcw className="w-6 h-6" /> TRY AGAIN
                        </button>
                    </motion.div>
                )}

                {gameState.won && mode === 'arcade' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/80 backdrop-blur-sm z-20"
                    >
                        <Trophy className="w-20 h-20 text-yellow-400 mb-6 animate-bounce" />
                        <h3 className="text-4xl font-bold text-white mb-4">SYSTEM CLEAN</h3>
                        <p className="text-xl text-white/80 mb-8">Score: {gameState.score}</p>

                        {!submitted ? (
                            <div className="bg-black/50 p-6 rounded-xl max-w-md w-full mx-4">
                                <h4 className="text-xl font-bold text-white mb-4">Submit Score to Leaderboard</h4>

                                {user ? (
                                    <div className="mb-4 text-green-400 text-sm">
                                        Signed in as {user.email}
                                    </div>
                                ) : (
                                    <div className="mb-4 text-yellow-400 text-sm flex items-center justify-center gap-2">
                                        <Lock className="w-4 h-4" /> Login required to submit score
                                    </div>
                                )}

                                <button
                                    onClick={submitScore}
                                    disabled={submitting}
                                    className={`w-full py-3 rounded font-bold transition-colors flex items-center justify-center gap-2 ${user
                                        ? 'bg-green-500 hover:bg-green-400 text-white'
                                        : 'bg-primary hover:bg-primary/90 text-white'
                                        }`}
                                >
                                    {submitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : user ? (
                                        'SUBMIT SCORE'
                                    ) : (
                                        'LOGIN TO SUBMIT'
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-green-400 font-bold text-xl mb-6">Score Submitted!</p>
                                <button
                                    onClick={startGame}
                                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold flex items-center gap-2 mx-auto"
                                >
                                    <RotateCcw className="w-5 h-5" /> Play Again
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {gameState.won && mode === 'gate' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/90 backdrop-blur-sm z-20"
                    >
                        <Trophy className="w-20 h-20 text-yellow-400 mb-6 animate-bounce" />
                        <h3 className="text-4xl font-bold text-white mb-2">ACCESS GRANTED</h3>
                        <p className="text-xl text-white/80 mb-8">Target Reached!</p>
                        <div className="flex items-center gap-2 text-accent-blue animate-pulse">
                            Proceeding to registration <ArrowRight className="w-5 h-5" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    // If Gate mode, just return the game content (no section wrapper)
    if (mode === 'gate') {
        return <GameContent />
    }

    // Arcade Mode (Full Section)
    return (
        <section className="py-24 relative bg-black/40">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Debug the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">System</span>
                    </h2>
                    <p className="text-xl text-foreground-secondary">
                        Clear the bugs to unlock your spot on the leaderboard.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="lg:col-span-2">
                        <GameContent />
                    </div>

                    {/* Leaderboard Sidebar */}
                    <div className="h-full">
                        <Leaderboard />
                    </div>
                </div>

                <AuthModal
                    isOpen={showAuth}
                    onClose={() => setShowAuth(false)}
                    onSuccess={() => {
                        setShowAuth(false)
                    }}
                />
            </div>
        </section>
    )
}
