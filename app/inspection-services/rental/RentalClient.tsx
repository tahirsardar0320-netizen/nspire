"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const sections = [
  {
    "title": "Comprehensive Move-In Inspection Services for Rental Properties",
    "content": "Our Move-In Inspection services provide landlords with a detailed assessment of the property before tenants occupy it. By documenting the property’s condition, including walls, appliances, flooring, and fixtures, we prevent disputes regarding damages at the end of the lease. Our team uses standardized tenant property inspection forms, creates accurate tenant documentation, and records everything digitally in Nspire Rental Compliance systems. This preemptive measure ensures tenants are fully informed, landlords are legally protected, and multi-unit rental properties maintain consistency in quality. Nspire’s move-in inspections also help establish clear rental agreement documents to avoid confusion or legal conflicts during tenancy."
  },
  {
    "title": "Tenant Damage Assessment and Documentation Services",
    "content": "Nspire specializes in Tenant Damage Assessment Inspections, ensuring landlords have a clear record of property condition and any damages caused by tenants. Our process includes visual inspections, photography documentation, and comprehensive reports for tenant damage reports. We provide a tenant record-keeping system to track damages, maintenance requests, and repairs. By combining inspections with landlord forms USA, property owners can confidently manage disputes or insurance claims. Whether it’s a single-unit rental or multi-unit building, Nspire’s damage assessment services are essential for rental property compliance, risk reduction, and long-term tenant satisfaction."
  },
  {
    "title": "Annual Rental Safety Inspection Services for Compliance",
    "content": "Annual inspections are critical for rental property safety, habitability, and regulatory compliance. Nspire conducts thorough Annual Rental Safety Inspections to identify fire hazards, plumbing issues, electrical problems, and other risks. Our inspection reports help landlords comply with local, state, and federal regulations, while improving tenant satisfaction and property longevity. We integrate findings into Nspire Rental Management systems for easy tracking and ongoing compliance. By performing annual inspections, property owners can mitigate potential risks, protect tenants, and ensure multi-unit buildings meet all habitability standards, creating safer environments and reducing costly repairs or liabilities."
  },
  {
    "title": "Pre-Rental Inspection Services for Multi-Unit Buildings",
    "content": "Before renting out units, Nspire provides pre-rental property inspections for single-family and multi-unit buildings. Our team inspects structural elements, mechanical systems, and safety features to ensure units are ready for occupancy. Detailed property inspection reports for rentals are generated to support landlord–tenant documentation packages, including lease addenda and rental agreement documents. These inspections prevent post-move-in disputes, maintain property standards, and establish trust with tenants. Whether it’s a residential complex, apartment building, or commercial rental, Nspire’s pre-rental inspections ensure compliance with multi-family rental inspection standards and provide landlords with actionable, data-driven insights."
  },
  {
    "title": "Move-Out Inspections to Protect Landlord Investments",
    "content": "Nspire’s Move-Out Inspection services are designed to accurately assess property conditions after tenancy ends. Our team evaluates tenant-caused damage, documents wear and tear, and generates comprehensive tenant damage inspection services reports. These records support security deposit deductions, repairs, and insurance claims. By using Nspire Compliance Software, landlords maintain tenant property inspection logs, track trends, and improve property management practices. Multi-unit rental inspections are streamlined to reduce downtime between tenants while ensuring rental property condition inspection standards are met. Nspire’s move-out inspections protect landlord investments, reduce disputes, and provide a transparent, defensible record of property conditions."
  },
  {
    "title": "Habitability Standards Review and Risk Assessment",
    "content": "Ensuring rental properties meet habitability standards is critical for legal compliance and tenant safety. Nspire performs detailed Rental Risk Assessments covering fire safety, plumbing, structural integrity, HVAC systems, and environmental hazards. Our inspections include occupancy and health safety checks to identify hazards before they escalate. Landlords receive a full report with recommended repairs, documentation for compliance, and support for HUD/REAC pre-audit evaluations. With these services, property owners maintain safe, compliant rentals while avoiding fines, lawsuits, or tenant complaints. Our structured approach ensures multi-unit properties adhere to local codes, protecting both landlord and tenant interests."
  },
  {
    "title": "Multi-Unit Rental Property Inspection and Maintenance Services",
    "content": "Managing multi-unit properties requires detailed inspections to ensure safety and consistent maintenance. Nspire’s Multi-Unit Property Maintenance Inspections cover electrical systems, plumbing, roofing, and common areas. We create detailed rental inspection service reports, including recommendations for repairs, preventative maintenance, and safety improvements. With Nspire Rental Compliance integration, landlords can track maintenance schedules, tenant complaints, and compliance data efficiently. Whether for apartment complexes, commercial rentals, or mixed-use buildings, our inspections reduce liability, prevent structural damage, and enhance tenant satisfaction. Nspire’s multi-unit rental inspection services provide a proactive approach to rental property management, ensuring properties remain profitable and compliant."
  },
  {
    "title": "Nspire Rental Compliance and Documentation Packages",
    "content": "Nspire provides a complete Nspire Rental Compliance system, offering landlords and property managers all necessary documentation tools. Our packages include tenant move-in and move-out forms, rental property documentation, and annual safety inspection logs. This centralized system simplifies landlord–tenant documentation, supports insurance claims, and ensures regulatory compliance. By using Nspire Compliance Software, property owners reduce administrative burdens, maintain detailed records, and ensure rental compliance Nspire standards are met. For multi-family and commercial rental properties, our compliance packages streamline operations, improve tenant relations, and provide transparent, data-driven oversight for every aspect of property management."
  },
  {
    "title": "Specialized Commercial and Residential Rental Inspections",
    "content": "Nspire’s Commercial Rental Inspection Services cater to office buildings, retail spaces, and mixed-use properties. We assess structural integrity, safety systems, and occupancy compliance while producing actionable reports for property inspection for rentals. Our residential services cover residential move-in inspections, apartment building inspection services, and rental home inspection services, including pre-move-in and move-out evaluations. By combining tenant move-in home inspections with annual rental safety inspections, landlords receive a complete overview of property conditions. Nspire’s specialized inspections ensure multi-unit and single-family properties maintain safety, comply with regulations, and provide tenants with habitable, well-documented living spaces."
  },
  {
    "title": "Rental Property Damage Inspection and Risk Management",
    "content": "Nspire provides expert Rental Property Damage Inspections, helping landlords identify tenant-related damages, environmental hazards, and maintenance concerns. We create comprehensive tenant damage reports, record findings digitally, and integrate the data into Nspire Compliance Software for ongoing property management. Our services also include rental risk assessments and support for HUD/REAC pre-audit compliance, ensuring both commercial and residential rental properties meet safety standards. With Nspire, landlords have access to a detailed, defensible record of property conditions, enabling informed decisions on repairs, tenant disputes, and insurance claims. These inspections improve tenant satisfaction and protect property investments long-term."
  }
];

export default function RentalClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-[#10B981] to-[#059669] py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 opacity-20"><Image src="/hero.png" alt="" fill className="object-cover" /></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#059669] via-[#059669]/60 to-transparent"></div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Safety, Compliance & Satisfaction</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
              Rental Property Inspection <span className="italic font-medium">Services</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              NSPIREinspection..AI offers comprehensive Rental Property Inspection Services nationwide, designed to assist landlords, property managers, and tenants in maintaining safe, habitable, and compliant rental properties. Our services focus on every stage of the rental lifecycle, including move-in, move-out, and annual inspections. Using advanced tools and Nspire Compliance Software, we provide detailed tenant documentation, tenant damage reports, and multi-unit inspection reports. Our goal is to protect landlords from liability, ensure tenant safety, and maintain property standards. From commercial rental inspections to multi-family units, Napier’s inspection services ensure legal compliance, proper record keeping, and long-term property value retention.
            </p>
          </div>
        </section>

        {/* Service Sections */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-4">Complete Rental Solutions</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Comprehensive Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-12 h-12 rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981] font-bold text-lg">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-xl font-bold text-black group-hover:text-[#10B981] transition-colors">{s.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black py-20 px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Protect Your Rental Investment</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Schedule a comprehensive rental property inspection and ensure compliance, safety, and tenant satisfaction.</p>
          <Button onClick={() => router.push("/contact")} className="bg-[#10B981] hover:bg-[#059669] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Schedule Inspection</Button>
        </section>
      </div>
    </MainLayout>
  );
}
