"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TermsClient() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Logo */}
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center">
        <Image src="/logo.png" alt="NSPIRE" width={500} height={600} priority className="h-14 md:h-32 lg:h-40 w-auto" />
      </div>

      {/* Navigation */}
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
              <Link href="/contact" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors">CONTACT</span></Link>
              <Link href="/faq" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors">FAQ</span></Link>
              <Link href="/blog" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors">BLOG</span></Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors">HOME</span><span className="text-[10px] text-gray-500 italic tracking-wider">Welcome</span></Link>
            <Link href="/about" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors">ABOUT</span><span className="text-[10px] text-gray-500 italic tracking-wider">Our Story</span></Link>
            <Link href="/contact" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors">CONTACT</span><span className="text-[10px] text-gray-500 italic tracking-wider">Get in Touch</span></Link>
            <Link href="/faq" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors">FAQ</span><span className="text-[10px] text-gray-500 italic tracking-wider">Answers</span></Link>
            <Link href="/blog" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors">BLOG</span><span className="text-[10px] text-gray-500 italic tracking-wider">Articles</span></Link>
          </div>
          <Button onClick={() => router.push("/login")} className="bg-[#006795] hover:bg-[#00567a] text-white rounded-full px-4 md:px-6 lg:px-8 py-2 md:py-2.5 text-xs md:text-sm font-medium flex items-center gap-2 shadow-md transition-all cursor-pointer">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="hidden sm:inline">Login/Register</span><span className="sm:hidden">Login</span>
          </Button>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-[#006795] py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-white/70 text-lg">Last Updated: March 13, 2026</p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-black mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using the Nspire Home Inspections website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our services.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">2. Services</h2>
            <p>Nspire Home Inspections provides professional property inspection services, including but not limited to home inspections, commercial inspections, specialized inspections, and related consulting services. All inspections are performed by certified professionals following industry standards.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">3. Scheduling and Cancellation</h2>
            <p>Inspection appointments are subject to availability. Cancellations must be made at least 24 hours before the scheduled inspection. Failure to cancel within this period may result in a cancellation fee.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">4. Payment Terms</h2>
            <p>Payment is due at the time of service unless alternative arrangements have been made in advance. We accept major credit cards, debit cards, and electronic payments. All fees are non-refundable once the inspection report has been delivered.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">5. Inspection Reports</h2>
            <p>Inspection reports are prepared for the exclusive use of the client who ordered the inspection. Reports represent the condition of the property at the time of inspection and are not warranties or guarantees. The report is not transferable without written consent from Nspire Home Inspections.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">6. Limitation of Liability</h2>
            <p>Nspire Home Inspections' liability is limited to the fee paid for the inspection. We are not responsible for conditions that were concealed, not readily accessible, or that occurred after the inspection date. Our inspections are visual and non-invasive in nature.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">7. Intellectual Property</h2>
            <p>All content on the Nspire Home Inspections website, including text, graphics, logos, images, and software, is the property of Nspire Home Inspections and is protected by copyright and trademark laws.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">8. Governing Law</h2>
            <p>These Terms of Service are governed by the laws of the State of Georgia, United States. Any disputes arising from these terms shall be resolved in the courts of Georgia.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">9. Contact</h2>
            <p>For questions about these Terms of Service, contact us:</p>
            <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100 mt-6">
              <p className="font-bold text-black mb-2">Nspire Home Inspections</p>
              <p>Email: <a href="mailto:support@nspireexperts.com" className="text-[#006795] hover:underline">support@nspireexperts.com</a></p>
              <p>Phone: <a href="tel:9202202220" className="text-[#006795] hover:underline">920-220-2220</a></p>
            </div>
          </div>
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
