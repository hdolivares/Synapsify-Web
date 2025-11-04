'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

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

interface GameProps {
  onWin: () => void
  onLose: () => void
}

export default function DebugTheCodeGame({ onWin, onLose }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameStarted, setGameStarted] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  
  const playerX = useRef(400) // Starting position (center)
  const playerWidth = 60
  const playerHeight = 30
  const bugsRef = useRef<Bug[]>([])
  const bulletsRef = useRef<Bullet[]>([])
  const moveDirectionRef = useRef(1) // 1 for right, -1 for left
  const animationFrameRef = useRef<number>()
  const bugSpeedRef = useRef(1)
  const bulletSpeedRef = useRef(8)
  const lastBugTimeRef = useRef(0)
  const lastBulletTimeRef = useRef(0)
  const bugsKilledRef = useRef(0)
  const WIN_CONDITION = 20 // Kill 20 bugs to win

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 600

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
  }, [])

  // Game loop
  const gameLoop = useCallback(() => {
    if (gamePaused || !gameStarted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

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

    // Move bugs
    bugsRef.current = bugsRef.current.map((bug) => ({
      ...bug,
      y: bug.y + bugSpeedRef.current,
    }))

    // Remove bugs that reached bottom
    const bugsReachedBottom = bugsRef.current.filter((bug) => bug.y > CANVAS_HEIGHT)
    if (bugsReachedBottom.length > 0) {
      setLives((prev) => {
        const newLives = prev - bugsReachedBottom.length
        if (newLives <= 0) {
          onLose()
          return 0
        }
        return newLives
      })
      bugsRef.current = bugsRef.current.filter((bug) => bug.y <= CANVAS_HEIGHT)
    }

    // Move bullets
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
        setScore((prev) => prev + 1)
        bugsKilledRef.current += 1
        
        // Increase difficulty
        bugSpeedRef.current = Math.min(bugSpeedRef.current + 0.1, 3)
        
        // Check win condition
        if (bugsKilledRef.current >= WIN_CONDITION) {
          onWin()
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
    
    // Add glow effect
    ctx.shadowBlur = 20
    ctx.shadowColor = '#4eebff'
    ctx.fill()
    ctx.shadowBlur = 0

    // Draw bugs
    bugsRef.current.forEach((bug) => {
      ctx.fillStyle = '#ff8c3f'
      ctx.fillRect(bug.x, bug.y, bug.width, bug.height)
      
      // Bug face
      ctx.fillStyle = '#000'
      ctx.fillRect(bug.x + 8, bug.y + 8, 8, 8) // Left eye
      ctx.fillRect(bug.x + 24, bug.y + 8, 8, 8) // Right eye
      ctx.fillRect(bug.x + 12, bug.y + 20, 16, 4) // Mouth
    })

    // Draw bullets
    bulletsRef.current.forEach((bullet) => {
      ctx.fillStyle = '#00aaff'
      ctx.fillRect(bullet.x, bullet.y, 4, 10)
      ctx.shadowBlur = 10
      ctx.shadowColor = '#00aaff'
      ctx.fillRect(bullet.x, bullet.y, 4, 10)
      ctx.shadowBlur = 0
    })

    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [gamePaused, gameStarted, onWin, onLose])

  // Start game loop
  useEffect(() => {
    if (gameStarted && !gamePaused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameStarted, gamePaused, gameLoop])

  // Keyboard controls - track multiple keys simultaneously
  useEffect(() => {
    if (!gameStarted) return

    const keysPressed = new Set<string>()

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      
      // Track movement keys
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

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearInterval(movementInterval)
    }
  }, [gameStarted])

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setLives(3)
    bugsKilledRef.current = 0
    bugsRef.current = []
    bulletsRef.current = []
    playerX.current = CANVAS_WIDTH / 2
    bugSpeedRef.current = 1
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Instructions */}
      {!gameStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Debug the Code!</h3>
          <p className="text-gray-300 mb-4">
            Shoot down <span className="text-[#4eebff] font-bold">{WIN_CONDITION} bugs</span> to join the waitlist!
          </p>
          <p className="text-sm text-gray-400">
            Use <kbd className="px-2 py-1 bg-[#1a2332] rounded">←</kbd> <kbd className="px-2 py-1 bg-[#1a2332] rounded">→</kbd> to move, <kbd className="px-2 py-1 bg-[#1a2332] rounded">Space</kbd> to shoot
          </p>
        </motion.div>
      )}

      {/* Game Stats */}
      {gameStarted && (
        <div className="flex justify-between w-full px-4">
          <div className="text-white">
            <span className="text-[#4eebff] font-bold">Score:</span> {score}
          </div>
          <div className="text-white">
            <span className="text-[#ff8c3f] font-bold">Bugs Killed:</span> {bugsKilledRef.current}/{WIN_CONDITION}
          </div>
          <div className="text-white">
            <span className="text-red-400 font-bold">Lives:</span> {'❤️'.repeat(lives)}
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="relative" style={{ pointerEvents: gameStarted ? 'auto' : 'none' }}>
        <canvas
          ref={canvasRef}
          className="border-2 border-[#4eebff]/30 rounded-lg bg-[#0a0f1e]"
          style={{ pointerEvents: gameStarted ? 'auto' : 'none' }}
        />
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={startGame}
              className="px-8 py-4 gradient-button-primary rounded-full text-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-[#4eebff]/30 relative z-10"
              style={{ pointerEvents: 'auto' }}
            >
              Start Game
            </motion.button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      {gameStarted && (
        <div className="flex gap-4 mt-4 md:hidden">
          <button
            onClick={() => {
              playerX.current = Math.max(playerWidth / 2, playerX.current - 10)
            }}
            className="px-6 py-3 bg-[#1a2332] border border-[#4eebff]/30 rounded-lg text-white font-bold hover:bg-[#1a2332]/80 transition-all"
          >
            ←
          </button>
          <button
            onClick={() => {
              const now = Date.now()
              if (now - lastBulletTimeRef.current > 200) {
                bulletsRef.current.push({
                  id: Math.random(),
                  x: playerX.current - 2,
                  y: CANVAS_HEIGHT - 50,
                })
                lastBulletTimeRef.current = now
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#4eebff] to-[#00aaff] rounded-lg text-white font-bold hover:opacity-90 transition-all"
          >
            🔫 Shoot
          </button>
          <button
            onClick={() => {
              playerX.current = Math.min(CANVAS_WIDTH - playerWidth / 2, playerX.current + 10)
            }}
            className="px-6 py-3 bg-[#1a2332] border border-[#4eebff]/30 rounded-lg text-white font-bold hover:bg-[#1a2332]/80 transition-all"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

