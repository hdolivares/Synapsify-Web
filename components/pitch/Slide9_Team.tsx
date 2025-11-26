import SlideLayout from './SlideLayout'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

export default function Slide9_Team() {
    return (
        <SlideLayout>
            <div className="flex flex-col h-full items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        Engine Native Experts
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl">
                    {[
                        {
                            name: 'Hugo',
                            role: 'Unreal Expert',
                            desc: '4+ years in Unreal Engine; specialist in C++, Blueprints, and Systems architecture.',
                            color: 'text-neon-lime',
                            borderColor: 'border-neon-lime'
                        },
                        {
                            name: 'Jorge Ruiz',
                            role: 'Tech Lead',
                            desc: '15+ years experience. Ex-CTO/CEO who co-founded Airtm (4M+ users). Expert in Heurist.ai agent frameworks.',
                            color: 'text-neon-cyan',
                            borderColor: 'border-neon-cyan'
                        },
                        {
                            name: 'Cristina Manrique',
                            role: 'Eng Lead',
                            desc: '12+ years in Computer Vision and AR/VR. Deep experience building agentic systems.',
                            color: 'text-neon-magenta',
                            borderColor: 'border-neon-magenta'
                        }
                    ].map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className={`w-40 h-40 rounded-full bg-gray-900 border-2 ${member.borderColor} flex items-center justify-center mb-6 overflow-hidden relative shadow-[0_0_20px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-300`}>
                                <User className={`w-20 h-20 ${member.color} opacity-50`} />
                                <div className={`absolute inset-0 bg-${member.color.replace('text-', '')}/10`} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                            <p className={`text-sm font-mono font-bold ${member.color} mb-4 uppercase tracking-wider`}>{member.role}</p>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{member.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </SlideLayout>
    )
}
