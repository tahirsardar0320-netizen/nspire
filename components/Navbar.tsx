"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <nav className="bg-white/95 border-b border-slate-200 px-4 md:px-6 py-2 sticky top-0 z-50 backdrop-blur-xl shadow-sm">
      <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
        {/* Mobile Menu Button - Left */}
        <button
          className="md:hidden p-2 -ml-2 text-gray-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Logo - Center on mobile, Left on desktop */}
        <div className="flex-1 md:flex-none flex justify-center md:justify-start lg:mr-8 xl:mr-16">
          <Link href="/">
            <Image src="/logo.png" alt="NSPIRE" width={200} height={70} className="object-contain h-12 md:h-14 w-auto" priority />
          </Link>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden z-50">
            <div className="flex flex-col px-4 py-4 space-y-4">
              <Link href="/" className="text-gray-800 font-medium pb-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>HOME</Link>
              <div className="py-2 border-b border-gray-50">
                <button
                  className="flex items-center justify-between w-full text-gray-800 font-medium"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                >
                  SERVICES{" "}
                  <svg className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileServicesOpen && (
                  <div className="flex flex-col gap-3 pl-4 mt-3">
                    <Link href="/service" className="text-sm text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>All Services</Link>
                    <Link href="/inspection-services/buyers" className="text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Buyers Inspections</Link>
                    <Link href="/inspection-services/owners" className="text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Owners Inspections</Link>
                    <Link href="/inspection-services/sellers" className="text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Sellers Inspections</Link>
                    <Link href="/inspection-services/specialized" className="text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Specialized Services</Link>
                    <Link href="/inspection-services/commercial" className="text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Commercial Inspections</Link>
                    <Link href="/inspection-services/public-housing" className="text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Public Housing</Link>
                    <Link href="/inspection-services/rental" className="text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Rental Inspections</Link>
                    <Link href="/inspection-services/insurance-risk" className="text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Insurance Risk</Link>
                  </div>
                )}
              </div>
              <Link href="/about" className="text-gray-800 font-medium pb-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>ABOUT</Link>
              <Link href="/contact" className="text-gray-800 font-medium pb-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>CONTACT</Link>
              <Link href="/faq" className="text-gray-800 font-medium pb-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>EDUCATION &amp; TRAINING</Link>
              <Link href="/blog" className="text-gray-800 font-medium" onClick={() => setMobileMenuOpen(false)}>BLOG</Link>
            </div>
          </div>
        )}

        {/* Desktop Navigation Links Container */}
        <div className="hidden md:flex items-center gap-5 lg:gap-6 xl:gap-8 flex-1 justify-center">
          <Link href="/" className="flex flex-col group items-center">
            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-950 transition-colors leading-tight">HOME</span>
            <span className="text-[10px] text-slate-500 italic tracking-wide">Welcome</span>
          </Link>
          <div className="relative group p-4 -m-4" onMouseLeave={() => setServicesDropdownOpen(false)}>
            <button
              className="flex flex-col group items-center cursor-pointer"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onClick={() => router.push('/service')}
            >
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight flex items-center gap-1">
                SERVICES{" "}
                <svg className={`w-3 h-3 transition-transform ${servicesDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Professional Solutions</span>
            </button>
            {servicesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[220px]">
                  <Link href="/service" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors text-sm font-bold text-gray-800" onClick={() => setServicesDropdownOpen(false)}>All Services</Link>
                  <Link href="/inspection-services/buyers" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors" onClick={() => setServicesDropdownOpen(false)}>
                    <span className="w-2 h-2 rounded-full bg-[#006795]"></span>
                    <span className="text-sm text-gray-700 hover:text-[#006795]">Buyers Inspections</span>
                  </Link>
                  <Link href="/inspection-services/owners" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors" onClick={() => setServicesDropdownOpen(false)}>
                    <span className="w-2 h-2 rounded-full bg-[#F84B5F]"></span>
                    <span className="text-sm text-gray-700 hover:text-[#006795]">Owners Inspections</span>
                  </Link>
                  <Link href="/inspection-services/sellers" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors" onClick={() => setServicesDropdownOpen(false)}>
                    <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
                    <span className="text-sm text-gray-700 hover:text-[#006795]">Sellers Inspections</span>
                  </Link>
                  <Link href="/inspection-services/rental" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors" onClick={() => setServicesDropdownOpen(false)}>
                    <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                    <span className="text-sm text-gray-700 hover:text-[#006795]">Rental Inspections</span>
                  </Link>
                  <Link href="/inspection-services/specialized" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors" onClick={() => setServicesDropdownOpen(false)}>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                    <span className="text-sm text-gray-700 hover:text-[#006795]">Specialized Services</span>
                  </Link>
                  <Link href="/inspection-services/commercial" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors" onClick={() => setServicesDropdownOpen(false)}>
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                    <span className="text-sm text-gray-700 hover:text-[#006795]">Commercial Inspections</span>
                  </Link>
                  <Link href="/inspection-services/public-housing" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors" onClick={() => setServicesDropdownOpen(false)}>
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                    <span className="text-sm text-gray-700 hover:text-[#006795]">Public Housing</span>
                  </Link>
                  <Link href="/inspection-services/insurance-risk" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors" onClick={() => setServicesDropdownOpen(false)}>
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                    <span className="text-sm text-gray-700 hover:text-[#006795]">Insurance Risk</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link href="/about" className="flex flex-col group items-center">
            <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight text-center">ABOUT</span>
            <span className="text-[10px] text-gray-500 italic tracking-wider text-center">Our Story</span>
          </Link>
          <Link href="/contact" className="flex flex-col group items-center">
            <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">CONTACT</span>
            <span className="text-[10px] text-gray-500 italic tracking-wider">Get in Touch</span>
          </Link>
          <Link href="/faq" className="flex flex-col group items-center">
            <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">EDUCATION &amp; TRAINING</span>
            <span className="text-[10px] text-gray-500 italic tracking-wider">NSPIRE Videos</span>
          </Link>
          <Link href="/blog" className="flex flex-col group items-center">
            <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">BLOG</span>
            <span className="text-[10px] text-gray-500 italic tracking-wider">Articles & Insights</span>
          </Link>
        </div>

        {/* Login/Register Button */}
        <Button
          onClick={() => router.push("/profile-selection")}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-4 md:px-5 py-2 text-xs md:text-sm font-medium flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="hidden sm:inline">Login/Register</span>
          <span className="sm:hidden">Login</span>
        </Button>
      </div>
    </nav>
  );
}
