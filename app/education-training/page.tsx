"use client"

import { useRouter } from "next/navigation"

const VIDEOS = [
    { title: "Carbon Monoxide Alarms", url: "https://youtu.be/FYZBVgrAlK4" },
    { title: "Clothes Dryer Exhaust Ventilation", url: "https://youtu.be/QGo18ELdZUg" },
    { title: "Doors – Entry", url: "https://youtu.be/M5zC94bW38M" },
    { title: "Doors – Fire-Labeled", url: "https://youtu.be/uZfgT9QIjEY" },
    { title: "Doors – General", url: "https://youtu.be/hVcbhaeiXYI" },
    { title: "Egress", url: "https://youtu.be/QZalQtT2XcY" },
    { title: "Electrical – Conductors, Outlets, and Switches", url: "https://youtu.be/6LEMEVdm-Aw" },
    { title: "Electrical GFCI or AFCI", url: "https://youtu.be/7oJlikoWYSk" },
    { title: "Fire Extinguishers", url: "https://youtu.be/Rkxdptw0K7I" },
    { title: "Guardrails", url: "https://youtu.be/O4A5nJ6auyQ" },
    { title: "Handrails", url: "https://youtu.be/bofMegKS7D0" },
    { title: "HVAC", url: "https://youtu.be/sJhJWKi8OXc" },
    { title: "Infestation", url: "https://youtu.be/ua7oB0HwEqk" },
    { title: "Lighting Auxiliary", url: "https://youtu.be/-tmO2NQTXK8" },
    { title: "Lighting Exterior", url: "https://youtu.be/30cnni5zEYU" },
    { title: "Lighting Interior", url: "https://youtu.be/vwj3hOSj6Ls" },
    { title: "Mold-Like Substances", url: "https://youtu.be/m53Yjf83lAI" },
    { title: "Sinks", url: "https://youtu.be/tWAqxTfuzAo" },
    { title: "Smoke Alarms", url: "https://youtu.be/HCGQMtVXvgo" },
    { title: "Sprinkler Assembly", url: "https://youtu.be/-LmDg1H-7tA" },
    { title: "Structural Systems", url: "https://youtu.be/BPu6RQOljFg" },
]

export default function EducationTrainingPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-white">
            {/* Top bar */}
            <div className="px-4 md:px-6 py-5 flex items-center justify-between max-w-[1400px] mx-auto">
                <div className="flex flex-col cursor-pointer" onClick={() => router.push('/')}>
                    <img
                        src="/logo.png"
                        alt="NSPIRE"
                        className="h-14 sm:h-16 md:h-20 w-auto object-contain"
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
                        {VIDEOS.map(({ title, url }) => (
                            <a
                                key={title}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                                    ▶
                                </div>
                                <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">{title}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
