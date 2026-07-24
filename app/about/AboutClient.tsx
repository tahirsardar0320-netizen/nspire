"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

export default function AboutClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative bg-[#006795] py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F84B5F] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10 text-center">
            <p className="text-[#006795] font-bold uppercase tracking-[0.2em] mb-6 animate-fade-in">Empowering Property Decisions</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
              About <span className="text-[#F84B5F] italic font-medium">Nspire</span>
            </h1>
            <p className="max-w-4xl mx-auto text-lg md:text-xl text-white/90 leading-relaxed font-light">
              Our Qualified NSPIRE inspectors focus on identifying risks, structural issues, and safety hazards to ensure that every inspection provides clear insights that help you make informed decisions about your property.
            </p>
          </div>
        </section>

        {/* Main Content & Mission Section */}
        <section className="bg-white py-20 md:py-32 px-4 md:px-6">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative group">
              <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/multi_unit_housing.png"
                  alt="Professional Housing Inspection"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-[#F84B5F] text-white p-12 rounded-[32px] shadow-2xl hidden md:block">
                <p className="text-4xl font-bold">Trusted</p>
                <p className="text-sm uppercase tracking-widest font-medium opacity-80">Across The Nation</p>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <p className="text-sm font-bold text-[#006795] uppercase tracking-widest mb-4">What We Do</p>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 leading-tight">Identifying Risks, <br/><span className="text-[#006795]">Securing Investments</span></h2>
                <div className="w-20 h-1.5 bg-[#F84B5F] rounded-full mb-8"></div>
                
                <div className="text-gray-600 space-y-6 text-lg leading-relaxed">
                  <p>
                    Our Qualified NSPIRE inspectors focus on identifying risks, structural issues, and safety hazards to ensure that every inspection provides clear insights that help you make informed decisions about your property.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                <div className="bg-[#E8F4F8] p-6 rounded-2xl">
                  <h4 className="text-xl font-bold text-[#006795] mb-3">Comprehensive</h4>
                  <p className="text-gray-700 text-sm">Assessing roofing, electrical, plumbing, HVAC, and foundation conditions entirely.</p>
                </div>
                <div className="bg-[#E8F4F8] p-6 rounded-2xl">
                  <h4 className="text-xl font-bold text-[#006795] mb-3">Compliant</h4>
                  <p className="text-gray-700 text-sm">A thorough and compliant process identifying precisely what fails a home inspection.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Tools Section */}
        <section className="bg-[#F8F9FA] py-20 px-4 md:px-6">
          <div className="max-w-[1400px] mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">Setting the <span className="text-[#006795]">Benchmark</span></h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed mb-16">
              Our Qualified NSPIRE inspectors focus on identifying risks, structural issues, and safety hazards to ensure that every inspection provides clear insights that help you make informed decisions about your property.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[32px] shadow-lg hover:shadow-xl transition-shadow text-left">
                <div className="w-14 h-14 bg-[#E8F4F8] rounded-2xl flex items-center justify-center text-[#006795] mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Advanced Tools</h3>
                <p className="text-gray-600">Leveraging the latest industry technology to uncover what the naked eye might miss.</p>
              </div>
              <div className="bg-white p-10 rounded-[32px] shadow-lg hover:shadow-xl transition-shadow text-left">
                <div className="w-14 h-14 bg-[#FEF2F2] rounded-2xl flex items-center justify-center text-[#F84B5F] mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Certified Inspectors</h3>
                <p className="text-gray-600">Our inspectors are highly trained professionals ensuring complete accuracy.</p>
              </div>
              <div className="bg-white p-10 rounded-[32px] shadow-lg hover:shadow-xl transition-shadow text-left">
                <div className="w-14 h-14 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-[#22C55E] mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Reliable Reporting</h3>
                <p className="text-gray-600">Insurance-ready documentation and detailed reporting for confident decisions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#006795] rounded-full blur-[160px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to <span className="text-[#F84B5F]">Nspire</span> Confidence?</h2>
            <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed">
              Join thousands of satisfied clients who have trusted Nspire with their property inspections.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                  onClick={() => router.push("/contact")}
                  className="bg-[#F84B5F] hover:bg-[#EE3646] text-white rounded-full px-12 py-8 text-lg font-bold shadow-2xl transition-all hover:scale-105"
              >
                Contact Us Now
              </Button>
              <Button 
                  variant="outline" 
                  className="bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-black rounded-full px-12 py-8 text-lg font-bold transition-all hover:scale-105"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
