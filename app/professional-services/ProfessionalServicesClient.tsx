"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const partners = [
  { title: "Real Estate Agents", desc: "Reliable inspection partnerships that build client trust and streamline closings. Priority scheduling, branded reports, and dedicated agent support.", icon: "🏠" },
  { title: "Brokerages", desc: "Enterprise-level inspection programs for brokerages of all sizes. Volume pricing, white-label reporting, and integrated scheduling solutions.", icon: "🏢" },
  { title: "Relocation Services", desc: "Fast-turnaround inspections for relocating families and corporate transfers. Nationwide coverage with consistent quality standards.", icon: "✈️" },
  { title: "Property Managers", desc: "Annual and move-in/move-out inspections, maintenance assessments, and tenant safety reviews tailored for property management companies.", icon: "🔑" },
  { title: "Developers & Builders", desc: "Phase inspections, pre-drywall reviews, and final walk-through inspections for new construction and renovation projects.", icon: "🏗️" },
  { title: "Lenders & Banks", desc: "Property condition reports and appraisal support for mortgage lenders, banks, and financial institutions requiring due diligence.", icon: "🏦" },
  { title: "Institutional Investors", desc: "Portfolio-level property assessments, capital planning reports, and due diligence packages for institutional real estate investors.", icon: "📊" },
];

export default function ProfessionalServicesClient() {
  const router = useRouter();
  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center"><Image src="/logo.png" alt="NSPIRE" width={500} height={600} priority className="h-14 md:h-32 lg:h-40 w-auto" /></div>
      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4"><div className="max-w-[1400px] mx-auto w-full flex items-center justify-between"><div className="hidden md:flex items-center gap-6 lg:gap-8"><Link href="/" className="text-sm font-medium text-gray-800 hover:text-[#006795]">HOME</Link><Link href="/about" className="text-sm font-medium text-gray-800 hover:text-[#006795]">ABOUT</Link><Link href="/inspection-services" className="text-sm font-medium text-gray-800 hover:text-[#006795]">SERVICES</Link><Link href="/professional-services" className="text-sm font-bold text-[#006795]">PROFESSIONALS</Link><Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-[#006795]">CONTACT</Link></div><Button onClick={() => router.push("/login")} className="bg-[#006795] hover:bg-[#00567a] text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-md cursor-pointer">Login/Register</Button></div></nav>

      <section className="bg-black py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#006795] rounded-full blur-[200px] opacity-20"></div></div>
        <div className="relative z-10"><p className="text-[#F84B5F] font-bold uppercase tracking-[0.2em] mb-6">B2B Partnership Programs</p><h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Professional Services</h1><p className="text-gray-400 text-xl max-w-3xl mx-auto">Tailored inspection partnerships for real estate professionals, property managers, developers, and financial institutions.</p></div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((p, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
              <div className="text-4xl mb-6">{p.icon}</div>
              <h3 className="text-xl font-bold text-black mb-4 group-hover:text-[#006795] transition-colors">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#006795] py-20 px-4 text-center"><h2 className="text-4xl font-bold text-white mb-6">Ready to Partner With Nspire?</h2><p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">Join our network of professional partners and deliver best-in-class inspection services to your clients.</p><Button onClick={() => router.push("/contact")} className="bg-[#F84B5F] hover:bg-[#EE3646] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Become a Partner</Button></section>
      <footer className="bg-black text-white py-12 px-4"><div className="max-w-7xl mx-auto text-center"><Image src="/logo.png" alt="NSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" /><p className="text-gray-500 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p></div></footer>
    </main>
  );
}
