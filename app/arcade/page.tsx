'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import BugInvaders from '@/components/BugInvaders'
import Navbar from '@/components/Navbar'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function ArcadePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/')
            } else {
                setLoading(false)
            }
        }
        checkAuth()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
                <div className="text-primary animate-pulse">Initializing Arcade...</div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-[#0a0f1e] text-white selection:bg-primary/30">
            <Navbar />
            <div className="pt-20">
                <BugInvaders mode="arcade" />
            </div>
        </main>
    )
}
