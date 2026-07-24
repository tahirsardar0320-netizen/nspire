"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const sections = [
  {
    "title": "Advanced Sewer Scope Video Inspections to Detect Hidden Plumbing Issues Before They Become Costly Problems",
    "content": "Our Video Sewer Inspection Services utilize high-definition cameras to examine sewer lines, identify clogs, leaks, or root intrusions, and provide precise evaluations. This service allows homeowners, commercial property managers, and real estate professionals to proactively address plumbing issues, saving both time and money. We offer Sewer Camera Inspection and Sewer Line Inspection solutions tailored to residential, multi-unit, and commercial properties. Our inspections help avoid unexpected sewer failures and provide a detailed, video-backed report for insurance claims, renovations, or pre-listing requirements. Choosing Nspire ensures a reliable, thorough, and technologically advanced approach to maintaining your property’s plumbing systems."
  },
  {
    "title": "Comprehensive Pool & Spa Inspections to Ensure Safety and Compliance for Residential and Commercial Properties",
    "content": "Nspire’s Pool Inspection Services and Pool and Spa Safety Inspections are performed by certified inspectors to ensure safety, compliance, and optimal performance. We serve both residential and commercial clients, including luxury homes, multi-unit complexes, and resort facilities. Our services include thorough evaluations of pool equipment, water quality, structural integrity, and compliance with local regulations. Clients searching for “Pool Inspection Company USA” or “Pool Inspection Services Near Me” can rely on Nspire for accurate, detailed, and actionable reports. By addressing issues proactively, our inspections reduce liability risks, enhance property value, and provide a safe environment for all users."
  },
  {
    "title": "Expert Mold Sampling and Environmental Air Quality Testing for Healthy and Safe Living Spaces",
    "content": "Our Mold Sampling Inspection Services and Environmental & Air Quality Sampling are essential for detecting airborne contaminants, allergens, and harmful particles in residential and commercial properties. Using advanced laboratory techniques, Nspire identifies mold species, evaluates potential health risks, and provides actionable remediation guidance. These inspections are crucial for luxury homes, historic properties, multi-unit residential complexes, and commercial spaces. Clients searching for Residential Special Inspection Services or Commercial Special Inspection Services can rely on our certified inspectors for thorough assessments, ensuring a safe indoor environment. Early detection prevents structural damage, costly repairs, and health-related complications."
  },
  {
    "title": "Precision Roof Inspection Services to Protect Your Home or Commercial Building from Weather Damage",
    "content": "Nspire provides detailed Roof Inspection Services for residential, commercial, and historic properties. Our certified inspectors assess roofing materials, structural integrity, drainage systems, and potential leak points. Whether you need inspections for Malibu & Beach Home Inspections or general residential properties, our services identify risks before they cause damage. Accurate roofing assessments are critical for pre-listing, insurance claims, or scheduled maintenance. Clients searching for Roof Inspection Services or Certified Special Inspection Services can trust Nspire to deliver actionable reports, comprehensive evaluations, and reliable recommendations to prolong the lifespan of roofs and maintain the value and safety of your property."
  },
  {
    "title": "Foundation & Crawlspace Inspections for Ensuring Structural Integrity of Homes and Commercial Buildings",
    "content": "Our Foundation & Crawlspace Inspection Services provide essential evaluations for residential, multi-unit, and commercial properties. These inspections identify cracks, moisture intrusion, settling issues, and potential structural weaknesses that can compromise property safety and value. Nspire’s certified inspectors offer detailed reports and remediation guidance for Historic Homes Inspections, luxury residences, and standard properties. Early detection of foundation problems ensures cost-effective repairs and prevents long-term damage. Clients searching for Structural Special Inspection Services or Multi-Unit Specialized Evaluations receive reliable, thorough assessments to protect investments, maintain compliance, and ensure occupant safety."
  },
  {
    "title": "Specialized Luxury Home Inspections for High-Value Properties Across the USA",
    "content": "Nspire offers Luxury Home Inspections and Malibu & Beach Home Inspections, providing comprehensive evaluations for high-value properties. Our inspections cover structural integrity, pool and spa safety, roofing, plumbing, mold, and environmental risks. These services are critical for pre-listing or property acquisition, ensuring every detail meets safety standards and property regulations. Clients seeking Certified Special Inspection Services or Special Inspection Company USA can rely on Nspire for precise, actionable, and detailed reporting. Our expert inspectors use advanced tools and methodologies to provide property owners, buyers, and real estate professionals with confidence, security, and assurance in every luxury property transaction."
  },
  {
    "title": "Historic Homes Inspections to Preserve Heritage While Ensuring Safety and Structural Soundness",
    "content": "Our Historic Homes Inspections are tailored to the unique challenges of aging properties, balancing preservation with modern safety standards. Nspire evaluates foundations, roofing, structural elements, plumbing, and environmental hazards such as mold or asbestos. These inspections are ideal for homeowners, real estate agents, and buyers interested in Pre-Listing Inspection Services or comprehensive property evaluations. By addressing risks early, our inspections prevent costly repairs and ensure compliance with preservation standards. Clients seeking Special Inspection Services Near Me or Certified Special Inspection Services receive detailed documentation, actionable recommendations, and guidance to protect both historical value and modern usability."
  },
  {
    "title": "General Home Inspections for Residential Safety, Maintenance, and Pre-Sale Evaluations",
    "content": "Nspire’s General Home Inspections provide a complete overview of residential properties, covering structural, mechanical, electrical, plumbing, and environmental aspects. Our inspections support pre-purchase, pre-listing, or routine maintenance needs. Clients looking for Residential Special Inspection Services or Pre-Listing Inspection Services benefit from detailed reporting, photographs, and professional recommendations. These inspections help homeowners and buyers prevent hidden issues, reduce long-term costs, and maintain property value. Nspire’s approach combines technology, certified expertise, and personalized guidance, ensuring every home inspection meets the highest standards of safety, compliance, and thoroughness."
  },
  {
    "title": "Commercial Add-On Inspections for Multi-Unit, Retail, and Industrial Properties Across the USA",
    "content": "Our Commercial Add-On Inspections complement standard evaluations by offering specialized assessments for multi-unit buildings, retail spaces, and industrial properties. These include HVAC, plumbing, pool safety, environmental testing, and structural evaluations. Clients searching for Commercial Pool Inspection Services or Commercial Special Inspection Services benefit from detailed reports and actionable guidance tailored to commercial compliance standards. Nspire’s certified inspectors ensure property safety, regulatory adherence, and operational efficiency. By providing comprehensive inspections, our services help commercial property managers, investors, and owners identify risks early, reduce liabilities, and maintain high-quality standards for tenants and customers alike."
  },
  {
    "title": "Multi-Unit Specialized Evaluations to Ensure Safety and Regulatory Compliance Across Residential and Commercial Properties",
    "content": "Nspire’s Multi-Unit Specialized Evaluations are designed for apartment complexes, condominiums, and multi-tenant commercial properties. Our inspections assess structural integrity, plumbing, electrical systems, mold risk, and environmental safety. These services are crucial for pre-listing, maintenance, and compliance requirements. Clients searching for Special Inspection Services or Certified Special Inspection Services can rely on Nspire to provide actionable, detailed reports. Early identification of issues ensures cost-effective repairs, minimizes liability risks, and enhances tenant satisfaction. Our certified inspectors use advanced technology, experience, and a meticulous approach to deliver inspections that are reliable, thorough, and highly valued by property owners and stakeholders."
  },
  {
    "title": "Environmental & Air Quality Sampling Services to Protect Health and Ensure Safe Indoor Environments",
    "content": "Nspire’s Environmental & Air Quality Sampling evaluates airborne contaminants, allergens, and pollutants in homes, pools, and commercial buildings. These services complement Mold Sampling Inspection Services, providing comprehensive analysis for residential, multi-unit, and commercial properties. Clients searching for Environmental & Air Quality Sampling or Certified Special Inspection Services receive detailed results, recommendations, and actionable guidance for remediation. Our inspections help prevent long-term health hazards, maintain compliance with environmental standards, and support pre-listing or acquisition evaluations. By leveraging technology and certified expertise, Nspire ensures safe, clean, and well-maintained indoor environments for all property types, enhancing safety, comfort, and overall property value."
  }
];

export default function SpecializedClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        <section className="relative bg-gradient-to-br from-[#22C55E] to-[#15803D] py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 opacity-15"><Image src="/candid_specialized.png" alt="" fill className="object-cover" /></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#15803D] via-[#15803D]/60 to-transparent"></div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Advanced Assessments</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
              Special Inspection <span className="italic font-medium">Services</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              At NSPIREinspection.AI, we provide comprehensive Special Inspection Services nationwide, designed to address every residential, commercial, and specialized property need. Our expert team uses advanced and updated software to inspect pool and spa safety evaluations, roof inspections, and foundation assessments to detect potential issues before they escalate. Whether it’s a luxury home, multi-unit building, historic property, or commercial establishment, our services ensure safety, regulatory compliance, and peace of mind. With our qulified inspectors, you receive detailed reports, actionable recommendations, and trustworthy guidance to maintain your property’s integrity and value.
            </p>
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="text-center mb-16"><p className="text-xs font-bold text-[#22C55E] uppercase tracking-widest mb-4">Specialized Assessments</p><h2 className="text-3xl md:text-4xl font-bold text-black">Comprehensive Services</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center gap-3 mb-5"><span className="w-11 h-11 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#22C55E] font-bold text-sm">{String(i + 1).padStart(2, '0')}</span><h3 className="text-lg font-bold text-black group-hover:text-[#22C55E] transition-colors leading-tight">{s.title}</h3></div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-black py-20 px-4 text-center"><h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Need a Specialized Inspection?</h2><p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">From sewer scopes to mold testing, we have the expertise for every property need.</p><Button onClick={() => router.push("/contact")} className="bg-[#22C55E] hover:bg-[#15803D] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Book Specialized Inspection</Button></section>
      </div>
    </MainLayout>
  );
}
