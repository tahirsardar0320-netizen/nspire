"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="bg-white/95 border-b border-slate-200 px-4 md:px-6 py-2 md:py-3 sticky top-0 z-50 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between gap-3 md:gap-6">
          {/* Logo - Left Aligned */}
          <div className="flex-shrink-0 ml-2 md:ml-6">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="NSPIRE"
                width={160}
                height={44}
                priority
                className="h-12 md:h-16 w-auto"
              />
            </Link>
          </div>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-6">
            <Link href="/" className="flex flex-col group items-center">
                  <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                HOME
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                Welcome
              </span>
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link
                href="/service"
                className="flex flex-col group items-center cursor-pointer"
              >
                <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight flex items-center gap-1">
                  SERVICES{" "}
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      servicesDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
                <span className="text-[10px] text-gray-500 italic tracking-wider">
                  Professional Solutions
                </span>
              </Link>
              {servicesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[220px]">
                    <Link
                      href="/service"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        All Services
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/buyers"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0E7490]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Buyers Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/owners"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#F84B5F]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Owners Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/sellers"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Sellers Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/rental"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Rental Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/specialized"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Specialized Services
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/commercial"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Commercial Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/public-housing"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Public Housing
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/insurance-risk"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Insurance Risk
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/about" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight text-center">
                ABOUT
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider text-center">
                Our Story
              </span>
            </Link>
            <Link href="/contact" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                CONTACT
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                Get in Touch
              </span>
            </Link>
            <Link href="/faq" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                EDUCATION & TRAINING
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                NSPIRE Videos
              </span>
            </Link>
            <Link href="/blog" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight text-center">
                BLOGS
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                AI-Driven Property Inspection
              </span>
            </Link>
          </div>

          {/* Login/Register Button - Right Aligned (Desktop) */}
          <div className="hidden md:flex flex-shrink-0">
            <Button
              onClick={() => router.push("/profile-selection")}
              className="bg-primary hover:bg-[#0A5670] text-primary-foreground rounded-full px-4 md:px-5 py-2 text-xs md:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <svg
                className="w-3 h-3 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden sm:inline">Login/Register</span>
              <span className="sm:hidden">Login</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}

        {/* Mobile Menu Content */}
        <div
          className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex flex-col gap-6 p-8 pt-24">
            <Link
              href="/"
              className="flex flex-col group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                HOME
              </span>
              <span className="text-[11px] text-gray-500 italic tracking-wider">
                Welcome
              </span>
            </Link>
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex flex-col group w-full text-left"
              >
                <span className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight flex items-center gap-2">
                  SERVICES{" "}
                  <svg
                    className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">
                  Professional Solutions
                </span>
              </button>
              {mobileServicesOpen && (
                <div className="pl-4 pt-3 space-y-3">
                  <Link
                    href="/service"
                    className="block text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Service Details
                  </Link>
                  <Link
                    href="/inspection-services/buyers"
                    className="block text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Buyers Inspections
                  </Link>
                  <Link
                    href="/inspection-services/owners"
                    className="block text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Owners Inspections
                  </Link>
                  <Link
                    href="/inspection-services/sellers"
                    className="block text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sellers Inspections
                  </Link>
                  <Link
                    href="/inspection-services/specialized"
                    className="block text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Specialized Services
                  </Link>
                  <Link
                    href="/inspection-services/commercial"
                    className="block text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Commercial Inspections
                  </Link>
                  <Link
                    href="/inspection-services/public-housing"
                    className="block text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Public Housing
                  </Link>
                  <Link
                    href="/inspection-services/rental"
                    className="block text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Rental Inspections
                  </Link>
                  <Link
                    href="/inspection-services/insurance-risk"
                    className="block text-sm font-medium text-gray-600 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Insurance Risk
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/about"
              className="flex flex-col group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                ABOUT
              </span>
              <span className="text-[11px] text-gray-500 italic tracking-wider">
                Our Story
              </span>
            </Link>
            <Link
              href="/contact"
              className="flex flex-col group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                CONTACT
              </span>
              <span className="text-[11px] text-gray-500 italic tracking-wider">
                Get in Touch
              </span>
            </Link>
            <Link
              href="/faq"
              className="flex flex-col group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                EDUCATION & TRAINING
              </span>
              <span className="text-[11px] text-gray-500 italic tracking-wider">
                NSPIRE Videos
              </span>
            </Link>
            <Link
              href="/blog"
              className="flex flex-col group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                BLOGS
              </span>
              <span className="text-[11px] text-gray-500 italic tracking-wider">
                AI-Driven Property Inspection
              </span>
            </Link>

            {/* Mobile Login/Register Button */}
            <div className="mt-4 pt-6 border-t border-gray-200">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/profile-selection");
                }}
                className="w-full bg-primary hover:bg-[#0A5670] text-primary-foreground rounded-xl py-4 text-base font-bold flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Login / Register</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
