"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";

export default function HomeInspectionServicesForREProfessionals() {

  return (
    <MainLayout>
      <article className="max-w-[1000px] mx-auto px-4 md:px-6 pt-12 md:pt-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#E8F4F8] text-[#006795] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">For Professionals</span>
            <span className="text-gray-400 text-sm">March 13, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 leading-tight">
            Real Estate Professional Services
          </h1>
          <p className="text-xl md:text-2xl text-[#006795] font-medium mb-8">
            Building Trust and Smoother Transactions
          </p>
          <div className="relative h-[400px] md:h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl mb-12">
            <Image
              src="/blog-re-pros.png"
              alt="Real Estate Professional Home Inspection"
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
          <p className="text-xl font-medium text-gray-900 border-l-4 border-[#006795] pl-6">
            Real estate transactions depend on trust, clarity, and accurate information. A professional home inspection helps remove uncertainty and gives all parties the knowledge they need to move forward confidently.
          </p>

          <p>
            For real estate professionals, partnering with a reliable inspection service can significantly improve the transaction experience. Professional inspection services, such as those provided by Nspire Property Inspection, help real estate professionals deliver peace of mind and transparency to their clients.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Why Home Inspections Matter in Transactions</h2>
            <p>In any property transaction, uncertainty can create delays or failed deals. A home inspection addresses these concerns by providing a professional evaluation of the property’s structure and systems.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                { title: "Early Detection", desc: "Identifying property issues early to avoid surprises during closing." },
                { title: "Fair Negotiations", desc: "Supporting fair negotiations based on factual property data." },
                { title: "Confidence", desc: "Building confidence among both buyers and sellers." },
                { title: "Post-Closing Risk", desc: "Reducing unexpected problems for clients after the keys are handed over." }
              ].map((item, i) => (
                <div key={i} className="bg-[#E8F4F8]/50 p-6 rounded-3xl border border-[#006795]/10">
                  <h3 className="font-bold text-[#006795] mb-2">{item.title}</h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Benefits of the Right Inspection Partner</h2>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <div className="mt-1 bg-[#006795] rounded-full p-1"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                <p><strong>Increased Confidence:</strong> Buyers want reassurance that the property is safe and sound.</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="mt-1 bg-[#006795] rounded-full p-1"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                <p><strong>Efficiency:</strong> Sellers who inspect early experience smoother transactions and fewer delays.</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="mt-1 bg-[#006795] rounded-full p-1"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                <p><strong>Relationship Building:</strong> Recommending reliable services demonstrates your commitment to protecting client interests.</p>
              </li>
            </ul>
          </section>

          <section className="bg-black text-white p-8 md:p-12 rounded-[40px] shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Support Throughout the Process</h2>
            <p className="mb-6 opacity-80">A professional service provider manages the technical evaluation so you can focus on your clients:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">Coordinating appointments</div>
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">Confirming schedules</div>
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">Providing real-time updates</div>
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">Fast report delivery</div>
            </div>
          </section>

          <section className="py-12 border-y border-gray-100">
            <h2 className="text-2xl font-bold text-black mb-6">Expertise You Can Trust</h2>
            <p>Our certified inspectors undergo rigorous training to identify issues that may not be visible to the average eye. Every inspection concludes with a conversation to clarify findings and answer any questions your clients may have.</p>
          </section>

          <section className="py-12 text-center bg-[#F8F9FA] rounded-[40px]">
            <h2 className="text-3xl font-bold text-black mb-4">Partner with Nspire</h2>
            <p className="mb-8 max-w-2xl mx-auto opacity-70 px-6">Deliver peace of mind and technical excellence to your clients with our professional inspection services.</p>
            <Button className="bg-[#006795] hover:bg-[#0A5F7F] text-white rounded-full px-12 py-6 text-lg font-bold shadow-xl">Contact Our Pro Team</Button>
          </section>
        </div>

        <div className="border-t border-gray-100 mt-20 pt-10 flex justify-between items-center mb-20">
          <Link href="/blog" className="flex items-center gap-2 text-[#006795] font-bold hover:underline">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </MainLayout>
  );
}
