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

  const handleGetStarted = () => {
    router.push('/profile-selection');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
  };

  return (
    <div className="w-full relative bg-white">
      

    {/* Navigation */}
    <nav className="fixed w-full z-50 glass-nav">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 lg:py-3">
                {/* Logo */}
                <div className="flex-shrink-0 flex items-center relative z-20">
                    <img src="logo.png" alt="Nspire App Logo" className="h-14 sm:h-16 md:h-20 w-auto rounded object-contain mix-blend-multiply" />
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
                            <a href="#services" className="dropdown-item"><span className="dot text-primary"></span> All Services</a>
                            <a href="#services" className="dropdown-item"><span className="dot text-cyan-600"></span> Buyers Inspections</a>
                            <a href="#services" className="dropdown-item"><span className="dot text-rose-500"></span> Owners Inspections</a>
                            <a href="#services" className="dropdown-item"><span className="dot text-orange-500"></span> Sellers Inspections</a>
                            <a href="#services" className="dropdown-item"><span className="dot text-emerald-500"></span> Rental Inspections</a>
                            <a href="#services" className="dropdown-item"><span className="dot text-green-500"></span> Specialized Services</a>
                            <a href="#services" className="dropdown-item"><span className="dot text-amber-500"></span> Commercial Inspections</a>
                            <a href="#services" className="dropdown-item"><span className="dot text-purple-500"></span> Public Housing</a>
                            <a href="#services" className="dropdown-item"><span className="dot text-red-600"></span> Insurance Risk</a>
                        </div>
                    </div>
                    <a href="#about" className="nav-item-container"><span className="nav-title">ABOUT</span><span className="nav-subtitle">Our Story</span></a>
                    <a href="#contact" className="nav-item-container"><span className="nav-title">CONTACT</span><span className="nav-subtitle">Get in Touch</span></a>
                    <a href="#education" className="nav-item-container"><span className="nav-title">EDUCATION & TRAINING</span><span className="nav-subtitle">NSPIRE Videos</span></a>
                    <a href="#blogs" className="nav-item-container"><span className="nav-title">BLOGS</span><span className="nav-subtitle">AI-Driven Inspection</span></a>
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
                    <img src="logo.png" alt="Nspire" className="h-12 w-auto rounded object-contain" />
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
                                {['All Services','Buyers Inspections','Owners Inspections','Sellers Inspections','Rental Inspections','Specialized Services','Commercial Inspections','Public Housing','Insurance Risk'].map(s => (
                                    <a key={s} href="#services" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 text-sm text-white/60 hover:text-cyan-400 rounded-lg hover:bg-white/10">{s}</a>
                                ))}
                            </div>
                        )}
                    </div>
                    <a href="#about" onClick={() => setMobileNavOpen(false)} className="flex flex-col px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"><span className="font-bold text-white text-sm">ABOUT</span><span className="text-[11px] text-cyan-400">Our Story</span></a>
                    <a href="#contact" onClick={() => setMobileNavOpen(false)} className="flex flex-col px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"><span className="font-bold text-white text-sm">CONTACT</span><span className="text-[11px] text-cyan-400">Get in Touch</span></a>
                    <a href="#education" onClick={() => setMobileNavOpen(false)} className="flex flex-col px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"><span className="font-bold text-white text-sm">EDUCATION &amp; TRAINING</span><span className="text-[11px] text-cyan-400">NSPIRE Videos</span></a>
                    <a href="#blogs" onClick={() => setMobileNavOpen(false)} className="flex flex-col px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"><span className="font-bold text-white text-sm">BLOGS</span><span className="text-[11px] text-cyan-400">AI-Driven Inspection</span></a>
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
    <section className="relative pt-28 sm:pt-36 lg:pt-52 pb-16 lg:pb-32 z-10 min-h-screen flex items-center bg-[#E8F4F8] overflow-hidden">
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
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-bold text-[#0C1F3F] mb-4 leading-[1.15] serif tracking-tight">
                        Trusted and Certified
                        <span className="block">Multi-Unit Inspections</span>
                        <span className="text-[#F84B5F] italic font-bold block">Across the NATION</span>
                    </h1>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base max-w-xl font-medium">
                        NSPIREinspection.AI stands at the forefront of the multi-unit inspection industry, offering multi-unit property inspections and advanced risk-mitigation solutions.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-start gap-3 mb-8">
                        <button onClick={handleGetStarted} className="btn-primary px-7 py-3.5 rounded-full text-sm md:text-base font-semibold">
                            Get Started
                        </button>
                        <button onClick={() => router.push('/find-inspectors')} className="btn-outline px-7 py-3.5 rounded-full text-sm md:text-base font-semibold">
                            View Inspectors
                        </button>
                    </div>
                    {/* App Download */}
                    <div className="pt-5 border-t border-gray-200">
                        <h3 className="text-base font-bold text-[#0C1F3F] mb-4">Download your app</h3>
                        <div className="flex flex-wrap gap-5 items-start">
                            <div className="flex flex-col items-center gap-2">
                                <a href="#" className="hover:opacity-80 transition-opacity"><img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="App Store" className="h-9" /></a>
                                <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-200">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://apps.apple.com/app/nspire" alt="iOS QR" className="w-16 h-16 sm:w-20 sm:h-20" />
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium">Scan (iOS)</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <a href="#" className="hover:opacity-80 transition-opacity"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-9" /></a>
                                <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-200">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://play.google.com/store/apps/details?id=nspire" alt="Android QR" className="w-16 h-16 sm:w-20 sm:h-20" />
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium">Scan (Android)</span>
                            </div>
                        </div>
                    </div>
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

    {/* THE PROCESS */}
    <section className="px-4 md:px-6 py-16 md:py-20 bg-[#F0F4FA] relative z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10">
            <div className="text-center mb-12">
                <p className="text-xs font-bold text-[#00C6D7] uppercase tracking-[0.2em] mb-3">THE PROCESS</p>
                <h2 className="text-4xl md:text-5xl font-bold text-[#0C1F3F] mt-2 serif">What to Expect</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="process-step">
                    <span className="step-number">1</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00C6D7] to-[#006795] rounded-2xl flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg">1</div>
                    <h3 className="font-bold text-xl mb-2 text-[#0C1F3F] serif">Schedule</h3>
                    <p className="text-gray-500 font-medium text-sm">Start inspection</p>
                </div>
                <div className="process-step">
                    <span className="step-number">2</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00C6D7] to-[#006795] rounded-2xl flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg">2</div>
                    <h3 className="font-bold text-xl mb-2 text-[#0C1F3F] serif">Evaluate</h3>
                    <p className="text-gray-500 font-medium text-sm">System by System check of the entire property.</p>
                </div>
                <div className="process-step">
                    <span className="step-number">3</span>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00C6D7] to-[#006795] rounded-2xl flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg">3</div>
                    <h3 className="font-bold text-xl mb-2 text-[#0C1F3F] serif">Report</h3>
                    <p className="text-gray-500 font-medium text-sm">Receive digital report (PDF) and clear repair recommendation (Excel format)</p>
                </div>
            </div>
        </div>
    </section>

    {/* Public Housing Section */}
    <section className="bg-[#0F172A] text-white py-20 relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 serif">Government Housing Compliance</h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                NSPIREinspection.AI provides professional, Public, and affordable Housing Inspections nationwide, helping housing authorities, property managers, and multifamily communities maintain federal compliance and safe living conditions. Qualified NSPIRE inspectors specialize in Real Estate Assessment inspection, ensuring every property meets federal housing standards.
            </p>
        </div>
    </section>

    
    {/* About Section */}
    <section id="about" className="relative bg-[#006795] py-20 md:py-32 overflow-hidden z-20">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F84B5F] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10 text-center">
            <p className="text-[#A8D8EA] font-bold uppercase tracking-[0.2em] mb-6">Empowering Property Decisions</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1] serif">
                About <span className="text-[#F84B5F] italic font-medium">Inspire</span>
            </h2>
            <p className="max-w-4xl mx-auto text-lg md:text-xl text-white/90 leading-relaxed font-light">
                Our Qualified NSPIRE inspectors focus on identifying risks, structural issues, and safety hazards to ensure that every inspection provides clear insights that help you make informed decisions about your property.
            </p>
        </div>
    </section>

    <section id="services" className="py-20 px-4 md:px-8 bg-white z-20 relative">
        <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
                <p className="text-[#00C6D7] font-bold uppercase tracking-[0.2em] mb-4 text-xs">Nationwide Solutions</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0C1F3F] mb-4 serif">Our Professional Inspection Solutions</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-sm">Comprehensive, transparent, and accurate evaluations tailored for every stage of property ownership and investment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="service-card flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                        <img src="/candid_house_people.png" alt="Buyer Inspection" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F3F]/80 via-black/20 to-transparent"></div>
                    </div>
                    <div className="p-7 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">Buyer Inspection Services</h3>
                            <p className="text-[#00C6D7] font-bold text-xs mb-3 uppercase tracking-wider">Informed Property Decisions</p>
                            <p className="text-gray-600 leading-relaxed text-sm">Inspire's Buyer Inspection Services support confident purchasing decisions for residential, multi-family, commercial, and public housing properties across the USA.</p>
                        </div>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] text-left mt-5 self-start transition-colors">Learn More →</button>
                    </div>
                </div>
                <div className="service-card flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                        <img src="/multiunit_residence.png" alt="Owner Inspection" className="w-full h-full object-cover transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F3F]/80 via-black/20 to-transparent"></div>
                    </div>
                    <div className="p-7 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">Owner Inspection Services</h3>
                            <p className="text-[#F59E0B] font-bold text-xs mb-3 uppercase tracking-wider">Asset Protection and Longevity</p>
                            <p className="text-gray-600 leading-relaxed text-sm">Inspire's Owner Inspection Services help property owners maintain asset value, ensure compliance, and plan preventive maintenance.</p>
                        </div>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] text-left mt-5 self-start transition-colors">Learn More →</button>
                    </div>
                </div>
                <div className="service-card flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                        <img src="/multi_unit_housing.png" alt="Seller Inspection" className="w-full h-full object-cover transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F3F]/80 via-black/20 to-transparent"></div>
                    </div>
                    <div className="p-7 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">Seller Inspection Services</h3>
                            <p className="text-orange-500 font-bold text-xs mb-3 uppercase tracking-wider">Maximize Marketability</p>
                            <p className="text-gray-600 leading-relaxed text-sm">Inspire's Seller Inspection Services prepare properties for listing with transparency and confidence. Identify major and minor defects before marketing.</p>
                        </div>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] text-left mt-5 self-start transition-colors">Learn More →</button>
                    </div>
                </div>
                <div className="service-card flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                        <img src="/plaza_shops.png" alt="Rental Inspection" className="w-full h-full object-cover transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F3F]/80 via-black/20 to-transparent"></div>
                    </div>
                    <div className="p-7 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">Rental Property Inspection</h3>
                            <p className="text-emerald-600 font-bold text-xs mb-3 uppercase tracking-wider">Compliance and Safety</p>
                            <p className="text-gray-600 leading-relaxed text-sm">Comprehensive rental property inspection services, including move-in, move-out, annual safety inspection, and habitability standards review.</p>
                        </div>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] text-left mt-5 self-start transition-colors">Learn More →</button>
                    </div>
                </div>
                <div className="service-card flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                        <img src="/candid_commercial_building.png" alt="Commercial Inspection" className="w-full h-full object-cover transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F3F]/80 via-black/20 to-transparent"></div>
                    </div>
                    <div className="p-7 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">Commercial Building Inspection</h3>
                            <p className="text-amber-500 font-bold text-xs mb-3 uppercase tracking-wider">Nationwide Services</p>
                            <p className="text-gray-600 leading-relaxed text-sm">Commercial building inspection services for multi-unit facilities, industrial properties, office buildings, retail spaces, warehouses, and shopping centers.</p>
                        </div>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] text-left mt-5 self-start transition-colors">Learn More →</button>
                    </div>
                </div>
                <div className="service-card flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                        <img src="/candid_public_housing.png" alt="Public Housing Inspection" className="w-full h-full object-cover transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1F3F]/80 via-black/20 to-transparent"></div>
                    </div>
                    <div className="p-7 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">Public Housing Inspection</h3>
                            <p className="text-purple-600 font-bold text-xs mb-3 uppercase tracking-wider">HUD/REAC Support</p>
                            <p className="text-gray-600 leading-relaxed text-sm">Specializing in public housing inspection services aligned with Inspire standards. HUD/REAC inspection preparation and multi-family housing inspection.</p>
                        </div>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] text-left mt-5 self-start transition-colors">Learn More →</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* Education Section */}
    <section id="education" className="bg-[#F8F9FA] px-4 md:px-6 py-20 md:py-28 z-20 relative">
        <div className="max-w-[1400px] mx-auto text-center">
            <p className="text-xs font-bold text-[#006795] uppercase tracking-[0.2em] mb-3">Video Library</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C1F3F] mb-4 serif">NSPIRE Inspection <span className="text-[#F84B5F] italic">Video Library</span></h2>
            <div className="w-16 h-1 bg-[#F84B5F] mx-auto rounded-full mb-12"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-left">

                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Carbon Monoxide Alarms</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Clothes Dryer Exhaust Ventilation</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Doors – Entry</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Doors – Fire-Labeled</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Doors – General</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Egress</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Electrical – Conductors, Outlets, and Switches</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Electrical GFCI or AFCI</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Fire Extinguishers</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Guardrails</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Handrails</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">HVAC</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Infestation</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Lighting Auxiliary</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Lighting Exterior</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Lighting Interior</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Mold-Like Substances</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Sinks</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Smoke Alarms</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Sprinkler Assembly</p>
                </div>
                <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-red-500/20">
                        ▶
                    </div>
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#EF4444] transition-colors">Structural Systems</p>
                </div>
            </div>
        </div>
    </section>

    <section id="blogs" className="bg-[#F0F4FA] px-4 md:px-6 py-20 md:py-28 z-20 relative">
        <div className="max-w-[1400px] mx-auto text-center">
            <p className="text-xs font-bold text-[#00C6D7] uppercase tracking-widest mb-4">Latest Insights</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C1F3F] mb-4 serif">AI-Driven Property <span className="text-[#F59E0B] italic">Inspection Blogs</span></h2>
            <div className="w-16 h-1 bg-[#F59E0B] mx-auto rounded-full mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">

                <article className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 serif">Sewer Scope Inspection</h3>
                        <p className="text-[#006795] font-bold text-sm mb-4">What It Is and Why It Matters for Homeowners Across the U.S.</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">
                            <span>March 13, 2026</span>
                            <span>|</span>
                            <span className="text-[#F84B5F]">Inspection Services</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed text-sm mb-5">Buying or owning a home comes with responsibilities that go far beyond what you can see during a casual walkthrough.</p>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] transition-colors">Read Article →</button>
                    </div>
                </article>
                <article className="blog-card">
                    <div className="blog-card-accent"></div>
                    <div className="p-7">
                        <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">Professional Roof Inspections</h3>
                        <p className="text-[#00C6D7] font-bold text-xs mb-3 uppercase tracking-wider">Across the U.S. to Prevent Leaks, Moisture Damage, and Costly Repairs</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">
                            <span>March 13, 2026</span>
                            <span>|</span>
                            <span className="text-[#F84B5F]">Inspection Services</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed text-sm mb-5">One of the most critical yet overlooked aspects of property maintenance is the roof. Even small leaks can lead to significant damage.</p>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] transition-colors">Read Article →</button>
                    </div>
                </article>
                <article className="blog-card">
                    <div className="blog-card-accent"></div>
                    <div className="p-7">
                        <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">Professional Home Inspection</h3>
                        <p className="text-[#00C6D7] font-bold text-xs mb-3 uppercase tracking-wider">What to Expect and Why They Matter</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">
                            <span>March 13, 2026</span>
                            <span>|</span>
                            <span className="text-[#F84B5F]">Inspection Services</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed text-sm mb-5">A home inspection provides a detailed understanding of a property’s condition before the deal is finalized. It helps buyers make informed decisions.</p>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] transition-colors">Read Article →</button>
                    </div>
                </article>
                <article className="blog-card">
                    <div className="blog-card-accent"></div>
                    <div className="p-7">
                        <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">Real Estate Professional Services</h3>
                        <p className="text-[#00C6D7] font-bold text-xs mb-3 uppercase tracking-wider">Building Trust and Smoother Transactions</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">
                            <span>March 13, 2026</span>
                            <span>|</span>
                            <span className="text-[#F84B5F]">For Professionals</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed text-sm mb-5">Partnering with a reliable inspection service can significantly improve the transaction experience. Deliver peace of mind and transparency.</p>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] transition-colors">Read Article →</button>
                    </div>
                </article>
                <article className="blog-card">
                    <div className="blog-card-accent"></div>
                    <div className="p-7">
                        <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">10 Common Problems</h3>
                        <p className="text-[#00C6D7] font-bold text-xs mb-3 uppercase tracking-wider">Issues Found During Home Inspections</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">
                            <span>March 13, 2026</span>
                            <span>|</span>
                            <span className="text-[#F84B5F]">Expert Advice</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed text-sm mb-5">Even homes that appear well-maintained can have hidden problems. Understanding these common issues helps buyers make informed decisions.</p>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] transition-colors">Read Article →</button>
                    </div>
                </article>
                <article className="blog-card">
                    <div className="blog-card-accent"></div>
                    <div className="p-7">
                        <h3 className="text-xl font-bold text-[#0C1F3F] mb-1 serif">Home Inspection Checklist</h3>
                        <p className="text-[#00C6D7] font-bold text-xs mb-3 uppercase tracking-wider">What to Look for Before Buying a Home</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">
                            <span>March 13, 2026</span>
                            <span>|</span>
                            <span className="text-[#F84B5F]">Buyer Guide</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed text-sm mb-5">A home inspection checklist gives buyers a clear idea of the important areas that should be evaluated before making a final decision.</p>
                        <button className="text-[#006795] font-bold text-sm hover:text-[#00C6D7] transition-colors">Read Article →</button>
                    </div>
                </article>
            </div>
            
            <button className="mt-10 bg-gradient-to-r from-[#00C6D7] to-[#006795] text-white px-10 py-4 rounded-2xl text-sm font-bold shadow-lg hover:shadow-cyan-500/25 transition-all hover:-translate-y-1">
                View All Articles
            </button>
        </div>
    </section>

    {/* Contact Section */}
    <section id="contact" className="bg-[#0C1F3F] py-20 px-4 md:px-6 z-20 relative">
        <div className="max-w-[1000px] mx-auto text-center">
            <p className="text-xs font-bold text-[#00C6D7] uppercase tracking-widest mb-4">Connect With Us</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 serif">How Can We <span className="text-[#F59E0B] italic">Help?</span></h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-3xl text-left mt-12">
                <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input type="text" placeholder="Full Name" className="form-input" />
                        <input type="email" placeholder="Email Address" className="form-input" />
                    </div>
                    <textarea rows={4} placeholder="How can we help you?" className="form-input"></textarea>
                    <button className="w-full bg-gradient-to-r from-[#00C6D7] to-[#006795] text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all hover:-translate-y-0.5">Send Message</button>
                </form>
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
                        <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                        <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                        <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                        <li><a href="#education" className="hover:text-white transition-colors">Education &amp; Training</a></li>
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
                <a href="#">
                    <img src="logo.png" alt="Nspire App Logo" className="object-contain h-16 md:h-20 w-auto rounded mix-blend-lighten filter brightness-110" />
                </a>

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
