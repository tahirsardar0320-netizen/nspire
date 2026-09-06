"use client";
import MainLayout from "@/components/MainLayout";

const articles = [
  { title: "HUD Releases Updated NSPIRE Standards for 2026", date: "March 10, 2026", category: "Regulatory", excerpt: "The Department of Housing and Urban Development announced updates to the NSPIRE inspection protocol, affecting public housing compliance requirements nationwide." },
  { title: "Georgia Housing Market Forecast: What Inspectors Are Seeing", date: "March 5, 2026", category: "Market Insights", excerpt: "As the Georgia real estate market continues to evolve, inspectors are noticing new trends in construction quality and buyer expectations." },
  { title: "Nspire Expands Service Coverage to North Georgia", date: "February 28, 2026", category: "Company News", excerpt: "We're excited to announce expanded inspection services to Gainesville, Cumming, and the greater North Georgia area." },
  { title: "New EPA Guidelines on Lead Paint Testing", date: "February 20, 2026", category: "Regulatory", excerpt: "The EPA has issued updated guidelines for lead-based paint testing in residential properties, with implications for pre-purchase inspections." },
];

export default function NewsClient() {
  return (
    <MainLayout>
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
    </MainLayout>
  );
}
