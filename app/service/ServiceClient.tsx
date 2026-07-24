"use client";


import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";

const services = [
  {
    title: "Buyer Inspection Services",
    subtitle: "Informed Property Decisions",
    description: "Nspire's Buyer Inspection Services support confident purchasing decisions for residential, multi-family, commercial, and public housing properties across the USA. Our inspections include multi-unit buyer inspection, single-family home buyer inspection, condominium and townhome buyer inspection, and commercial property pre-purchase evaluation. We conduct comprehensive property condition assessments for buyers, covering structural, mechanical, and electrical review while identifying hazards and compliance risks. Each buyer inspection includes Nspire buyer safety compliance checks, repair and maintenance cost estimation, and buyer decision support reports.",
    moreText: "Buyer Risk Analysis, Compliance, and Negotiation Support: Our buyer-focused inspections emphasize hazard and risk identification, safety compliance, and financial clarity. Nspire delivers buyer decision support reports that highlight structural deficiencies, system failures, and safety concerns affecting value and insurability.",
    image: "/family_housing_complex.png",
    color: "bg-blue-50",
    href: "/inspection-services/buyers"
  },
  {
    title: "Owner Inspection Services",
    subtitle: "Asset Protection and Longevity",
    description: "Nspire's Owner Inspection Services help property owners maintain asset value, ensure compliance, and plan preventive maintenance. Our annual owner property inspection, multi-unit owner inspection, and building health and maintenance evaluation identify issues before they escalate. We perform property condition assessments (PCA), insurance risk checks for owners, and tenant safety and habitability reviews.",
    moreText: "Preventive Maintenance and Owner Compliance Reporting: Our owner inspections focus on actionable intelligence, including pre-renovation inspections and owner repair priority reports. Nspire evaluates structural integrity, MEP systems, and safety features to identify early-stage deterioration.",
    image: "/multiunit_residence.png",
    color: "bg-red-50",
    href: "/inspection-services/owners"
  },
  {
    title: "Seller Inspection Services",
    subtitle: "Maximize Marketability",
    description: "Nspire's Seller Inspection Services prepare properties for listing with transparency and confidence. Our pre-listing inspection, multi-unit seller inspection, and property readiness evaluation identify major and minor defects before marketing. We provide HUD/REAC pre-sale support, repair and upgrade recommendations, and pricing advantage inspection reports. Marketability enhancement reviews focus on safety, compliance, and presentation factors that influence buyer perception.",
    moreText: "Seller Transparency and Pricing Advantage Reports: Seller inspections include detailed seller transparency reports designed to minimize post-offer disputes. Nspire documents defects, compliance gaps, and improvement opportunities with clear prioritization.",
    image: "/candid_street.png",
    color: "bg-orange-50",
    href: "/inspection-services/sellers"
  },
  {
    title: "Rental Property Inspection",
    subtitle: "Compliance and Safety",
    description: "Nspire delivers comprehensive rental property inspection services, including move-in inspection, move-out inspection, annual rental safety inspection, and habitability standards review. We assess tenant damage, occupancy health and safety, and multi-unit rental inspection requirements. Nspire rental compliance and HUD/REAC pre-audit support ensure landlords meet federal and local housing standards.",
    moreText: "Rental Risk Management and Documentation Support: Our rental inspections focus on risk mitigation and regulatory readiness. Nspire evaluates life-safety systems, habitability conditions, and compliance gaps that impact leasing and audits.",
    image: "/plaza_shops.png",
    color: "bg-green-50",
    href: "/inspection-services/rental"
  },
  {
    title: "Commercial Building Inspection",
    subtitle: "Nationwide Services",
    description: "Nspire provides commercial building inspection services for multi-unit commercial facilities, industrial properties, office buildings, retail spaces, warehouses, and shopping centers. Our inspections include construction quality assessment, safety and code compliance, fire and life safety checks, and roof, HVAC, electrical, and plumbing analysis.",
    moreText: "Commercial Compliance, Systems, and Structural Evaluation: Commercial inspections emphasize operational continuity and regulatory alignment. Nspire identifies deficiencies affecting safety, insurability, and asset performance. Our reporting supports capital planning, compliance remediation, and insurance coordination.",
    image: "/candid_commercial_building.png",
    color: "bg-yellow-50",
    href: "/inspection-services/commercial"
  },
  {
    title: "Public Housing Inspection",
    subtitle: "HUD/REAC Support",
    description: "Nspire specializes in public housing inspection services aligned with Nspire standards. We provide HUD/REAC inspection preparation, multi-family housing inspection, apartment community compliance, and federal housing standards review. Our habitability and safety evaluations, energy and environmental standards checks, and occupancy health inspections support REAC scoring improvement and regulatory readiness for public housing authorities (PHAs).",
    moreText: "Public Housing Risk, Compliance, and Documentation: Our public housing inspections deliver risk and deficiency reporting with clear remediation guidance. Nspire supports PHAs with documentation, compliance verification, and audit preparation.",
    image: "/candid_public_housing.png",
    color: "bg-purple-50",
    href: "/inspection-services/public-housing"
  },
  {
    title: "Insurance Risk Management",
    subtitle: "Property Risk Assessment",
    description: "Nspire's insurance risk management inspections address property risk assessment, hazard and liability review, and multi-unit insurance inspection requirements. We conduct commercial insurance inspections, fire and safety risk reporting, and environmental risk analysis. Our foundation, electrical, and structural risk reviews support insurance claim prevention and pre-coverage inspection needs.",
    moreText: "Insurance Compliance and Claim Prevention Reporting: Insurance-focused inspections emphasize loss prevention and underwriting readiness. Nspire provides annual insurance compliance checks and actionable recommendations to reduce exposure.",
    image: "/insurance_risk_mgmt.png",
    color: "bg-teal-50",
    href: "/inspection-services/insurance-risk"
  }
];

const processSteps = [
  { num: "Step 1", title: "Schedule Inspection", desc: "Clients book inspections online or by phone, choosing a convenient date and property type for comprehensive evaluation." },
  { num: "Step 2", title: "On-Site Evaluation", desc: "Certified inspectors perform thorough on-site assessments of structural, mechanical, electrical, and safety systems for accurate property analysis." },
  { num: "Step 3", title: "Compliance & Risk Review", desc: "Inspection results are reviewed against Nspire, HUD, REAC, and local codes to identify hazards, code violations, and compliance risks." },
  { num: "Step 4", title: "Digital Report Delivery", desc: "Clients receive detailed digital reports with photos, risk assessments, repair estimates, and actionable insights for informed property decisions." },
  { num: "Step 5", title: "Post-Inspection Support", desc: "Our team provides follow-up guidance, clarifies findings, and advises on repairs, preventive measures, or negotiation strategies." }
];

export default function ServiceClient() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1 w-full">
          {/* Hero Section */}
          <section className="bg-[#E8F4F8] py-20 md:py-32 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F84B5F] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
              <p className="text-[#006795] font-bold uppercase tracking-[0.2em] mb-6">Nationwide Solutions</p>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-8 leading-[1.1]">
                Inspection <span className="text-[#F84B5F] italic font-medium">Services</span> in USA
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
                Nspire provides professional Inspection Services across the USA, delivering end-to-end solutions for buyers, owners, sellers, landlords, investors, and public housing authorities.
              </p>
              <div className="bg-white/60 p-6 rounded-2xl backdrop-blur-sm mx-auto max-w-3xl border border-white/20 shadow-sm">
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  From single-family homes to multi-unit commercial buildings, Nspire combines structural, mechanical, electrical, and safety evaluations under one trusted framework. We support purchase decisions, risk management, compliance verification, and long-term asset planning through data-driven inspections.
                </p>
              </div>
            </div>
          </section>

        {/* Services Grid Section */}
        <section className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Professional Inspection Solutions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive, transparent, and accurate evaluations tailored for every stage of property ownership and investment.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full">
                  <div className="h-64 sm:h-72 w-full relative">
                    <Image 
                      src={service.image} 
                      alt={service.title} 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <Link href={service.href || "#"}>
                        <h3 className="text-2xl font-bold text-white mb-2 hover:text-[#F84B5F] transition-colors cursor-pointer">{service.title}</h3>
                      </Link>
                      <p className="text-white/90 font-medium">{service.subtitle}</p>
                    </div>
                  </div>
                  <div className={`p-8 flex-1 ${service.color}`}>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="bg-white/60 p-5 rounded-2xl border border-white/80">
                      <p className="text-gray-800 text-sm leading-relaxed font-medium">
                        {service.moreText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Nspire Inspection Process</h2>
              <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our inspection process is designed for clarity, efficiency, and compliance, ensuring every client receives accurate, actionable insights. Nspire’s step-by-step workflow minimizes risk, maximizes property understanding, and supports informed decision-making for buyers, owners, sellers, landlords, and commercial operators nationwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {processSteps.map((step, index) => (
                <div key={index} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center hover:bg-[#006795] hover:text-white transition-colors group">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#006795] group-hover:text-[#006795] font-bold text-xl">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 group-hover:text-blue-100 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


      </main>
    </div>
  </MainLayout>
);
}
