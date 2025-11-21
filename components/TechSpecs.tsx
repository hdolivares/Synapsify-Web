'use client'

import { Check } from 'lucide-react'

const specs = [
    "Unreal Engine 5.0+",
    "Windows 10/11 (64-bit)",
    "Visual Studio 2019/2022",
    "Internet Connection (for AI)"
]

export default function TechSpecs() {
    return (
        <section className="py-16 border-t border-white/5 bg-black/20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto p-8 rounded-2xl glass-panel">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">System Requirements</h3>
                        <p className="text-foreground-secondary">Compatible with your existing workflow.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                        {specs.map((spec, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-green-400" />
                                </div>
                                <span className="text-sm font-medium">{spec}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
