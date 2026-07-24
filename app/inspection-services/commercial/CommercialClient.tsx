"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const sections = [
  {
    "title": "Expert Construction Quality Assessment for Commercial and Industrial Buildings",
    "content": "Ensuring that construction meets industry standards is vital for any commercial property. Nspire’s construction quality assessment services cover detailed inspections of new and existing buildings, evaluating structural integrity, material quality, and workmanship. Our team identifies potential hazards, structural weaknesses, or non-compliance issues early, saving clients from expensive repairs and legal liabilities. From office buildings to warehouses and retail centers, we provide actionable insights to improve building longevity and functionality. Our comprehensive reports include photo documentation, analysis, and recommended actions, allowing property managers and owners to make informed decisions with confidence, ensuring their properties remain safe and fully operational."
  },
  {
    "title": "Industrial Properties Inspection: Ensuring Safety and Operational Excellence",
    "content": "Industrial sites require meticulous inspections to maintain safety and operational standards. Our industrial properties inspection services assess factories, warehouses, and production facilities for structural, mechanical, and environmental compliance. We check equipment safety, storage protocols, fire prevention systems, and employee safety measures. By conducting regular industrial site inspections, Nspire helps clients identify inefficiencies, prevent accidents, and reduce downtime. Our inspectors use advanced testing tools, thermal imaging, and safety audits to evaluate the condition of machinery, HVAC, plumbing, and electrical systems. This comprehensive approach ensures industrial facilities are safe, productive, and compliant with federal and state regulations."
  },
  {
    "title": "Comprehensive Shopping Center Inspection Services for Safety and Compliance",
    "content": "Shopping centers and retail complexes require regular inspections to guarantee public safety and operational compliance. Nspire’s shopping center inspection services cover everything from structural assessments to fire and life safety checks. We inspect roofing, HVAC systems, plumbing, electrical installations, and parking areas to ensure a safe environment for shoppers and staff. Our team also evaluates accessibility, safety signage, and retail space functionality. By providing thorough commercial property inspections, we help mall owners and retail operators maintain compliance with local building codes, reduce liability risks, and enhance customer confidence. Our detailed inspection reports include recommendations for repairs, maintenance, and long-term improvement strategies."
  },
  {
    "title": "Nspire Commercial Compliance: Multi-Unit Facility and Retail Property Inspection",
    "content": "Our Nspire Commercial Compliance services ensure multi-unit commercial properties, including office buildings, retail spaces, and warehouses, meet local safety and regulatory standards. We provide multi-unit commercial facility inspections to assess fire safety, accessibility, structural integrity, and overall operational compliance. Retail property inspections focus on store layout safety, HVAC functionality, electrical systems, and emergency preparedness. By combining regulatory knowledge with hands-on inspections, we help property managers maintain secure, code-compliant environments that reduce liability. Detailed reports include actionable insights for improvement, making it easier to maintain multiple commercial properties efficiently while keeping employees, tenants, and visitors safe."
  },
  {
    "title": "Warehouse Inspections: Structural, Safety, and Operational Assessments",
    "content": "Warehouses are critical to business operations and require specialized inspection services. Nspire’s warehouse inspection services include comprehensive structural assessments, HVAC and electrical evaluations, fire safety audits, and compliance checks. We perform warehouse condition assessments, quality inspections, and warehouse compliance inspections to ensure operational efficiency and safety. Our team identifies structural weaknesses, potential hazards, and regulatory non-compliance issues that can disrupt workflow or cause accidents. By implementing our recommendations, warehouse managers can improve safety, prevent losses, and extend facility lifespan. From inventory storage safety to loading dock inspections, our services ensure warehouses operate at peak efficiency and safety standards."
  },
  {
    "title": "Detailed Commercial Building Structural Integrity and Roof, HVAC, Electrical & Plumbing Analysis",
    "content": "Maintaining the structural integrity of commercial buildings is essential for long-term safety and performance. Nspire’s structural integrity assessments include detailed inspections of foundations, load-bearing elements, roofing systems, HVAC units, electrical networks, and plumbing infrastructure. Our experts evaluate potential risks such as water damage, electrical faults, or mechanical wear. We provide actionable recommendations for repairs, preventive maintenance, and upgrades. By combining modern inspection technology with industry expertise, we ensure office buildings, retail spaces, and industrial facilities remain safe, compliant, and functional. These inspections are critical for protecting investments, preventing downtime, and enhancing the safety and comfort of all building occupants."
  },
  {
    "title": "Retail Spaces and Office Buildings: Professional Safety and Code Compliance Checks",
    "content": "Retail spaces and office buildings require meticulous safety and code compliance inspections to protect staff, customers, and assets. Nspire’s professional commercial inspection services assess fire safety, accessibility, structural soundness, electrical systems, HVAC, and plumbing. We also provide retail space safety inspections, focusing on layout, emergency exits, and operational hazards. Our detailed reports include code compliance analysis and practical recommendations to address deficiencies. By relying on our inspections, business owners can mitigate risks, maintain insurance coverage, and ensure customer confidence. From small offices to large commercial complexes, our inspections guarantee environments that meet regulatory requirements and uphold operational excellence."
  },
  {
    "title": "Fire, Life Safety, and Commercial Facility Safety Inspections",
    "content": "At Nspire, we prioritize fire and life safety for all commercial properties. Our fire and life safety inspections cover multi-tenant buildings, shopping malls, warehouses, and office spaces. We assess fire suppression systems, alarms, emergency exits, signage, and accessibility for all occupants. Our commercial facility safety inspections ensure that operational practices, storage methods, and equipment comply with safety standards. By proactively identifying hazards, we help property owners reduce risks, prevent accidents, and maintain insurance compliance. Our inspectors provide clear, detailed reports with actionable recommendations, enabling businesses to enhance safety, minimize liabilities, and protect employees, customers, and tenants."
  },
  {
    "title": "Comprehensive Commercial Property Inspection Services for Multi-Tenant and Retail Buildings",
    "content": "Multi-tenant and retail properties require specialized inspections to ensure both safety and operational efficiency. Nspire provides multi-tenant building inspections, commercial retail inspections, and retail property inspection services that cover structural, mechanical, and compliance requirements. We evaluate HVAC systems, electrical networks, plumbing, roofing, and overall building integrity. Our inspections identify safety risks, operational inefficiencies, and regulatory non-compliance, helping property managers and retail operators maintain secure environments. With detailed reports and professional recommendations, we empower businesses to improve property management, reduce downtime, and ensure long-term operational success. Nspire’s inspections are essential for safeguarding assets, tenants, and customers alike."
  },
  {
    "title": "Industrial Property, Factory, and Warehouse Audits for Optimal Performance",
    "content": "Industrial facilities, factories, and warehouses require rigorous evaluation for operational efficiency and safety compliance. Nspire’s industrial property inspection services, factory inspection services, and warehouse audit services focus on identifying structural weaknesses, compliance issues, and safety hazards. We perform warehouse structural inspections, warehouse facility inspections, and warehouse safety inspections to ensure facilities meet federal and state regulations. Our detailed assessments help businesses mitigate risks, prevent accidents, and maintain productivity. By combining hands-on inspections with advanced tools, Nspire ensures that industrial and commercial facilities operate safely and efficiently, protecting employees, clients, and business investments."
  }
];

export default function CommercialClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        <section className="relative bg-gradient-to-br from-[#F59E0B] to-[#D97706] py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 opacity-20"><Image src="/candid_commercial_building.png" alt="" fill className="object-cover" /></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#D97706] via-[#D97706]/60 to-transparent"></div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Business Properties Nationwide</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
              Commercial Buildings Inspection <span className="italic font-medium">Services</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              At NSPIREinspection.AI, we provide top-tier commercial buildings multi-unit, mixed-use inspection services nationwide, helping businesses, property managers, and industrial facility owners ensure the safety, functionality, and compliance of their properties. Our expert inspectors specialize in commercial, industrial, and retail inspections, covering warehouses, office buildings, and shopping centers. From structural integrity assessments to safety and code compliance checks, our services are tailored to address every property concern. By combining advanced inspection technology with decades of experience, we help clients avoid costly repairs, maintain operational efficiency, and comply with local regulations, making us a trusted choice for commercial property owners nationwide.
            </p>
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="text-center mb-16"><p className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest mb-4">Expert Evaluations</p><h2 className="text-3xl md:text-4xl font-bold text-black">Comprehensive Services</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center gap-4 mb-6"><span className="w-12 h-12 rounded-2xl bg-[#FFFBEB] flex items-center justify-center text-[#F59E0B] font-bold text-lg">{String(i + 1).padStart(2, '0')}</span><h3 className="text-xl font-bold text-black group-hover:text-[#F59E0B] transition-colors">{s.title}</h3></div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-black py-20 px-4 text-center"><h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Protect Your Commercial Investment</h2><p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Schedule a comprehensive commercial property inspection today.</p><Button onClick={() => router.push("/contact")} className="bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Schedule Inspection</Button></section>
      </div>
    </MainLayout>
  );
}
