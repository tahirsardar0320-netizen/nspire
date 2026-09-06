"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";

export default function WhatIsSewerScopeInspection() {

  const faqs = [
    {
      q: "How long does a sewer scope inspection take?",
      a: "Typically, 30–60 minutes, depending on pipe length and accessibility."
    },
    {
      q: "Is a sewer scope safe for my plumbing?",
      a: "Yes. The camera is flexible and designed to navigate pipes without causing damage."
    },
    {
      q: "How much does a sewer scope inspection cost?",
      a: "Costs vary by property type and location but generally range from a few hundred dollars."
    },
    {
      q: "Can sewer scope inspections prevent costly emergencies?",
      a: "Absolutely. Early detection of hidden issues prevents backups, water damage, and expensive repairs."
    }
  ];

  return (
    <MainLayout>
      <article className="max-w-[1000px] mx-auto px-4 md:px-6 pt-12 md:pt-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#E8F4F8] text-[#006795] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Inspection Services</span>
            <span className="text-gray-400 text-sm">March 13, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 leading-tight">
            Sewer Scope Inspection Guide
          </h1>
          <p className="text-xl md:text-2xl text-[#006795] font-medium mb-8">
            Everything You Need to Know About Underground Pipe Health
          </p>
          <div className="relative h-[400px] md:h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl mb-12">
            <Image
              src="/blog-sewer-scope.png"
              alt="Sewer Scope Inspection"
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
          <p className="text-xl font-medium text-gray-900 border-l-4 border-[#F84B5F] pl-6 italic">
            Many homeowners don’t realize that one of the most important systems in their home is hidden underground: the sewer line. Problems like cracks, blockages, or root intrusion can lead to costly repairs if left undetected.
          </p>

          <p>
            A sewer scope inspection uses a specialized camera to provide a detailed view of the sewer line from the home to the main connection. It uncovers hidden issues that are invisible to the naked eye, allowing homeowners to address problems before they escalate.
          </p>

          <p>In this guide, we’ll explain what a sewer scope inspection is, how it works, common issues it detects, and why it’s so important for homeowners.</p>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Understanding Sewer Scope Inspections</h2>
            <p>A sewer scope inspection is a camera based evaluation of the main sewer line. Unlike standard plumbing checks, these focus on underground pipes that are otherwise inaccessible.</p>
            <p>During the inspection:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A flexible camera is inserted into a cleanout point.</li>
              <li>Live video footage is transmitted to a monitor.</li>
              <li>Results are documented in a detailed report.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Common Sewer Line Issues Found</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                { title: "Cracks in Pipes", desc: "Older homes often have clay or cast-iron pipes that deteriorate over time." },
                { title: "Tree Root Intrusion", desc: "Roots naturally seek moisture and can infiltrate small joints in pipes." },
                { title: "Pipe Misalignment", desc: "Soil shifts or improper installation can cause pipes to sag, creating low spots." },
                { title: "Debris Buildup", desc: "Grease, wipes, or construction materials can accumulate and restrict flow." }
              ].map((item, i) => (
                <div key={i} className="bg-[#F8F9FA] p-6 rounded-3xl border border-gray-100">
                  <h3 className="font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Modern Solutions for Sewer Repairs</h2>
            <p>If problems are detected, there are several repair options available that minimize disruption:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Trenchless Pipe Lining:</strong> Reinforces pipes from the inside without excavation.</li>
              <li><strong>Root Removal:</strong> Specialized equipment cuts roots inside the pipe.</li>
              <li><strong>Replacement:</strong> Required for severely damaged sections.</li>
            </ul>
          </section>

          <section className="bg-[#006795] rounded-[40px] p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Common Questions (FAQs)</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-white/20 pb-6 last:border-0">
                  <h3 className="text-xl font-bold mb-3 flex gap-3"><span className="text-[#006795]">Q:</span>{faq.q}</h3>
                  <p className="text-white/80 pl-8">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-12 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">Schedule Your Inspection Today</h2>
            <p className="mb-8 max-w-2xl mx-auto">Protect your home from costly sewer line damage with a professional inspection from Nspire.</p>
            <Button variant="secondary" size="lg" className="hover:scale-105 transition-all">Book Your Inspection</Button>
          </section>
        </div>

        <div className="border-t border-gray-100 mt-20 pt-10 flex justify-between items-center mb-20 px-4 md:px-6 max-w-[1000px] mx-auto">
          <Link href="/blog" className="flex items-center gap-2 text-[#006795] font-bold hover:underline">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </MainLayout>
  );
}
