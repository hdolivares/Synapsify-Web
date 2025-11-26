'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MagneticButton from './MagneticButton'
import GameGateModal from './GameGateModal'
import AuthModal from './AuthModal'
import { supabase } from '@/lib/supabaseClient'
import { LogOut } from 'lucide-react'

export default function Navbar() {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b-2 border-neon-lime"
      style={{
        boxShadow: '0 0 20px rgba(204, 255, 0, 0.3)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 border-2 border-neon-lime p-1 relative">
                <Image
                  src="/Synapsify Logo 512.png"
                  alt="Synapsify Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain brightness-0 invert"
                  style={{ filter: 'brightness(0) invert(1) saturate(10) hue-rotate(60deg)' }}
                />
              </div>
              <span className="text-2xl font-black text-neon-lime tracking-wider" style={{ fontFamily: 'var(--font-orbitron)' }}>
                SYNAPSIFY
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-4">
            {mounted && user ? (
              <>
                <Link href="/arcade">
                  <button className="px-4 py-2 bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all uppercase font-bold text-xs tracking-wider">
                    Arcade
                  </button>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-transparent border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black transition-all uppercase font-bold text-xs tracking-wider flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all uppercase font-bold text-xs tracking-wider hidden sm:block"
                >
                  Sign In
                </button>
                <MagneticButton
                  magneticStrength={0.3}
                  onClick={() => setIsGameModalOpen(true)}
                  className="px-6 py-2 bg-black border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black transition-all uppercase font-bold text-sm tracking-wider"
                >
                  Join Waitlist
                </MagneticButton>
              </>
            )}
          </div>
        </div>
      </div>

      <GameGateModal isOpen={isGameModalOpen} onClose={() => setIsGameModalOpen(false)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false)
          window.location.href = '/arcade'
        }}
      />
    </motion.nav>
  )
}
