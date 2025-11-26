import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SlideLayoutProps {
    children: ReactNode
    className?: string
}

export default function SlideLayout({ children, className = '' }: SlideLayoutProps) {
    return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-8 pt-24 md:p-16 md:pt-24 relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-20 pointer-events-none" />
            <div className="w-full max-w-7xl mx-auto relative z-10 h-full flex flex-col justify-center">
                {children}
            </div>
        </div>
    )
}
