"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const sections = [
  {
    "title": "Comprehensive Public Housing Inspection Services USA",
    "content": "Our housing inspection services in the USA are designed to cover all aspects of public and multifamily housing compliance. Nspire conducts detailed inspections to ensure your property aligns with HUD, Section 8, and local housing authority regulations. We focus on habitability, safety, and code compliance, providing actionable recommendations to address deficiencies. By using a standardized Nspire framework, we support property managers in preparing for federal inspections, minimizing risks, and maintaining excellent REAC scores. Our team combines technical expertise with practical knowledge of multifamily housing operations to deliver accurate, reliable, and compliant inspection services."
  },
  {
    "title": "HUD Property Inspection Prep And Compliance",
    "content": "Nspire offers specialized HUD property inspection prep to streamline federal audits and REAC inspections. Our inspectors conduct pre-assessment evaluations, identifying gaps in compliance and correcting deficiencies before official HUD visits. We focus on safety, structural integrity, and regulatory adherence, providing a detailed report for property managers. With our guidance, properties achieve higher REAC scores and improved HUD compliance ratings. Our team ensures that all Section 8 housing, affordable housing, and federal properties are prepared for rigorous inspections, maintaining accountability, transparency, and resident safety while reducing the likelihood of penalties or non-compliance issues."
  },
  {
    "title": "Multifamily Property Compliance Inspections",
    "content": "Our multifamily property compliance inspections cover every element of apartment communities and residential complexes. Nspire ensures your property meets HUD and Nspire public housing inspection standards, addressing habitability, energy efficiency, and code adherence. Our team evaluates occupancy health, safety protocols, and documentation accuracy for PHAs. These inspections not only improve compliance but also enhance tenant satisfaction and property reputation. From common areas to individual units, we provide thorough assessments, detailed reports, and practical recommendations, helping housing authorities and property managers maintain federal compliance, minimize risk, and ensure that multifamily communities are safe, healthy, and well-maintained for all residents."
  },
  {
    "title": "Public Housing Compliance Inspection Services USA",
    "content": "We provide property compliance inspection services in the USA for public housing authorities and private operators. Nspire’s inspection services focus on HUD/REAC readiness, Section 8 compliance, and multifamily safety evaluations. Our team identifies deficiencies in building structure, fire safety, environmental hazards, and occupancy health. By offering detailed reporting, remediation guidance, and scoring improvement strategies, we ensure properties meet or exceed federal standards. Our inspectors are experienced in federal and state regulations, Nspire compliance, and local housing codes, providing reliable insights for property owners and managers seeking to improve public housing quality, efficiency, and safety across the nation."
  },
  {
    "title": "Federal Property Inspection Services And HUD IInspire",
    "content": "Nspire delivers federal property inspection services for HUD, Section 8, and other government-managed housing. Our Nspire inspections assess habitability, energy standards, and environmental safety, helping property managers prepare for federal evaluations. We also conduct REAC inspections and provide score improvement support to enhance compliance ratings. Nspire ensures that public housing authorities meet regulatory expectations, minimize risks, and address deficiencies proactively. Our structured inspections follow federal guidelines, emphasizing documentation accuracy, risk assessment, and actionable reporting, offering comprehensive solutions that strengthen operational efficiency, occupant safety, and federal compliance in affordable housing communities across the USA."
  },
  {
    "title": "HUD REAC Inspection Preparation And Support",
    "content": "Our HUD REAC inspection services help property managers navigate the complex federal inspection process. Nspire offers comprehensive REAC inspection prep services, including pre-assessment evaluations, risk identification, and compliance gap analysis. We provide detailed documentation, training for staff, and practical guidance to ensure readiness for official HUD inspections. Our team focuses on Section 8, multifamily housing, and public housing compliance, helping communities achieve higher REAC scores. With Nspire, property managers can proactively manage deficiencies, maintain regulatory adherence, and protect residents’ well-being while strengthening relationships with housing authorities through meticulous preparation, transparent reporting, and consistent compliance improvement."
  },
  {
    "title": "Apartment Community Safety And Compliance Inspections",
    "content": "Nspire conducts apartment community compliance inspection services to maintain tenant safety, habitability, and federal code adherence. Our inspections cover fire safety, structural integrity, environmental hazards, and operational efficiency. We assess energy and health standards while documenting any deficiencies for PHAs. These inspections are designed to prepare communities for HUD/REAC and Nspire evaluations, providing actionable recommendations for remediation and improvement. By partnering with Nspire, property managers ensure federal compliance, enhance resident satisfaction, and reduce liability risks. Our expertise in affordable housing and multifamily communities enables properties to maintain optimal safety, efficiency, and regulatory alignment across all apartment units and shared spaces."
  },
  {
    "title": "Nspire Public Housing Inspection And Standards",
    "content": "Our Nspire public housing inspection services are tailored for compliance with HUD regulations and federal housing standards. We assess habitability, safety, and code adherence in multifamily and public housing projects. Nspire helps property managers implement improvements, streamline reporting, and ensure consistent compliance with Nspire and REAC guidelines. By evaluating energy efficiency, occupancy health, and documentation accuracy, we provide actionable insights to enhance federal inspection readiness. Our inspections support PHAs in achieving higher HUD scores, improving resident satisfaction, and maintaining long-term operational efficiency. Nspire ensures public housing authorities and property owners uphold quality, safety, and regulatory compliance."
  },
  {
    "title": "Documentation And Risk Management For Public Housing Authorities",
    "content": "Nspire offers documentation for public housing authorities (PHAs) to streamline inspection reporting, compliance tracking, and deficiency remediation. Our services include HUD inspection preparation, Nspire compliance verification, and REAC scoring improvement strategies. We provide comprehensive reports detailing risk areas, safety hazards, and occupancy issues, enabling housing authorities to make informed decisions. Nspire’s experts assist in regulatory interpretation, code compliance, and operational optimization, ensuring that public housing units meet federal standards. By offering clear documentation and structured guidance, we support PHAs in maintaining safe, habitable, and compliant housing, minimizing risk, and enhancing the effectiveness of multifamily property management across the USA."
  },
  {
    "title": "REAC Score Improvement And HUD Nspire Compliance",
    "content": "Nspire’s HUD REAC score improvement services focus on elevating property compliance ratings through pre-inspection assessments and targeted remediation. We analyze deficiencies in habitability, safety, and energy compliance, providing actionable solutions to enhance federal inspection results. Our team supports Nspire and HUD compliance inspections, ensuring properties meet public housing standards and Section 8 requirements. By identifying risks, documenting improvements, and guiding property managers, Nspire improves overall federal inspection readiness. These services are essential for public housing authorities seeking to maximize REAC scores, protect resident well-being, and maintain federal compliance efficiently across multifamily and affordable housing properties nationwide."
  }
];

export default function PublicHousingClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        <section className="relative bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 opacity-15"><Image src="/candid_public_housing.png" alt="" fill className="object-cover" /></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#6D28D9] via-[#6D28D9]/60 to-transparent"></div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <p className="text-[#8B5CF6] font-bold uppercase tracking-[0.2em] mb-6">Government Housing Compliance</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
              Public Housing Inspection <span className="italic font-medium">Services</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              NSPIREinspection.AI provides professional Public and affordable Housing Inspection nationwide, helping housing authorities, property managers, and multifamily communities maintain federal compliance and safe living conditions. Our team specializes in Real Estate Assessment inspection, ensuring every property meets federal housing standards, requirements, and energy and safety regulations. From apartment communities to large public or affordable housing developments, Nspire ensures compliance inspections are thorough, timely, and precise. We focus on identifying deficiencies, supporting risk management, and improving HUD REAC scores, providing a comprehensive solution for all public housing inspection needs while streamlining documentation and reporting for PHAs.
            </p>
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="text-center mb-16"><p className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest mb-4">Federal Compliance</p><h2 className="text-3xl md:text-4xl font-bold text-black">Comprehensive Services</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center gap-4 mb-6"><span className="w-12 h-12 rounded-2xl bg-[#F5F3FF] flex items-center justify-center text-[#8B5CF6] font-bold text-lg">{String(i + 1).padStart(2, '0')}</span><h3 className="text-xl font-bold text-black group-hover:text-[#8B5CF6] transition-colors">{s.title}</h3></div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-black py-20 px-4 text-center"><h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ensure Federal Compliance</h2><p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Schedule a HUD/REAC preparation inspection and improve your compliance scores today.</p><Button onClick={() => router.push("/contact")} className="bg-[#8B5CF6] hover:bg-[#6D28D9] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Get REAC Ready</Button></section>
      </div>
    </MainLayout>
  );
}
