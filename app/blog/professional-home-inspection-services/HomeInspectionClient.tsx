"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";

export default function ProfessionalHomeInspectionServices() {

  return (
    <MainLayout>
      <article className="max-w-[1000px] mx-auto px-4 md:px-6 pt-12 md:pt-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#E8F4F8] text-[#006795] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Inspection Services</span>
            <span className="text-gray-400 text-sm">March 13, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 leading-tight">
            Professional Home Inspection
          </h1>
          <p className="text-xl md:text-2xl text-[#006795] font-medium mb-8">
            What to Expect and Why They Matter
          </p>
          <div className="relative h-[400px] md:h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl mb-12">
            <Image
              src="/blog-home-pros.png"
              alt="Professional Home Inspection"
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
          <p className="text-xl font-medium text-gray-900 border-l-4 border-[#F84B5F] pl-6 italic">
            Buying or selling a home is a major life decision. A house may look beautiful during a showing, but many issues can remain hidden behind walls, under the roof, or within essential systems.
          </p>

          <p>
            A home inspection provides a detailed understanding of a property’s condition before the deal is finalized. It helps buyers make informed decisions and allows sellers to address potential problems early. With the help of a professional inspector, you gain clarity, confidence, and peace of mind about the property you are buying or selling.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">What Is a Home Inspection?</h2>
            <p>
              A home inspection is a thorough visual evaluation of a property conducted by a qualified home inspector. The purpose of the inspection is to assess the overall condition of the home and identify potential problems that could affect safety, performance, or long-term maintenance.
            </p>
            <p>
              During the inspection, the professional inspector carefully examines major structural elements and home systems including the roof, foundation, electrical systems, plumbing, heating and cooling equipment, and interior structures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Why Home Inspections Are Important</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F8F9FA] p-6 rounded-3xl">
                <h3 className="font-bold text-[#006795] mb-2">Discover Hidden Problems</h3>
                <p className="text-sm">Many issues are not visible during a normal viewing. Roof damage, leaks, or electrical hazards may exist behind the scenes.</p>
              </div>
              <div className="bg-[#F8F9FA] p-6 rounded-3xl">
                <h3 className="font-bold text-[#006795] mb-2">Support Negotiations</h3>
                <p className="text-sm">Inspection findings can play an important role during negotiations, helping both parties move forward with confidence.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">What Home Inspectors Examine</h2>
            <p>Professional home inspectors evaluate many components of the property to ensure a thorough assessment:</p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Exterior Components:</strong> Roof, gutters, walls, windows, doors, and drainage.</li>
              <li><strong>Structural Integrity:</strong> Foundation, framing, and support beams.</li>
              <li><strong>Electrical Systems:</strong> Panels, wiring, outlets, and switches.</li>
              <li><strong>Plumbing Systems:</strong> Supply lines, drainage, and water heaters.</li>
              <li><strong>HVAC:</strong> Heating, cooling, and ventilation performance.</li>
            </ul>
          </section>

          <section className="bg-[#006795] text-white p-8 md:p-12 rounded-[40px]">
            <h2 className="text-3xl font-bold mb-6 text-center">Final Thoughts</h2>
            <p className="text-center text-lg opacity-90">
              A home inspection is a vital step in any real estate transaction. It provides a clear understanding of a property’s condition and helps buyers avoid unexpected issues after moving in. Working with a trusted provider ensures every detail is carefully evaluated.
            </p>
          </section>

          <section className="py-12 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">Schedule Your Home Inspection</h2>
            <p className="mb-8 max-w-2xl mx-auto">Gain clarity and confidence in your next property transaction with Nspire.</p>
            <Button className="bg-[#F84B5F] hover:bg-[#EE3646] text-white rounded-full px-12 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105">Book Now</Button>
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
