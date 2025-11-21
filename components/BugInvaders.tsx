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
    lives: number
    won: boolean
}

interface BugInvadersProps {
    mode?: 'gate' | 'arcade'
    onGateWin?: () => void
}

interface Bug {
    id: number
    x: number
    y: number
    width: number
    height: number
}

interface Bullet {
    id: number
    x: number
    y: number
}

export default function BugInvaders({ mode = 'arcade', onGateWin }: BugInvadersProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [gameState, setGameState] = useState<GameState>({
        isPlaying: false,
        isGameOver: false,
        score: 0,
        lives: 3,
        won: false
    })
    const [user, setUser] = useState<any>(null)
    const [showAuth, setShowAuth] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    // Game Constants
    const CANVAS_WIDTH = 800
    const CANVAS_HEIGHT = 600
    const WIN_CONDITION = mode === 'gate' ? 20 : 0 // 20 bugs for gate, endless for arcade

    // Game refs
    const playerX = useRef(CANVAS_WIDTH / 2)
    const playerWidth = 60
    const playerHeight = 30
    const bugsRef = useRef<Bug[]>([])
    const bulletsRef = useRef<Bullet[]>([])
    const animationFrameRef = useRef<number>()
    const bugSpeedRef = useRef(1)
    const bulletSpeedRef = useRef(8)
    const lastBugTimeRef = useRef(0)
    const lastBulletTimeRef = useRef(0)
    const bugsKilledRef = useRef(0)

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

        // Keyboard controls
        const keysPressed = new Set<string>()

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase()
            if (key === 'arrowleft' || key === 'a') {
                keysPressed.add('left')
            } else if (key === 'arrowright' || key === 'd') {
                keysPressed.add('right')
            } else if (key === ' ' || key === 'arrowup') {
                keysPressed.add('shoot')
                e.preventDefault()
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase()
            if (key === 'arrowleft' || key === 'a') {
                keysPressed.delete('left')
            } else if (key === 'arrowright' || key === 'd') {
                keysPressed.delete('right')
            } else if (key === ' ' || key === 'arrowup') {
                keysPressed.delete('shoot')
            }
        }

        // Movement and shooting update loop
        const movementInterval = setInterval(() => {
            if (keysPressed.has('left')) {
                playerX.current = Math.max(playerWidth / 2, playerX.current - 10)
            }
            if (keysPressed.has('right')) {
                playerX.current = Math.min(CANVAS_WIDTH - playerWidth / 2, playerX.current + 10)
            }
            if (keysPressed.has('shoot')) {
                const now = Date.now()
                if (now - lastBulletTimeRef.current > 200) {
                    bulletsRef.current.push({
                        id: Math.random(),
                        x: playerX.current - 2,
                        y: CANVAS_HEIGHT - 50,
                    })
                    lastBulletTimeRef.current = now
                }
            }
        }, 16) // ~60fps

        // Game loop
        const gameLoop = () => {
            // Clear canvas
            ctx.fillStyle = '#0a0f1e'
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

            // Draw stars background
            ctx.fillStyle = '#4eebff'
            for (let i = 0; i < 50; i++) {
                const x = (i * 73) % CANVAS_WIDTH
                const y = (i * 137) % CANVAS_HEIGHT
                ctx.fillRect(x, y, 2, 2)
            }

            // Spawn bugs
            const now = Date.now()
            if (now - lastBugTimeRef.current > 1000 - bugsRef.current.length * 50) {
                bugsRef.current.push({
                    id: Math.random(),
                    x: Math.random() * (CANVAS_WIDTH - 40),
                    y: -40,
                    width: 40,
                    height: 40,
                })
                lastBugTimeRef.current = now
            }

            // Move bugs downward
            bugsRef.current = bugsRef.current.map((bug) => ({
                ...bug,
                y: bug.y + bugSpeedRef.current,
            }))

            // Check if bugs reached bottom (lose lives)
            const bugsReachedBottom = bugsRef.current.filter((bug) => bug.y > CANVAS_HEIGHT)
            if (bugsReachedBottom.length > 0) {
                setGameState(prev => {
                    const newLives = prev.lives - bugsReachedBottom.length
                    if (newLives <= 0) {
                        return { ...prev, lives: 0, isGameOver: true, isPlaying: false }
                    }
                    return { ...prev, lives: newLives }
                })
                bugsRef.current = bugsRef.current.filter((bug) => bug.y <= CANVAS_HEIGHT)
            }

            // Move bullets upward
            bulletsRef.current = bulletsRef.current
                .map((bullet) => ({
                    ...bullet,
                    y: bullet.y - bulletSpeedRef.current,
                }))
                .filter((bullet) => bullet.y > 0)

            // Check collisions
            bulletsRef.current = bulletsRef.current.filter((bullet) => {
                const hitBug = bugsRef.current.find(
                    (bug) =>
                        bullet.x < bug.x + bug.width &&
                        bullet.x + 4 > bug.x &&
                        bullet.y < bug.y + bug.height &&
                        bullet.y + 10 > bug.y
                )

                if (hitBug) {
                    bugsRef.current = bugsRef.current.filter((b) => b.id !== hitBug.id)
                    bugsKilledRef.current += 1

                    setGameState(prev => ({ ...prev, score: prev.score + 1 }))

                    // Increase difficulty
                    bugSpeedRef.current = Math.min(bugSpeedRef.current + 0.1, 3)

                    // Check win condition (gate mode only)
                    if (mode === 'gate' && bugsKilledRef.current >= WIN_CONDITION) {
                        setGameState(prev => ({ ...prev, won: true, isPlaying: false }))
                        return false
                    }
                    return false
                }
                return true
            })

            // Draw player (spaceship)
            ctx.fillStyle = '#4eebff'
            ctx.beginPath()
            ctx.moveTo(playerX.current, CANVAS_HEIGHT - 50)
            ctx.lineTo(playerX.current - playerWidth / 2, CANVAS_HEIGHT - 20)
            ctx.lineTo(playerX.current + playerWidth / 2, CANVAS_HEIGHT - 20)
            ctx.closePath()
            ctx.fill()

            // Add glow effect to player
            ctx.shadowBlur = 20
            ctx.shadowColor = '#4eebff'
            ctx.fill()
            ctx.shadowBlur = 0

            // Draw bugs with faces
            bugsRef.current.forEach((bug) => {
                ctx.fillStyle = '#ff8c3f'
                ctx.fillRect(bug.x, bug.y, bug.width, bug.height)

                // Bug face
                ctx.fillStyle = '#000'
                ctx.fillRect(bug.x + 8, bug.y + 8, 8, 8) // Left eye
                ctx.fillRect(bug.x + 24, bug.y + 8, 8, 8) // Right eye
                ctx.fillRect(bug.x + 12, bug.y + 20, 16, 4) // Mouth
            })

            // Draw bullets with glow
            bulletsRef.current.forEach((bullet) => {
                ctx.fillStyle = '#00aaff'
                ctx.shadowBlur = 10
                ctx.shadowColor = '#00aaff'
                ctx.fillRect(bullet.x, bullet.y, 4, 10)
                ctx.shadowBlur = 0
            })

            if (gameState.isPlaying && !gameState.won && !gameState.isGameOver) {
                animationFrameRef.current = requestAnimationFrame(gameLoop)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        animationFrameRef.current = requestAnimationFrame(gameLoop)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            clearInterval(movementInterval)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [gameState.isPlaying, mode, gameState.won, gameState.isGameOver])

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
            lives: 3,
            won: false
        })
        setSubmitted(false)
        bugsKilledRef.current = 0
        bugsRef.current = []
        bulletsRef.current = []
        playerX.current = CANVAS_WIDTH / 2
        bugSpeedRef.current = 1
    }

    const submitScore = async () => {
        if (!user) {
            setShowAuth(true)
            return
        }
        setSubmitting(true)
        try {
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

    // Render simplified view for Gate Mode
    const GameContent = () => (
        <div className="relative aspect-[4/3] bg-[#0a0f1e] rounded-xl overflow-hidden border border-white/10 shadow-2xl mx-auto max-w-4xl">
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-contain"
            />

            {/* UI Overlays */}
            {gameState.isPlaying && (
                <div className="absolute top-4 left-4 right-4 flex justify-between text-white font-mono z-10">
                    <div className="text-xl">
                        {mode === 'gate' ? (
                            <span className="text-[#4eebff] font-bold">BUGS: {bugsKilledRef.current}/{WIN_CONDITION}</span>
                        ) : (
                            <span className="text-[#4eebff] font-bold">SCORE: {gameState.score}</span>
                        )}
                    </div>
                    <div className="text-xl">
                        <span className="text-red-400 font-bold">LIVES: {'❤️'.repeat(gameState.lives)}</span>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {!gameState.isPlaying && !gameState.isGameOver && !gameState.won && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20"
                    >
                        <h3 className="text-4xl font-bold text-white mb-8">DEBUG THE CODE!</h3>
                        {mode === 'gate' && (
                            <p className="text-accent-blue mb-6 text-lg">Destroy {WIN_CONDITION} bugs to unlock access</p>
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
                        <p className="text-xl text-white/80 mb-8">Bugs Destroyed: {bugsKilledRef.current}</p>
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
                        <p className="text-xl text-white/80 mb-8">All Bugs Eliminated!</p>
                        <div className="flex items-center gap-2 text-accent-blue animate-pulse">
                            Proceeding to registration <ArrowRight className="w-5 h-5" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    // If Gate mode, just return the game content
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
