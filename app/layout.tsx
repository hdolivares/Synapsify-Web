import type { Metadata } from 'next'
import { Orbitron, Inconsolata } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'
import Preloader from '@/components/Preloader'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const inconsolata = Inconsolata({
  subsets: ['latin'],
  variable: '--font-inconsolata',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Synapsify - Cursor for Game Development',
  description: 'Synapsify is an AI co-developer that lives in your editor. Build faster. Learn faster. Ship better.',
  icons: {
    icon: '/Synapsify Logo 512.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inconsolata.variable}`}>
      <body className="antialiased">
        <SmoothScroll>
          <Preloader />
          <CustomCursor />
          <ScrollProgress />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}

