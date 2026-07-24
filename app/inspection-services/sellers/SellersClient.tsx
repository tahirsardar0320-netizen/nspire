"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const sections = [
  {
    "title": "Pre-Listing Inspection Services for Home Sellers",
    "content": "A pre-listing inspection is crucial for property owners preparing to sell. At Nspire, we provide thorough pre-listing home inspections that identify both major and minor defects, evaluate structural integrity, and recommend necessary repairs. These inspections enable sellers to present their homes confidently, reducing surprises during buyer evaluations. With our pre-sale property inspection, sellers can enhance marketability, avoid post-sale disputes, and achieve optimal pricing. Our team ensures detailed inspection report services USA are delivered promptly, making the selling process transparent and efficient. Early detection of issues saves time, cost, and negotiation challenges for property owners."
  },
  {
    "title": "Multi-Unit Seller Inspection and Reporting",
    "content": "For landlords and property managers, multi-unit seller inspections are essential to maintain transparency and market readiness. Nspire provides multi-unit real estate inspection and multi-family seller inspection services, covering all units in one comprehensive report. Our seller reporting system details property conditions, highlights repair needs, and ensures compliance with HUD/REAC standards. Sellers benefit from our affordable home inspection report and pricing advantage inspection strategies, improving buyer confidence and reducing negotiation losses. Whether preparing for pre-sale home inspection or multi-unit property inspection, our specialized approach ensures every property is documented, evaluated, and optimized for maximum marketability."
  },
  {
    "title": "Property Readiness Evaluation for Sellers",
    "content": "A detailed property readiness evaluation helps sellers prepare their homes to attract serious buyers. Nspire’s inspections assess structural integrity, mechanical systems, safety compliance, and overall market appeal. Our pre-sale property inspection identifies defects early and provides actionable repair and upgrade recommendations. Sellers gain insight into pre-listing property inspection results, enabling them to make informed decisions about improvements and pricing. With seller transparency report generation, clients can showcase compliance, safety verification, and property condition clearly to potential buyers. This process ensures reduced negotiation loss, higher perceived property value, and a smoother transaction experience for all parties involved."
  },
  {
    "title": "HUD/REAC Pre-Sale Support and Compliance Services",
    "content": "Navigating HUD/REAC compliance inspections can be challenging for sellers. Nspire offers HUD/REAC pre-sale inspection support services and REAC pre-sale inspection assistance for all property types, ensuring compliance with federal guidelines. Our HUD/REAC pre-sale consulting and HUD pre-sale inspection services USA prepare sellers for official evaluations, minimizing potential violations and penalties. We generate detailed HUD/REAC property inspection before sale reports that clearly outline repairs, upgrades, and compliance actions. With our expertise, sellers can confidently complete pre-sale home inspection requirements, enhance property appeal, and maintain transparency through online seller transparency and marketplace seller report options."
  },
  {
    "title": "Major & Minor Defect Detection for Sellers",
    "content": "Identifying both major and minor defects before listing a property is vital to avoid future disputes. Nspire’s inspections cover structural, electrical, plumbing, HVAC, and exterior systems, providing a detailed seller compliance report. Our home inspection for sellers includes actionable recommendations for repair or upgrades to improve safety, functionality, and aesthetics. By performing thorough inspection report services USA, we ensure sellers can address defects proactively, enhancing property marketability and buyer confidence. With pre-sale home inspection and pre-listing home inspection services, property owners can reduce negotiation losses, improve listing visibility, and present a well-maintained property ready for immediate sale."
  },
  {
    "title": "Repair & Upgrade Recommendations",
    "content": "Nspire’s repair and upgrade recommendations are tailored to maximize property value and reduce sale delays. Through our pre-sale property inspection and property readiness evaluation, we identify cost-effective upgrades that enhance property appeal. Our detailed seller home inspection reports include prioritized recommendations, ensuring sellers understand critical fixes versus cosmetic improvements. Multi-unit property owners benefit from multi-unit seller inspection recommendations, addressing compliance, safety, and functionality for all units. By following our expert advice, sellers can implement pricing advantage inspection reports, ensuring properties sell faster, at optimal market value, and with minimized buyer objections or negotiation issues."
  },
  {
    "title": "Pricing Advantage Inspection Report for Sellers",
    "content": "A pricing advantage inspection report gives sellers a competitive edge by aligning property condition with market expectations. Nspire’s inspection report services USA include detailed analysis of repairs, upgrades, and compliance status, helping sellers justify asking prices. Seller transparency reports reduce buyer skepticism, mitigate negotiation losses, and improve transaction speed. Our pre-listing inspection services combined with home inspection pricing advantage strategies allow sellers to optimize market positioning. Whether for multi-unit property inspection or pre-sale home inspection, our reports provide clear, actionable insights. Clients gain confidence in their listing, demonstrate professional diligence, and improve overall property marketability."
  },
  {
    "title": "Marketability Enhancement Review",
    "content": "Nspire’s marketability enhancement review evaluates properties beyond basic inspections, focusing on buyer appeal, safety, and compliance. Our pre-listing home inspection and seller inspection for multi-unit properties ensure properties are ready to meet market standards. Sellers benefit from pre-sale home inspection insights, repair recommendations, and HUD/REAC compliance inspection support, enhancing overall market value. We provide a seller reporting system that includes online seller transparency and marketplace seller reports, ensuring buyers have clear, accurate information. By following our guidance, sellers improve property visibility, reduce negotiation delays, and position their homes for quick, profitable sales in competitive real estate markets."
  },
  {
    "title": "Compliance & Safety Verification",
    "content": "Ensuring compliance and safety verification is critical for all sellers. Nspire’s HUD/REAC pre-sale support and seller compliance report services cover structural integrity, safety systems, and federal regulations. Our multi-unit building inspection and pre-listing inspection identify potential safety risks and compliance gaps, enabling proactive repairs and upgrades. With detailed inspection report services USA, sellers can demonstrate transparency and reliability, reducing liability and negotiation conflicts. By implementing our recommendations, clients enhance buyer confidence and property value. From HUD REAC pre-sale inspection assistance to pre-listing property inspections, Nspire ensures all sellers meet regulatory requirements while optimizing their property for market success."
  },
  {
    "title": "Seller Transparency Report – Reduce Negotiation Loss",
    "content": "A seller transparency report minimizes negotiation risks and strengthens buyer confidence. Nspire generates online seller transparency and marketplace seller reports detailing property conditions, repair history, and compliance certifications. Our pre-sale home inspection and pre-listing inspection services provide actionable insights for sellers to address issues proactively. By offering vendor transparency reports, clients demonstrate honesty and professionalism, increasing the likelihood of smooth, high-value transactions. Whether for multi-unit seller inspection or HUD REAC pre-sale inspection, these reports help reduce conflicts, accelerate closings, and enhance property marketability. Nspire empowers sellers to showcase well-maintained, compliant, and fully transparent properties."
  }
];

export default function SellersClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* Hero with Image */}
        <section className="relative bg-gradient-to-br from-[#F97316] to-[#EA580C] py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <Image src="/hero.png" alt="" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F97316] via-[#F97316]/70 to-transparent"></div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Maximize Marketability</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
              Sellers Inspection <span className="italic font-medium">Services</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              At NSPIREinspection.AI, we provide comprehensive Sellers Inspection Services nationwide, ensuring property owners, multi-unit landlords, and real estate sellers gain accurate insights before listing their properties. Our services include pre-sale home inspections, REAC(Real Estate Assessment Center) inspection preparation, property readiness evaluations, and seller transparency reports, helping clients reduce negotiation risks and enhance property marketability. By leveraging our experience and compliance expertise, sellers can confidently present their homes to buyers with detailed reports, actionable recommendations, and pricing advantage strategies. Whether it’s a single-family home or a multi-unit property, Nspire delivers thorough inspections tailored to each seller’s needs.
            </p>
          </div>
        </section>

        {/* Intro Content */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed">
              By leveraging our experience and compliance expertise, sellers can confidently present their homes to buyers with detailed reports, actionable recommendations, and pricing advantage strategies. Whether it's a single-family home or a multi-unit property, Nspire delivers thorough inspections tailored to each seller's needs, helping clients reduce negotiation risks and enhance property marketability.
            </p>
          </div>
        </section>

        {/* Service Sections */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 md:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-12 h-12 rounded-2xl bg-[#FFF7ED] flex items-center justify-center text-[#F97316] font-bold text-lg">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-bold text-black group-hover:text-[#F97316] transition-colors">{s.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="bg-[#F8F9FA] py-20 md:py-28 px-4 md:px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-[#F97316] uppercase tracking-widest mb-4">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold text-black">Comprehensive Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { step: "01", title: "Schedule", desc: "Book online or by phone, choose date and property type." },
                { step: "02", title: "On-Site Evaluation", desc: "Certified inspectors assess structural, mechanical, and safety systems." },
                { step: "03", title: "Compliance Review", desc: "Results reviewed against NSPIRE, HUD, REAC, and local codes." },
                { step: "04", title: "Digital Report", desc: "Receive photos, risk assessments, repair estimates, and insights." },
                { step: "05", title: "Post-Inspection", desc: "Follow-up guidance, clarification, and negotiation strategies." },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F97316] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.step}</div>
                  <h4 className="font-bold text-black mb-2">{s.title}</h4>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black py-20 px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to List With Confidence?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Get a pre-listing inspection and maximize your property's market value today.</p>
          <Button onClick={() => router.push("/contact")} size="lg" className="bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 transition-all">Schedule Your Inspection</Button>
        </section>
      </div>
    </MainLayout>
  );
}
