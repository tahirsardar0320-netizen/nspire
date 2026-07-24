"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const sections = [
  {
    "title": "Comprehensive Property Risk Assessment Services to Identify Structural, Electrical, and Liability Hazards",
    "content": "Our Property Risk Assessment services provide a detailed evaluation of residential and commercial properties to identify potential threats to safety and insurance coverage. This includes foundation inspections, electrical systems audits, and structural integrity reviews. By assessing properties comprehensively, we help clients understand exposure to risks such as fire, water damage, and natural hazards. Our team creates detailed reports with actionable recommendations for mitigation, ensuring properties comply with insurance policies and legal requirements. Whether for new acquisitions, multi-unit complexes, or corporate facilities, Nspire’s assessment services enhance decision-making, reduce liability, and optimize insurance premiums while maintaining maximum safety standards."
  },
  {
    "title": "Professional Hazard & Liability Review Services to Minimize Insurance Exposure",
    "content": "Our Hazard & Liability Review services are designed to identify all potential risks that could result in insurance claims or legal liability. We evaluate structural stability, electrical compliance, fire hazards, and environmental threats across residential and commercial properties. Nspire’s risk specialists provide precise documentation of vulnerabilities and actionable strategies for risk mitigation. These reviews help businesses and property owners maintain full compliance with insurance standards, avoid costly claims, and reduce operational exposure. By offering professional liability assessments, hazard reviews, and risk exposure analysis, we enable clients to implement targeted risk management strategies for maximum financial and safety protection."
  },
  {
    "title": "Multi-Unit Insurance Inspection Services to Safeguard Residential and Commercial Properties",
    "content": "Our Multi-Unit Insurance Inspection services focus on assessing properties such as apartments, condominiums, and commercial complexes to ensure insurance compliance and structural safety. Nspire evaluates each unit’s foundation, electrical systems, fire safety, and potential hazards that may affect insurance coverage. This inspection process provides a comprehensive risk analysis, highlighting vulnerabilities and recommending mitigation strategies. By conducting detailed property audits, we help insurance providers, property managers, and business owners reduce liability risks, prevent claims, and optimize insurance policies. Our team ensures multi-unit properties comply with national insurance standards, enhancing safety, financial stability, and long-term operational efficiency."
  },
  {
    "title": "Expert Commercial Insurance Inspection Services for Corporate Risk Management",
    "content": "Nspire’s Commercial Insurance Inspection services deliver a thorough evaluation of businesses and corporate facilities, addressing property, liability, and operational risks. We conduct structural risk assessments, electrical audits, fire safety reviews, and compliance checks to prevent potential insurance issues. These inspections support corporate insurance risk management by identifying gaps in coverage and implementing risk reduction strategies. Our reports provide actionable insights into risk exposure, ensuring businesses remain compliant with federal and state insurance regulations. By integrating advanced risk assessment tools and professional consulting, Nspire empowers organizations to mitigate hazards, reduce insurance costs, and safeguard assets from unforeseen liabilities."
  },
  {
    "title": "Fire & Safety Risk Reporting Services to Prevent Losses and Insurance Claims",
    "content": "Our Fire & Safety Risk Reporting services assess the potential hazards associated with fire, electrical systems, and operational safety across residential and commercial properties. We evaluate compliance with national fire codes, identify unsafe conditions, and recommend actionable mitigation strategies. By implementing these reports, property owners and businesses can proactively reduce insurance claims, maintain regulatory compliance, and ensure occupant safety. Nspire’s risk specialists also provide detailed documentation for insurance providers, enabling faster claims processing and evidence-based risk management. These services are essential for high-risk commercial spaces, multi-unit residences, and corporate offices seeking to optimize safety and reduce exposure to financial and legal liabilities."
  },
  {
    "title": "Environmental Risk Analysis and Compliance Services to Safeguard Your Assets",
    "content": "Our Environmental Risk Analysis services help clients identify hazards related to pollution, mold, air quality, and chemical exposure that may impact insurance coverage or property value. Nspire conducts thorough inspections and provides actionable recommendations to mitigate environmental risks. This includes compliance checks for federal and state regulations, insurance risk evaluations, and preventive strategies to reduce liability. Environmental audits are critical for commercial properties, residential complexes, and enterprise facilities to maintain operational safety and avoid insurance disputes. By integrating environmental risk management with our property assessment and insurance consulting services, Nspire ensures comprehensive protection for your assets, people, and investments."
  },
  {
    "title": "Foundation, Electrical, and Structural Risk Review Services for Residential and Commercial Properties",
    "content": "Nspire’s Foundation, Electrical, and Structural Risk Review services provide an in-depth assessment of the critical components of properties, including foundations, electrical wiring, and structural frameworks. These inspections evaluate risks such as foundation settlement, electrical malfunctions, and structural weaknesses that may result in insurance claims or property damage. Our reports include a detailed analysis of potential vulnerabilities, recommended mitigations, and compliance verification with insurance policies. Property owners, businesses, and corporate clients benefit from this proactive risk management approach, which reduces liability exposure, enhances safety, and ensures property resilience. These reviews are essential for maintaining long-term property integrity and financial security."
  },
  {
    "title": "Insurance Claim Prevention Report Services to Minimize Risk Exposure",
    "content": "Nspire’s Insurance Claim Prevention Report services aim to proactively identify potential causes of insurance claims before they occur. These reports evaluate residential and commercial properties for structural, electrical, fire, and liability risks, providing actionable recommendations for risk mitigation. By implementing preventive strategies, businesses and homeowners can reduce the likelihood of claims, ensure compliance with insurance policies, and maintain safe environments. Our reports also enhance insurance negotiations by documenting proactive risk management measures. With Nspire’s expertise in risk assessment, liability reduction, and compliance monitoring, clients gain comprehensive insight into property vulnerabilities, enabling smarter decision-making and increased protection against financial losses."
  },
  {
    "title": "Pre-Coverage Inspection Services for Insurance Risk Evaluation and Compliance",
    "content": "Our Pre-Coverage Inspection services are designed to evaluate properties before insurance coverage is initiated, ensuring all structural, electrical, and safety standards are met. Nspire conducts thorough audits of residential, commercial, and enterprise properties, highlighting risk factors that could affect insurance eligibility or premiums. These inspections include foundation reviews, fire safety evaluations, hazard identification, and compliance verification. By addressing potential issues before coverage begins, clients reduce exposure to claims, improve insurance terms, and strengthen risk management strategies. Nspire’s proactive inspections ensure peace of mind for property owners and insurance providers, creating a secure foundation for long-term asset protection and liability reduction."
  },
  {
    "title": "Annual Insurance Compliance Check Services to Maintain Regulatory and Policy Adherence",
    "content": "Our Annual Insurance Compliance Check services ensure that residential, commercial, and corporate properties consistently adhere to insurance regulations, safety standards, and liability requirements. Nspire conducts yearly audits, evaluating property risk exposure, structural safety, fire hazards, and electrical systems. These checks identify gaps in compliance, recommend mitigation strategies, and provide documented verification for insurance providers. By maintaining ongoing compliance, businesses and homeowners minimize risk exposure, prevent policy violations, and optimize insurance premiums. Our annual services support continuous improvement in risk management practices, ensuring properties remain protected, policies remain valid, and insurance claims are minimized through proactive, professional oversight."
  }
];

export default function InsuranceRiskClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-[#DC2626] to-[#991B1B] py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 opacity-15"><Image src="/blog-roof.png" alt="" fill className="object-cover" /></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#991B1B] via-[#991B1B]/60 to-transparent"></div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Protect Your Assets</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
              Insurance Risk Management <span className="italic font-medium">Services</span>
            </h1>
            <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">
              At NSPIREinspection.AI, we provide comprehensive Insurance Risk Management Services nationwide, designed to protect residential, commercial, and enterprise properties from potential hazards, structural risks, and insurance liabilities. Our expert team combines advanced inspection techniques, risk assessment methodologies, and compliance audits to ensure your property and business remain secure. We focus on proactive risk mitigation, evaluating property structures, electrical systems, and liability exposures while aligning with insurance requirements. By integrating both traditional and AI-driven analysis, Nspire helps businesses and homeowners anticipate risks, reduce premiums, and prevent claims, ensuring peace of mind through strategic risk management solutions.
            </p>
          </div>
        </section>

        {/* Service Sections */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-[#DC2626] uppercase tracking-widest mb-4">Risk Mitigation</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Comprehensive Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-12 h-12 rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] font-bold text-lg">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-xl font-bold text-black group-hover:text-[#DC2626] transition-colors">{s.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black py-20 px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Reduce Risk, Reduce Premiums</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Schedule a comprehensive risk assessment and protect your property investments today.</p>
          <Button onClick={() => router.push("/contact")} size="lg" className="bg-[#DC2626] hover:bg-[#991B1B] hover:scale-105 transition-all">Get a Risk Assessment</Button>
        </section>
      </div>
    </MainLayout>
  );
}
