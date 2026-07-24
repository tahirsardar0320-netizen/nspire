"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SewerScopeBlogPost() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const faqs = [
    {
      q: "Can a sewer scope inspection detect tree root damage before it causes a backup?",
      a: "Yes. Sewer scope inspections allow inspectors to see roots growing inside the pipes, even before they block the line. Early detection can prevent costly backups and emergency repairs."
    },
    {
      q: "How long does a typical sewer scope inspection take?",
      a: "Most sewer scope inspections take 30 to 60 minutes, depending on pipe length and accessibility. Modern camera systems make it a quick and non-invasive process."
    },
    {
      q: "Are sewer scope inspections covered by home insurance?",
      a: "In most cases, routine sewer scope inspections are not covered by standard home insurance, as they are considered preventive maintenance. However, insurance may cover repairs if damage is found due to an insured event."
    },
    {
      q: "Can sewer line problems be fixed without digging up the yard?",
      a: "Yes. Many issues, like minor cracks or root intrusion, can be addressed with trenchless methods such as pipe lining or root cutting. These methods minimize excavation, reduce cost, and protect landscaping."
    }
  ];

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Logo Section */}
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center">
        <Image
          src="/logo.png"
          alt="NSPIRE"
          width={500}
          height={600}
          priority
          className="h-14 md:h-32 lg:h-40 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          )}

          {/* Mobile Menu */}
          <div
            className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex flex-col gap-6 p-8 pt-36">
              <Link href="/#home" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">HOME</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Welcome</span>
              </Link>
              <Link href="/#services" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">SERVICES</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Professional Solutions</span>
              </Link>
              <Link href="/about" className="flex flex-col group">
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">ABOUT</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Discover Nspire</span>
              </Link>
              <Link href="/contact" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">CONTACT</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Get in Touch</span>
              </Link>
              <Link href="/faq" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">FAQ</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Answers to Questions</span>
              </Link>
              <Link href="/blog" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-[#006795] font-bold leading-tight">BLOG</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Articles & Insights</span>
              </Link>
            </div>
          </div>

          {/* Desktop Menu - Left aligned */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/#home" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">HOME</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Welcome</span>
            </Link>
            <Link href="/#services" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">SERVICES</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Professional Solutions</span>
            </Link>
            <Link href="/about" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight text-center">ABOUT</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider text-center">Discover Nspire</span>
            </Link>
            <Link href="/contact" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">CONTACT</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Get in Touch</span>
            </Link>
            <Link href="/faq" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">FAQ</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Answers to Questions</span>
            </Link>
            <Link href="/blog" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-[#006795] leading-tight">BLOG</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Articles & Insights</span>
            </Link>
          </div>

          {/* Login/Register Button */}
          <Button
            onClick={() => router.push("/login")}
            className="bg-[#006795] hover:bg-[#00567a] text-white rounded-full px-4 md:px-6 lg:px-8 py-2 md:py-2.5 text-xs md:text-sm font-medium flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="hidden sm:inline">Login/Register</span>
            <span className="sm:hidden">Login</span>
          </Button>
        </div>
      </nav>

      {/* Hero Content */}
      <article className="max-w-[1000px] mx-auto px-4 md:px-6 pt-12 md:pt-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#E8F4F8] text-[#006795] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Inspection Services</span>
            <span className="text-gray-400 text-sm">March 13, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 leading-tight">
            Sewer Scope Inspection
          </h1>
          <p className="text-xl md:text-2xl text-[#006795] font-medium mb-8">
            What It Is and Why It Matters for Homeowners Across the U.S.
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

        {/* Post Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
          <p className="text-xl font-medium text-gray-900 border-l-4 border-[#F84B5F] pl-6 italic">
            Buying or owning a home comes with responsibilities that go far beyond what you can see during a casual walkthrough. One of the most overlooked but potentially most expensive—areas of a property is the main sewer line. Many homeowners only learn about sewer problems after a backup, flooding, or emergency repair. That’s where a sewer scope inspection becomes essential.
          </p>

          <p>
            A sewer scope inspection is a specialized service that uses a high‑resolution camera to examine the condition of a property’s main sewer line. This inspection can reveal hidden problems long before they turn into costly disasters. Whether you’re purchasing a home, maintaining an older property, or experiencing unexplained plumbing issues, understanding sewer scoping can save you stress, money, and time.
          </p>

          <p>
            This in depth guide explains what a sewer scope inspection is, how it works, when you need one, and why it matters for homeowners across the United States—not just in older cities.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Understanding a Sewer Scope Inspection</h2>
            <p>
              A sewer scope inspection is a camera‑based evaluation of the main sewer line that carries wastewater from your home to the municipal sewer system or septic connection. Unlike standard plumbing checks, this inspection focuses specifically on underground pipes that are otherwise invisible.
            </p>
            <p>
              A trained inspector inserts a flexible, waterproof camera through an existing cleanout or access point. As the camera travels through the sewer line, it transmits live video footage to a monitor. This allows the inspector to assess the pipe’s condition in real time and record the findings for review.
            </p>
            <p>
              The goal is to identify defects, damage, or obstructions that could disrupt wastewater flow or lead to backups inside the home.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">How a Sewer Scope Inspection Works</h2>
            <p>
              The process is non‑invasive, efficient, and typically completed within 30 to 60 minutes. Here’s what usually happens during a sewer scope inspection:
            </p>
            <p>
              First, the inspector locates the sewer cleanout. This is often found in a basement, crawl space, garage, or outside near the foundation. In some older homes, additional access methods may be required.
            </p>
            <p>
              Next, the camera is carefully fed into the sewer line. The camera head is designed to navigate bends and joints while providing clear visuals of the pipe interior.
            </p>
            <p>
              As the camera moves through the line, the inspector looks for signs of deterioration, blockages, or structural failure. Many modern systems also include a locator that identifies the camera’s position underground, helping pinpoint the exact location of any issue.
            </p>
            <p>
              Finally, the inspector documents the findings. Homeowners receive a summary of observed conditions, video footage or images, and recommendations for next steps if problems are detected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Common Problems Found During Sewer Scope Inspections</h2>
            <p>
              Sewer scope inspections often uncover issues that cannot be detected through routine plumbing use. Some of the most common problems include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                { title: "Cracked or Broken Pipes", desc: "Caused by aging materials, soil movement, or heavy loads above ground." },
                { title: "Tree Root Intrusion", desc: "Tree root intrusion, where roots enter small joints or cracks in search of moisture and nutrients, gradually blocking the line." },
                { title: "Pipe Misalignment or Bellies", desc: "Occur when sections of the sewer line sag and allow waste to collect instead of flowing properly." },
                { title: "Corrosion and Scaling", desc: "Especially in cast‑iron pipes, where interior surfaces deteriorate over time." },
                { title: "Foreign Objects", desc: "Foreign objects or debris buildup, including grease, wipes, or construction materials left from previous renovations." }
              ].map((item, i) => (
                <div key={i} className="bg-[#F8F9FA] p-6 rounded-3xl border border-gray-100">
                  <h3 className="font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Why Sewer Scope Inspections Matter</h2>
            <p>
              Sewer line repairs are among the most expensive plumbing projects a homeowner can face. Because these pipes are buried underground, repairs often involve excavation, landscaping disruption, or even foundation access.
            </p>
            <p>
              A sewer scope inspection matters because it helps you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Avoid unexpected repair costs that can range from a few thousand dollars to tens of thousands for full replacements.</li>
              <li>Prevent sewage backups that can damage flooring, drywall, furniture, and personal belongings.</li>
              <li>Protect your health by identifying conditions that may lead to unsanitary living environments.</li>
              <li>Make informed decisions during a home purchase by understanding the true condition of the property.</li>
              <li>Plan proactive maintenance instead of reacting to emergencies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">The Importance of Sewer Scoping in Older Homes</h2>
            <p>
              Across many U.S. cities and suburbs, homes built before the 1980s often rely on sewer lines made from clay, cast iron, or Orangeburg piping. While these materials were standard at the time, they are more vulnerable to age‑related deterioration.
            </p>
            <p>
              Clay pipes are prone to cracking at joints. Cast‑iron pipes can corrode from the inside out. Orangeburg pipes, made from compressed wood fiber and tar, are known to deform and collapse over time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Sewer Scope Inspections for Home Buyers</h2>
            <p>
              For home buyers, a sewer scope inspection provides critical insight that a general home inspection may not cover. Standard inspections typically do not evaluate underground sewer lines unless visible symptoms are present.
            </p>
            <p>
              By adding a sewer scope inspection during the due diligence period, buyers can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identify existing sewer issues before closing.</li>
              <li>Request repairs or credits from the seller.</li>
              <li>Avoid inheriting costly problems immediately after move‑in.</li>
              <li>Gain confidence in the overall condition of the home.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Sewer Scope Inspections for Current Homeowners</h2>
            <p>
              Sewer scoping isn’t only for buyers. Current homeowners can benefit just as much, particularly if they notice recurring plumbing issues.
            </p>
            <p>
              You should consider a sewer scope inspection if you experience:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Frequent drain clogs or slow drainage in multiple fixtures.</li>
              <li>Gurgling sounds from toilets or sinks.</li>
              <li>Unpleasant sewer odors inside or outside the home.</li>
              <li>Past sewer backups or root removal treatments.</li>
              <li>Recent ground settling, driveway work, or landscaping changes near the sewer line.</li>
            </ul>
          </section>

          <section className="bg-[#006795] rounded-[40px] p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Common Questions (FAQs)</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-white/20 pb-6 last:border-0">
                  <h3 className="text-xl font-bold mb-3 flex gap-3">
                    <span className="text-[#006795] tracking-tighter">Q:</span>
                    {faq.q}
                  </h3>
                  <p className="text-white/80 pl-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-12 text-center">
            <h2 className="text-3xl font-bold text-black mb-6">Schedule Your Home Inspection Today</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Do you need a home inspection in the United States? Nspire is the trusted leader in professional home inspections.
            </p>
            <Button className="bg-[#F84B5F] hover:bg-[#EE3646] text-white rounded-full px-12 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105">
              Book Your Inspection
            </Button>
          </section>
        </div>

        <div className="border-t border-gray-100 mt-20 pt-10 flex justify-between items-center mb-20 px-4 md:px-6 max-w-[1000px] mx-auto">
          <Link href="/blog" className="flex items-center gap-2 text-[#006795] font-bold hover:underline">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
          <div className="flex gap-4">
            <span className="text-gray-400">Share:</span>
            {/* Social Share Icons Placeholder */}
            <div className="w-6 h-6 rounded-full bg-gray-100"></div>
            <div className="w-6 h-6 rounded-full bg-gray-100"></div>
            <div className="w-6 h-6 rounded-full bg-gray-100"></div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Image
            src="/logo.png"
            alt="NSPIRE"
            width={120}
            height={40}
            className="mx-auto mb-6 h-8 w-auto"
          />
          <p className="text-gray-400 text-xs text-center">© 2026 Nspire Home Inspections. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
