"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const VIDEOS = [
    { title: "Affirmative Habitability Requirements", id: "1084430538" },
    { title: "Carbon Monoxide Alarms", id: "1084430606" },
    { title: "Clothes Dryer Exhaust Ventilation", id: "1084430669" },
    { title: "Doors – Entry", id: "1084430708" },
    { title: "Doors – Fire-Labeled", id: "1084430785" },
    { title: "Doors – General", id: "1084430834" },
    { title: "Egress", id: "1084433787" },
    { title: "Electrical – Conductors, Outlets, and Switches", id: "1084433828" },
    { title: "Electrical GFCI or AFCI", id: "1084433863" },
    { title: "Fire Extinguishers", id: "1084433937" },
    { title: "Guardrails", id: "1084433976" },
    { title: "Handrails", id: "1084434018" },
    { title: "HVAC", id: "1084434060" },
    { title: "Lighting Auxiliary", id: "1084432352" },
    { title: "Lighting Exterior", id: "1084432374" },
    { title: "Lighting Interior", id: "1084432402" },
    { title: "Mold-Like Substances", id: "1084432423" },
    { title: "Sinks", id: "1084434100" },
    { title: "Smoke Alarms", id: "1084432466" },
    { title: "Sprinkler Assembly", id: "1084432516" },
    { title: "Structural Systems", id: "1084432600" },
]

export default function EducationTrainingPage() {
    const router = useRouter()
    const [playing, setPlaying] = useState<{ title: string; id: string } | null>(null)

    return (
        <div className="min-h-screen bg-white">
            {/* Top bar */}
            <div className="px-4 md:px-6 py-5 flex items-center justify-between max-w-[1400px] mx-auto">
                <div className="flex flex-col cursor-pointer" onClick={() => router.push('/')}>
                    <img
                        src="/logo.png"
                        alt="NSPIRE"
                        className="h-24 md:h-32 lg:h-36 w-auto object-contain"
                    />
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="text-gray-600 hover:text-[#006795] text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Home
                </button>
            </div>

            <section className="bg-[#F8F9FA] px-4 md:px-6 py-16 md:py-24">
                <div className="max-w-[1400px] mx-auto text-center">
                    <p className="text-xs font-bold text-[#006795] uppercase tracking-[0.2em] mb-3">Video Library</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0C1F3F] mb-4 serif">NSPIRE Inspection <span className="text-[#F84B5F] italic">Video Library</span></h1>
                    <div className="w-16 h-1 bg-[#F84B5F] mx-auto rounded-full mb-12"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-left">
                        {VIDEOS.map(({ title, id }) => (
                            <button
                                key={title}
                                onClick={() => setPlaying({ title, id })}
                                className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-left"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                                    ▶
                                </div>
                                <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">{title}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {playing && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setPlaying(null)}
                >
                    <div
                        className="w-full max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-white font-bold text-sm sm:text-base pr-4">{playing.title}</p>
                            <button
                                onClick={() => setPlaying(null)}
                                className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                aria-label="Close video"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingTop: "56.25%" }}>
                            <iframe
                                src={`https://player.vimeo.com/video/${playing.id}?autoplay=1&title=0&byline=0&portrait=0`}
                                className="absolute inset-0 w-full h-full"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
