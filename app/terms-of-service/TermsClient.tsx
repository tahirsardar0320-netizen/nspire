"use client";

import MainLayout from "@/components/MainLayout";

export default function TermsClient() {
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-[#006795] py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-white/70 text-lg">Last Updated: March 13, 2026</p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-black mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using the Nspire Home Inspections website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our services.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">2. Services</h2>
            <p>Nspire Home Inspections provides professional property inspection services, including but not limited to home inspections, commercial inspections, specialized inspections, and related consulting services. All inspections are performed by certified professionals following industry standards.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">3. Scheduling and Cancellation</h2>
            <p>Inspection appointments are subject to availability. Cancellations must be made at least 24 hours before the scheduled inspection. Failure to cancel within this period may result in a cancellation fee.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">4. Payment Terms</h2>
            <p>Payment is due at the time of service unless alternative arrangements have been made in advance. We accept major credit cards, debit cards, and electronic payments. All fees are non-refundable once the inspection report has been delivered.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">5. Inspection Reports</h2>
            <p>Inspection reports are prepared for the exclusive use of the client who ordered the inspection. Reports represent the condition of the property at the time of inspection and are not warranties or guarantees. The report is not transferable without written consent from Nspire Home Inspections.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">6. Limitation of Liability</h2>
            <p>Nspire Home Inspections' liability is limited to the fee paid for the inspection. We are not responsible for conditions that were concealed, not readily accessible, or that occurred after the inspection date. Our inspections are visual and non-invasive in nature.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">7. Intellectual Property</h2>
            <p>All content on the Nspire Home Inspections website, including text, graphics, logos, images, and software, is the property of Nspire Home Inspections and is protected by copyright and trademark laws.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">8. Governing Law</h2>
            <p>These Terms of Service are governed by the laws of the State of Georgia, United States. Any disputes arising from these terms shall be resolved in the courts of Georgia.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">9. Contact</h2>
            <p>For questions about these Terms of Service, contact us:</p>
            <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100 mt-6">
              <p className="font-bold text-black mb-2">Nspire Home Inspections</p>
              <p>Email: <a href="mailto:info@nspireinspectionapp.com" className="text-[#006795] hover:underline">info@nspireinspectionapp.com</a></p>
              <p>Phone: <a href="tel:9202202220" className="text-[#006795] hover:underline">920-220-2220</a></p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
