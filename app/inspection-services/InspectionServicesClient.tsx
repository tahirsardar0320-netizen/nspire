"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const serviceCategories = [
  {
    title: "Public Housing Inspection",
    subtitle: "Compliance & Standards",
    description: "REAC/NSPIRE standard compliance inspections, physical needs assessments, ADA accessibility, and quality assurance program reviews.",
    href: "/inspection-services/public-housing",
    items: ["REAC/NSPIRE Compliance", "Physical Needs Assessment (PNA)", "UFAS/ADA Accessibility", "Quality Assurance Reviews"],
    color: "#8B5CF6",
    accent: "#F5F3FF"
  },
  {
    title: "Affordable Housing Inspection",
    subtitle: "LIHTC, Section 8 & Multi-Family",
    description: "NSPIRE-aligned inspections for LIHTC and Section 8 properties, physical condition assessments, and HUD/REAC-ready compliance documentation.",
    href: "/inspection-services/affordable-housing",
    items: ["LIHTC Compliance", "Section 8 Unit Inspections", "Physical Condition Assessments", "Capital Needs Planning"],
    color: "#0F9D58",
    accent: "#ECFDF5"
  },
  {
    title: "Owner Inspection",
    subtitle: "Maintain & Protect Your Investment",
    description: "Annual property inspections, pre-listing evaluations, property condition assessments, and maintenance surveys for current owners.",
    href: "/inspection-services/owners",
    items: ["Annual Owner Property Inspection", "Pre-Listing Home Inspection", "Property Condition Evaluation", "Homeowner Maintenance Survey", "Tenant Safety Review"],
    color: "#F84B5F",
    accent: "#FEF2F2"
  },
  {
    title: "Risk Management Inspection",
    subtitle: "Protect Your Assets",
    description: "Property risk assessment, hazard and liability review, fire and safety risk reporting, environmental risk analysis, and insurance claim prevention.",
    href: "/inspection-services/insurance-risk",
    items: ["Property Risk Assessment", "Hazard & Liability Review", "Fire & Safety Reporting", "Environmental Risk Analysis", "Claim Prevention", "Annual Compliance Checks"],
    color: "#DC2626",
    accent: "#FEF2F2"
  }
];

export default function InspectionServicesClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* Hero */}
        <section className="bg-[#E8F4F8] py-20 md:py-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F84B5F] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6">
            <p className="text-[#006795] font-bold uppercase tracking-[0.2em] mb-6">Nationwide Solutions</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-[1.1]">
              Inspection <span className="text-[#F84B5F] italic font-medium">Services</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              NSPIREinspectiom.AI provides professional Inspection Services nationwide, delivering end-to-end solutions for public housing authorities, affordable housing communities, property owners, and risk management teams.
            </p>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mt-4">
              From single-family homes to multi-unit commercial buildings, Nspire combines structural, mechanical, electrical, and safety evaluations into a single trusted framework. We support purchase decisions, risk management, compliance verification, and long-term asset planning through data-driven inspections.
            </p>
          </div>
        </section>

        {/* Service Categories */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-32 space-y-16">
          {serviceCategories.map((cat, idx) => (
            <Link key={cat.title} href={cat.href} className="group block">
              <div className={`flex flex-col ${idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}>
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: cat.color }}>{cat.subtitle}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-black group-hover:text-[#006795] transition-colors">{cat.title}</h2>
                  <p className="text-gray-500 text-lg leading-relaxed">{cat.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <span key={item} className="text-xs font-medium px-4 py-2 rounded-full border" style={{ borderColor: cat.color + "40", color: cat.color, backgroundColor: cat.accent }}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all pt-4" style={{ color: cat.color }}>
                    Learn More
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>

                {/* Visual */}
                <div className="flex-shrink-0 w-full lg:w-[300px] h-[200px] lg:h-[300px] rounded-[32px] flex items-center justify-center" style={{ backgroundColor: cat.accent }}>
                  <div className="text-6xl font-extrabold opacity-20" style={{ color: cat.color }}>0{idx + 1}</div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* CTA */}
        <section className="bg-[#006795] py-20 md:py-28 px-4 md:px-6 text-center relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Not Sure Which Service You Need?</h2>
            <p className="text-white/70 text-lg mb-10">Contact our team for a free consultation and we'll recommend the right inspection package for your property.</p>
            <Button onClick={() => router.push("/contact")} variant="secondary" size="lg" className="hover:scale-105 transition-all">
              Get a Free Consultation
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
