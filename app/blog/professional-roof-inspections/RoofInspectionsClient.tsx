"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfessionalRoofInspections() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const faqs = [
    {
      q: "How often should I have my roof inspected?",
      a: "Experts recommend at least once a year, with additional inspections after major storms or extreme weather events."
    },
    {
      q: "Can drone inspections detect all roof issues?",
      a: "While drones provide excellent visual coverage and safety, they are often combined with thermal imaging and interior checks for a comprehensive assessment."
    },
    {
      q: "Are roof inspections covered by insurance?",
      a: "Routine inspections are typically not covered, but insurance may cover repairs if damage is discovered due to a covered event."
    },
    {
      q: "What happens if minor leaks are ignored?",
      a: "Even small leaks can lead to significant water damage, mold growth, structural deterioration, and higher repair costs over time."
    }
  ];

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
            <span className="bg-[#E8F4F8] text-[#006795] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Inspection Services</span>
            <span className="text-gray-400 text-sm">March 13, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 leading-tight">
            Professional Roof Inspections
          </h1>
          <p className="text-xl md:text-2xl text-[#006795] font-medium mb-8">
            Across the U.S. to Prevent Leaks, Moisture Damage, and Costly Repairs
          </p>
          <div className="relative h-[400px] md:h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl mb-12">
            <Image
              src="/blog-roof.png"
              alt="Professional Roof Inspection"
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
          <p className="text-xl font-medium text-gray-900 border-l-4 border-[#F84B5F] pl-6 italic">
            Your home or commercial property is one of your most valuable investments. One of the most critical yet overlooked aspects of property maintenance is the roof. Even small leaks or unnoticed moisture intrusion can lead to significant structural damage, mold growth, and expensive repairs.
          </p>

          <p>
            At Nspire, we provide expert roof inspection services that combine traditional inspection methods with modern technology, including drone assessments and thermal imaging. Our inspections are designed to detect issues before they escalate, saving you time, money, and stress.
          </p>

          <p>
            This comprehensive guide will explain the importance of roof inspections, how they are conducted, the common problems they uncover, and why proactive maintenance matters no matter where you live in the U.S.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Understanding Roof Inspections</h2>
            <p>
              A roof inspection is a detailed evaluation of your roof’s condition, materials, and structural integrity. Unlike a casual visual check, professional inspections focus on identifying both visible and hidden issues that could compromise your property’s safety.
            </p>
            <p>Professional inspectors evaluate:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Roofing materials (shingles, tiles, metal panels)</li>
              <li>Flashing and sealants</li>
              <li>Gutters and drainage systems</li>
              <li>Ventilation and insulation</li>
              <li>Signs of wear, damage, or moisture intrusion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">How Modern Technology Enhances Roof Inspections</h2>
            <p>Traditional inspections are sometimes limited by accessibility, safety concerns, or human error. Modern technology, however, has transformed the process.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-[#F8F9FA] p-6 rounded-3xl border border-gray-100">
                <h3 className="font-bold text-black mb-2">Drone Roof Inspections</h3>
                <p className="text-sm">Drones allow inspectors to capture high-resolution images of rooftops safely. They identify damaged areas or missing materials without the need for risky ladder work.</p>
              </div>
              <div className="bg-[#F8F9FA] p-6 rounded-3xl border border-gray-100">
                <h3 className="font-bold text-black mb-2">Thermal Imaging</h3>
                <p className="text-sm">Thermal cameras detect temperature differences that may indicate moisture buildup or leaks, identifying hidden water intrusion and insulation issues.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Common Roof Problems and Their Impacts</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="font-bold text-[#F84B5F]">1.</span>
                <div>
                  <h3 className="font-bold text-black">Moisture Intrusion</h3>
                  <p>Water penetration can lead to damaged ceilings, mold growth, and compromised structural integrity. Even minor leaks can cause extensive damage over time.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-[#F84B5F]">2.</span>
                <div>
                  <h3 className="font-bold text-black">Damaged Materials</h3>
                  <p>Shingles, tiles, or metal panels may crack, lift, or go missing due to weather, aging, or improper installation.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-[#F84B5F]">3.</span>
                <div>
                  <h3 className="font-bold text-black">Gutter and Drainage Problems</h3>
                  <p>Clogged gutters prevent water from flowing away from the roof, increasing the risk of leaks and wood rot.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#F8F9FA] p-8 rounded-[40px] border border-gray-100">
            <h2 className="text-2xl font-bold text-black mb-4">Case Studies: Real Life Roof Inspections</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#006795] mb-1">Residential Property Example</h3>
                <p className="text-sm">During a routine inspection, we detected a soft spot near a gutter causing interior damage. Early action avoided extensive mold remediation.</p>
              </div>
              <div>
                <h3 className="font-bold text-[#006795] mb-1">Commercial Property Example</h3>
                <p className="text-sm">Using drones, we identified metal roof deterioration that was inaccessible manually, preventing major business interruption.</p>
              </div>
            </div>
          </section>

          <section className="bg-[#006795] rounded-[40px] p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Common Questions (FAQs)</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-white/20 pb-6 last:border-0">
                  <h3 className="text-xl font-bold mb-3 flex gap-3"><span className="text-[#006795]">Q:</span>{faq.q}</h3>
                  <p className="text-white/80 pl-8">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-12 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">Schedule Your Roof Inspection Today</h2>
            <p className="mb-8 max-w-2xl mx-auto">Do you need a roof inspection in the United States? Schedule your inspection today with Nspire and protect your property.</p>
            <Button className="bg-[#F84B5F] hover:bg-[#EE3646] text-white rounded-full px-12 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105">Book Your Inspection</Button>
          </section>
        </div>

        <div className="border-t border-gray-100 mt-20 pt-10 flex justify-between items-center mb-20 px-4 md:px-6 max-w-[1000px] mx-auto">
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
