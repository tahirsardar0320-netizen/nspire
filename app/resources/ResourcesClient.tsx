"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const resources = [
  {
    title: "Blog",
    description: "Expert articles on home inspections, real estate, and property maintenance across the U.S.",
    href: "/blog",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
    ),
    color: "#006795",
    bg: "#E8F4F8"
  },
  {
    title: "FAQ",
    description: "Frequently asked questions about home inspection services, pricing, and what to expect.",
    href: "/faq",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    color: "#F84B5F",
    bg: "#FEF2F2"
  },
  {
    title: "News & Articles",
    description: "Stay updated with the latest industry news, regulatory changes, and Nspire announcements.",
    href: "/news-articles",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" /></svg>
    ),
    color: "#22C55E",
    bg: "#F0FDF4"
  },
  {
    title: "Guides",
    description: "Comprehensive guides for buyers, sellers, homeowners, and real estate professionals.",
    href: "/guides",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    ),
    color: "#F59E0B",
    bg: "#FFFBEB"
  }
];

export default function ResourcesClient() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center">
        <Image src="/logo.png" alt="NSPIRE" width={500} height={600} priority className="h-14 md:h-32 lg:h-40 w-auto" />
      </div>

      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden z-50 flex flex-col gap-1.5 p-2" aria-label="Toggle menu">
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
          {mobileMenuOpen && (<div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)}></div>)}
          <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex flex-col gap-6 p-8 pt-36">
              <Link href="/" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors">HOME</span></Link>
              <Link href="/about" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors">ABOUT</span></Link>
              <Link href="/inspection-services" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors">SERVICES</span></Link>
              <Link href="/contact" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors">CONTACT</span></Link>
              <Link href="/blog" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors">BLOG</span></Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors">HOME</span><span className="text-[10px] text-gray-500 italic tracking-wider">Welcome</span></Link>
            <Link href="/about" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors">ABOUT</span><span className="text-[10px] text-gray-500 italic tracking-wider">Our Story</span></Link>
            <Link href="/inspection-services" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors">SERVICES</span><span className="text-[10px] text-gray-500 italic tracking-wider">Inspections</span></Link>
            <Link href="/contact" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors">CONTACT</span><span className="text-[10px] text-gray-500 italic tracking-wider">Get in Touch</span></Link>
            <Link href="/resources" className="flex flex-col group items-center"><span className="text-sm font-bold text-[#006795]">RESOURCES</span><span className="text-[10px] text-gray-500 italic tracking-wider">Learn More</span></Link>
          </div>
          <Button onClick={() => router.push("/login")} className="bg-[#006795] hover:bg-[#00567a] text-white rounded-full px-4 md:px-6 lg:px-8 py-2 md:py-2.5 text-xs md:text-sm font-medium flex items-center gap-2 shadow-md transition-all cursor-pointer">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="hidden sm:inline">Login/Register</span><span className="sm:hidden">Login</span>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#006795] py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="relative z-10">
          <p className="text-[#006795] font-bold uppercase tracking-[0.2em] mb-4">Knowledge Center</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Resources</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">Everything you need to make informed decisions about your property.</p>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((r) => (
            <Link key={r.title} href={r.href} className="group block">
              <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: r.bg, color: r.color }}>
                  {r.icon}
                </div>
                <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-[#006795] transition-colors">{r.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">{r.description}</p>
                <span className="text-[#006795] font-bold text-sm uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Explore
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Image src="/logo.png" alt="NSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" />
          <p className="text-gray-400 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
