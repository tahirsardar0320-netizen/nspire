"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const sections = [
  {
    "title": "Multi-Unit Buyer Inspection Services to Safeguard Your Property Investment",
    "content": "Buying multi-unit residential or commercial properties can be complex. Our Multi-Unit Buyer Inspection services provide an in-depth evaluation of apartment buildings, commercial multi-unit structures, and multi-family homes. We assess the overall property condition, check electrical and mechanical systems, and evaluate potential hazards for tenants and future occupants. Nspire ensures that investors receive a clear picture of maintenance requirements and long-term costs. Our inspections guide decision-making, support price negotiations, and reduce the risk of unexpected repairs. Choosing Nspire’s multi-unit inspection services ensures your real estate investment is secure, compliant, and profitable."
  },
  {
    "title": "Apartment and Multi-Family Property Pre-Purchase Inspections",
    "content": "Our Apartment Building Inspection and Multi-Family Buyer Inspection services target buyers seeking accurate, actionable insights. From pre-buy inspection cost estimates to complete property assessments, we evaluate plumbing, electrical systems, roofing, and structural integrity. We identify hidden issues such as mold, pest damage, or water leaks that could impact long-term investment value. Each inspection includes detailed documentation, photographs, and a buyer decision support report. With Nspire, buyers can make informed decisions about multi-unit property acquisitions, negotiate effectively, and plan for repair or maintenance costs while ensuring compliance with local safety regulations."
  },
  {
    "title": "Single-Family Home Buyer Inspection Services for Smart Home Purchases",
    "content": "Purchasing a single-family home requires a detailed assessment to prevent future financial and safety risks. Our Single-Family Home Buyer Inspection service covers all critical aspects, including structural review, mechanical and electrical systems, HVAC, plumbing, and roofing conditions. Nspire inspectors provide a thorough home buyer inspection and pre-purchase analysis tailored to your investment goals. Our residential inspection reports include repair cost estimates, hazard identification, and actionable recommendations to support your purchase negotiation. By conducting a professional home inspection, we empower buyers to make confident, informed decisions while safeguarding their financial interests in the USA housing market."
  },
  {
    "title": "Pre-Purchase Condominium and Townhome Inspections",
    "content": "Condominiums and townhomes require specialized inspections to evaluate shared and individual property elements. Our Condominium Buyer Inspection service provides comprehensive checks for structural integrity, mechanical systems, and common area maintenance. We offer pre-purchase condo inspections that uncover potential issues, from plumbing leaks to electrical hazards, and provide repair or maintenance cost estimations. Nspire’s buyer condo inspection services deliver detailed reports for informed decision-making and negotiation. Our inspectors also ensure compliance with local building regulations and condominium association requirements. Trust Nspire to simplify your condo purchase with thorough inspections, hazard identification, and decision support for every buyer."
  },
  {
    "title": "Commercial Property Pre-Purchase Evaluation for Informed Investments",
    "content": "Investing in commercial multi-unit properties requires a clear understanding of structural and operational conditions. Nspire’s Commercial Multi-Unit Inspection services provide detailed evaluations of office buildings, retail spaces, and multi-unit commercial properties. We identify electrical, plumbing, and HVAC issues, assess structural integrity, and highlight potential hazards that may affect tenants or business operations. Our inspections provide actionable insights for repair, maintenance, and purchase negotiation. By choosing Nspire, commercial property buyers gain accurate pre-buy inspection cost estimates, ensure compliance with safety regulations, and receive comprehensive documentation for a confident investment decision in the USA market."
  },
  {
    "title": "Public Housing and Multi-Family Buyer Assessments",
    "content": "Nspire conducts detailed inspections for Public Housing and Multi-Family Buyer Assessments to help buyers and investors evaluate high-density residential properties. We analyze structural, mechanical, and electrical systems, assess safety hazards, and provide buyer decision support reports with estimated repair costs. Our pre-purchase inspection services cover apartment complexes, community housing, and multi-unit properties, ensuring transparency and reducing investment risk. By identifying hidden defects or potential compliance issues, Nspire empowers buyers to make well-informed decisions. Each inspection report is designed to guide purchase negotiations and long-term maintenance planning, making your multi-family property investment secure and profitable."
  },
  {
    "title": "Property Condition Assessment for Buyers with Structural, Mechanical & Electrical Review",
    "content": "Nspire’s Property Condition Assessment for Buyers provides a complete review of all critical property components. We inspect structural elements, electrical systems, plumbing, HVAC, and mechanical equipment to detect potential problems before purchase. Our home inspection services include documentation of findings, hazard identification, and maintenance cost estimation. Buyers receive actionable insights for negotiating property prices and planning repairs. With Nspire’s inspection expertise, every property is evaluated with precision and transparency. Our detailed reports help buyers make informed decisions, prevent unexpected expenses, and ensure compliance with safety standards across the USA residential and commercial property markets."
  },
  {
    "title": "Nspire Buyer Safety Compliance and Hazard Identification",
    "content": "Safety and compliance are core components of Nspire’s inspections. Our Nspire Buyer Safety Compliance service evaluates fire hazards, electrical risks, structural vulnerabilities, and environmental concerns such as mold or asbestos. Each inspection includes a hazard and risk identification report, highlighting areas that may impact occupant safety or legal compliance. Nspire also provides recommendations for mitigation and repair, enabling buyers to address issues proactively. By integrating safety compliance into every inspection, we ensure your investment is secure, risk-free, and fully documented. Our services support informed decision-making, reduce liability, and provide peace of mind for all property buyers."
  },
  {
    "title": "Buyer Decision Support Reports with Repair and Maintenance Cost Estimations",
    "content": "Nspire delivers Buyer Decision Support Reports that provide actionable insights for every property purchase. These reports include detailed documentation of structural, mechanical, and electrical assessments, estimated repair and maintenance costs, and potential safety hazards. Our pre-purchase inspection services guide negotiation strategies, ensure transparency, and prevent unexpected financial burdens. Whether for single-family homes, condos, or multi-unit commercial properties, Nspire’s inspection reports are designed to empower buyers with accurate information. With expert analysis and clear recommendations, we simplify the decision-making process, protect your investment, and ensure you make informed property purchases in the competitive USA real estate market."
  },
  {
    "title": "Documentation and Pre-Purchase Inspection Support for Negotiation and Investment Confidence",
    "content": "Nspire provides complete documentation for all inspections, including photographs, technical evaluations, and cost estimates. Our pre-buy inspection support ensures buyers have all necessary information for effective negotiation. By offering comprehensive home buying inspections and multi-unit property assessments, we help clients minimize risk and secure optimal purchase terms. Our inspections support informed decision-making, highlighting hazards, maintenance needs, and compliance issues. Nspire’s professional evaluation services empower buyers to confidently invest in residential or commercial properties, reduce post-purchase surprises, and achieve long-term satisfaction. Trust our expertise to streamline property inspections and safeguard your real estate investments across the USA."
  }
];

export default function BuyersClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* Hero with Image */}
        <section className="relative bg-[#006795] py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <Image src="/candid_house_people.png" alt="" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#006795] via-[#006795]/70 to-transparent"></div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <p className="text-[#006795] font-bold uppercase tracking-[0.2em] mb-6">Expert Inspection Services</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
              Buyers Inspection <span className="italic font-medium">Services</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              At NSPIREinspection.AI, we provide Buyer's Inspection Services nationwide to help homebuyers and investors make informed decisions before purchasing any property. Our expert inspectors conduct thorough evaluations for single-family homes, multi-unit residential buildings, condominiums, and commercial properties. Using advanced techniques, we identify structural, mechanical, and electrical issues, estimate repair costs, and highlight potential hazards. From pre-buy inspections to full property condition assessments, our services provide peace of mind and support informed negotiation. Trust Nspire to protect your investment and simplify your multi-family home-buying experience with professional, reliable, and comprehensive inspection solutions.
            </p>
          </div>
        </section>

        {/* Service Sections */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-[#006795] uppercase tracking-widest mb-4">Our Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Comprehensive Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-12 h-12 rounded-2xl bg-[#E8F4F8] flex items-center justify-center text-[#006795] font-bold text-lg">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-bold text-black group-hover:text-[#006795] transition-colors">{s.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black py-20 px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Protect your investment with a comprehensive pre-purchase inspection from Nspire.</p>
          <Button onClick={() => router.push("/contact")} className="bg-[#006795] hover:bg-[#0A5670] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Book Your Buyer Inspection</Button>
        </section>
      </div>
    </MainLayout>
  );
}
