"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";




export default function Home() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileNavOpen]);

  return (
    <div className="w-full relative bg-white">
      

    {/* Navigation */}
    <nav className="fixed w-full z-50 glass-nav">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 lg:py-3">
                {/* Logo */}
                <div className="flex-shrink-0 flex flex-col relative z-20">
                    <img src="logo.png" alt="Nspire App Logo" className="h-14 sm:h-16 md:h-20 w-auto rounded object-contain" />
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-8">
                    <a href="#" className="nav-item-container">
                        <span className="nav-title">HOME</span>
                        <span className="nav-subtitle">Welcome</span>
                    </a>
                    <div className="nav-item-container has-dropdown">
                        <span className="nav-title flex items-center">
                            SERVICES
                            <svg className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                        </span>
                        <span className="nav-subtitle">Professional Solutions</span>
                        <div className="dropdown-menu">
                            <a href="/inspection-services/public-housing" className="dropdown-item"><span className="dot text-purple-500"></span> Public Housing inspection</a>
                            <a href="/inspection-services/affordable-housing" className="dropdown-item"><span className="dot text-emerald-500"></span> Affordable Housing inspection</a>
                            <a href="/inspection-services/owners" className="dropdown-item"><span className="dot text-rose-500"></span> Owner Inspection</a>
                            <a href="/inspection-services/insurance-risk" className="dropdown-item"><span className="dot text-red-600"></span> Risk Management inspection</a>
                        </div>
                    </div>
                    <a href="/data-retention" className="nav-item-container"><span className="nav-title">ABOUT</span><span className="nav-subtitle">Our Story</span></a>
                    <a href="/education-training" className="nav-item-container"><span className="nav-title">EDUCATION & TRAINING</span><span className="nav-subtitle">NSPIRE Videos</span></a>
                    <a href="https://www.hud.gov/reac/nspire-webinars" target="_blank" rel="noopener noreferrer" className="nav-item-container"><span className="nav-title">HUD EXCHANGE</span><span className="nav-subtitle">NSPIRE Webinars</span></a>
                </div>

                {/* Right side: Login btn (desktop) + Hamburger (mobile) */}
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push('/profile-selection')} className="hidden md:flex btn-primary px-5 lg:px-7 py-2.5 lg:py-3 rounded-full text-sm font-bold tracking-wide items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Login / Register
                    </button>
                    {/* Hamburger - mobile/tablet only */}
                    <button
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                        className="lg:hidden flex flex-col gap-1.5 p-2 z-50 relative"
                        aria-label="Toggle menu"
                    >
                        <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileNavOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileNavOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileNavOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>
            </div>
        </div>

        {/* Mobile Overlay */}
        {mobileNavOpen && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileNavOpen(false)} />
        )}

        {/* Mobile Drawer */}
        <div className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-[#0C1F3F] z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${ mobileNavOpen ? 'translate-x-0' : '-translate-x-full' }`}>
            <div className="flex flex-col h-full overflow-y-auto">
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex flex-col">
                        <img src="logo.png" alt="Nspire" className="h-12 w-auto rounded object-contain" />
                    </div>
                    <button onClick={() => setMobileNavOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex flex-col gap-1 p-4">
                    <a href="#" onClick={() => setMobileNavOpen(false)} className="flex flex-col px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
                        <span className="font-bold text-white text-sm">HOME</span>
                        <span className="text-[11px] text-cyan-400">Welcome</span>
                    </a>
                    <div>
                        <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
                            <div className="flex flex-col text-left">
                                <span className="font-bold text-white text-sm">SERVICES</span>
                                <span className="text-[11px] text-cyan-400">Professional Solutions</span>
                            </div>
                            <svg className={`w-4 h-4 text-cyan-400 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {mobileServicesOpen && (
                            <div className="pl-6 pb-2 space-y-1">
                                {[
                                    { label: 'Public Housing inspection', href: '/inspection-services/public-housing' },
                                    { label: 'Affordable Housing inspection', href: '/inspection-services/affordable-housing' },
                                    { label: 'Owner Inspection', href: '/inspection-services/owners' },
                                    { label: 'Risk Management inspection', href: '/inspection-services/insurance-risk' },
                                ].map(s => (
                                    <a key={s.label} href={s.href} onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 text-sm text-white/60 hover:text-cyan-400 rounded-lg hover:bg-white/10">{s.label}</a>
                                ))}
                            </div>
                        )}
                    </div>
                    <a href="/data-retention" onClick={() => setMobileNavOpen(false)} className="flex flex-col px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"><span className="font-bold text-white text-sm">ABOUT</span><span className="text-[11px] text-cyan-400">Our Story</span></a>
                    <a href="/education-training" onClick={() => setMobileNavOpen(false)} className="flex flex-col px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"><span className="font-bold text-white text-sm">EDUCATION &amp; TRAINING</span><span className="text-[11px] text-cyan-400">NSPIRE Videos</span></a>
                    <a href="https://www.hud.gov/reac/nspire-webinars" target="_blank" rel="noopener noreferrer" onClick={() => setMobileNavOpen(false)} className="flex flex-col px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"><span className="font-bold text-white text-sm">HUD EXCHANGE</span><span className="text-[11px] text-cyan-400">NSPIRE Webinars</span></a>
                </div>
                <div className="p-4 mt-auto border-t border-white/10">
                    <button onClick={() => { setMobileNavOpen(false); router.push('/profile-selection'); }} className="w-full btn-primary rounded-xl py-4 text-sm font-bold flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Login / Register
                    </button>
                </div>
            </div>
        </div>
    </nav>

    {/* Hero Section */}
    <section className="relative pt-20 sm:pt-24 lg:pt-28 pb-16 lg:pb-32 z-10 min-h-screen flex items-center bg-[#E8F4F8] overflow-hidden">
        {/* Background photo slideshow — light overlay so text stays readable */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="bg-slide"></div>
            <div className="bg-slide"></div>
            <div className="bg-slide"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#E8F4F8] via-[#E8F4F8]/90 to-[#E8F4F8]/50"></div>
            <div className="absolute inset-0 bg-white/30"></div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative w-full z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-8">

                {/* Hero Content */}
                <div className="flex-1 w-full lg:max-w-[650px] text-left relative z-20">
                    <p className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.15] serif tracking-tight text-gradient mb-4">Developed and Updated by State Licensees</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-bold mb-6 leading-[1.15] serif tracking-tight">
                        <span className="text-gradient block">NSPIRE inspection (Public)</span>
                        <span className="block">Public &amp; Affordable Housing</span>
                        <span className="text-[#F84B5F] italic font-bold block">Across the U.S.A</span>
                    </h1>
                </div>

                {/* Hero Flip Card — hidden on small phones, visible sm+ */}
                <div className="hidden sm:flex flex-1 w-full justify-center lg:justify-end relative z-20 self-center">
                    <div className="flip-card animate-float">
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <img src="nationalstandard.png" alt="Trust Shield" className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)]" />
                            </div>
                            <div className="flip-card-back">
                                <img src="hero.png" alt="Mobile App" className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)]" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    {/* Download App Section */}
    <section className="bg-[#0C1F3F] py-20 px-4 md:px-6 z-20 relative">
        <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
                <p className="text-xs font-bold text-[#00C6D7] uppercase tracking-widest mb-4">Take It With You</p>
                <h2 className="text-4xl md:text-5xl font-bold text-white serif">Download <span className="text-[#F59E0B] italic">NSPIRE Inspection App (Public)</span></h2>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex flex-col items-center gap-4">
                    <a href="https://apps.apple.com/pk/app/nspire-inspection/id6744891415" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="App Store" className="h-12" /></a>
                    <div className="bg-white p-4 rounded-2xl shadow-xl">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://apps.apple.com/pk/app/nspire-inspection/id6744891415" alt="iOS QR" className="w-40 h-40 sm:w-48 sm:h-48" />
                    </div>
                    <span className="text-sm text-white/70 font-medium">Scan (iOS)</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <a href="https://play.google.com/store/apps/details?id=com.nspireapp" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-12" /></a>
                    <div className="bg-white p-4 rounded-2xl shadow-xl">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://play.google.com/store/apps/details?id=com.nspireapp" alt="Android QR" className="w-40 h-40 sm:w-48 sm:h-48" />
                    </div>
                    <span className="text-sm text-white/70 font-medium">Scan (Android)</span>
                </div>
            </div>
        </div>
    </section>

    {/* Footer */}
    <footer className="bg-black text-white px-4 md:px-6 py-12 md:py-16 relative z-20">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
                {/* Quick Links */}
                <div>
                    <h3 className="font-bold mb-4 serif text-xl">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400 font-medium">
                        <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                        <li><a href="/data-retention" className="hover:text-white transition-colors">About</a></li>
                        <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                        <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                        <li><a href="/education-training" className="hover:text-white transition-colors">Education &amp; Training</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-bold mb-4 serif text-xl">Contact</h3>
                    <div className="space-y-3 text-gray-400 font-medium">
                        <p className="flex items-center gap-2 group cursor-pointer">
                            <svg className="w-5 h-5 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            <a href="mailto:support@inspire.com" className="group-hover:text-white transition-colors">support@inspire.com</a>
                        </p>
                        <p className="flex items-center gap-2 group cursor-pointer">
                            <svg className="w-5 h-5 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            <a href="tel:9202202220" className="group-hover:text-white transition-colors">9202202220</a>
                        </p>
                    </div>
                </div>

                {/* Subscribe */}
                <div>
                    <h3 className="font-bold mb-4 serif text-xl">Subscribe</h3>
                    <div className="flex mb-4">
                        <div className="relative flex-1">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            <input type="email" placeholder="Enter your email address" className="pl-10 pr-4 py-3 rounded-l bg-white text-gray-900 placeholder-gray-500 w-full border-0 outline-none" />
                        </div>
                        <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition-colors px-5 py-3 rounded-r flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </button>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">
                        Hello we are UI Monks. Our goal is to translate the positive effects from revolutionizing how companies engage with their clients &amp; their team.
                    </p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <a href="#" className="flex flex-col">
                        <img src="logo.png" alt="Nspire App Logo" className="object-contain h-16 md:h-20 w-auto rounded" />
                    </a>
                    <a href="https://nspireinspection.ai/" className="btn-primary px-6 py-3 rounded-full text-sm font-semibold inline-block text-center">
                        Download NSPIREinspectionApp.com
                    </a>
                </div>

                <div className="flex gap-6 text-gray-400 font-medium">
                    <a href="#terms" className="hover:text-white transition-colors">Terms</a>
                    <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#cookies" className="hover:text-white transition-colors">Cookies</a>
                </div>

                <div className="flex gap-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="X (Twitter)">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                </div>
            </div>
        </div>
    </footer>


    </div>
  );
}
