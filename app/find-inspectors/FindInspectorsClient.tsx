"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MainLayout from "@/components/MainLayout";

const usStates = [
  { name: "California", slug: "california" },
  { name: "Florida", slug: "florida" },
  { name: "Georgia", slug: "georgia" },
  { name: "Louisiana", slug: "louisiana" },
  { name: "Oklahoma", slug: "oklahoma" }
];

export default function FindInspectorsClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [notFoundFor, setNotFoundFor] = useState("");

  const handleSearch = () => {
    const term = query.trim().toLowerCase();
    if (!term) return;
    // The directory below is organised by state, so match on that rather than
    // pretending to resolve a street address.
    const match = usStates.find(
      (s) => s.name.toLowerCase().includes(term) || term.includes(s.name.toLowerCase())
    );
    if (match) {
      router.push(`/find-inspectors/${match.slug}`);
    } else {
      setNotFoundFor(query.trim());
    }
  };

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-[#E8F4F8]">
        {/* Content Section */}
        <section className="max-w-[1200px] mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-20">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[#334155] mb-4">
              Find Certified Home Inspectors Near You
            </h1>
            <p className="text-gray-600 max-w-3xl text-lg">
              Make sure you choose an InterNACHI®-Certified Home Inspector to inspect your home. Buying a home is the biggest purchase you'll ever make. Inspect it once. Inspect it right.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row shadow-sm rounded-md overflow-hidden bg-white">
            <Input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setNotFoundFor("") }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
              placeholder="Enter the state you need a home inspection in..."
              className="flex-1 border-0 rounded-none rounded-l-md focus-visible:ring-0 px-6 py-6 text-base"
            />
            <Button
              onClick={handleSearch}
              className="bg-[#006795] hover:bg-[#00567a] text-white rounded-none sm:rounded-r-md px-8 py-6 font-semibold h-auto"
            >
              Search Home Inspectors
            </Button>
          </div>
          {/* Coverage is the five states listed below, so say so rather than
              leaving a search that appears to have done nothing. */}
          <p className="mt-3 mb-12 text-sm text-gray-600 min-h-[20px]">
            {notFoundFor
              ? `We don't have inspectors listed for "${notFoundFor}" yet. Currently covering ${usStates.map(s => s.name).join(", ")}.`
              : " "}
          </p>

          {/* Regions Container */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <Accordion type="multiple" defaultValue={["item-1"]} className="space-y-6">
              {/* United States Accordion */}
              <AccordionItem value="item-1" className="border-0 bg-[#E8F4F8] rounded-xl overflow-hidden px-2">
                <AccordionTrigger className="px-4 py-4 hover:no-underline font-bold text-lg text-black">
                  United States
                </AccordionTrigger>
                <AccordionContent className="bg-white px-2 py-0 rounded-b-xl border border-gray-100">
                  <div className="flex flex-col">
                    {usStates.map((state, idx) => (
                      <Link 
                        key={state.slug} 
                        href={`/find-inspectors/${state.slug}`}
                        className={`flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${idx !== usStates.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        <span className="font-medium text-gray-900">{state.name}</span>
                        <ChevronRight className="w-5 h-5 text-[#006795]" />
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Canada Accordion */}
              <AccordionItem value="item-2" className="border-0 bg-[#E8F4F8] rounded-xl overflow-hidden px-2">
                <AccordionTrigger className="px-4 py-4 hover:no-underline font-bold text-lg text-black">
                  Canada
                </AccordionTrigger>
                <AccordionContent className="bg-white px-2 py-0 rounded-b-xl border border-gray-100">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-900">Ontario</span>
                      <ChevronRight className="w-5 h-5 text-[#006795]" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Other Countries Accordion */}
              <AccordionItem value="item-3" className="border-0 bg-[#E8F4F8] rounded-xl overflow-hidden px-2">
                <AccordionTrigger className="px-4 py-4 hover:no-underline font-bold text-lg text-black">
                  Other Countries
                </AccordionTrigger>
                <AccordionContent className="bg-white px-2 py-0 rounded-b-xl border border-gray-100">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-900">United Kingdom</span>
                      <ChevronRight className="w-5 h-5 text-[#006795]" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
