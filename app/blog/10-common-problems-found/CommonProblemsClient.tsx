"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";

export default function CommonProblemsFound() {
  const problems = [
    { title: "Roofing Problems", desc: "Missing or damaged shingles, poor ventilation, and improper flashing can lead to serious structural damage." },
    { title: "Foundation Cracks", desc: "While not all cracks are serious, large or expanding ones may indicate stability issues." },
    { title: "Electrical Issues", desc: "Outdated wiring or panels create serious safety hazards, especially in older homes." },
    { title: "Plumbing Problems", desc: "Leaking pipes, low pressure, or corroded lines can cause extensive hidden damage." },
    { title: "HVAC Concerns", desc: "Aging equipment or poor maintenance can lead to inefficiency and safety risks." },
    { title: "Water Damage", desc: "Moisture intrusion is one of the biggest threats to a home’s structure and air quality." },
    { title: "Insulation Issues", desc: "Insufficient insulation increases energy costs and contributes to moisture problems." },
    { title: "Exterior Drainage", desc: "Water collecting near the foundation can weaken it and cause basement flooding." },
    { title: "Window/Door Defects", desc: "Broken seals or poor alignment affect energy efficiency and home security." },
    { title: "Pest/Termite Damage", desc: "Pests can weaken structures without being immediately visible." }
  ];

  return (
    <MainLayout>
      <article className="max-w-[1000px] mx-auto px-4 md:px-6 pt-12 md:pt-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#E8F4F8] text-[#006795] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Expert Advice</span>
            <span className="text-gray-400 text-sm">March 13, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 leading-tight">
            10 Common Problems
          </h1>
          <p className="text-xl md:text-2xl text-[#006795] font-medium mb-8">
            Issues Found During Home Inspections
          </p>
          <div className="relative h-[400px] md:h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl mb-12">
            <Image
              src="/blog-problems.png"
              alt="Home Inspection Problems"
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
          <p className="text-xl font-medium text-gray-900 border-l-4 border-red-500 pl-6 italic">
            Buying a home is an exciting milestone, but it comes with responsibilities. A professional home inspection provides a detailed look at the condition of a property and helps identify potential issues that may not be visible.
          </p>

          <p>Even homes that appear well-maintained can have hidden problems. Understanding these common issues helps buyers make informed decisions and allows sellers to address concerns early.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            {problems.map((problem, i) => (
              <div key={i} className="flex gap-4 items-start bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-2xl font-bold text-[#F84B5F] leading-none">{i + 1}.</span>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">{problem.title}</h3>
                  <p className="text-sm text-gray-600">{problem.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <section className="bg-[#E8F4F8] p-8 md:p-12 rounded-[40px] border border-[#006795]/10">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Why Identifying These Problems is Important</h2>
            <p className="text-center mb-0 opacity-80">
              A home inspection does not mean a home will pass or fail. Instead, it provides valuable information to help buyers make informed decisions, plan future maintenance, and negotiate repairs if needed.
            </p>
          </section>

          <section className="py-12 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">Need a Professional Insight?</h2>
            <p className="mb-8 max-w-2xl mx-auto opacity-70">Schedule your inspection today with Nspire and get a clear picture of your property’s condition.</p>
            <Button className="bg-[#006795] hover:bg-[#00567a] text-white rounded-full px-12 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105">Book Your Inspection Now</Button>
          </section>
        </div>

        <div className="border-t border-gray-100 mt-20 pt-10 flex justify-between items-center mb-20 px-4 md:px-6">
          <Link href="/blog" className="flex items-center gap-2 text-[#006795] font-bold hover:underline">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </MainLayout>
  );
}
