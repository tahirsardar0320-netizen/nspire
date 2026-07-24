"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const articles = [
  { title: "HUD Releases Updated NSPIRE Standards for 2026", date: "March 10, 2026", category: "Regulatory", excerpt: "The Department of Housing and Urban Development announced updates to the NSPIRE inspection protocol, affecting public housing compliance requirements nationwide." },
  { title: "Georgia Housing Market Forecast: What Inspectors Are Seeing", date: "March 5, 2026", category: "Market Insights", excerpt: "As the Georgia real estate market continues to evolve, inspectors are noticing new trends in construction quality and buyer expectations." },
  { title: "Nspire Expands Service Coverage to North Georgia", date: "February 28, 2026", category: "Company News", excerpt: "We're excited to announce expanded inspection services to Gainesville, Cumming, and the greater North Georgia area." },
  { title: "New EPA Guidelines on Lead Paint Testing", date: "February 20, 2026", category: "Regulatory", excerpt: "The EPA has issued updated guidelines for lead-based paint testing in residential properties, with implications for pre-purchase inspections." },
];

export default function NewsClient() {
  const router = useRouter();
  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center"><Image src="/logo.png" alt="NSPIRE" width={500} height={600} priority className="h-14 md:h-32 lg:h-40 w-auto" /></div>
      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4"><div className="max-w-[1400px] mx-auto w-full flex items-center justify-between"><div className="hidden md:flex items-center gap-6 lg:gap-8"><Link href="/" className="text-sm font-medium text-gray-800 hover:text-[#006795]">HOME</Link><Link href="/about" className="text-sm font-medium text-gray-800 hover:text-[#006795]">ABOUT</Link><Link href="/inspection-services" className="text-sm font-medium text-gray-800 hover:text-[#006795]">SERVICES</Link><Link href="/resources" className="text-sm font-bold text-[#006795]">RESOURCES</Link><Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-[#006795]">CONTACT</Link></div><Button onClick={() => router.push("/login")} className="bg-[#006795] hover:bg-[#00567a] text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-md cursor-pointer">Login/Register</Button></div></nav>

      <section className="bg-[#006795] py-16 md:py-24 text-center"><h1 className="text-5xl md:text-7xl font-bold text-white mb-4">News & Articles</h1><p className="text-white/70 text-lg">Stay informed with the latest from Nspire and the inspection industry.</p></section>

      <section className="max-w-[1000px] mx-auto px-4 md:px-6 py-16 md:py-24 space-y-10">
        {articles.map((a, i) => (
          <article key={i} className="border-b border-gray-100 pb-10 last:border-0">
            <div className="flex items-center gap-3 mb-4"><span className="bg-[#E8F4F8] text-[#006795] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{a.category}</span><span className="text-gray-400 text-sm">{a.date}</span></div>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 hover:text-[#006795] transition-colors cursor-pointer">{a.title}</h2>
            <p className="text-gray-500 leading-relaxed">{a.excerpt}</p>
          </article>
        ))}
      </section>

      <footer className="bg-black text-white py-12 px-4"><div className="max-w-7xl mx-auto text-center"><Image src="/logo.png" alt="NSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" /><p className="text-gray-500 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p></div></footer>
    </main>
  );
}
