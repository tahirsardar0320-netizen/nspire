"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeInspectionChecklist() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Logo Section */}
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center">
        <Image
          src="/logo.png"
          alt="NSPIRE"
          width={500}
          height={600}
          priority
          className="h-14 md:h-32 lg:h-40 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>

          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)}></div>
          )}

          <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex flex-col gap-6 p-8 pt-36">
              <Link href="/#home" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">HOME</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Welcome</span>
              </Link>
              <Link href="/#services" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">SERVICES</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Professional Solutions</span>
              </Link>
              <Link href="/about" className="flex flex-col group">
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">ABOUT</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Discover Nspire</span>
              </Link>
              <Link href="/contact" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">CONTACT</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Get in Touch</span>
              </Link>
              <Link href="/faq" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">FAQ</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Answers to Questions</span>
              </Link>
              <Link href="/blog" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-[#006795] font-bold leading-tight">BLOG</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Articles & Insights</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/#home" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">HOME</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Welcome</span>
            </Link>
            <Link href="/#services" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">SERVICES</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Professional Solutions</span>
            </Link>
            <Link href="/about" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight text-center">ABOUT</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider text-center">Discover Nspire</span>
            </Link>
            <Link href="/contact" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">CONTACT</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Get in Touch</span>
            </Link>
            <Link href="/faq" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">FAQ</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Answers to Questions</span>
            </Link>
            <Link href="/blog" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-[#006795] leading-tight">BLOG</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Articles & Insights</span>
            </Link>
          </div>

          <Button onClick={() => router.push("/login")} className="bg-[#006795] hover:bg-[#00567a] text-white rounded-full px-4 md:px-6 lg:px-8 py-2 md:py-2.5 text-xs md:text-sm font-medium flex items-center gap-2 shadow-md transition-all cursor-pointer">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Login/Register</span>
            <span className="sm:hidden">Login</span>
          </Button>
        </div>
      </nav>

      <article className="max-w-[1000px] mx-auto px-4 md:px-6 pt-12 md:pt-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#E8F4F8] text-[#006795] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Buyer Guide</span>
            <span className="text-gray-400 text-sm">March 13, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 leading-tight">
            Home Inspection Checklist
          </h1>
          <p className="text-xl md:text-2xl text-[#006795] font-medium mb-8">
            What to Look for Before Buying a Home
          </p>
          <div className="relative h-[400px] md:h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl mb-12">
            <Image
              src="/blog-checklist.png"
              alt="Home Inspection Checklist"
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
          <p className="text-xl font-medium text-gray-900 border-l-4 border-[#006795] pl-6 italic">
            Buying a home is one of the biggest financial decisions most people make. While a property may appear perfect during a viewing, hidden issues can exist behind walls, under floors, or within essential home systems.
          </p>

          <p>
            Understanding what inspectors look for during an inspection can help buyers feel more prepared and confident throughout the process. A home inspection checklist gives buyers a clear idea of the important areas that should be evaluated before making a final decision.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Why a Home Inspection Is Important for Buyers</h2>
            <p>A home inspection is an essential step in the buying process. It helps you understand the real condition of the property and identify issues that may require repairs or further evaluation.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identify potential structural or safety issues</li>
              <li>Understand the condition of major systems</li>
              <li>Avoid unexpected repair costs</li>
              <li>Negotiate repairs if needed</li>
            </ul>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
              <h3 className="text-xl font-bold text-black mb-4">Exterior Checklist</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2"><strong>• Roof:</strong> Shingles, flashing, gutters.</li>
                <li className="flex gap-2"><strong>• Foundation:</strong> Cracks, settlement, floors.</li>
                <li className="flex gap-2"><strong>• Walls/Siding:</strong> Deterioration, water stains.</li>
                <li className="flex gap-2"><strong>• Windows/Doors:</strong> Seals, operation, frames.</li>
              </ul>
            </div>
            <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
              <h3 className="text-xl font-bold text-black mb-4">Interior Checklist</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2"><strong>• Systems:</strong> Electrical, Plumbing, HVAC.</li>
                <li className="flex gap-2"><strong>• Structure:</strong> Walls, ceilings, floors.</li>
                <li className="flex gap-2"><strong>• Spaces:</strong> Attic, Basement, Crawl spaces.</li>
                <li className="flex gap-2"><strong>• Safety:</strong> Smoke/CO detectors, railings.</li>
              </ul>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">What Buyers Should Do During the Inspection</h2>
            <p>While the inspector performs the technical evaluation, buyers can benefit from being present. Attending the inspection allows you to ask questions, understand how systems work, and see potential issues firsthand.</p>
          </section>

          <section className="bg-[#006795] text-white p-8 md:p-12 rounded-[40px] shadow-xl">
            <h2 className="text-2xl font-bold mb-4">After the Inspection: Next Steps</h2>
            <p className="opacity-90">Once the inspection is completed, you receive a detailed report. Based on the findings, you can proceed with confidence, request repairs, or negotiate changes in the agreement.</p>
          </section>

          <section className="py-12 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">Ready for a Professional Inspection?</h2>
            <p className="mb-8 max-w-2xl mx-auto text-gray-600">Get a clear, detailed evaluation of your potential new home with Nspire Property Inspection.</p>
            <Button className="bg-[#F84B5F] hover:bg-[#EE3646] text-white rounded-full px-12 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105">Book Now</Button>
          </section>
        </div>

        <div className="border-t border-gray-100 mt-20 pt-10 flex justify-between items-center mb-20">
          <Link href="/blog" className="flex items-center gap-2 text-[#006795] font-bold hover:underline">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Blog
          </Link>
        </div>
      </article>

      <footer className="bg-black text-white py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Image src="/logo.png" alt="NSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" />
          <p className="text-gray-400 text-xs text-center">© 2026 Nspire Home Inspections. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
