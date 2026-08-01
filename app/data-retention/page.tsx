"use client"

import { useRouter } from "next/navigation"

export default function DataRetentionPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[#0C1F3F]">
            {/* Top bar */}
            <div className="px-4 md:px-6 py-5 flex items-center justify-between max-w-[1400px] mx-auto">
                <img
                    src="/logo.png"
                    alt="NSPIRE"
                    className="h-10 w-auto cursor-pointer"
                    onClick={() => router.push('/')}
                />
                <button
                    onClick={() => router.push('/')}
                    className="text-white/80 hover:text-white text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Home
                </button>
            </div>

            {/* Content */}
            <section className="relative bg-[#006795] py-20 md:py-28 overflow-hidden">
                {/* Blurred house/property photo backdrop */}
                <img
                    src="/candid_house_people.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.18] blur-md scale-105 pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-[#006795]/70 pointer-events-none"></div>
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F84B5F] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="max-w-[1000px] mx-auto px-4 md:px-6 relative z-10 text-center">
                    <p className="text-[#A8D8EA] font-bold uppercase tracking-[0.2em] mb-6">Empowering Property Decisions</p>
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] serif text-white"
                        style={{ textShadow: '0 0 8px rgba(0,198,215,0.9), 0 0 22px rgba(0,198,215,0.65), 0 0 48px rgba(248,75,95,0.5)' }}
                    >
                        Data{' '}
                        <span
                            className="text-[#F84B5F] italic font-medium"
                            style={{ textShadow: '0 0 8px rgba(248,75,95,0.9), 0 0 22px rgba(248,75,95,0.65), 0 0 48px rgba(0,198,215,0.5)' }}
                        >
                            Retention
                        </span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/90 leading-relaxed font-light mb-10">
                        We use encrypted administrative, technical, and physical safeguards designed to protect all information. Despite our efforts, no method of transmitting or storing data is completely secure.
                    </p>

                    <a
                        href="https://www.hud.gov/sites/dfiles/PIH/documents/NSPIRE_Toolkit-Property_Owner_1YearIn.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-[#006795] hover:bg-white/90 px-8 py-4 rounded-full text-sm font-bold tracking-wide transition-colors shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Toolkit Cheat Sheet
                    </a>
                </div>
            </section>
        </div>
    )
}
