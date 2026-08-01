"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function DataRetentionPage() {
    const router = useRouter()

    return (
        <div className="relative min-h-screen bg-[#006795] overflow-hidden">
            {/* Blurred house/property photo backdrop — covers the whole page */}
            <img
                src="/candid_house_people.png"
                alt=""
                aria-hidden="true"
                className="fixed inset-0 w-full h-full object-cover opacity-45 blur-sm scale-105 pointer-events-none select-none"
            />
            <div className="fixed inset-0 bg-gradient-to-b from-[#006795]/60 via-[#006795]/50 to-[#006795]/75 pointer-events-none"></div>
            <div className="fixed inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F84B5F] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Top bar */}
            <div className="relative z-10 px-4 md:px-6 py-5 flex items-center justify-between max-w-[1400px] mx-auto">
                <img
                    src="/logo.png"
                    alt="NSPIRE"
                    className="h-14 sm:h-16 md:h-20 w-auto cursor-pointer object-contain"
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
            <section className="relative z-10 py-20 md:py-28">
                <div className="max-w-[1000px] mx-auto px-4 md:px-6 text-center">
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

            {/* AI-Driven Inspection Article */}
            <section className="relative z-10 bg-white text-black py-20 md:py-28">
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-14">
                        <p className="text-[#006795] font-bold uppercase tracking-[0.2em] mb-6">The Future Is Here</p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.15] serif">
                            Say Goodbye to the <span className="text-[#006795]">Clipboard</span> and <span className="text-[#F84B5F] italic">Slow Apps</span>
                        </h2>
                        <div className="w-24 h-1 bg-[#F84B5F] mx-auto mb-8"></div>
                        <p className="text-xl font-semibold text-gray-800 mb-8">How AI-Driven NSPIRE Property Inspections Are Changing the Game</p>
                        <div className="text-left space-y-5 text-gray-600 leading-relaxed">
                            <p>If you&apos;ve ever conducted a property self-inspection, you know the pain: spending hours on-site with a clipboard, taking hundreds of photos, and then returning to the office to spend even more time typing up repetitive reports and matching images to rooms.</p>
                            <p>In an industry where every hour counts, manual inspections have long been a major administrative bottleneck. Fortunately, that is changing. The rise of NSPIRE inspection AI-powered inspection software is completely reshaping how inspections and self-inspections are performed.</p>
                            <p>Here is a look at how artificial intelligence streamlines property management, benefiting both property teams and tenants.</p>
                        </div>
                    </div>

                    {/* Section 1 */}
                    <div className="flex flex-col md:flex-row gap-10 items-center py-10">
                        <div className="flex-1 order-2 md:order-1">
                            <div className="w-14 h-14 rounded-xl bg-[#006795] flex items-center justify-center mb-5">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#006795] mb-4">1. Instant Photo Analysis &amp; Anomaly Detection</h3>
                            <p className="text-gray-600 leading-relaxed">One of the most powerful applications of AI is Vision AI. Instead of manually labeling images, property inspectors can simply take photos of a deficiency. The AI automatically analyzes images to focus on the defect and flag common issues such as water stains, cracks, mold, and structural wear and tear. It can even spot minor issues that the human eye might miss.</p>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-[340px] h-[260px] rounded-[24px] overflow-hidden relative order-1 md:order-2 shadow-xl">
                            <Image src="/inspectionWorkflow.png" alt="AI inspection app" fill className="object-cover" />
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="flex flex-col md:flex-row-reverse gap-10 items-center py-10">
                        <div className="flex-1">
                            <div className="w-14 h-14 rounded-xl bg-[#F84B5F] flex items-center justify-center mb-5">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#F84B5F] mb-4">2. Hours of Report Writing, Done in Minutes</h3>
                            <p className="text-gray-600 leading-relaxed">Tired of typing out near-identical descriptions for dozens of rooms? AI-driven tools can now prepopulate standard comments and instantly generate highly professional descriptions. Systems equipped with voice-to-text and Natural Language Processing (NLP) allow you to speak your findings, instantly converting them into neatly formatted, on-brand text.</p>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-[340px] h-[260px] rounded-[24px] overflow-hidden relative shadow-xl">
                            <Image src="/candid_inspection.png" alt="Property inspection reporting" fill className="object-cover" />
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="flex flex-col md:flex-row gap-10 items-center py-10">
                        <div className="flex-1 order-2 md:order-1">
                            <div className="w-14 h-14 rounded-xl bg-[#22C55E] flex items-center justify-center mb-5">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#22C55E] mb-4">3. Predictive Maintenance</h3>
                            <p className="text-gray-600 leading-relaxed">Rather than reacting to emergency repairs after they happen, AI algorithms can analyze trends across your portfolio and recommend proactive fixes. By comparing current conditions with historical data, AI helps you catch small problems before they turn into costly breakdowns.</p>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-[340px] h-[260px] rounded-[24px] overflow-hidden relative order-1 md:order-2 shadow-xl">
                            <Image src="/why2.jpg" alt="Property maintenance" fill className="object-cover" />
                        </div>
                    </div>

                    {/* Human touch callout */}
                    <div className="mt-10 bg-gradient-to-r from-[#006795] to-[#00495F] rounded-[32px] p-8 md:p-12 shadow-xl">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">The Human Touch Remains Crucial</h3>
                        <p className="text-white/85 leading-relaxed">While AI is handling the heavy lifting of data analysis and routine report generation, human judgment remains irreplaceable. AI is an incredibly powerful digital assistant that augments your expertise, allowing you to focus on strategic maintenance and tenant relations rather than tedious paperwork.</p>
                    </div>

                    {/* Closing CTA */}
                    <div className="text-center mt-16">
                        <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to <span className="text-[#006795]">Upgrade</span> Your Walkthroughs?</h3>
                        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">Are you ready to cut hours out of your routine and scale your operations? AI-powered inspections are no longer just an idea of the future; they are here to help you inspect smarter, not harder.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
