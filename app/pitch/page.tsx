import PitchDeck from '@/components/PitchDeck'
import Navbar from '@/components/Navbar'

export const metadata = {
    title: 'Synapsify - Pitch Deck',
    description: 'Cursor for Game Development. The first AI-native development environment integrated directly inside Unreal Engine.',
}

export default function PitchPage() {
    return (
        <main className="min-h-screen bg-black text-foreground selection:bg-primary/30 selection:text-white overflow-hidden">
            <Navbar />
            <PitchDeck />
        </main>
    )
}
