'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Slide1_Title from './pitch/Slide1_Title'
import Slide2_Problem from './pitch/Slide2_Problem'
import Slide3_Solution from './pitch/Slide3_Solution'
import Slide4_SecretSauce from './pitch/Slide4_SecretSauce'
import Slide5_Market from './pitch/Slide5_Market'
import Slide6_Traction from './pitch/Slide6_Traction'
import Slide7_BusinessModel from './pitch/Slide7_BusinessModel'
import Slide8_Competition from './pitch/Slide8_Competition'
import Slide9_Team from './pitch/Slide9_Team'
import Slide10_TheAsk from './pitch/Slide10_TheAsk'
import { ChevronDown, ChevronUp } from 'lucide-react'

const slides = [
    Slide1_Title,
    Slide2_Problem,
    Slide3_Solution,
    Slide4_SecretSauce,
    Slide5_Market,
    Slide6_Traction,
    Slide7_BusinessModel,
    Slide8_Competition,
    Slide9_Team,
    Slide10_TheAsk
]

export default function PitchDeck() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Handle scroll snap detection
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleScroll = () => {
            const slideHeight = container.clientHeight
            const scrollTop = container.scrollTop
            const index = Math.round(scrollTop / slideHeight)
            if (index !== currentSlide) {
                setCurrentSlide(index)
            }
        }

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [currentSlide])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault()
                if (currentSlide < slides.length - 1) {
                    scrollToSlide(currentSlide + 1)
                }
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault()
                if (currentSlide > 0) {
                    scrollToSlide(currentSlide - 1)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentSlide])

    const scrollToSlide = (index: number) => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: index * containerRef.current.clientHeight,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Main Scroll Container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                {slides.map((SlideComponent, index) => (
                    <section
                        key={index}
                        className="h-screen w-full snap-start flex-shrink-0 relative"
                    >
                        <SlideComponent />
                    </section>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index
                                ? 'bg-neon-lime scale-125 shadow-[0_0_10px_var(--neon-lime)]'
                                : 'bg-gray-700 hover:bg-gray-500'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-gray-800 w-full z-50">
                <motion.div
                    className="h-full bg-neon-lime shadow-[0_0_10px_var(--neon-lime)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Slide Counter */}
            <div className="absolute bottom-8 right-8 z-50 font-mono text-gray-500 text-sm">
                <span className="text-neon-lime">{currentSlide + 1}</span> / {slides.length}
            </div>

            {/* Navigation Hints */}
            {currentSlide < slides.length - 1 && (
                <div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => scrollToSlide(currentSlide + 1)}
                >
                    <ChevronDown className="w-8 h-8 text-white" />
                </div>
            )}
        </div>
    )
}
