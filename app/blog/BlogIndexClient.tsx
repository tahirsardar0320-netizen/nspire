"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";

export default function BlogIndex() {
  const blogs = [
    {
      title: "Sewer Scope Inspection",
      subtitle: "What It Is and Why It Matters for Homeowners Across the U.S.",
      slug: "sewer-scope-inspection",
      excerpt: "Buying or owning a home comes with responsibilities that go far beyond what you can see during a casual walkthrough.",
      image: "/blog-sewer-scope.png",
      date: "March 13, 2026",
      category: "Inspection Services"
    },
    {
      title: "Professional Roof Inspections",
      subtitle: "Across the U.S. to Prevent Leaks, Moisture Damage, and Costly Repairs",
      slug: "professional-roof-inspections",
      excerpt: "One of the most critical yet overlooked aspects of property maintenance is the roof. Even small leaks can lead to significant damage.",
      image: "/blog-roof.png",
      date: "March 13, 2026",
      category: "Inspection Services"
    },
    {
      title: "Sewer Scope Inspection Guide",
      subtitle: "Everything You Need to Know About Underground Pipe Health",
      slug: "what-is-sewer-scope-inspection",
      excerpt: "Many homeowners don’t realize that one of the most important systems in their home is hidden underground: the sewer line.",
      image: "/blog-sewer-scope.png",
      date: "March 13, 2026",
      category: "Inspection Services"
    },
    {
      title: "Professional Home Inspection",
      subtitle: "What to Expect and Why They Matter",
      slug: "professional-home-inspection-services",
      excerpt: "A home inspection provides a detailed understanding of a property’s condition before the deal is finalized. It helps buyers make informed decisions.",
      image: "/blog-home-pros.png",
      date: "March 13, 2026",
      category: "Inspection Services"
    },
    {
      title: "Real Estate Professional Services",
      subtitle: "Building Trust and Smoother Transactions",
      slug: "home-inspection-services-for-real-estate-professionals",
      excerpt: "Partnering with a reliable inspection service can significantly improve the transaction experience. Deliver peace of mind and transparency.",
      image: "/blog-re-pros.png",
      date: "March 13, 2026",
      category: "For Professionals"
    },
    {
      title: "10 Common Problems",
      subtitle: "Issues Found During Home Inspections",
      slug: "10-common-problems-found",
      excerpt: "Even homes that appear well-maintained can have hidden problems. Understanding these common issues helps buyers make informed decisions.",
      image: "/blog-problems.png",
      date: "March 13, 2026",
      category: "Expert Advice"
    },
    {
      title: "Home Inspection Checklist",
      subtitle: "What to Look for Before Buying a Home",
      slug: "home-inspection-checklist-for-buyers",
      excerpt: "A home inspection checklist gives buyers a clear idea of the important areas that should be evaluated before making a final decision.",
      image: "/blog-checklist.png",
      date: "March 13, 2026",
      category: "Buyer Guide"
    }
  ];

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-[#E8F4F8] overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-white py-12 md:py-16 border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-2">AI-Driven Property Inspection</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-[#006795] mb-4">Blogs</h2>
            <div className="w-20 h-1 bg-[#F84B5F] rounded-full"></div>
          </div>
        </section>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-16 flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 space-y-24">
            {blogs.map((blog) => (
              <article key={blog.slug} className="group">
                <Link href={`/blog/${blog.slug}`} className="block overflow-hidden rounded-[32px] mb-8 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>
                
                <div className="max-w-[900px]">
                  <Link href={`/blog/${blog.slug}`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2 leading-tight group-hover:text-[#006795] transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-xl text-[#006795] font-medium mb-4">
                      {blog.subtitle}
                    </p>
                  </Link>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
                    <span>by Nspire Experts</span>
                    <span>|</span>
                    <span>{blog.date}</span>
                    <span>|</span>
                    <span className="text-[#006795]">{blog.category}</span>
                  </div>
                  
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    {blog.excerpt}...
                  </p>
                  
                  <Link 
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-[#006795] font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all"
                  >
                    Read More
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
            
            {/* Pagination Placeholder */}
            <div className="pt-12 border-t border-gray-100 flex items-center gap-6">
              <span className="text-gray-400 cursor-not-allowed uppercase text-sm tracking-widest font-bold">« Newer Entries</span>
              <Link href="#" className="text-[#333333] hover:text-[#006795] uppercase text-sm tracking-widest font-bold">Older Entries »</Link>
            </div>
          </div>

          {/* Sidebar Placeholder */}
          <aside className="lg:w-[350px] space-y-12">
            <div className="bg-white p-8 rounded-[32px] shadow-lg border border-gray-50">
              <h3 className="text-xl font-bold text-black mb-6">Search Blogs</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#006795] transition-all"
                />
                <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-[#006795] p-10 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Free NSPIRE Checklist</h3>
                <p className="opacity-80 mb-8 text-sm leading-relaxed">Download our comprehensive home inspection checklist for free.</p>
                <Button className="w-full bg-[#F84B5F] hover:bg-[#EE3646] text-white rounded-full py-6 font-bold transition-all shadow-lg">Download Now</Button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
