"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const cities = [
  { name: "Atlanta", desc: "Metro Atlanta and surrounding neighborhoods" },
  { name: "Alpharetta", desc: "North Fulton County" },
  { name: "Marietta", desc: "Cobb County" },
  { name: "Sandy Springs", desc: "North Atlanta" },
  { name: "Roswell", desc: "North Fulton" },
  { name: "Lawrenceville", desc: "Gwinnett County" },
  { name: "Decatur", desc: "DeKalb County" },
  { name: "Cumming", desc: "Forsyth County" },
  { name: "Duluth", desc: "Gwinnett County" },
  { name: "Smyrna", desc: "Cobb County" },
  { name: "Gainesville", desc: "Hall County" },
  { name: "Woodstock", desc: "Cherokee County" },
];

export default function ServiceAreaClient() {
  const router = useRouter();
  return (
    <MainLayout>
      <section className="bg-gradient-to-br from-[#006795] to-[#0A5670] py-20 md:py-32 text-center relative overflow-hidden">
        <div className="relative z-10"><p className="text-[#006795] font-bold uppercase tracking-[0.2em] mb-6">Georgia & Beyond</p><h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Our Service Area</h1><p className="text-white/70 text-xl max-w-3xl mx-auto">Proudly serving homeowners, buyers, and businesses across the greater Atlanta metropolitan area and surrounding Georgia communities.</p></div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Cities We Serve</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">We provide comprehensive inspection services throughout the greater Atlanta area. Click on a city to learn more about our services in your area.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cities.map((city) => (
            <div key={city.name} className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer text-center">
              <div className="w-12 h-12 rounded-full bg-[#E8F4F8] flex items-center justify-center mx-auto mb-4 text-[#006795] group-hover:bg-[#006795] group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-1 group-hover:text-[#006795] transition-colors">{city.name}</h3>
              <p className="text-gray-400 text-xs">{city.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F8F9FA] py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-black mb-4">Don't See Your City?</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">We're expanding our coverage area. Contact us to check availability in your location.</p>
        <Button onClick={() => router.push("/contact")} className="bg-[#006795] hover:bg-[#0A5670] text-white rounded-full px-12 py-7 text-lg font-bold shadow-xl hover:scale-105 transition-all">Check Availability</Button>
      </section>
    </MainLayout>
  );
}
