"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const sections = [
  {
    "title": "NSPIRE-Compliant Inspections for LIHTC and Tax Credit Properties",
    "content": "Nspire provides NSPIRE-aligned physical condition inspections for Low-Income Housing Tax Credit (LIHTC) properties, helping owners and management companies stay ahead of state housing finance agency reviews. Our inspectors evaluate units, common areas, building systems, and site conditions using the same standards HUD applies during REAC/NSPIRE reviews, so findings translate directly into actionable repair priorities. Detailed digital reports document every deficiency with photos, severity, and location, giving compliance teams the documentation they need for annual certifications and tax credit compliance monitoring."
  },
  {
    "title": "Section 8 and Housing Choice Voucher Unit Inspections",
    "content": "For properties participating in the Section 8 Housing Choice Voucher program, Nspire delivers unit-level inspections that mirror NSPIRE's Unit, Inside, and Outside scoring categories. We assess health and safety items, electrical and plumbing systems, smoke and CO alarms, and habitability conditions to help owners pass HUD inspections on the first attempt and avoid abatement of housing assistance payments. Our reports flag life-threatening and severe deficiencies immediately so they can be corrected within HUD's required timelines."
  },
  {
    "title": "Multi-Family Affordable Housing Physical Condition Assessments",
    "content": "Affordable housing communities require regular physical condition assessments to preserve long-term asset value and maintain regulatory standing. Nspire inspects multi-family affordable properties building-by-building and unit-by-unit, evaluating structural integrity, building envelope, mechanical systems, and life-safety equipment. Our assessments help owners, asset managers, and public housing authorities plan capital improvement budgets and prioritize repairs across a portfolio of properties."
  },
  {
    "title": "HUD REAC and NSPIRE Standard Compliance Reviews",
    "content": "Nspire's affordable housing inspections are built around the same NSPIRE standards used in official HUD REAC reviews, covering the full Outside, Inside, and Unit categories. We document deficiencies with the same severity classifications and point deductions used in scoring, giving property teams a realistic preview of how a property would score in an actual REAC inspection, along with a prioritized punch list to close the gap before the real review happens."
  },
  {
    "title": "Preventive Maintenance and Capital Needs Planning for Affordable Properties",
    "content": "Sustaining an affordable housing property over its regulatory compliance period depends on proactive maintenance planning. Nspire's inspections identify emerging maintenance needs, aging building systems, and code violations before they escalate into costly repairs or compliance failures. Our reports support long-term capital needs assessments, helping owners and housing authorities budget accurately for reserve replacement schedules and portfolio-wide preventive maintenance programs."
  },
  {
    "title": "Tenant Safety, Habitability, and Accessibility Compliance",
    "content": "Affordable housing residents depend on safe, habitable units that meet accessibility requirements under UFAS and Section 504. Nspire inspections evaluate egress, fire safety, ventilation, and accessibility features alongside general habitability conditions. Our documentation helps property owners demonstrate compliance with fair housing and accessibility obligations while protecting tenant health and safety across the portfolio."
  }
];

export default function AffordableHousingClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* Hero with Image */}
        <section className="relative bg-[#0F9D58] py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image src="/candid_public_housing.png" alt="" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F9D58] via-[#0F9D58]/70 to-transparent"></div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">LIHTC, Section 8 &amp; Multi-Family Compliance</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
              Affordable Housing Inspection <span className="italic font-medium">Services</span>
            </h1>
            <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">
              NSPIREinspectionApp.com delivers NSPIRE-aligned inspections for affordable housing communities across the USA — including LIHTC, Section 8 Housing Choice Voucher, and other HUD-assisted properties. Our inspectors evaluate units, buildings, and site conditions against the same standards used in official REAC/NSPIRE reviews, giving owners, management companies, and housing authorities the documentation they need to maintain compliance and protect resident safety.
            </p>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="bg-[#F8F9FA] py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
              <div className="flex-1">
                <p className="text-xs font-bold text-[#0F9D58] uppercase tracking-widest mb-4">Compliance-Ready Reporting</p>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Built Around NSPIRE Scoring, Ready for Real Reviews</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our affordable housing inspections use the same Outside, Inside, and Unit categories, severity classifications, and point-deduction logic applied in official HUD REAC/NSPIRE reviews. That means the punch list you get from Nspire is a realistic preview of how a property would score in an actual inspection — not a generic condition report. Owners and compliance teams can prioritize repairs by severity and close gaps before the real review happens.
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-[400px] h-[280px] rounded-[32px] overflow-hidden relative">
                <Image src="/candid_house_people.png" alt="Affordable housing inspection" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Service Sections */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-[#0F9D58] uppercase tracking-widest mb-4">Our Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Comprehensive Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-11 h-11 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#0F9D58] font-bold text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-black group-hover:text-[#0F9D58] transition-colors leading-tight">{s.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black py-20 px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Keep Your Affordable Housing Portfolio Compliant</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Schedule an NSPIRE-aligned inspection and stay ahead of your next REAC review.</p>
          <Button onClick={() => router.push("/contact")} variant="secondary" size="lg" className="hover:scale-105 transition-all">Schedule an Inspection</Button>
        </section>
      </div>
    </MainLayout>
  );
}
