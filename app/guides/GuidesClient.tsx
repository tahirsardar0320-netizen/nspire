"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const guides = [
  { title: "First-Time Home Buyer Inspection Guide", desc: "Everything you need to know about home inspections before purchasing your first property.", audience: "Buyers", color: "#006795" },
  { title: "Seller's Pre-Listing Inspection Checklist", desc: "A step-by-step checklist to prepare your home for sale and maximize its value.", audience: "Sellers", color: "#F84B5F" },
  { title: "Annual Home Maintenance Calendar", desc: "Month-by-month maintenance tasks to keep your property in top condition year-round.", audience: "Homeowners", color: "#22C55E" },
  { title: "Commercial Property Due Diligence Guide", desc: "Essential steps for evaluating commercial properties before acquisition.", audience: "Investors", color: "#F59E0B" },
  { title: "Real Estate Agent's Inspection Handbook", desc: "How to guide your clients through the inspection process and manage expectations.", audience: "Agents", color: "#8B5CF6" },
  { title: "Understanding Your Inspection Report", desc: "How to read, interpret, and act on your professional inspection report.", audience: "Everyone", color: "#006795" },
];

export default function GuidesClient() {
  const router = useRouter();
  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center"><Image src="/logo.png" alt="NSPIRE" width={500} height={600} priority className="h-14 md:h-32 lg:h-40 w-auto" /></div>
      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4"><div className="max-w-[1400px] mx-auto w-full flex items-center justify-between"><div className="hidden md:flex items-center gap-6 lg:gap-8"><Link href="/" className="text-sm font-medium text-gray-800 hover:text-[#006795]">HOME</Link><Link href="/about" className="text-sm font-medium text-gray-800 hover:text-[#006795]">ABOUT</Link><Link href="/inspection-services" className="text-sm font-medium text-gray-800 hover:text-[#006795]">SERVICES</Link><Link href="/resources" className="text-sm font-bold text-[#006795]">RESOURCES</Link><Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-[#006795]">CONTACT</Link></div><Button onClick={() => router.push("/login")} className="bg-[#006795] hover:bg-[#00567a] text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-md cursor-pointer">Login/Register</Button></div></nav>

      <section className="bg-[#006795] py-16 md:py-24 text-center"><h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Guides & Resources</h1><p className="text-white/70 text-lg">Expert guides to help you navigate every aspect of property inspections.</p></section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((g, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6" style={{ backgroundColor: g.color + "15", color: g.color }}>{g.audience}</span>
              <h3 className="text-xl font-bold text-black mb-4 group-hover:text-[#006795] transition-colors">{g.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{g.desc}</p>
              <span className="text-[#006795] font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                Read Guide <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-black text-white py-12 px-4"><div className="max-w-7xl mx-auto text-center"><Image src="/logo.png" alt="NSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" /><p className="text-gray-500 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p></div></footer>
    </main>
  );
}
