"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import MainLayout from "@/components/MainLayout";

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send message.");
      }
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.", { position: "top-right" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-[#E8F4F8] pt-12 md:pt-20 pb-32">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <p className="text-xs font-bold text-[#006795] uppercase tracking-widest mb-4">Connect With Us</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight">
              How Can We <span className="text-[#F84B5F] italic font-medium">Help?</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Have questions about our inspection services or need technical support? We're here to provide the clarity and assistance you need.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative -mt-20 pb-20 px-4 md:px-6">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#006795]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Email Us</h3>
                <p className="text-gray-500 text-sm mb-4">Our friendly team is here to help.</p>
                <a href="mailto:support@inspire.com" className="text-[#006795] font-bold hover:underline text-lg">support@inspire.com</a>
              </div>


            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-gray-100">
              <h2 className="text-3xl font-bold text-black mb-8">Send us a <span className="text-[#F84B5F]">Message</span></h2>

              {submitted ? (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-[#006795]/20 text-[#006795] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-2">Message Sent!</h3>
                  <p className="text-gray-500">Thank you for reaching out. We'll get back to you shortly.</p>
                  <Button onClick={() => setSubmitted(false)} variant="default" className="mt-8">Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-2">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#006795] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-2">Email</label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#006795] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#006795] transition-all"
                    >
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Sales & Partnerships</option>
                      <option>Feedback</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#006795] transition-all resize-none"
                    ></textarea>
                  </div>
                  <Button type="submit" variant="secondary" size="lg" disabled={isSending} className="w-full py-8 hover:scale-[1.01] transition-all">
                    {isSending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>


      </div>
    </MainLayout>
  );
}
